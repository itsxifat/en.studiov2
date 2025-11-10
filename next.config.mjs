/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },

  // ✅ Optional: Improves IP and proxy header behavior (for your tracking API)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // These help ensure the client’s real IP is forwarded through proxies
          { key: "X-Forwarded-For", value: "{ip}" },
          { key: "X-Real-IP", value: "{ip}" },
        ],
      },
    ];
  },

  // ✅ Optional: Recommended for better edge/runtime behavior
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // increase if you upload data
    },
  },

  reactStrictMode: true,
};

export default nextConfig;
