'use client';

import { useState } from 'react';
import { MemeTokenMetadata } from '@/types/memecoin';
import { MemecoinCard } from './components/cards/MemecoinCard';
import { LoadingCard } from './components/cards/LoadingCard';
import { WalletConnect } from './components/WalletConnect';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';

const GENERATION_PRICE_SOL = 0.007;

export default function GeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MemeTokenMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { connected, publicKey } = usePhantomWallet();

  const generateToken = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // First verify payment
      // TODO: Implement payment verification
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: "current memes",
          style: "viral",
          keywords: ["crypto", "viral", "moon"]
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      
      if ('error' in data) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Wallet section at the top */}
      <div className="absolute top-4 left-4">
        <WalletConnect />
      </div>

      <div className="max-w-3xl mx-auto mt-16"> {/* Added margin top to account for wallet */}
        <h1 className="text-3xl font-bold mb-8">
          Generate Your Memecoin
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Generation Cost: {GENERATION_PRICE_SOL} SOL
            </div>
            <div className="text-xs text-gray-500">
              Includes AI-powered name, description, and unique image generation
            </div>
          </div>
          
          <button
            onClick={generateToken}
            className={`w-full font-bold py-3 px-4 rounded-lg transition-colors ${
              connected 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!connected || loading}
          >
            {loading ? 'Generating...' : connected ? 'Generate Memecoin' : 'Connect Wallet to Generate'}
          </button>

          <div className="mt-8">
            {loading && <LoadingCard />}
            {result && !loading && (
              <MemecoinCard token={result} />
            )}
            {error && (
              <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
