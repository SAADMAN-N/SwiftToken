'use client';

import { useState } from 'react';
import { MemeTokenMetadata } from '@/types/memecoin';
import { MemecoinCard } from './components/cards/MemecoinCard';
import { LoadingCard } from './components/cards/LoadingCard';

export default function GeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MemeTokenMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateToken = async () => {
    setLoading(true);
    setError(null);
    
    try {
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Generate Your Memecoin
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Create your next viral memecoin using AI-powered generation.
          </p>
          
          <button
            onClick={generateToken}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Memecoin'}
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
