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
      <div className="p-4">
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Please install Phantom wallet
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Get it from: <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">phantom.app</a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {(walletError || balanceError) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {walletError || balanceError}
        </div>
      )}
      
      <div className="flex flex-col gap-4">
        <button
          onClick={connected ? disconnect : connect}
          disabled={walletLoading}
          className={`px-4 py-2 rounded ${
            walletLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {walletLoading 
            ? 'Loading...' 
            : connected 
              ? 'Disconnect Wallet' 
              : 'Connect Wallet'
          }
        </button>

        {connected && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Connected Address
            </div>
            <div className="font-mono text-sm mt-1">
              {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
            </div>
            
            <div className="mt-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Balance
              </div>
              <div className="font-medium mt-1">
                {balanceLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : balance !== null ? (
                  <span>{balance.toFixed(4)} SOL</span>
                ) : (
                  <span className="text-red-500">Error loading balance</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
