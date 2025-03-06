import { MemeTokenMetadata } from '../../types/memecoin';
import { generateImage } from '../replicate';
import { openai } from '../openai';
import { writeFile } from 'fs/promises';
import path from 'path';

// Fallback prompts for when OpenAI is unavailable
const FALLBACK_PROMPTS = [
  "A cute Shiba Inu dog wearing a space suit and cryptocurrency symbols floating around, digital art style, centered portrait shot, 4k quality",
  "A smiling green Pepe the Frog wearing a crown and holding crypto coins, digital art style, centered portrait shot, 4k quality",
  "Elon Musk as an anime character riding a Dogecoin rocket to the moon, digital art style, centered portrait shot, 4k quality",
  "A golden Trump pepe wearing a crypto trader outfit with charts in background, digital art style, centered portrait shot, 4k quality",
  "A cute cat wearing sunglasses and a bitcoin necklace, digital art style, centered portrait shot, 4k quality",
  "A space astronaut doge holding a cryptocurrency wallet, digital art style, centered portrait shot, 4k quality"
];

export async function generateTokenImage(token: MemeTokenMetadata): Promise<string | null> {
  try {
    // Try getting a prompt from GPT-4
    try {
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
      // If OpenAI fails (quota/rate limit), use fallback prompts
      if (error instanceof Error && 
          (error.message.includes('429') || error.message.includes('quota'))) {
        console.log('OpenAI quota exceeded, using fallback prompt');
        
        // Select a random fallback prompt
        const fallbackPrompt = FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
        console.log('Using fallback prompt:', fallbackPrompt);

        // Generate image with fallback prompt
        const imageUrl = await generateImage({ prompt: fallbackPrompt });
        if (!imageUrl) {
          throw new Error('Failed to generate image with fallback prompt');
        }

        return imageUrl;
      }
      
      throw error; // Re-throw if it's not a quota error
    }

  } catch (error) {
    console.error('Image generation failed:', error);
    return null;
  }
}
