import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://swifttoken.xyz'),
  title: {
    default: "SwiftToken - AI Memecoin Generator | Create Your Own Memecoin",
    template: "%s | SwiftToken"
  },
  description: "Generate viral memecoins instantly with AI. Create, launch, and deploy your next memecoin token on Solana. The easiest and most affordable way to launch your memecoin with built-in safety features.",
  keywords: [
    // Core Keywords
    "memecoin generator",
    "create memecoin",
    "launch memecoin",
    "AI token generator",
    "Solana memecoin",
    
    // Cost-Related Keywords
    "cheapest way to create memecoin",
    "affordable token launch",
    "low cost memecoin creation",
    "budget friendly token generator",
    "free memecoin maker",
    
    // How-To Keywords
    "how to make a memecoin",
    "how to launch token on solana",
    "how to create cryptocurrency",
    "memecoin creation guide",
    "token launch tutorial",
    
    // Ideas & Inspiration
    "memecoin ideas",
    "viral token ideas",
    "best memecoin names",
    "successful memecoin examples",
    "trending meme tokens",
    "next viral memecoin",
    
    // Technical Keywords
    "solana token creator",
    "token smart contract generator",
    "automated token deployment",
    "token minting platform",
    "crypto token builder",
    
    // Safety & Trust Keywords
    "safe token launch",
    "secure memecoin creation",
    "trusted token generator",
    "verified token contract",
    "anti-scam token features",
    
    // Marketing Related
    "viral memecoin marketing",
    "token launch strategy",
    "memecoin promotion",
    "crypto community building",
    "token launch marketing",
    
    // Platform Specific
    "SwiftToken platform",
    "AI crypto generator",
    "automated token creation",
    "instant token deployment",
    "professional token builder",
    
    // Long-tail Keywords
    "fastest way to launch solana token",
    "automatic memecoin generator",
    "viral potential token creator",
    "professional grade token maker",
    "community driven token platform",
    "legitimate token creation platform",
    "best memecoin generator 2024",
    "trending crypto token ideas",
    "viral meme cryptocurrency generator",
    "easy token launch platform"
  ],
  authors: [{ name: "SwiftToken" }],
  creator: "SwiftToken",
  publisher: "SwiftToken",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "SwiftToken - AI Memecoin Generator",
    description: "Generate viral memecoins instantly with AI. Create and launch your next memecoin token on Solana.",
    type: "website",
    url: 'https://swifttoken.xyz',
    siteName: "SwiftToken",
    locale: "en_US",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SwiftToken - AI Memecoin Generator',
        type: 'image/png',
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftToken - AI Memecoin Generator",
    description: "Generate viral memecoins instantly with AI. Create and launch your next memecoin token on Solana.",
    creator: "@swifttoken",
    images: ['/twitter-image.png']
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
