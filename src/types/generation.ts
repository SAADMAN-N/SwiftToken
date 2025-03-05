export interface TokenGenerationPrompt {
  theme?: string;       // e.g., "cats", "space", "food"
  style?: string;       // e.g., "funny", "serious", "cute"
  keywords?: string[];  // additional context keywords
}

export interface TokenGenerationResult {
  name: string;
  symbol: string;
  description: string;
  error?: string;
}