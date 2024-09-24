/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
