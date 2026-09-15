import type { NextRequest } from "next/server";
import { getClient, clientEnv } from "@/lib/clients";

export const dynamic = "force-dynamic";

const BASE = "https://api.hyros.com/v1/api";

interface AdSource {
  adSourceId: string;
  adAccountId: string;
  platform: string;
}

interface SourceLinkAd {
  name: string;
  adSourceId: string;
}

interface LeadSource {
  name: string;
  adSource?: AdSource;
  sourceLinkAd?: SourceLinkAd;
  category?: { name: string };
  organic: boolean;
}

interface HyrosLead {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  creationDate?: string;
  currentStage?: string;
  tags?: string[];
  firstSource?: LeadSource;
  lastSource?: LeadSource;
}

function getDates(range: string): { fromDate: string; toDate: string } {
  const today = new Date();
  const toDate = today.toISOString().slice(0, 10);
  if (range === "last_7d") {
    const d = new Date(today); d.setDate(d.getDate() - 6);
    return { fromDate: d.toISOString().slice(0, 10), toDate };
  }
  if (range === "last_30d") {
    const d = new Date(today); d.setDate(d.getDate() - 29);
    return { fromDate: d.toISOString().slice(0, 10), toDate };
  }
  return { fromDate: toDate, toDate };
}

async function fetchLeadsPage(apiKey: string, body: object): Promise<{ leads: HyrosLead[]; nextPageId: string | null }> {
  const attempts: Array<{ method: string; path: string }> = [
    { method: "POST", path: "/get-leads" },
    { method: "GET",  path: "/get-leads" },
    { method: "POST", path: "/leads" },
    { method: "GET",  path: "/leads" },
  ];

  const errors: string[] = [];

  for (const { method, path } of attempts) {
    const url = new URL(`${BASE}${path}`);
    const init: RequestInit = { method, headers: { "API-Key": apiKey }, cache: "no-store" };
    if (method === "POST") {
      (init.headers as Record<string, string>)["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    } else {
      // GET: put params in query string
      const b = body as Record<string, string>;
      for (const [k, v] of Object.entries(b)) if (v) url.searchParams.set(k, v);
    }

    const res = await fetch(url.toString(), init);
    if (res.ok) {
      const json = await res.json() as { result?: HyrosLead[]; data?: HyrosLead[]; nextPageId?: string | null };
      return { leads: json.result || json.data || [], nextPageId: json.nextPageId ?? null };
    }
    const text = await res.text();
    errors.push(`${method} ${path} → ${res.status}: ${text.slice(0, 150)}`);
    if (res.status !== 404) break;
  }

  throw new Error(`HYROS leads failed:\n${errors.join("\n")}`);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clientSlug: string }> }
) {
  const { clientSlug } = await params;
  const dateRange = req.nextUrl.searchParams.get("dateRange") || "today";

  const client = getClient(clientSlug);
  if (!client) return Response.json({ message: `Client "${clientSlug}" not found` }, { status: 404 });

  const apiKey = clientEnv(clientSlug, "HYROS_API_KEY");
  if (!apiKey) return Response.json({ message: "HYROS credentials missing" }, { status: 500 });

  const { fromDate, toDate } = getDates(dateRange);

  try {
    const { leads, nextPageId } = await fetchLeadsPage(apiKey, { fromDate, toDate, pageSize: 100 });

    const rows = leads.map((lead) => {
      const src = lead.firstSource;
      const adId = src?.adSource?.adSourceId ?? null;
      const platform = src?.adSource?.platform ?? null;
      const adName = src?.sourceLinkAd?.name ?? null;
      return {
        id: lead.id,
        email: lead.email,
        name: [lead.firstName, lead.lastName].filter(Boolean).join(" ") || null,
        joinDate: lead.creationDate ?? null,
        stage: lead.currentStage ?? null,
        tags: lead.tags ?? [],
        sourceName: src?.name ?? null,
        adName,
        adId,
        platform,
        organic: src?.organic ?? true,
      };
    });

    return Response.json({ leads: rows, fromDate, toDate, hasMore: !!nextPageId });
  } catch (err) {
    return Response.json({ message: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
