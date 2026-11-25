import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Javeed Ishaq Portfolio",
    short_name: "Javeed Ishaq",
    description: "Javeed Ishaq - Full-Stack AI Engineer | RAG · pgvector · TypeScript · Next.js · Flutter",
    start_url: "/",
    display: "standalone",
    background_color: "#000",
    theme_color: "#000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
