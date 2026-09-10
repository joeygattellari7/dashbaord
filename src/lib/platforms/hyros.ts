import { clientEnv } from "@/lib/clients";
import type { PlatformSnapshot } from "./types";

const BASE_URL = "https://api.hyros.com/v1/api";

async function hyrosFetch<T>(path: string, apiKey: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { "API-Key": apiKey },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HYROS API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
}

interface HyrosAdRow {
  ad_id: string;
  ad_name: string;
  source_name: string;
  revenue: number;
  leads: number;
  sales: number;
  spend: number;
  roas: number;
}

interface HyrosReportResponse {
  data: { result: HyrosAdRow[] };
}

export async function fetchHyros(clientSlug: string): Promise<PlatformSnapshot> {
  const apiKey = clientEnv(clientSlug, "HYROS_API_KEY");
  if (!apiKey) throw new Error(`HYROS credentials missing for client "${clientSlug}"`);

  const today = new Date().toISOString().slice(0, 10);
  const report = await hyrosFetch<HyrosReportResponse>(
    "/attribution/report",
    apiKey,
    { from_date: today, to_date: today, breakdown: "ad" }
  );

  const rows = report.data?.result || [];

  const campaigns = rows.map((row) => {
    const spend = num(row.spend);
    const conversions = num(row.sales);
    const revenue = num(row.revenue);
    return {
      id: row.ad_id,
      name: `${row.source_name}: ${row.ad_name}`,
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
      roas: spend > 0 ? revenue / spend : num(row.roas),
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
    extras: { note: "HYROS attribution data — revenue and sales are attributed, not click-based" },
  };
}
