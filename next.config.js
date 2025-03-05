/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'example.com',
      'replicate.delivery',
      'i.imgur.com',
      'raw.githubusercontent.com'
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
