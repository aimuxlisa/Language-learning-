import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "4 your learning",
    short_name: "4yl",
    description: "Изучение английского в игровой форме",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0c",
    theme_color: "#7c5cff",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
