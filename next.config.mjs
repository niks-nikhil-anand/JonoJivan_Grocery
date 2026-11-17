import buffer from 'node:buffer';
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep browser-test builds separate from a running development server.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,


};

export default nextConfig;
