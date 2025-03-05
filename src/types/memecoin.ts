export interface MemeTokenMetadata {
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  attributes: {
    memeScore: number;
    viralPotential: number;
    uniqueness: number;
  };
}

export interface GenerationRequest {
  theme?: string;
  style?: string;
  targetAudience?: string;
}

export interface GenerationResponse {
  success: boolean;
  data?: MemeTokenMetadata;
  error?: string;
}

export interface WalletTransaction {
  signature: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}