import { clientEnv } from "@/lib/clients";
import type { PlatformSnapshot } from "./types";

// HYROS is a leads/attribution tool — campaign spend comes from Meta.
// This snapshot is intentionally empty; the real value is in the leads table
// rendered by HyrosLeadsView via /api/[clientSlug]/hyros/leads.
export async function fetchHyros(clientSlug: string, _range = "today"): Promise<PlatformSnapshot> {
  const apiKey = clientEnv(clientSlug, "HYROS_API_KEY");
  if (!apiKey) throw new Error(`HYROS credentials missing for client "${clientSlug}"`);

  return {
    platform: "hyros",
    fetchedAt: new Date().toISOString(),
    totals: { spend: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0, cpm: 0, reach: 0, conversions: 0, roas: 0 },
    campaigns: [],
  };
}
