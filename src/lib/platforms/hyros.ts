import { clientEnv } from "@/lib/clients";
import type { PlatformSnapshot } from "./types";

const BASE_URL = "https://api.hyros.com/v1/api";

function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
}

function dateRange(range: string): { startDate: string; endDate: string } {
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
  parentName?: string;
  COST?: number;
  REVENUE?: number;
  SALES?: number;
  LEADS?: number;
  ROAS?: number;
}

interface HyrosReportResponse {
  data?: HyrosRow[];
  result?: HyrosRow[];
}

export async function fetchHyros(clientSlug: string, range = "today"): Promise<PlatformSnapshot> {
  const apiKey = clientEnv(clientSlug, "HYROS_API_KEY");
  if (!apiKey) throw new Error(`HYROS credentials missing for client "${clientSlug}"`);

  const { startDate, endDate } = dateRange(range);

  const body = {
    attributionModel: "LAST_CLICK",
    startDate,
    endDate,
    level: "FACEBOOK_CAMPAIGN",
    fields: ["NAME", "COST", "REVENUE", "SALES", "LEADS", "ROAS"],
    sourceConfiguration: "ALL_SOURCES",
    isAdAccountId: false,
  };

  const res = await fetch(`${BASE_URL}/ads/get-attributed-ads`, {
    method: "POST",
    headers: {
      "API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`HYROS API ${res.status}: ${await res.text()}`);

  const json: HyrosReportResponse = await res.json();
  const rows: HyrosRow[] = json.data || json.result || [];

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
    extras: { note: "HYROS attribution data — revenue and sales are attributed" },
  };
}
