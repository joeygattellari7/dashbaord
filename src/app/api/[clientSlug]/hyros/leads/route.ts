import type { NextRequest } from "next/server";
import { getClient, clientEnv } from "@/lib/clients";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

interface LeadSource {
  name?: string;
  adSource?: { adSourceId?: string; platform?: string };
  sourceLinkAd?: { name?: string; adSourceId?: string };
  organic?: boolean;
}

interface RawLead {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  creationDate?: string;
  currentStage?: string;
  tags?: string[];
  firstSource?: LeadSource;
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

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) return Response.json({ message: "ANTHROPIC_API_KEY not set" }, { status: 500 });

  const { fromDate, toDate } = getDates(dateRange);

  try {
    const anthropic = new Anthropic({ apiKey: anthropicKey });

    // Use Claude with HYROS MCP to fetch leads
    const response = await (anthropic.beta.messages as unknown as {
      create: (opts: unknown) => Promise<{ content: Array<{ type: string; text?: string }> }>;
    }).create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8096,
      mcp_servers: [
        {
          type: "url",
          url: "https://mcp.hyros.com/mcp",
          name: "HYROS",
          authorization_token: apiKey,
        },
      ],
      tools: [{ type: "mcp_toolset", mcp_server_name: "HYROS" }],
      messages: [
        {
          role: "user",
          content: `Use the hyros_get_leads tool to fetch leads from HYROS for the date range ${fromDate} to ${toDate} with pageSize 100. Return ONLY a raw JSON array of leads — no explanation, no markdown, no code fences. Each item must have: id, email, firstName, lastName, creationDate, currentStage, tags, firstSource (with name, adSource.adSourceId, adSource.platform, sourceLinkAd.name, organic).`,
        },
      ],
      betas: ["mcp-client-2025-11-20"],
    });

    const text = response.content.find((b) => b.type === "text")?.text || "[]";
    // Strip any accidental markdown fences
    const clean = text.replace(/```json\n?|```\n?/g, "").trim();
    const rawLeads: RawLead[] = JSON.parse(clean);

    const leads = rawLeads.map((lead) => {
      const src = lead.firstSource;
      return {
        id: lead.id ?? "",
        email: lead.email ?? "",
        name: [lead.firstName, lead.lastName].filter(Boolean).join(" ") || null,
        joinDate: lead.creationDate ?? null,
        stage: lead.currentStage ?? null,
        tags: lead.tags ?? [],
        sourceName: src?.name ?? null,
        adName: src?.sourceLinkAd?.name ?? null,
        adId: src?.adSource?.adSourceId ?? null,
        platform: src?.adSource?.platform ?? null,
        organic: src?.organic ?? true,
      };
    });

    return Response.json({ leads, fromDate, toDate });
  } catch (err) {
    return Response.json({ message: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
