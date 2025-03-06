import { MemeTokenMetadata } from '../../types/memecoin';
import { generateImage } from '../replicate';

export async function generateTokenImage(token: MemeTokenMetadata): Promise<string | null> {
  try {
    // Format prompt specifically for Ideogram V2A Turbo
    const imagePrompt = `${token.description}, modern vector art style, perfect for crypto token, clean professional design`;

    // Generate image with square aspect ratio
    const imageUrl = await generateImage({ 
      prompt: imagePrompt,
      config: {
        aspect_ratio: "1:1"  // Square aspect ratio for token images
      }
    });

    return imageUrl;

  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
}
