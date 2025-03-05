import { MemeTokenMetadata } from '../../types/memecoin';
import { generateImage } from '../replicate';
import { openai } from '../openai';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function generateTokenImage(token: MemeTokenMetadata): Promise<string | null> {
  try {
    // Get a highly detailed prompt from GPT-4 with more specific safe guidelines
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Create short, focused prompts for crypto coin images. Keep it under 3 sentences. avoid using political names as they get flagged as unsafe, if you dont have any options or all options have politics, then make celebrity memecoins e.g. Elon Musk became broke (this is a meme), PEPE memes, DOGE memes etc. mAKE SURE YOU DONT MAKE A PROMPT THAT contains sensitive words that violate Google's Responsible AI practices"
        },
        {
          role: "user",
          content: `Create a simple crypto coin image prompt based on: ${token.description}. Make it a centered portrait shot, 4k quality, digital art style.`
        }
      ]
    });

    const imagePrompt = completion.choices[0].message.content;
    if (!imagePrompt) {
      throw new Error('Failed to generate image prompt');
    }

    console.log('Generated image prompt:', imagePrompt);

    // Generate image using predictions API
    const imageUrl = await generateImage({ prompt: imagePrompt });
    if (!imageUrl) {
      throw new Error('Failed to generate image');
    }

    return imageUrl;

  } catch (error) {
    console.error('Image generation failed:', error);
    return null;
  }
}
