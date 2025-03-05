import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export class CreditService {
  static async getCredits(walletAddress: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { walletAddress },
      select: { credits: true },
    });
    return user?.credits ?? 0;
  }

  static async addCredits(walletAddress: string, amount: number, paymentSignature: string, solAmount?: number, paymentMethod: 'solana' | 'stripe' = 'solana') {
    logger.info(`Adding ${amount} credits to wallet ${walletAddress}`);

    return await prisma.$transaction(async (tx) => {
      // Create or update user
      const user = await tx.user.upsert({
        where: { walletAddress },
        create: {
          walletAddress,
          credits: amount,
        },
        update: {
          credits: { increment: amount },
        },
      });

      // Record the transaction
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: solAmount || 0,
          signature: paymentSignature,
          status: 'confirmed',
          credits: amount,
          paymentMethod,
          confirmedAt: new Date(),
        },
      });

      // Record credit transaction
      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount: amount,
          type: 'ADDITION',
          balanceAfter: user.credits + amount,
          description: `Credit purchase via ${paymentMethod}`
        }
      });

      return user;
    });
  }

  static async deductCredits(walletAddress: string, amount: number = 1) {
    logger.info(`Deducting ${amount} credits from wallet ${walletAddress}`);

    return await prisma.$transaction(async (tx) => {
      // Get current user
      const user = await tx.user.findUnique({
        where: { walletAddress },
        select: { id: true, credits: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.credits < amount) {
        throw new Error('Insufficient credits');
      }

      // Update user credits
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { credits: { decrement: amount } },
      });

      // Record credit transaction
      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount: -amount,
          type: 'DEDUCTION',
          balanceAfter: updatedUser.credits,
          description: 'Token generation credit deduction'
        }
      });

      return updatedUser;
    });
  }
}
