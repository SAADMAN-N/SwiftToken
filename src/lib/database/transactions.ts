import { prisma } from '../db';
import type { Prisma } from '@prisma/client';

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
    where: {
      signature: signature,
    },
    data: {
      status: 'confirmed',
      confirmedAt: new Date(),
    },
  });
}

export async function failTransaction(signature: string) {
  return await prisma.transaction.update({
    where: {
      signature: signature,
    },
    data: {
      status: 'failed',
    },
  });
}

export async function getTransactionBySignature(signature: string) {
  return await prisma.transaction.findUnique({
    where: {
      signature: signature,
    },
  });
}

export async function getTransactionsByUser(userId: string) {
  return await prisma.transaction.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
