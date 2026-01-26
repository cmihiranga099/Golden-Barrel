/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.jacobscreek.com' },
      { protocol: 'https', hostname: 'images.squarespace-cdn.com' },
    ],
  },
};

module.exports = nextConfig;
