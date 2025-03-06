import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ received: true });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    // Only process checkout.session.completed events
    if (event.type !== 'checkout.session.completed') {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const walletAddress = session.metadata?.walletAddress;
    const credits = parseInt(session.metadata?.credits || '0');

    if (!walletAddress || !credits) {
      console.error('Missing metadata:', { walletAddress, credits });
      return NextResponse.json({ received: true });
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { walletAddress },
        create: { 
          walletAddress,
          credits: credits
        },
        update: {
          credits: {
            increment: credits
          }
        }
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: (session.amount_total || 0) / 100,
          signature: session.payment_intent?.toString() || '',
          status: 'completed',
          credits: credits,
          paymentMethod: 'stripe',
          confirmedAt: new Date()
        }
      });

      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount: credits,
          type: 'purchase',
          balanceAfter: user.credits + credits,
          description: `Stripe purchase of ${credits} credits`
        }
      });
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ received: true });
  }
}
