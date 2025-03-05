'use client';

import { useState } from 'react';
import { MemeTokenMetadata } from '@/types/memecoin';
import { MemecoinCard } from './components/cards/MemecoinCard';
import { LoadingCard } from './components/cards/LoadingCard';
import { useWallet } from '@solana/wallet-adapter-react';

const GENERATION_PRICE_SOL = 0.01;

export default function GeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MemeTokenMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { connected, publicKey } = useWallet();

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
    } catch (err) {
      setError('Generation failed. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Generate Your Memecoin
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {GENERATION_PRICE_SOL} SOL
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                per generation
              </div>
            </div>
            <div className="text-sm text-gray-500">
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
            {loading ? 'Generating...' : (connected ? 'Generate Memecoin' : 'Connect Wallet to Generate')}
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
