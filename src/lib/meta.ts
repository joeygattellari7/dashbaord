const API_VERSION = process.env.META_API_VERSION || "v21.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

export interface CampaignInsight {
  campaignId: string;
  campaignName: string;
  status: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  reach: number;
  conversions: number;
  costPerConversion: number;
  roas: number;
}

export interface AccountSnapshot {
  fetchedAt: string;
  accountId: string;
  totals: {
    spend: number;
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    cpm: number;
    reach: number;
    conversions: number;
    roas: number;
  };
  campaigns: CampaignInsight[];
}

function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
}

function extractActionValue(actions: { action_type: string; value: string }[] | undefined, type: string): number {
  if (!actions) return 0;
  const match = actions.find((a) => a.action_type === type);
  return match ? num(match.value) : 0;
}

function extractActionSpendValue(
  actionValues: { action_type: string; value: string }[] | undefined,
  type: string
): number {
  return extractActionValue(actionValues, type);
}

async function metaFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) {
    throw new Error("META_ACCESS_TOKEN is not configured");
  }
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Meta API error (${res.status}): ${body}`);
  }
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

interface RawCampaign {
  id: string;
  status: string;
}

export async function fetchAccountSnapshot(): Promise<AccountSnapshot> {
  const accountId = process.env.META_AD_ACCOUNT_ID;
  if (!accountId) {
    throw new Error("META_AD_ACCOUNT_ID is not configured");
  }

  const [insightsRes, campaignsRes] = await Promise.all([
    metaFetch<{ data: RawInsightRow[] }>(`/${accountId}/insights`, {
      level: "campaign",
      date_preset: "today",
      fields: "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,reach,actions,action_values",
    }),
    metaFetch<{ data: RawCampaign[] }>(`/${accountId}/campaigns`, {
      fields: "id,status",
      limit: "200",
    }),
  ]);

  const statusByCampaignId = new Map(campaignsRes.data.map((c) => [c.id, c.status]));

  const campaigns: CampaignInsight[] = insightsRes.data.map((row) => {
    const conversions = extractActionValue(row.actions, "purchase") || extractActionValue(row.actions, "lead");
    const conversionValue = extractActionSpendValue(row.action_values, "purchase");
    const spend = num(row.spend);
    return {
      campaignId: row.campaign_id,
      campaignName: row.campaign_name,
      status: statusByCampaignId.get(row.campaign_id) || "UNKNOWN",
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

  const totals = campaigns.reduce(
    (acc, c) => {
      acc.spend += c.spend;
      acc.impressions += c.impressions;
      acc.clicks += c.clicks;
      acc.reach += c.reach;
      acc.conversions += c.conversions;
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0, reach: 0, conversions: 0 }
  );

  return {
    fetchedAt: new Date().toISOString(),
    accountId,
    totals: {
      ...totals,
      ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
      cpc: totals.clicks > 0 ? totals.spend / totals.clicks : 0,
      cpm: totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0,
      roas:
        totals.spend > 0
          ? campaigns.reduce((sum, c) => sum + c.roas * c.spend, 0) / totals.spend
          : 0,
    },
    campaigns,
  };
}
