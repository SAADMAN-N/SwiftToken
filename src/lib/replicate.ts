import Replicate from 'replicate';

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing REPLICATE_API_TOKEN environment variable');
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Use Ideogram V2A Turbo model
const IMAGE_MODEL = "ideogram-ai/ideogram-v2a-turbo";

export interface ImagenConfig {
  prompt: string;
  config?: {
    aspect_ratio?: string;
  };
}

export interface ReplicateStatus {
  isValid: boolean;
  message: string;
  timestamp: string;
}

export async function checkReplicateConnection(): Promise<ReplicateStatus> {
  try {
    // Test the connection with a minimal prompt
    const testPrediction = await replicate.run(IMAGE_MODEL, {
      input: {
        prompt: "test connection",
        aspect_ratio: "1:1"
      }
    });

    return {
      isValid: true,
      message: 'Successfully connected to Replicate API',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      isValid: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    };
  }
}

export async function generateImage(config: ImagenConfig): Promise<string | null> {
  try {
    // Enhance prompt for better memecoin results
    const enhancedPrompt = `Generate a crypto memecoin image based on the following prompt: ${config.prompt}, centered composition, vibrant colors, clean edges, perfect for token logo`;

    const prediction = await replicate.run(IMAGE_MODEL, {
      input: {
        prompt: enhancedPrompt,
        aspect_ratio: config.config?.aspect_ratio ?? "1:1"  // Square by default for token images
      }
    });

    // Handle the output
    if (Array.isArray(prediction)) {
      return prediction[0];
    } else if (typeof prediction === 'string') {
      return prediction;
    }

    throw new Error(`Invalid output format: ${JSON.stringify(prediction)}`);
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
}
