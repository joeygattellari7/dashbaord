import type { NextRequest } from "next/server";
import { getClient, clientEnv } from "@/lib/clients";

export const dynamic = "force-dynamic";

const BASE = "https://api.hyros.com/v1/api";

interface HyrosLead {
  id: string;
  email: string;
  joinDate?: string;
  currentStage?: string;
  tags?: string[];
  name?: string;
  firstName?: string;
  lastName?: string;
}

interface HyrosClick {
  leadId?: string;
  email?: string;
  url?: string;
  sourceId?: string;
  sourceName?: string;
  integrationType?: string;
  clickDate?: string;
  adId?: string;
  campaignId?: string;
}

async function hyrosPost(path: string, apiKey: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "API-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return res;
}

async function fetchLeads(apiKey: string, fromDate: string, toDate: string): Promise<HyrosLead[]> {
  const body = { fromDate, toDate, pageSize: 100 };
  const paths = ["/get-leads", "/leads"];
  for (const path of paths) {
    const res = await hyrosPost(path, apiKey, body);
    if (res.ok) {
      const json = await res.json() as { data?: HyrosLead[]; result?: HyrosLead[]; leads?: HyrosLead[] };
      return json.data || json.result || json.leads || [];
    }
    if (res.status !== 404) {
      const text = await res.text();
      throw new Error(`HYROS leads ${res.status}: ${text.slice(0, 200)}`);
    }
  }
  throw new Error("HYROS leads endpoint not found");
}

async function fetchClicks(apiKey: string, leadIds: string[]): Promise<HyrosClick[]> {
  if (leadIds.length === 0) return [];
  const body = { leadIds, pageSize: 250 };
  const paths = ["/get-lead-clicks", "/lead-clicks", "/leads/clicks"];
  for (const path of paths) {
    const res = await hyrosPost(path, apiKey, body);
    if (res.ok) {
      const json = await res.json() as { data?: HyrosClick[]; result?: HyrosClick[]; clicks?: HyrosClick[] };
      return json.data || json.result || json.clicks || [];
    }
    if (res.status !== 404) break;
  }
  return []; // clicks are best-effort — don't fail the whole request
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

  const leads = await fetchLeads(apiKey, fromDate, toDate);

  // Fetch clicks for up to 50 leads to get Meta ad attribution
  const leadIds = leads.slice(0, 50).map((l) => l.id).filter(Boolean);
  const clicks = await fetchClicks(apiKey, leadIds);

  // Build a map: leadId -> first paid click with a sourceId
  const clickMap: Record<string, HyrosClick> = {};
  for (const click of clicks) {
    const lid = click.leadId;
    if (!lid) continue;
    if (!clickMap[lid] && click.sourceId) {
      clickMap[lid] = click;
    }
  }

  const rows = leads.map((lead) => {
    const click = clickMap[lead.id];
    return {
      id: lead.id,
      email: lead.email,
      name: lead.name || [lead.firstName, lead.lastName].filter(Boolean).join(" ") || null,
      joinDate: lead.joinDate,
      stage: lead.currentStage || null,
      tags: lead.tags || [],
      sourceName: click?.sourceName || null,
      sourceType: click?.integrationType || null,
      adId: click?.adId || click?.sourceId || null,
      campaignId: click?.campaignId || null,
    };
  });

  return Response.json({ leads: rows, fromDate, toDate });
}
