import { generateImage, SDXLConfig } from '../replicate';
import { MemeTokenMetadata } from '../../types/memecoin';

export async function generateTokenImage(token: MemeTokenMetadata): Promise<string | null> {
  const config: SDXLConfig = {
    prompt: `Create a memecoin logo for ${token.name} (${token.symbol}). 
    Theme: ${token.description}. 
    Style: Modern crypto token logo, highly memeable, viral-worthy, 
    professional yet fun design, centered composition, clean background, 
    suitable for social media and crypto exchanges.`,
    negative_prompt: "text, watermark, signature, blurry, low quality, distorted, ugly, unprofessional",
    width: 1024,
    height: 1024,
    num_outputs: 1
  };

  return generateImage(config);
}