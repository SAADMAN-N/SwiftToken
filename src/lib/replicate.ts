import Replicate from 'replicate';

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing REPLICATE_API_TOKEN environment variable');
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Constants for the Image-01 model
const IMAGE_MODEL = "minimax/image-01";

export async function checkReplicateConnection(): Promise<{ 
  isValid: boolean; 
  message: string;
  timestamp?: string;
}> {
  try {
    // Create a simple test prediction
    const prediction = await replicate.predictions.create({
      model: IMAGE_MODEL,
      input: {
        prompt: "test image",
        aspect_ratio: "1:1"
      }
    });

    return {
      isValid: true,
      message: 'Successfully connected to Replicate API',
      timestamp: prediction.created_at
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Replicate API connection error:', {
      error,
      token: process.env.REPLICATE_API_TOKEN ? 'Token provided' : 'No token'
    });
    
    return {
      isValid: false,
      message: `Failed to connect to Replicate API: ${message}`
    };
  }
}

export interface ImagenConfig {
  prompt: string;
  config?: {
    num_inference_steps?: number;
    guidance_scale?: number;
    prompt_strength?: number;
  };
}

export async function generateImage(config: ImagenConfig): Promise<string | null> {
  // First verify the connection
  const connectionStatus = await checkReplicateConnection();
  if (!connectionStatus.isValid) {
    console.error('Replicate connection check failed:', connectionStatus.message);
    return null;
  }

  try {
    const prediction = await replicate.predictions.create({
      model: IMAGE_MODEL,
      input: {
        prompt: config.prompt,
        num_inference_steps: config.config?.num_inference_steps ?? 50,
        guidance_scale: config.config?.guidance_scale ?? 7.5,
        prompt_strength: config.config?.prompt_strength ?? 0.8,
        aspect_ratio: "1:1"
      }
    });

    console.log('Prediction created:', prediction.id);

    // Wait for the prediction to complete
    let result = await replicate.predictions.get(prediction.id);

    // Poll until the prediction is complete
    while (result.status !== "succeeded" && result.status !== "failed") {
      console.log('Waiting for prediction...', result.status);
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === "failed") {
      throw new Error(`Prediction failed: ${result.error}`);
    }

    // Handle the output format
    if (result.output) {
      if (Array.isArray(result.output)) {
        return result.output[0];
      } else if (typeof result.output === 'string') {
        return result.output;
      }
    }

    throw new Error(`Invalid output format: ${JSON.stringify(result.output)}`);
  } catch (error) {
    console.error('Detailed Replicate error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      token: process.env.REPLICATE_API_TOKEN ? 'Token exists' : 'No token',
    });
    return null;
  }
}

// Optional: Update webhook function for Image-01
export async function generateImageWithWebhook(config: ImagenConfig, webhookUrl: string): Promise<string> {
  const prediction = await replicate.predictions.create({
    model: IMAGE_MODEL,
    input: {
      prompt: config.prompt,
      aspect_ratio: "1:1"
    },
    webhook: webhookUrl,
    webhook_events_filter: ["completed"]
  });

  return prediction.id;
}
