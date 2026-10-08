import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            { source: "/personalProjects/revego", destination: "/projects/690215fc00092d42d096", permanent: true },
            { source: "/personalProjects/novasuite", destination: "/projects/69020c5d0002b4d3341f", permanent: true },
            { source: "/personalProjects/waystrone", destination: "/projects/6901d1fb0002505973bb", permanent: true },
            { source: "/personalProjects/nazel-launcher", destination: "/projects/68ff743800223a113cee", permanent: true },
            { source: "/projects/revego", destination: "/projects/690215fc00092d42d096", permanent: true },
            { source: "/projects/novasuite", destination: "/projects/69020c5d0002b4d3341f", permanent: true },
            { source: "/projects/waystrone", destination: "/projects/6901d1fb0002505973bb", permanent: true },
            { source: "/projects/nazel-launcher", destination: "/projects/68ff743800223a113cee", permanent: true },
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
