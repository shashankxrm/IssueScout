/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_API_URL: process.env.GITHUB_API_URL,
  },
};

export default nextConfig;
