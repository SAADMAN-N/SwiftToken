'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const CREDIT_PACKAGES = [
  { credits: 1, price: 1.50 },
  { credits: 5, price: 5.00 },
  { credits: 10, price: 9.99 },
  { credits: 25, price: 20.00 }
] as const;

export function StripePurchaseCredits() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connected, publicKey } = useWallet();

  const handlePurchase = async (credits: number, amount: number) => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use relative URL instead of absolute URL
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credits,
          amount,
          walletAddress: publicKey.toString()
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { url, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err instanceof Error ? err.message : 'Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Purchase Credits with Card</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CREDIT_PACKAGES.map(({ credits, price }) => (
          <button
            key={credits}
            onClick={() => handlePurchase(credits, price)}
            disabled={loading || !connected}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${loading 
                ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 cursor-not-allowed' 
                : 'bg-white dark:bg-gray-900 border-blue-500 hover:bg-gray-50'}
            `}
          >
            <div className="text-2xl mb-2">🪙 {credits}</div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              ${price.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ${(price / credits).toFixed(2)} per credit
            </div>
            {loading && (
              <div className="mt-2 text-sm text-gray-500">
                Loading...
              </div>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
}
