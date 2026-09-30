import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            { source: "/personalProjects", destination: "/projects", permanent: true },
            { source: "/personalProjects/:slug", destination: "/projects/:slug", permanent: true },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },

    experimental: {
        optimizeCss: true
    },

    compress: true,

    output: "standalone"
};

export default nextConfig;
