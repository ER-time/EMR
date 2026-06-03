/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ioctane.nyc3.digitaloceanspaces.com",
        port: "",
        pathname: "**", // Allow images from any path
      },
    ],
    // domains: [
    //   'ioctane.nyc3.digitaloceanspaces.com'
    // ],
    // unoptimized: true,
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
