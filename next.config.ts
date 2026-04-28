 /** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'abhptxekbiwvrhcpmtna.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Vaqtinchalik rasmlar uchun ruxsat
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;