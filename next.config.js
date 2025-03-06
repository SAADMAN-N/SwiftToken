/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Remove experimental.serverActions as it's now enabled by default
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  pageExtensions: process.env.NODE_ENV === 'production' 
    ? ['tsx', 'ts'].filter(ext => !ext.includes('demo'))
    : ['tsx', 'ts']
}

module.exports = nextConfig
