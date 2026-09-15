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
  const paths = ["/get-leads", "/leads"];
  for (const path of paths) {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json() as { result?: HyrosLead[]; data?: HyrosLead[]; nextPageId?: string | null };
      return { leads: json.result || json.data || [], nextPageId: json.nextPageId ?? null };
    }
    if (res.status !== 404) {
      const text = await res.text();
      throw new Error(`HYROS ${res.status}: ${text.slice(0, 300)}`);
    }
  }
  throw new Error("HYROS leads endpoint not found (404). Check your API key.");
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
