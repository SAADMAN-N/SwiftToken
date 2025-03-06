import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const createUserSchema = z.object({
  walletAddress: z.string().min(32).max(44),
});

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(request: Request) {
  try {
    // Log the incoming request
    logger.info('Received user creation request');

    const body = await request.json();
    logger.info('Request body:', body);

    const validated = createUserSchema.parse(body);

    // Try to find existing user first
    let user = await prisma.user.findUnique({
      where: {
        walletAddress: validated.walletAddress,
      },
    });

    // If user doesn't exist, create them
    if (!user) {
      logger.info('Creating new user with wallet:', validated.walletAddress);
      user = await prisma.user.create({
        data: {
          walletAddress: validated.walletAddress,
          credits: 1, // Give 1 free credit to start
        },
      });
    } else {
      logger.info('User already exists:', validated.walletAddress);
    }

    return NextResponse.json(user);
  } catch (error) {
    logger.error('Error in user creation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create user' },
      { status: 400 }
    );
  }
}