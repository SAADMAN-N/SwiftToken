'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCredits } from '@/hooks/useCredits';
import { MemeTokenMetadata } from '@/types/memecoin';

export function TokenGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MemeTokenMetadata | null>(null);
  const { publicKey } = useWallet();
  const { credits, refetch: refetchCredits } = useCredits();

  const generateToken = async () => {
    if (!publicKey) {
      setError('Please connect your wallet');
      return;
    }

    if (!credits || credits < 1) {
      setError('Insufficient credits');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tokens/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      
      // Immediately refresh credits after successful generation
      await refetchCredits();
      
      setResult(data);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component code
}
