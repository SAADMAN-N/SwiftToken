'use client';

import Image from 'next/image';
import { MemeTokenMetadata } from '@/types/memecoin';
import { ScoreIndicator } from './ScoreIndicator';

interface MemecoinCardProps {
  token: MemeTokenMetadata;
  onClick?: () => void;
}

export function MemecoinCard({ token, onClick }: MemecoinCardProps) {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <div className="relative h-48 w-full">
        <Image
          src={token.imageUrl}
          alt={token.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {token.name}
          </h3>
          <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            ${token.symbol}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">
          {token.description}
        </p>

        <div className="space-y-3">
          <ScoreIndicator 
            label="Meme Score" 
            value={token.attributes.memeScore} 
          />
          <ScoreIndicator 
            label="Viral Potential" 
            value={token.attributes.viralPotential} 
          />
          <ScoreIndicator 
            label="Uniqueness" 
            value={token.attributes.uniqueness} 
          />
        </div>
      </div>
    </div>
  );
}
