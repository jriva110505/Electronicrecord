import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ['192.168.1.2'],
  
  images: {
    domains: ["uhkwlooejmhtjaspdvju.supabase.co"],
  }, // allow all IPs
};



export default nextConfig;
