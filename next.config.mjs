import buffer from 'node:buffer';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';
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

export default function config(phase) {
  return {
    ...nextConfig,
    // Dev recompilation must never overwrite production manifests and chunks.
    // Keep explicit output-directory overrides for isolated browser tests.
    distDir: process.env.NEXT_BUILD_DIR ||
      (phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next'),
  };
}
