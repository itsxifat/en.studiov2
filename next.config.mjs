/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... any other config you have ...

  // ADD THIS BLOCK:
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'googleapis'];
    }
    return config;
  },
};

export default nextConfig;