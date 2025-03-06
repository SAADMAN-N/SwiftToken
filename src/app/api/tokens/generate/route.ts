
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

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  logger.info(`Starting token generation request ${requestId}`);

  try {
    const body = await request.json();
    const validated = generateSchema.parse(body);
    
    // 1. Check if user exists and has credits
    const user = await prisma.user.findUnique({
      where: { walletAddress: validated.walletAddress }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    // 2. Deduct credits FIRST
    const updatedUser = await CreditService.deductCredits(validated.walletAddress);
    logger.info(`Credits deducted successfully for request ${requestId}`);

    // 3. Generate token
    const tokenResult = await generateTokenIdea({
      theme: validated.theme,
      style: validated.style,
      targetAudience: validated.targetAudience
    });

    if ('error' in tokenResult) {
      // Refund the credit since generation failed
      await CreditService.addCredits(validated.walletAddress, 1);
      return NextResponse.json(
        { error: tokenResult.error },
        { status: 500 }
      );
    }

    // 4. Generate image
    const imageUrl = await generateTokenImage(tokenResult);
    if (!imageUrl) {
      // Refund the credit since image generation failed
      await CreditService.addCredits(validated.walletAddress, 1);
      return NextResponse.json(
        { error: 'Image generation failed' },
        { status: 500 }
      );
    }

    // 5. Save the generated token
    await prisma.generatedToken.create({
      data: {
        userId: user.id,
        name: tokenResult.name,
        symbol: tokenResult.symbol,
        description: tokenResult.description,
        imageUrl: imageUrl,
        attributes: tokenResult.attributes as any
      }
    });

    // 6. Return success response
    return NextResponse.json({
      ...tokenResult,
      imageUrl,
      remainingCredits: updatedUser.credits
    });

  } catch (error) {
    logger.error(`Error in token generation request ${requestId}:`, error);
    
    // Ensure we always return a proper JSON response
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Token generation failed',
        requestId 
      },
      { status: 500 }
    );
  }
}





