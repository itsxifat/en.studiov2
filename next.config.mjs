/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... your other config ...

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      { // Add this new entry for placehold.co
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },

  // If you still have the webpack externals config, you can remove it now
  // webpack: (config, { isServer }) => { ... }, // REMOVE THIS BLOCK if present
};

export default nextConfig;