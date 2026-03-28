/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.126'],
};

export default nextConfig;
