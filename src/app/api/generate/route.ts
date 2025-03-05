import { NextResponse } from 'next/server';
import { generateTokenIdea } from '@/lib/generators/tokenGenerator';
import { TokenGenerationPrompt } from '@/types/generation';

export async function POST(request: Request) {
  try {
    const body: TokenGenerationPrompt = await request.json();
    
    const result = await generateTokenIdea(body);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
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