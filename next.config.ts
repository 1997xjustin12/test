// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // /* config options here */async redirects() {
//   //   return [
//   //     {
//   //       source: '/',
//   //       destination: '/category/fireplaces', // Replace with your target path
//   //       permanent: true, // Set to true for 301 redirects, false for 302 redirects
//   //     },
//   //   ];
//   // },
// };

// export default nextConfig;


module.exports = {
  compress: true, // ✅ Enable gzip/Brotli compression
  images: {
    formats: ['image/webp'], // ✅ Serve images in WebP for better performance
  },
  experimental: {
    optimizeCss: true, // ✅ Reduce CSS render-blocking
  },
  async headers() {
    return [
      {
        source: '/(.*)', // ✅ Match all routes
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // ✅ Cache static assets
          },
          {
            key: 'Content-Encoding',
            value: 'br', // ✅ Ensure Brotli compression is applied
          },
        ],
      },
    ];
  },
};
