import Replicate from 'replicate';

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing REPLICATE_API_TOKEN environment variable');
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Constants for the Imagen model
const IMAGEN_MODEL = "google/imagen-3";

export async function checkReplicateConnection(): Promise<{ 
  isValid: boolean; 
  message: string;
  timestamp?: string;
}> {
  try {
    // Create a simple test prediction to verify the API key
    const prediction = await replicate.predictions.create({
      model: IMAGEN_MODEL,
      input: {
        prompt: "test image",
        width: 1024,
        height: 1024,
        num_outputs: 1,
        guidance_scale: 7.5,
        steps: 50
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
}

export async function generateImage(config: ImagenConfig): Promise<string | null> {
  // First verify the connection
  const connectionStatus = await checkReplicateConnection();
  if (!connectionStatus.isValid) {
    console.error('Replicate connection check failed:', connectionStatus.message);
    return null;
  }

  try {
    // Create prediction with Imagen-3
    const prediction = await replicate.predictions.create({
      model: IMAGEN_MODEL,
      input: {
        prompt: config.prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
        guidance_scale: 7.5,
        steps: 50
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

    // Handle both array and string output formats
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

// Optional: Add a function to handle webhook-based generation if needed
export async function generateImageWithWebhook(config: ImagenConfig, webhookUrl: string): Promise<string> {
  const prediction = await replicate.predictions.create({
    model: "google/imagen-3",
    input: {
      prompt: config.prompt,
      num_outputs: 1,
      scheduler: "K_EULER",
      num_inference_steps: 50,
      guidance_scale: 7.5
    },
    webhook: webhookUrl,
    webhook_events_filter: ["completed"]
  });

  return prediction.id;
}
