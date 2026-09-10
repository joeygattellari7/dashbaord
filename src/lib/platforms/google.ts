import { clientEnv } from "@/lib/clients";
import type { PlatformSnapshot, CampaignRow } from "./types";

// Google Ads API v18 via REST (GAQL)
const BASE_URL = "https://googleads.googleapis.com/v18";

function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
}

// Google Ads uses micros (millionths) for money
const fromMicros = (v: unknown) => num(v) / 1_000_000;

async function gaqlQuery<T>(
  customerId: string,
  query: string,
  developerToken: string,
  accessToken: string
): Promise<T[]> {
  const res = await fetch(`${BASE_URL}/customers/${customerId}/googleAds:search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": developerToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Google Ads API ${res.status}: ${await res.text()}`);
  const json = await res.json() as { results?: T[] };
  return json.results || [];
}

interface GaqlRow {
  campaign: { id: string; name: string; status: string };
  metrics: {
    costMicros: string;
    impressions: string;
    clicks: string;
    ctr: string;
    averageCpc: string;
    averageCpm: string;
    conversions: string;
    costPerConversion: string;
    conversionsValue: string;
  };
}

export async function fetchGoogle(clientSlug: string): Promise<PlatformSnapshot> {
  const developerToken = clientEnv(clientSlug, "GOOGLE_DEVELOPER_TOKEN");
  const customerId = clientEnv(clientSlug, "GOOGLE_CUSTOMER_ID")?.replace(/-/g, "");
  const accessToken = clientEnv(clientSlug, "GOOGLE_ACCESS_TOKEN");
  if (!developerToken || !customerId || !accessToken) {
    throw new Error(`Google Ads credentials missing for client "${clientSlug}"`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const rows = await gaqlQuery<GaqlRow>(
    customerId,
    `SELECT
       campaign.id, campaign.name, campaign.status,
       metrics.cost_micros, metrics.impressions, metrics.clicks,
       metrics.ctr, metrics.average_cpc, metrics.average_cpm,
       metrics.conversions, metrics.cost_per_conversion, metrics.conversions_value
     FROM campaign
     WHERE segments.date = '${today}'
       AND campaign.status != 'REMOVED'`,
    developerToken,
    accessToken
  );

  const campaigns: CampaignRow[] = rows.map((row) => {
    const m = row.metrics;
    const spend = fromMicros(m.costMicros);
    const conversions = num(m.conversions);
    const conversionValue = num(m.conversionsValue);
    return {
      id: row.campaign.id,
      name: row.campaign.name,
      status: row.campaign.status,
      spend,
      impressions: num(m.impressions),
      clicks: num(m.clicks),
      ctr: num(m.ctr) * 100,
      cpc: fromMicros(m.averageCpc),
      cpm: fromMicros(m.averageCpm),
      reach: 0,
      conversions,
      costPerConversion: conversions > 0 ? spend / conversions : 0,
      roas: spend > 0 ? conversionValue / spend : 0,
    };
  });

  const t = campaigns.reduce(
    (a, c) => { a.spend += c.spend; a.impressions += c.impressions; a.clicks += c.clicks; a.conversions += c.conversions; return a; },
    { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
  );

  return {
    platform: "google",
    fetchedAt: new Date().toISOString(),
    totals: {
      ...t,
      reach: 0,
      ctr: t.impressions > 0 ? (t.clicks / t.impressions) * 100 : 0,
      cpc: t.clicks > 0 ? t.spend / t.clicks : 0,
      cpm: t.impressions > 0 ? (t.spend / t.impressions) * 1000 : 0,
      roas: t.spend > 0 ? campaigns.reduce((s, c) => s + c.roas * c.spend, 0) / t.spend : 0,
    },
    campaigns,
  };
}
