export interface TokenGenerationPrompt {
  theme?: string;       // e.g., "cats", "space", "food"
  style?: string;       // e.g., "funny", "serious", "cute"
  keywords?: string[];  // additional context keywords
  walletAddress?: string; // wallet address for credit deduction
  targetAudience?: string; // added this field
}

export interface TokenGenerationResult {
  name: string;
  symbol: string;
  description: string;
  error?: string;
}
