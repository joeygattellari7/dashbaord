export type PlatformId = "meta" | "tiktok" | "google" | "hyros";

export interface ClientConfig {
  slug: string;
  name: string;
  color?: string; // tailwind bg color class e.g. "bg-blue-500"
  platforms: PlatformId[];
}

export const CLIENTS: ClientConfig[] = [
  // Add your clients here. Credentials are read from env vars:
  //   Meta:    CLIENT_{SLUG}_META_ACCESS_TOKEN, CLIENT_{SLUG}_META_AD_ACCOUNT_ID
  //   TikTok:  CLIENT_{SLUG}_TIKTOK_ACCESS_TOKEN, CLIENT_{SLUG}_TIKTOK_ADVERTISER_ID
  //   Google:  CLIENT_{SLUG}_GOOGLE_DEVELOPER_TOKEN, CLIENT_{SLUG}_GOOGLE_CUSTOMER_ID, CLIENT_{SLUG}_GOOGLE_ACCESS_TOKEN
  //   HYROS:   CLIENT_{SLUG}_HYROS_API_KEY
  //
  // Example:
  // {
  //   slug: "acme",
  //   name: "Acme Corp",
  //   platforms: ["meta", "tiktok", "google", "hyros"],
  // },
];

export function getClient(slug: string): ClientConfig | undefined {
  return CLIENTS.find((c) => c.slug === slug);
}

export function clientEnv(slug: string, key: string): string | undefined {
  const envKey = `CLIENT_${slug.toUpperCase().replace(/-/g, "_")}_${key}`;
  return process.env[envKey];
}
