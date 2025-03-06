import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const createUserSchema = z.object({
  walletAddress: z.string().min(32).max(44),
});

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    if (!body || !body.walletAddress) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const validated = createUserSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    // Try to find existing user first
    let user = await prisma.user.findUnique({
      where: {
        walletAddress: validated.data.walletAddress,
      },
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: validated.data.walletAddress,
          credits: 1, // Give 1 free credit to start
        },
      });
    }

    return NextResponse.json({ success: true, user });
    
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: "Failed to process user request" },
      { status: 500 }
    );
  }
}
