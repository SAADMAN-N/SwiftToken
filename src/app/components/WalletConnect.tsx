'use client';

import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { useSolanaBalance } from '@/hooks/useSolanaBalance';

export function WalletConnect() {
  const { 
    isPhantomInstalled, 
    connected, 
    connect, 
    disconnect, 
    error: walletError, 
    isLoading: walletLoading,
    publicKey 
  } = usePhantomWallet();

  const {
    balance,
    isLoading: balanceLoading,
    error: balanceError
  } = useSolanaBalance();

  if (!isPhantomInstalled) {
    return (
      <div className="inline-block">
        <a 
          href="https://phantom.app" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-blue-500 hover:underline"
        >
          Install Phantom Wallet
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {(walletError || balanceError) && (
        <div className="text-sm text-red-500">
          {walletError || balanceError}
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <button
          onClick={connected ? disconnect : connect}
          disabled={walletLoading}
          className={`px-3 py-1 text-sm rounded ${
            walletLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {walletLoading 
            ? 'Loading...' 
            : connected 
              ? 'Disconnect' 
              : 'Connect'
          }
        </button>

        {connected && (
          <div className="text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
            </div>
            <div className="font-medium">
              {balanceLoading ? (
                <span className="text-gray-400">Loading...</span>
              ) : balance !== null ? (
                <span>{balance.toFixed(4)} SOL</span>
              ) : (
                <span className="text-red-500">Error</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
