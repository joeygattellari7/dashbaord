import { clientEnv } from "@/lib/clients";
import type { PlatformSnapshot } from "./types";

const BASE = "https://api.hyros.com/v1/api";

function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
}

function getDates(range: string): { startDate: string; endDate: string } {
  const today = new Date();
  const endDate = today.toISOString().slice(0, 10);
  if (range === "last_7d") {
    const d = new Date(today); d.setDate(d.getDate() - 6);
    return { startDate: d.toISOString().slice(0, 10), endDate };
  }
  if (range === "last_30d") {
    const d = new Date(today); d.setDate(d.getDate() - 29);
    return { startDate: d.toISOString().slice(0, 10), endDate };
  }
  return { startDate: endDate, endDate };
}

async function hyrosPost(path: string, apiKey: string, body: unknown) {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "API-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}

export async function fetchHyros(clientSlug: string, range = "today"): Promise<PlatformSnapshot> {
  const apiKey = clientEnv(clientSlug, "HYROS_API_KEY");
  if (!apiKey) throw new Error(`HYROS credentials missing for client "${clientSlug}"`);

  const adAccountId = clientEnv(clientSlug, "HYROS_AD_ACCOUNT_ID");

  const { startDate, endDate } = getDates(range);

  // Try campaign-level attribution report (POST)
  const reportBody = {
    attributionModel: "LAST_CLICK",
    startDate,
    endDate,
    fields: ["NAME", "COST", "REVENUE", "SALES", "LEADS", "ROAS", "CLICKS", "IMPRESSIONS"],
    level: "FACEBOOK_CAMPAIGN",
    sourceConfiguration: "ALL_SOURCES",
    ...(adAccountId ? { ids: [adAccountId], isAdAccountId: true } : {}),
  };

  const endpoints = [
    "/get-report",
    "/attribution/report",
    "/report",
  ];

  let lastStatus = 0;
  let lastBody = "";

  for (const path of endpoints) {
    const res = await hyrosPost(path, apiKey, reportBody);
    if (res.ok) {
      const json = await res.json() as { data?: unknown[]; result?: unknown[]; items?: unknown[] };
      const rows = json.data || json.result || json.items || [];
      return buildSnapshot(rows as Record<string, unknown>[]);
    }
    lastStatus = res.status;
    lastBody = await res.text();
    if (lastStatus !== 404) break;
  }

  throw new Error(`HYROS API ${lastStatus}: ${lastBody.slice(0, 200)}`);
}

function buildSnapshot(rows: Record<string, unknown>[]): PlatformSnapshot {
  const campaigns = rows.map((row) => {
    const spend = num(row.cost ?? row.COST ?? row.spend ?? row.adCost);
    const revenue = num(row.revenue ?? row.REVENUE ?? row.totalRevenue);
    const conversions = num(row.sales ?? row.SALES ?? row.leads ?? row.LEADS ?? row.conversions);
    const roas = spend > 0 ? revenue / spend : num(row.roas ?? row.ROAS);
    return {
      id: String(row.id ?? row.ad_id ?? row.sourceId ?? ""),
      name: String(row.name ?? row.NAME ?? row.ad_name ?? row.source_name ?? row.sourceName ?? "Unknown"),
      status: "ACTIVE",
      spend,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      reach: 0,
      conversions,
      costPerConversion: conversions > 0 ? spend / conversions : 0,
      roas,
    };
  });

  const t = campaigns.reduce(
    (a, c) => { a.spend += c.spend; a.conversions += c.conversions; return a; },
    { spend: 0, conversions: 0 }
  );

  return {
    platform: "hyros",
    fetchedAt: new Date().toISOString(),
    totals: {
      ...t,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      reach: 0,
      roas: t.spend > 0 ? campaigns.reduce((s, c) => s + c.roas * c.spend, 0) / t.spend : 0,
    },
    campaigns,
  };
}
