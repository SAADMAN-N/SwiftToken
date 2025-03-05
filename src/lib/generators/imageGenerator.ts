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
          content: `You are an expert at creating detailed image prompts for Imagen-3. Create prompts that:
- Use professional photography style elements
- Include specific art direction like "digital art", "3D render", or "cartoon style"
- Emphasize high quality details like "4k", "detailed", "professional lighting"
`
        },
        {
          role: "user",
          content: `Create a prompt for a crypto memecoin image silimar to DOGE coin or PEPE coin based on this concept: ${token.description}. 
Focus on:
- main subject stays in the middle like a portrait picture
- Simple, clean backgrounds
- Professional lighting and composition
- Avoid any text or logos`
        }
      ]
    });

    const imagePrompt = completion.choices[0].message.content;
    if (!imagePrompt) {
      throw new Error('Failed to generate image prompt');
    }

    console.log('Generated image prompt:', imagePrompt); // Add this for debugging

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
