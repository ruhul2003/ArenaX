/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Disable Turbopack and use Webpack (Recommended for stability right now)
  experimental: {
    // Remove this line if you want to try Turbopack
    turbopack: false,
  },

  // If you want to use Turbopack, remove the webpack config below
};

export default nextConfig;
