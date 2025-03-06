import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { CreditService } from '@/lib/services/creditService';
import { logger } from '@/lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    logger.info('==================== WEBHOOK START ====================');
    
    const body = await request.text();
    const sig = headers().get('stripe-signature');

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
      logger.info('Event Type:', event.type);
    } catch (err) {
      logger.error('Signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      logger.info('Processing completed checkout session:', session.id);
      
      try {
        const walletAddress = session.metadata?.walletAddress;
        const credits = parseInt(session.metadata?.credits || '0');
        
        logger.info('Processing payment for:', { walletAddress, credits });

        if (!walletAddress || !credits) {
          throw new Error(`Missing required metadata. Wallet: ${walletAddress}, Credits: ${credits}`);
        }

        // Use CreditService to handle credit addition
        const updatedUser = await CreditService.addCredits(
          walletAddress,
          credits,
          session.payment_intent as string,
          (session.amount_total || 0) / 100,
          'stripe'
        );

        logger.info('Credits added successfully:', {
          walletAddress,
          credits,
          newBalance: updatedUser.credits
        });

      } catch (error) {
        logger.error('Failed to process payment:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          session: session.id,
          metadata: session.metadata
        });
        
        // Important: Return 200 even on processing error to prevent Stripe retries
        return NextResponse.json({
          error: 'Payment processed but credit allocation failed',
          success: false
        });
      }
    }

    logger.info('==================== WEBHOOK END ====================');
    return NextResponse.json({ received: true });
    
  } catch (error) {
    logger.error('Webhook handler error:', {
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
