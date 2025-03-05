'use client';

import Image from 'next/image';
import { MemeTokenMetadata } from '@/types/memecoin';
import { ScoreIndicator } from './ScoreIndicator';
import { useState } from 'react';
import { FiDownload, FiCopy, FiCheck } from 'react-icons/fi';

interface MemecoinCardProps {
  token: MemeTokenMetadata;
  onClick?: () => void;
}

export function MemecoinCard({ token, onClick }: MemecoinCardProps) {
  const [copied, setCopied] = useState(false);

  const downloadImage = async () => {
    try {
      const response = await fetch(token.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${token.symbol.toLowerCase()}_token.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const copyMetadata = async () => {
    const metadata = {
      name: token.name,
      symbol: token.symbol,
      description: token.description,
      attributes: token.attributes,
      image: token.imageUrl,
      created: new Date().toISOString()
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy metadata:', err);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
    >
      <div className="relative w-full aspect-square group cursor-pointer" onClick={downloadImage}>
        <Image
          src={token.imageUrl}
          alt={token.name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
          <FiDownload className="text-white opacity-0 group-hover:opacity-100 w-8 h-8" />
        </div>
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

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {token.description}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <ScoreIndicator label="Meme" score={token.attributes.memeScore} />
          <ScoreIndicator label="Viral" score={token.attributes.viralPotential} />
          <ScoreIndicator label="Unique" score={token.attributes.uniqueness} />
        </div>

        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={downloadImage}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm"
          >
            <FiDownload /> Download Image
          </button>
          <button
            onClick={copyMetadata}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm ml-auto"
          >
            {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied!' : 'Copy Metadata'}
          </button>
        </div>
      </div>
    </div>
  );
}
