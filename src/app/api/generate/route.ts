import { NextResponse } from 'next/server';
import { generateTokenIdea } from '@/lib/generators/tokenGenerator';
import { generateTokenImage } from '@/lib/generators/imageGenerator';
import { TokenGenerationPrompt } from '@/types/generation';

export async function POST(request: Request) {
  try {
    const body: TokenGenerationPrompt = await request.json();
    
    console.log('Starting token generation with body:', body);
    
    // First generate token metadata
    const result = await generateTokenIdea(body);
    
    if ('error' in result) {
      console.error('Token generation failed:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    console.log('Token metadata generated:', result);
    
    try {
      // Generate image
      const imageUrl = await generateTokenImage(result);
      if (imageUrl) {
        result.imageUrl = imageUrl;
      } else {
        throw new Error('Image generation failed');
      }
    } catch (imageError) {
      console.error('Image generation error:', imageError);
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}
