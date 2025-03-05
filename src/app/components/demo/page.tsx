import { MemecoinCard } from '../cards/MemecoinCard';
import { LoadingCard } from '../cards/LoadingCard';
import { ErrorCard } from '../cards/ErrorCard';

const mockToken = {
  name: "PEPE 2.0",
  symbol: "PEPE2",
  description: "The next evolution of meme tokens. Built for the community, powered by AI and ready to take over the crypto world! 🐸",
  imageUrl: "https://picsum.photos/seed/pepe/800/600", // placeholder image
  attributes: {
    memeScore: 95,
    viralPotential: 88,
    uniqueness: 92,
  },
};

export default function CardDemo() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Card Components Demo</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl mb-4">Memecoin Card</h2>
          <MemecoinCard token={mockToken} />
        </div>
        
        <div>
          <h2 className="text-xl mb-4">Loading Card</h2>
          <LoadingCard />
        </div>
        
        <div>
          <h2 className="text-xl mb-4">Error Card</h2>
          <ErrorCard 
            message="API rate limit exceeded. Please try again later." 
            onRetry={() => alert('Retry clicked')} 
          />
        </div>
      </div>
    </div>
  );
}