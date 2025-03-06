import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import { GeneratorSection } from './components/GeneratorSection';

// Get all images from the showcase folder
const showcaseDir = path.join(process.cwd(), 'public', 'showcase');
const showcaseImages = fs.readdirSync(showcaseDir)
  .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
  .map(file => ({
    url: `/showcase/${file}`,
    title: file.split('.')[0].replace(/-/g, ' ').toUpperCase()
  }));

export default function GeneratorPage() {
  // Add JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SwiftToken',
    description: 'AI-powered memecoin generator for Solana blockchain',
    applicationCategory: 'Cryptocurrency Tool',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0.01',
      priceCurrency: 'SOL',
    },
    author: {
      '@type': 'Organization',
      name: 'SwiftToken',
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Create Your Next Viral Memecoin
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Generate stunning memecoin ideas powered by real-time data from Twitter, Reddit, and crypto news! 
            Let AI help you create the next moonshot! 🚀
          </p>
        </div>

        {/* Showcase Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Example Generations
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {showcaseImages.map((image) => (
              <div key={image.url} className="group relative">
                <div className="aspect-square overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={image.url}
                    alt={image.title}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-bold text-lg">{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generator Section */}
        <GeneratorSection />
      </div>
    </>
  );
}
