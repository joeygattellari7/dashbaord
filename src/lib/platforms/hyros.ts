import { clientEnv } from "@/lib/clients";
import type { PlatformSnapshot } from "./types";

const BASE_URL = "https://api.hyros.com/v1/api";

function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
}

function getDateRange(range: string): { startDate: string; endDate: string } {
  const today = new Date();
  const end = today.toISOString().slice(0, 10);
  if (range === "last_7d") {
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    return { startDate: start.toISOString().slice(0, 10), endDate: end };
  }
  if (range === "last_30d") {
    const start = new Date(today);
    start.setDate(start.getDate() - 29);
    return { startDate: start.toISOString().slice(0, 10), endDate: end };
  }
  return { startDate: end, endDate: end };
}

interface HyrosRow {
  id: string;
  name: string;
  COST?: number;
  REVENUE?: number;
  SALES?: number;
  LEADS?: number;
  ROAS?: number;
}

async function tryEndpoint(url: string, apiKey: string, body: object): Promise<HyrosRow[] | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json() as { result?: HyrosRow[]; data?: HyrosRow[] };
    return json.result || json.data || null;
  } catch {
    return null;
  }
}

export async function fetchHyros(clientSlug: string, range = "today"): Promise<PlatformSnapshot> {
  const apiKey = clientEnv(clientSlug, "HYROS_API_KEY");
  if (!apiKey) throw new Error(`HYROS credentials missing for client "${clientSlug}"`);

  const { startDate, endDate } = getDateRange(range);

  const body = {
    attributionModel: "LAST_CLICK",
    startDate,
    endDate,
    level: "FACEBOOK_CAMPAIGN",
    fields: ["NAME", "COST", "REVENUE", "SALES", "LEADS", "ROAS"],
    ids: ["1604914593699249"],
    isAdAccountId: true,
    sourceConfiguration: "ALL_SOURCES",
  };

  // Try known endpoint variations
  const endpoints = [
    `${BASE_URL}/ads/get-ads-report`,
    `${BASE_URL}/ads/get-attributed-ads`,
    `${BASE_URL}/attribution/report`,
  ];

  let rows: HyrosRow[] | null = null;
  let lastError = "";

  for (const endpoint of endpoints) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json() as { result?: HyrosRow[]; data?: HyrosRow[] };
      rows = json.result || json.data || [];
      break;
    }
    lastError = `HYROS API ${res.status}: ${await res.text()}`;
  }

  if (rows === null) throw new Error(lastError || "HYROS API unreachable");

  const campaigns = rows.map((row) => {
    const spend = num(row.COST);
    const revenue = num(row.REVENUE);
    const conversions = num(row.SALES) || num(row.LEADS);
    const roas = spend > 0 ? revenue / spend : num(row.ROAS);
    return {
      id: row.id,
      name: row.name || row.id,
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
    extras: { note: "HYROS attribution — revenue and sales are attributed, not click-based" },
  };
}
