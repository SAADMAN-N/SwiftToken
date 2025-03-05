import { generateTokenIdea } from '../lib/generators/tokenGenerator';
import { TokenGenerationPrompt } from '../types/generation';
import { MemeTokenMetadata } from '../types/memecoin';

describe('Token Generator', () => {
  it('should generate a valid memecoin with trending data', async () => {
    const prompt: TokenGenerationPrompt = {
      theme: "current memes",
      style: "viral",
      keywords: ["crypto", "viral", "moon"]
    };

    const result = await generateTokenIdea(prompt);

    // Check if result is not an error
    expect('error' in result).toBe(false);
    
    const tokenData = result as MemeTokenMetadata;
    
    // Basic structure checks
    expect(tokenData.name).toBeDefined();
    expect(tokenData.symbol).toBeDefined();
    expect(tokenData.description).toBeDefined();
    expect(tokenData.imageUrl).toBeDefined();
    
    // Attribute validations
    expect(tokenData.attributes.memeScore).toBeGreaterThanOrEqual(70);
    expect(tokenData.attributes.memeScore).toBeLessThanOrEqual(100);
    expect(tokenData.attributes.viralPotential).toBeGreaterThanOrEqual(70);
    expect(tokenData.attributes.viralPotential).toBeLessThanOrEqual(100);
    
    // Check if trending sources are included
    expect(Array.isArray(tokenData.trendingSources)).toBe(true);
    expect(tokenData.trendingSources.length).toBeGreaterThan(0);
  });
});