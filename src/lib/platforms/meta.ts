import { clientEnv } from "@/lib/clients";
import type { PlatformSnapshot, CampaignRow } from "./types";

const API_VERSION = process.env.META_API_VERSION || "v21.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
}

function extractAction(
  arr: { action_type: string; value: string }[] | undefined,
  type: string
): number {
  return arr?.find((a) => a.action_type === type) ? num(arr.find((a) => a.action_type === type)!.value) : 0;
}

async function metaFetch<T>(
  path: string,
  params: Record<string, string>,
  token: string
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("access_token", token);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Meta API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

interface RawInsightRow {
  campaign_id: string;
  campaign_name: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  cpm: string;
  reach: string;
  actions?: { action_type: string; value: string }[];
  action_values?: { action_type: string; value: string }[];
}

export async function fetchMeta(clientSlug: string): Promise<PlatformSnapshot> {
  const token = clientEnv(clientSlug, "META_ACCESS_TOKEN");
  const accountId = clientEnv(clientSlug, "META_AD_ACCOUNT_ID");
  if (!token || !accountId) throw new Error(`Meta credentials missing for client "${clientSlug}"`);

  const [insightsRes, campaignsRes] = await Promise.all([
    metaFetch<{ data: RawInsightRow[] }>(
      `/${accountId}/insights`,
      {
        level: "campaign",
        date_preset: "today",
        fields: "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,reach,actions,action_values",
      },
      token
    ),
    metaFetch<{ data: { id: string; status: string }[] }>(
      `/${accountId}/campaigns`,
      { fields: "id,status", limit: "200" },
      token
    ),
  ]);

  const statusMap = new Map(campaignsRes.data.map((c) => [c.id, c.status]));

  const campaigns: CampaignRow[] = insightsRes.data.map((row) => {
    const conversions =
      extractAction(row.actions, "purchase") || extractAction(row.actions, "lead");
    const conversionValue = extractAction(row.action_values, "purchase");
    const spend = num(row.spend);
    return {
      id: row.campaign_id,
      name: row.campaign_name,
      status: statusMap.get(row.campaign_id) || "UNKNOWN",
      spend,
      impressions: num(row.impressions),
      clicks: num(row.clicks),
      ctr: num(row.ctr),
      cpc: num(row.cpc),
      cpm: num(row.cpm),
      reach: num(row.reach),
      conversions,
      costPerConversion: conversions > 0 ? spend / conversions : 0,
      roas: spend > 0 ? conversionValue / spend : 0,
    };
  });

  const t = campaigns.reduce(
    (a, c) => { a.spend += c.spend; a.impressions += c.impressions; a.clicks += c.clicks; a.reach += c.reach; a.conversions += c.conversions; return a; },
    { spend: 0, impressions: 0, clicks: 0, reach: 0, conversions: 0 }
  );

  return {
    platform: "meta",
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
