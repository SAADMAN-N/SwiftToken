'use client';

import Link from 'next/link';
import { useCredits } from '@/hooks/useCredits';
import { useWallet } from '@solana/wallet-adapter-react';

export function CreditsDisplay() {
  const { credits, loading, error } = useCredits();
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg">
          <span className="text-xl">🪙</span>
          <span className="font-medium">Connect Wallet</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-800">
        <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent" />
        <span className="text-sm">Loading credits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-100">
        <span className="text-sm">⚠️ Error loading credits</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
        <span className="text-xl">🪙</span>
        <span className="font-medium">{credits ?? 0} Credit{(credits ?? 0) !== 1 ? 's' : ''}</span>
      </div>
      <Link 
        href="/credits"
        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Add Credits
      </Link>
    </div>
  );
}
