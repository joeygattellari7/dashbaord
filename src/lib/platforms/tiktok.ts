import { clientEnv } from "@/lib/clients";
import type { PlatformSnapshot, CampaignRow } from "./types";

const BASE_URL = "https://business-api.tiktok.com/open_api/v1.3";

function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
}

async function tiktokFetch<T>(
  path: string,
  params: Record<string, unknown>,
  token: string
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, typeof v === "string" ? v : JSON.stringify(v));
  }
  const res = await fetch(url.toString(), {
    headers: { "Access-Token": token },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`TikTok API ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { code: number; message: string; data: T };
  if (json.code !== 0) throw new Error(`TikTok API error: ${json.message}`);
  return json.data;
}

interface TikTokMetricsRow {
  dimensions: { campaign_id: string };
  metrics: {
    campaign_name: string;
    campaign_ids: string[];
    spend: string;
    impressions: string;
    clicks: string;
    ctr: string;
    cpc: string;
    cpm: string;
    reach: string;
    conversion: string;
    cost_per_conversion: string;
    purchase_roas: string;
    campaign_status?: string;
  };
}

export async function fetchTikTok(clientSlug: string): Promise<PlatformSnapshot> {
  const token = clientEnv(clientSlug, "TIKTOK_ACCESS_TOKEN");
  const advertiserId = clientEnv(clientSlug, "TIKTOK_ADVERTISER_ID");
  if (!token || !advertiserId) throw new Error(`TikTok credentials missing for client "${clientSlug}"`);

  const today = new Date().toISOString().slice(0, 10);
  const data = await tiktokFetch<{ list: TikTokMetricsRow[] }>(
    "/report/integrated/get/",
    {
      advertiser_id: advertiserId,
      report_type: "BASIC",
      data_level: "AUCTION_CAMPAIGN",
      dimensions: JSON.stringify(["campaign_id"]),
      metrics: JSON.stringify([
        "campaign_name",
        "spend",
        "impressions",
        "clicks",
        "ctr",
        "cpc",
        "cpm",
        "reach",
        "conversion",
        "cost_per_conversion",
        "purchase_roas",
        "campaign_status",
      ]),
      start_date: today,
      end_date: today,
      page_size: 100,
    },
    token
  );

  const campaigns: CampaignRow[] = (data.list || []).map((row) => {
    const m = row.metrics;
    const spend = num(m.spend);
    const conversions = num(m.conversion);
    const roas = num(m.purchase_roas);
    return {
      id: row.dimensions.campaign_id,
      name: m.campaign_name,
      status: m.campaign_status || "UNKNOWN",
      spend,
      impressions: num(m.impressions),
      clicks: num(m.clicks),
      ctr: num(m.ctr),
      cpc: num(m.cpc),
      cpm: num(m.cpm),
      reach: num(m.reach),
      conversions,
      costPerConversion: num(m.cost_per_conversion),
      roas,
    };
  });

  const t = campaigns.reduce(
    (a, c) => { a.spend += c.spend; a.impressions += c.impressions; a.clicks += c.clicks; a.reach += c.reach; a.conversions += c.conversions; return a; },
    { spend: 0, impressions: 0, clicks: 0, reach: 0, conversions: 0 }
  );

  return {
    platform: "tiktok",
    fetchedAt: new Date().toISOString(),
    totals: {
      ...t,
      ctr: t.impressions > 0 ? (t.clicks / t.impressions) * 100 : 0,
      cpc: t.clicks > 0 ? t.spend / t.clicks : 0,
      cpm: t.impressions > 0 ? (t.spend / t.impressions) * 1000 : 0,
      roas: t.spend > 0 ? campaigns.reduce((s, c) => s + c.roas * c.spend, 0) / t.spend : 0,
    },
    campaigns,
  };
}
