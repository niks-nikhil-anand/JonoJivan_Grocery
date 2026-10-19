import buffer from 'node:buffer';
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  reactStrictMode: true,
  swcMinify: true,


};

export default nextConfig;
