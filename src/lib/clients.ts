export type PlatformId = "meta" | "tiktok" | "google" | "hyros";

export interface ClientConfig {
  slug: string;
  name: string;
  color?: string; // tailwind bg color class e.g. "bg-blue-500"
  platforms: PlatformId[];
}

export const CLIENTS: ClientConfig[] = [
  {
    slug: "qki",
    name: "QKI",
    platforms: ["meta"],
  },
];

export function getClient(slug: string): ClientConfig | undefined {
  return CLIENTS.find((c) => c.slug === slug);
}

export function clientEnv(slug: string, key: string): string | undefined {
  const envKey = `CLIENT_${slug.toUpperCase().replace(/-/g, "_")}_${key}`;
  return process.env[envKey];
}
