import { prisma } from '../db';

export async function getOrCreateUser(walletAddress: string) {
  return await prisma.user.upsert({
    where: { walletAddress },
    update: {},
    create: {
      walletAddress,
      credits: 1, // Start with 1 free credit
    },
  });
}

export async function getUserCredits(walletAddress: string) {
  const user = await prisma.user.findUnique({
    where: { walletAddress },
    select: { credits: true },
  });
  return user?.credits ?? 0;
}

export async function deductCredit(walletAddress: string) {
  const user = await prisma.user.findUnique({
    where: { walletAddress },
    select: { credits: true },
  });

  if (!user || user.credits < 1) {
    throw new Error('Insufficient credits');
  }

  return await prisma.user.update({
    where: { walletAddress },
    data: {
      credits: { decrement: 1 },
    },
  });
}

export async function addCredits(walletAddress: string, credits: number) {
  return await prisma.user.update({
    where: { walletAddress },
    data: {
      credits: { increment: credits },
    },
  });
}
