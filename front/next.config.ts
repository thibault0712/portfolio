import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            { source: "/personalProjects/690215fc00092d42d096", destination: "/projects/revego", permanent: true },
            { source: "/personalProjects/69020c5d0002b4d3341f", destination: "/projects/novasuite", permanent: true },
            { source: "/personalProjects/6901d1fb0002505973bb", destination: "/projects/waystrone", permanent: true },
            { source: "/personalProjects/68ff743800223a113cee", destination: "/projects/nazel-launcher", permanent: true },
            { source: "/projects/690215fc00092d42d096", destination: "/projects/revego", permanent: true },
            { source: "/projects/69020c5d0002b4d3341f", destination: "/projects/novasuite", permanent: true },
            { source: "/projects/6901d1fb0002505973bb", destination: "/projects/waystone", permanent: true },
            { source: "/projects/68ff743800223a113cee", destination: "/projects/nazel-launcher", permanent: true },
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
