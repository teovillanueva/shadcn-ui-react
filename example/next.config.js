/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@teovilla/shadcn-ui"],
  experimental: {
    appDir: true,
    fontLoaders: [
      {
        loader: "@next/font/google",
        options: { subsets: ["latin"] },
      },
    ],
  },
};

module.exports = nextConfig;
