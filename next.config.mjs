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
};

export default nextConfig;
