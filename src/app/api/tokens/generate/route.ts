
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
    
    // 1. Verify and deduct credits FIRST
    let updatedUser;
    try {
      updatedUser = await CreditService.deductCredits(validated.walletAddress);
      logger.info(`Credits deducted successfully for request ${requestId}`);
    } catch (error) {
      logger.error(`Credit deduction failed for request ${requestId}:`, error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Credit deduction failed' },
        { status: 402 }
      );
    }

    // 2. Generate token
    logger.info(`Starting token generation for request ${requestId}`);
    const tokenResult = await generateTokenIdea({
      theme: validated.theme,
      style: validated.style,
      targetAudience: validated.targetAudience,
      walletAddress: validated.walletAddress
    });

    if ('error' in tokenResult) {
      logger.error(`Token generation failed for request ${requestId}:`, tokenResult.error);
      // If generation fails, we should refund the credit
      await CreditService.addCredits(validated.walletAddress, 1, requestId, 0, 'solana');
      return NextResponse.json({ error: tokenResult.error }, { status: 500 });
    }

    // 3. Generate image
    logger.info(`Starting image generation for request ${requestId}`);
    const imageUrl = await generateTokenImage(tokenResult);
    if (!imageUrl) {
      logger.error(`Image generation failed for request ${requestId}`);
      // If image generation fails, we should refund the credit
      await CreditService.addCredits(validated.walletAddress, 1, requestId, 0, 'solana');
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
    }

    // 4. Record successful generation
    const generation = await prisma.generation.create({
      data: {
        user: { connect: { id: updatedUser.id } },
        requestId: requestId,
        tokenName: tokenResult.name,
        tokenSymbol: tokenResult.symbol,
        imageUrl: imageUrl,
        status: 'completed'
      }
    });

    logger.info(`Token generation completed successfully for request ${requestId}`);

    // 5. Return success response with remaining credits
    return NextResponse.json({
      requestId,
      ...tokenResult,
      imageUrl,
      remainingCredits: updatedUser.credits
    });

  } catch (error) {
    logger.error(`Unexpected error in token generation request ${requestId}:`, error);
    return NextResponse.json(
      { error: 'Token generation failed' },
      { status: 500 }
    );
  }
}





