import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Приложение целиком динамическое (сессии + БД на каждый запрос)
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
