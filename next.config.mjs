/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile pictures
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Google CDN
      },
      {
        protocol: 'https',
        hostname: 'uykgpmgcayncaddtsspu.supabase.co', // Supabase storage
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase limit for large form uploads
    },
  },
  // Prevent fetch caching issues that cause AbortErrors
  reactStrictMode: true,
};

export default nextConfig;
