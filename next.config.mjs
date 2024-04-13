/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "img.kwcdn.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "cuddly-spoon-jjqq9q6454qcjg5-3000.app.github.dev",
      ],
      allowedForwardedHosts: [
        "localhost:3000",
        "cuddly-spoon-jjqq9q6454qcjg5-3000.app.github.dev",
      ],
    },
  },
};

export default nextConfig;
