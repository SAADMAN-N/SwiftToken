'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';

export const usePhantomWallet = () => {
  const { 
    publicKey,
    connecting,
    connected,
    connect,
    disconnect,
    wallet,
    select
  } = useWallet();
  const { setVisible } = useWalletModal();
  const [error, setError] = useState<string | null>(null);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

  useEffect(() => {
    const checkPhantom = async () => {
      if (typeof window !== 'undefined') {
        const isPhantom = (window as any)?.phantom?.solana?.isPhantom || false;
        setIsPhantomInstalled(isPhantom);
      }
    };
    
    checkPhantom();
  }, []);

  const handleConnect = async () => {
    try {
      setError(null);
      if (!wallet) {
        setVisible(true);
      } else {
        await connect();
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect');
    }
  };

  const handleDisconnect = async () => {
    try {
      setError(null);
      await disconnect();
    } catch (err: any) {
      console.error('Disconnection error:', err);
      setError(err.message || 'Failed to disconnect');
    }
  };

  return {
    isPhantomInstalled,
    connected,
    connect: handleConnect,
    disconnect: handleDisconnect,
    error,
    isLoading: connecting,
    publicKey: publicKey?.toString() || null
  };
};
