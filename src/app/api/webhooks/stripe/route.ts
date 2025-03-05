import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    console.log('==================== WEBHOOK START ====================');
    
    const body = await request.text();
    const sig = headers().get('stripe-signature');

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
      console.log('Event Type:', event.type);
    } catch (err) {
      console.error('Signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Detailed session logging
      console.log('Full Session Data:', JSON.stringify(session, null, 2));
      
      try {
        const walletAddress = session.metadata?.walletAddress;
        const credits = parseInt(session.metadata?.credits || '0');
        
        console.log('Processing payment for:', { walletAddress, credits });

        if (!walletAddress || !credits) {
          throw new Error(`Missing required metadata. Wallet: ${walletAddress}, Credits: ${credits}`);
        }

        // First create/update user
        console.log('Creating/updating user...');
        const user = await prisma.user.upsert({
          where: { walletAddress },
          create: {
            walletAddress,
            credits: credits,
          },
          update: {
            credits: { increment: credits },
          },
        });
        console.log('User created/updated:', user);

        // Then create transaction
        console.log('Creating transaction...');
        const transaction = await prisma.transaction.create({
          data: {
            userId: user.id,
            signature: session.payment_intent as string,
            amount: (session.amount_total || 0) / 100,
            credits: credits,
            status: 'confirmed',
            paymentMethod: 'stripe',
            confirmedAt: new Date(),
          },
        });
        console.log('Transaction created:', transaction);

      } catch (error) {
        console.error('Detailed error:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        throw error;
      }
    }

    console.log('==================== WEBHOOK END ====================');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Top level error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
