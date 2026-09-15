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

export async function fetchHyros(clientSlug: string, range = "today"): Promise<PlatformSnapshot> {
  const apiKey = clientEnv(clientSlug, "HYROS_API_KEY");
  if (!apiKey) throw new Error(`HYROS credentials missing for client "${clientSlug}"`);

  const { from_date, to_date } = getDates(range);

  // Try snake_case GET endpoint (original HYROS REST API style)
  const url = new URL(`${BASE}/attribution/report`);
  url.searchParams.set("from_date", from_date);
  url.searchParams.set("to_date", to_date);
  url.searchParams.set("breakdown", "campaign");
  url.searchParams.set("attribution_model", "last_click");

  const res = await fetch(url.toString(), {
    headers: { "API-Key": apiKey },
    cache: "no-store",
  });

  if (!res.ok) {
    // Try alternate path
    const url2 = new URL(`${BASE}/ads/report`);
    url2.searchParams.set("from_date", from_date);
    url2.searchParams.set("to_date", to_date);
    url2.searchParams.set("breakdown", "campaign");

    const res2 = await fetch(url2.toString(), {
      headers: { "API-Key": apiKey },
      cache: "no-store",
    });

    if (!res2.ok) {
      throw new Error(`HYROS API ${res2.status}: ${await res2.text()}`);
    }

    const json2 = await res2.json() as { data?: { result?: unknown[] }; result?: unknown[] };
    return buildSnapshot(json2.data?.result || json2.result || []);
  }

  const json = await res.json() as { data?: { result?: unknown[] }; result?: unknown[] };
  return buildSnapshot(json.data?.result || json.result || []);
}

function buildSnapshot(rows: unknown[]): PlatformSnapshot {
  const campaigns = (rows as Record<string, unknown>[]).map((row) => {
    const spend = num(row.spend ?? row.COST ?? row.cost);
    const revenue = num(row.revenue ?? row.REVENUE);
    const conversions = num(row.sales ?? row.SALES) || num(row.leads ?? row.LEADS);
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
