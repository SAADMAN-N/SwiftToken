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

export async function generateTokenImage(token: MemeTokenMetadata & { fastMode?: boolean }): Promise<string | null> {
  try {
    // Ultra-fast mode settings
    const imagePrompt = `${token.description}, digital art style, centered, 4k quality`;

    // Generate image with minimum viable parameters
    const imageUrl = await generateImage({ 
      prompt: imagePrompt,
      config: {
        num_inference_steps: 20,    // Minimum steps
        guidance_scale: 6.5,        // Lower guidance for faster generation
        prompt_strength: 0.6,       // Lower strength for faster generation
      }
    });

    return imageUrl;

  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
}

async function generateDetailedPrompt(token: MemeTokenMetadata): Promise<string> {
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
    return imagePrompt;

  } catch (error) {
    console.log('OpenAI quota exceeded, using fallback prompt');
    
    // Select a random fallback prompt
    const fallbackPrompt = FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
    console.log('Using fallback prompt:', fallbackPrompt);
    return fallbackPrompt;
  }
}
