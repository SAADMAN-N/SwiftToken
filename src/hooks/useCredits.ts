import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connected, publicKey } = useWallet();

  const fetchCredits = useCallback(async () => {
    if (!connected || !publicKey) {
      setCredits(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/credits?wallet=${publicKey.toString()}`, {
        // Prevent caching
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch credits');
      
      const data = await response.json();
      setCredits(data.credits);
    } catch (err) {
      setError('Failed to load credits');
      console.error('Credit fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const refetch = useCallback(async () => {
    await fetchCredits();
  }, [fetchCredits]);

  return {
    credits,
    loading,
    error,
    refetch
  };
}
