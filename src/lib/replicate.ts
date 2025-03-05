import Replicate from 'replicate';

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing REPLICATE_API_TOKEN environment variable');
}

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const SDXL_MODEL = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

export interface SDXLConfig {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  num_outputs?: number;
  scheduler?: "K_EULER";
  num_inference_steps?: number;
  guidance_scale?: number;
  prompt_strength?: number;
}

export async function generateImage(config: SDXLConfig): Promise<string | null> {
  try {
    const output = await replicate.run(SDXL_MODEL, {
      input: {
        prompt: config.prompt,
        negative_prompt: config.negative_prompt,
        width: config.width || 1024,
        height: config.height || 1024,
        num_outputs: config.num_outputs || 1,
        scheduler: config.scheduler || "K_EULER",
        num_inference_steps: config.num_inference_steps || 50,
        guidance_scale: config.guidance_scale || 7.5,
        prompt_strength: config.prompt_strength || 0.8,
      }
    });

    // Replicate returns an array of image URLs
    return Array.isArray(output) ? output[0] : null;
  } catch (error) {
    console.error('Image generation failed:', error);
    return null;
  }
}