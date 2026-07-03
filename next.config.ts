import type { NextConfig } from "next";

// Il browser deve parlare solo con questo dominio (Next.js) e mai direttamente
// col backend Express, altrimenti il cookie di sessione impostato dal login
// (dominio backend) non sarebbe visibile ai Server Component (dominio frontend)
// quando girano su domini diversi in produzione (Vercel vs Render).
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
