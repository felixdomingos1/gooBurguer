import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
        domains: ['localhost'],
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
