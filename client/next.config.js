/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: "/api/:path*",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:5328/api/:path*"
                        : "https://claims-api.fly.dev/api/:path*",
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "onylkugdgcijubigpcml.supabase.co",
                port: "",
            },
        ],
    },
};

module.exports = nextConfig;
