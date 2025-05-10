/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'i.pinimg.com',
      'i.pravatar.cc',
      'findroommate.s3.eu-north-1.amazonaws.com',
      'images.pexels.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  }
};

module.exports = nextConfig;