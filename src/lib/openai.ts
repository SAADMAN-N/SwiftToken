import OpenAI from 'openai';
import { validateEnv } from './env';

// Validate environment variables
const envResult = validateEnv();
if (!envResult.success) {
  throw new Error('Failed to initialize OpenAI client: Invalid environment variables');
}

if (!envResult.data?.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: envResult.data.OPENAI_API_KEY,
});
