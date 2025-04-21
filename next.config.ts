import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      new URL(
        "https://deohlaqqhevsfdehphpf.supabase.co/storage/v1/object/public/**"
      ),
    ],
  },
};

export default nextConfig;
