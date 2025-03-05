import { prisma } from '../db';

export async function createTransaction(data: {
  userId: string;
  amount: number;
  signature: string;
  credits: number;
}) {
  return await prisma.transaction.create({
    data: {
      ...data,
      status: 'pending',
    },
  });
}

export async function confirmTransaction(signature: string) {
  return await prisma.transaction.update({
    where: { signature },
    data: {
      status: 'confirmed',
      confirmedAt: new Date(),
    },
  });
}

export async function failTransaction(signature: string) {
  return await prisma.transaction.update({
    where: { signature },
    data: {
      status: 'failed',
    },
  });
}