
import { NextResponse } from 'next/server';
import { generateTokenIdea } from '@/lib/generators/tokenGenerator';
import { generateTokenImage } from '@/lib/generators/imageGenerator';
import { CreditService } from '@/lib/services/creditService';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { prisma } from '@/lib/db';

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
    
    // Set a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Generation timeout')), 55000); // 55 seconds to allow for response time
    });

    // User validation
    const user = await prisma.user.findUnique({
      where: { walletAddress: validated.walletAddress }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }

    // Run generation with timeout
    const generationPromise = (async () => {
      // Generate token first (usually faster)
      const tokenResult = await generateTokenIdea({
        theme: validated.theme,
        style: validated.style,
        targetAudience: validated.targetAudience
      });

      if ('error' in tokenResult) {
        throw new Error(tokenResult.error);
      }

      // Generate image with reduced parameters for speed
      const imageUrl = await generateTokenImage({
        ...tokenResult,
        fastMode: true // Add this parameter to your image generator
      });

      if (!imageUrl) {
        throw new Error('Image generation failed');
      }

      // Deduct credits only after successful generation
      const updatedUser = await CreditService.deductCredits(validated.walletAddress);

      return {
        ...tokenResult,
        imageUrl,
        remainingCredits: updatedUser.credits
      };
    })();

    // Race between timeout and generation
    const result = await Promise.race([generationPromise, timeoutPromise]);
    return NextResponse.json(result);

  } catch (error) {
    logger.error(`Error in token generation request ${requestId}:`, error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === 'Generation timeout') {
        return NextResponse.json(
          { error: 'Generation timed out. Please try again.' },
          { status: 504 }
        );
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Token generation failed' },
      { status: 500 }
    );
  }
}





