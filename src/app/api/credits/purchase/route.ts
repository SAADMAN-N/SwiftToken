import { NextResponse } from 'next/server';
import { z } from 'zod';
import { walletService } from '@/lib/solana/wallet';
import { CreditService } from '@/lib/services/creditService';
import { logger } from '@/lib/logger';

const purchaseSchema = z.object({
  signature: z.string().min(1),
  walletAddress: z.string().min(32).max(44),
  credits: z.number().int().positive(),
  solAmount: z.number().positive()
});

export async function POST(request: Request) {
  try {
    logger.info('Received purchase request');
    const body = await request.json();
    logger.info('Request body:', body);

    const validated = purchaseSchema.parse(body);

    // Verify the transaction signature
    const isValid = await walletService.verifyTransaction(validated.signature);
    if (!isValid) {
      logger.error('Invalid transaction signature');
      return NextResponse.json(
        { error: 'Invalid or failed transaction' },
        { status: 400 }
      );
    }

    // Add credits using the credit service
    const updatedUser = await CreditService.addCredits(
      validated.walletAddress,
      validated.credits,
      validated.signature,
      validated.solAmount,
      'solana'
    );

    return NextResponse.json({ 
      success: true,
      credits: updatedUser.credits 
    });
  } catch (error) {
    logger.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Purchase failed' },
      { status: 500 }
    );
  }
}
