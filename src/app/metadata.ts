import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://swifttoken.netlify.app'),
  title: "SwiftToken - AI Memecoin Generator | Create Your Own Memecoin",
  description: "Generate viral memecoins instantly with AI. Create, launch, and deploy your next memecoin token on Solana. Easy memecoin generation for crypto enthusiasts.",
  keywords: [
    "memecoin generator",
    "create memecoin",
    "launch memecoin",
    "AI token generator",
    "Solana memecoin",
    "crypto token generator",
    "viral memecoin",
    "token creator",
    "cryptocurrency generator",
    "meme token"
  ],
  openGraph: {
    title: "SwiftToken - AI Memecoin Generator",
    description: "Generate viral memecoins instantly with AI. Create and launch your next memecoin token on Solana.",
    type: "website",
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SwiftToken'
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftToken - AI Memecoin Generator",
    description: "Generate viral memecoins instantly with AI. Create and launch your next memecoin token on Solana.",
    images: ['/twitter-image.png']
  },
};
