/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  // Enabling experimental features
  experimental: {
    serverComponentsExternalPackages: ["mongoose"], // Allowing mongoose for server components
  },

  // Configuration for external images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Custom webpack configuration
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true, // Enabling top-level await
    };
    return config; // Return the modified config
  },

  // Adding headers to address COOP and CORS issues
  async headers() {
    return [
      {
        source: "/(.*)", // Apply to all routes
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", // Relax COOP policy for development
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none", // Allow embedding resources
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Enable CORS for all origins (adjust in production)
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS", // Allowed HTTP methods
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization", // Allowed headers
          },
        ],
      },
    ];
  },
};

export default nextConfig;
