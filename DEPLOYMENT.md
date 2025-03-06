# SwiftToken Deployment Checklist

## 1. Environment Variables Setup

### .env.local (DO NOT COMMIT - Store securely)
```env
# OpenAI
OPENAI_API_KEY=sk-...

# Replicate
REPLICATE_API_TOKEN=r8_...

# Stripe (Production Keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Twitter API (If using)
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_BEARER_TOKEN=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_TOKEN_SECRET=...
```

### .env (Safe to commit)
```env
# Solana Configuration
SOLANA_NETWORK=mainnet-beta  # Change from devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com  # Update from devnet

# App Configuration
NEXT_PUBLIC_APP_URL=https://swifttoken.com
NEXT_PUBLIC_BASE_URL=https://swifttoken.com
NEXT_PUBLIC_FREE_GENERATIONS_PER_USER=1
NEXT_PUBLIC_PAID_PRICE_SOL=0.01
NEXT_PUBLIC_BULK_PRICE_SOL=0.025

# Merchant Wallet (Production)
NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS=your_mainnet_wallet_address
```

## 2. Pre-Deployment Tasks

- [ ] Update Solana network from devnet to mainnet-beta
- [ ] Configure production Merchant Wallet address
- [ ] Update RPC URL to production endpoint
- [ ] Set up production database (update Prisma configuration)
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Build project locally to test: `npm run build`
- [ ] Test all environment variables are properly loaded
- [ ] Update metadata.ts with production URLs and SEO

## 3. Stripe Setup

- [ ] Create production Stripe account
- [ ] Update webhook endpoints in Stripe dashboard
- [ ] Configure Stripe price points
- [ ] Test Stripe checkout flow in test mode
- [ ] Switch Stripe to live mode
- [ ] Update success/cancel URLs in checkout configuration

## 4. Solana Configuration

- [ ] Test wallet connections on mainnet
- [ ] Verify transaction fees
- [ ] Update network endpoints
- [ ] Test SOL payments on mainnet
- [ ] Verify merchant wallet receiving payments

## 5. API Services

- [ ] Set up production API keys for OpenAI
- [ ] Configure Replicate API for production
- [ ] Set up rate limiting
- [ ] Configure CORS settings
- [ ] Set up monitoring and logging

## 6. Security Checks

- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Set up rate limiting
- [ ] Enable DDoS protection
- [ ] Configure allowed origins
- [ ] Review API endpoint security

## 7. Monitoring Setup

- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure performance monitoring
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts for critical errors

## 8. Backup & Recovery

- [ ] Configure database backups
- [ ] Document recovery procedures
- [ ] Test restore procedures
- [ ] Set up periodic backup verification

## 9. Performance Optimization

- [ ] Enable caching
- [ ] Optimize images
- [ ] Configure CDN
- [ ] Enable compression
- [ ] Test loading performance

## 10. Final Checks

- [ ] Test all payment flows
- [ ] Verify webhook handling
- [ ] Check error handling
- [ ] Test rate limiting
- [ ] Verify credit system
- [ ] Test image generation
- [ ] Verify token generation
- [ ] Check mobile responsiveness

## 11. Documentation

- [ ] Update API documentation
- [ ] Document deployment process
- [ ] Create troubleshooting guide
- [ ] Update user documentation
- [ ] Document monitoring procedures

## 12. Launch

- [ ] Deploy to production
- [ ] Verify all systems operational
- [ ] Monitor initial transactions
- [ ] Check logs for errors
- [ ] Verify webhooks working
- [ ] Test end-to-end flow