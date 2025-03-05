'use client';

import { MemecoinCard } from '../components/cards/MemecoinCard';
import { LoadingCard } from '../components/cards/LoadingCard';
import { ErrorCard } from '../components/cards/ErrorCard';
import { WalletConnect } from '../components/WalletConnect';

const mockTokens = [
  {
    name: "PEPE 2.0",
    symbol: "PEPE2",
    description: "The next evolution of meme tokens. Built for the community, powered by AI and ready to take over the crypto world! 🐸",
    imageUrl: "https://picsum.photos/seed/pepe/800/600",
    attributes: {
      memeScore: 95,
      viralPotential: 88,
      uniqueness: 92,
    },
  },
  {
    name: "DOGE AI",
    symbol: "DOGAI",
    description: "Much intelligence, very neural, wow! The first AI-powered Doge token. 🐕",
    imageUrl: "https://picsum.photos/seed/doge/800/600",
    attributes: {
      memeScore: 89,
      viralPotential: 92,
      uniqueness: 85,
    },
  },
  {
    name: "CATTO",
    symbol: "CAT",
    description: "Because cats deserve their own token too! 🐱",
    imageUrl: "https://picsum.photos/seed/cat/800/600",
    attributes: {
      memeScore: 87,
      viralPotential: 78,
      uniqueness: 90,
    },
  },
];

export default function CardDemo() {
  const handleRetry = () => {
    alert('Retry clicked');
  };

  const handleTokenClick = (tokenName: string) => {
    alert(`Clicked on ${tokenName}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Card Components Demo</h1>
      
      <div className="mb-8">
        <h2 className="text-xl mb-4">Wallet Connection</h2>
        <WalletConnect />
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-4">Memecoin Cards</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {mockTokens.map((token) => (
            <div key={token.symbol}>
              <MemecoinCard 
                token={token} 
                onClick={() => handleTokenClick(token.name)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-4">Loading & Error States</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg mb-4">Loading Card</h3>
            <LoadingCard />
          </div>
          
          <div>
            <h3 className="text-lg mb-4">Error Card</h3>
            <ErrorCard 
              message="API rate limit exceeded. Please try again later." 
              onRetry={handleRetry} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
