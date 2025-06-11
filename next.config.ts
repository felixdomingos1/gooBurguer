import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
        domains: ['goo-burguer.vercel.app', 'res.cloudinary.com', 'localhost'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '',
                pathname: '/t/p/**',
            },
        ],
    },
};

export default nextConfig;
