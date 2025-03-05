import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { walletService } from '@/lib/solana/wallet';
import { env } from '@/lib/env';

const purchaseSchema = z.object({
  signature: z.string().min(1),
  walletAddress: z.string().min(32).max(44),
  credits: z.number().int().positive(),
  solAmount: z.number().positive()
});

export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json();
    const validated = purchaseSchema.parse(body);

    // Verify transaction
    const isValid = await walletService.verifyTransaction(validated.signature);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or failed transaction' },
        { status: 400 }
      );
    }

    // Verify payment amount
    const expectedAmount = validated.credits * Number(env.NEXT_PUBLIC_PAID_PRICE_SOL);
    if (Math.abs(validated.solAmount - expectedAmount) > 0.0001) {
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    // Credit the user's account
    const user = await prisma.user.upsert({
      where: { walletAddress: validated.walletAddress },
      create: {
        walletAddress: validated.walletAddress,
        credits: validated.credits,
      },
      update: {
        credits: { increment: validated.credits },
      },
    });

    // Record the transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: validated.solAmount,
        signature: validated.signature,
        status: 'confirmed',
        credits: validated.credits,
        paymentMethod: 'solana',
        confirmedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      credits: user.credits,
    });

  } catch (error) {
    console.error('Purchase error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
