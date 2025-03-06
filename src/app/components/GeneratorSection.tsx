'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCredits } from '@/hooks/useCredits';
import { LoadingCard } from './cards/LoadingCard';
import { MemecoinCard } from './cards/MemecoinCard';
import { MemeTokenMetadata } from '@/types/memecoin';

export function GeneratorSection() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [memeToken, setMemeToken] = useState<MemeTokenMetadata | null>(null);
  
  const { connected, publicKey } = useWallet();
  const { credits, refetch: refetchCredits } = useCredits();

  const handleGenerate = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setMemeToken(null); // Reset result when starting new generation
    
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setMemeToken(data);
      await refetchCredits();
      
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <button
          onClick={handleGenerate}
          className={`w-full font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 ${
            connected 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!connected || loading}
        >
          {loading ? 'Generating...' : (connected ? '🚀 Generate Memecoin' : '🔗 Connect Wallet to Generate')}
        </button>

        <div className="mt-8">
          {loading && <LoadingCard />}
          {memeToken && !loading && (
            <MemecoinCard token={memeToken} />
          )}
          {error && (
            <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
