# SwiftToken - Memecoin Generator Project Plan

## Tech Stack

- Frontend: Next.js 15.2.1 ✓
- Language: TypeScript 5.x (strict mode) ✓
- Styling: TailwindCSS 4.x ✓
- AI:
  - Text: OpenAI API (GPT-4) ✓
  - Image: Google Imagen-3 via Replicate API
- Blockchain: Solana Web3.js, Phantom Wallet ✓
- Image Processing: Sharp.js (watermarking only)
- Type Validation: Zod for runtime type safety ✓

## Phase 1: Project Setup & Configuration ✓

1. Configure TypeScript strict mode ✓
2. Set up environment variables ✓
   - OpenAI API keys ✓
   - Replicate API key ✓
   - Solana wallet addresses ✓
   - API endpoints ✓
3. Create type definitions ✓
   - Memecoin schema ✓
   - API responses ✓
   - Wallet interactions ✓

## Phase 2: Core Components

1. Layout & Navigation ✓
   - Create base layout ✓
   - Set up navigation structure ✓
   - Implement responsive design ✓
2. Card Components
   - Memecoin display card ✓
     - Basic structure and styling ✓
     - Token metadata display ✓
     - Meme score visualization ✓
     - Interactive elements
     - Loading states ✓
     - Error states ✓
   - Loading state card ✓
   - Error state card ✓
   - Demo page for components ✓
3. Wallet Integration
   - Phantom wallet connector ✓
   - Transaction handling
   - Balance checking

## Phase 3: AI Integration

1. OpenAI Service Layer ✓
   - Type-safe API client for GPT-4 ✓
   - Prompt engineering for memecoin ideas ✓
   - Error handling ✓
2. Stable Diffusion Integration
   - Replicate API client setup
   - Optimized prompts for meme-style images
   - Response handling and validation
   - Watermark processing for free tier
3. Token Generation Logic
   - Market research processing
   - Scoring algorithm
   - Combined text/image response validation

## Phase 4: Payment System

1. Solana Integration
   - Wallet connection hooks
   - Transaction verification
   - Payment processing
2. Credits System
   - Generation tracking
   - Credit purchase flow
   - Usage limitation

## Phase 5: User Interface

1. Main Generator Page
   - Generation interface
   - Results display
   - Payment flow
2. Dashboard
   - Generation history
   - Credit balance
   - Download center

## Phase 6: API Routes

1. Generation Endpoint
   - Rate limiting
   - Authentication
   - Error handling
2. Payment Verification
   - Transaction confirmation
   - Credit allocation
   - Security measures

## Phase 7: Testing & Validation

1. Unit Tests
   - Component testing
   - API route testing
   - Utility function testing
2. Integration Tests
   - End-to-end flows
   - Payment processing
   - Generation pipeline

## Phase 8: Deployment

1. Development Environment
   - Local testing
   - Environment validation
2. Production Deployment
   - Vercel configuration
   - Environment variables
   - Performance monitoring

## File Structure

```
swifttoken/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/
│   │   │   └── payment/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   ├── styles/
│   └── utils/
```

## Development Approach

1. Each component/feature will be developed in isolation
2. TypeScript types will be defined before implementation
3. Testing will be done at each step
4. No code merging until type checking passes
5. Documentation will be maintained throughout

## Type Safety Measures

1. Zod schemas for runtime validation
2. TypeScript strict mode enabled
3. ESLint with TypeScript rules
4. Type checking in CI/CD pipeline

## Environment Variables Required

```env
# OpenAI
OPENAI_API_KEY=

# Replicate (Stable Diffusion)
REPLICATE_API_TOKEN=

# Solana
MERCHANT_WALLET_ADDRESS=
SOLANA_NETWORK=devnet  # or mainnet

# App Config
NEXT_PUBLIC_FREE_GENERATIONS_PER_USER=1
NEXT_PUBLIC_PAID_PRICE_SOL=0.01
NEXT_PUBLIC_BULK_PRICE_SOL=0.025
```

## Imagen-3 Configuration

- Model: google/imagen-3
- Parameters:
  - width: 1024
  - height: 1024
  - num_outputs: 1
  - guidance_scale: 7.5
  - prompt_strength: 0.8
  - steps: 50
