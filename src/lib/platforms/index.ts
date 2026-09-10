import type { PlatformId } from "@/lib/clients";
import type { PlatformFetcher } from "./types";
import { fetchMeta } from "./meta";
import { fetchTikTok } from "./tiktok";
import { fetchGoogle } from "./google";
import { fetchHyros } from "./hyros";

export const PLATFORM_FETCHERS: Record<PlatformId, PlatformFetcher> = {
  meta: fetchMeta,
  tiktok: fetchTikTok,
  google: fetchGoogle,
  hyros: fetchHyros,
};

export const PLATFORM_LABELS: Record<PlatformId, string> = {
  meta: "Meta Ads",
  tiktok: "TikTok Ads",
  google: "Google Ads",
  hyros: "HYROS",
};

export * from "./types";
