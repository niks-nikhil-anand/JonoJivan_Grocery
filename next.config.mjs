import buffer from 'node:buffer';
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
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
