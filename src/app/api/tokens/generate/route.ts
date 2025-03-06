
import { NextResponse } from 'next/server';
import { generateTokenIdea } from '@/lib/generators/tokenGenerator';
import { generateTokenImage } from '@/lib/generators/imageGenerator';
import { CreditService } from '@/lib/services/creditService';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { User } from '@prisma/client';

const generateSchema = z.object({
  walletAddress: z.string().min(32).max(44),
  theme: z.string().optional(),
  style: z.string().optional(),
  targetAudience: z.string().optional()
});

// Set timeout for the API
export const maxDuration = 60; // 60 seconds
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  logger.info(`Starting token generation request ${requestId}`);

  try {
    const body = await request.json();
    const validated = generateSchema.parse(body);
    
    // Shorter timeout for individual operations
    const OPERATION_TIMEOUT = 25000; // 25 seconds per operation
    const TOTAL_TIMEOUT = 50000;     // 50 seconds total

    // User validation with type annotation
    const user = await prisma.user.findUnique({
      where: { walletAddress: validated.walletAddress },
      select: { id: true, credits: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }

    // Start both generations in parallel with individual timeouts
    const [tokenPromise, imagePromise] = await Promise.all([
      Promise.race([
        generateTokenIdea({
          theme: validated.theme,
          style: validated.style,
          targetAudience: validated.targetAudience
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Token generation timeout')), OPERATION_TIMEOUT))
      ]),
      Promise.race([
        generateTokenImage({
          name: "Temporary",
          symbol: "TEMP",
          description: validated.theme || "A creative crypto meme",
          imageUrl: "",
          attributes: { memeScore: 0, viralPotential: 0, uniqueness: 0 },
          fastMode: true
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Image generation timeout')), OPERATION_TIMEOUT))
      ])
    ]).catch(error => {
      throw new Error(`Generation failed: ${error.message}`);
    });

    if (!tokenPromise || !imagePromise) {
      throw new Error('Generation incomplete');
    }

    // Quick credit deduction
    const updatedUser = await CreditService.deductCredits(validated.walletAddress);

    return NextResponse.json({
      ...tokenPromise,
      imageUrl: imagePromise,
      remainingCredits: updatedUser.credits
    });

  } catch (error) {
    logger.error(`Error in token generation request ${requestId}:`, error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Generation timed out. Please try again.' },
          { status: 504 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Token generation failed' },
      { status: 500 }
    );
  }
}





