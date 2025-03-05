import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const manualCreditSchema = z.object({
  signature: z.string(),
  walletAddress: z.string(),
  credits: z.number().int().positive(),
  solAmount: z.number().positive()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = manualCreditSchema.parse(body);

    // Create user and transaction records
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
      credits: validated.credits,
      newBalance: user.credits + validated.credits 
    });
  } catch (error) {
    console.error('Manual credit error:', error);
    return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
  }
}