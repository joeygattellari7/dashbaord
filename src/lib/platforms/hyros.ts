import { clientEnv } from "@/lib/clients";
import type { PlatformSnapshot } from "./types";

const BASE = "https://api.hyros.com/v1/api";

function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
}

function getDates(range: string): { from_date: string; to_date: string } {
  const today = new Date();
  const to_date = today.toISOString().slice(0, 10);
  if (range === "last_7d") {
    const d = new Date(today); d.setDate(d.getDate() - 6);
    return { from_date: d.toISOString().slice(0, 10), to_date };
  }
  if (range === "last_30d") {
    const d = new Date(today); d.setDate(d.getDate() - 29);
    return { from_date: d.toISOString().slice(0, 10), to_date };
  }
  return { from_date: to_date, to_date };
}

async function hyrosGet(path: string, apiKey: string, params: Record<string, string>) {
  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { "API-Key": apiKey },
    cache: "no-store",
  });
  return res;
}

export async function fetchHyros(clientSlug: string, range = "today"): Promise<PlatformSnapshot> {
  const apiKey = clientEnv(clientSlug, "HYROS_API_KEY");
  if (!apiKey) throw new Error(`HYROS credentials missing for client "${clientSlug}"`);

  const { from_date, to_date } = getDates(range);
  const params = { from_date, to_date, breakdown: "campaign" };

  // Try known HYROS REST endpoints in order
  const paths = [
    "/get-all-attributed-ads",
    "/ads/get-all-attributed-ads",
    "/attribution/get-report",
    "/report/attribution",
    "/ads/report",
    "/attribution/report",
  ];

  let lastStatus = 0;
  let lastBody = "";

  for (const path of paths) {
    const res = await hyrosGet(path, apiKey, params);
    if (res.ok) {
      const json = await res.json() as { data?: { result?: unknown[] }; result?: unknown[] };
      const rows = json.data?.result || json.result || [];
      return buildSnapshot(rows as Record<string, unknown>[]);
    }
    lastStatus = res.status;
    lastBody = await res.text();
    if (lastStatus !== 404) break; // Non-404 error means we found the endpoint but something else is wrong
  }

  throw new Error(`HYROS API ${lastStatus}: ${lastBody}`);
}

function buildSnapshot(rows: Record<string, unknown>[]): PlatformSnapshot {
  const campaigns = rows.map((row) => {
    const spend = num(row.spend ?? row.COST ?? row.cost);
    const revenue = num(row.revenue ?? row.REVENUE);
    const conversions = num(row.sales ?? row.SALES ?? row.leads ?? row.LEADS);
    const roas = spend > 0 ? revenue / spend : num(row.roas ?? row.ROAS);
    return {
      id: String(row.ad_id ?? row.id ?? ""),
      name: String(row.ad_name ?? row.name ?? row.source_name ?? "Unknown"),
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
