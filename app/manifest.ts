import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Javeed Ishaq Portfolio",
    short_name: "Javeed Ishaq",
    description: "Javeed Ishaq - Product Engineer | Flutter · Next.js · NestJS · PostgreSQL · AI",
    start_url: "/",
    display: "standalone",
    background_color: "#000",
    theme_color: "#000",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
