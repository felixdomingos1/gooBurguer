import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
        domains: ['goo-burguer.vercel.app', 'res.cloudinary.com', 'localhost'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'goo-burguer.vercel.app',
                port: '',
                pathname: '/t/p/**',
            },
        ],
    },
};

export default nextConfig;
