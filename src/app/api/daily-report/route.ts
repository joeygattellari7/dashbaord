import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchAccountSnapshot } from "@/lib/meta";
import { getClients } from "@/lib/clients";
import { generateClientHealthCheck } from "@/lib/insights";
import { sendDailyReportEmail, renderDailyReportHtml } from "@/lib/email";
import type { DailyReport } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // no secret configured: leave open (dev convenience)
  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const query = request.nextUrl.searchParams.get("secret");
  return bearer === secret || query === secret;
}

async function buildDailyReport(): Promise<DailyReport> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");
  const anthropic = new Anthropic({ apiKey });

  const clients = getClients();
  const results = await Promise.allSettled(
    clients.map(async (client) => {
      const snapshot = await fetchAccountSnapshot(client.metaAdAccountId);
      const healthCheck = await generateClientHealthCheck(anthropic, client, snapshot);
      return { ...healthCheck, snapshot };
    })
  );

  const clientReports: DailyReport["clients"] = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      clientReports.push(result.value);
    } else {
      const client = clients[i];
      clientReports.push({
        clientId: client.id,
        clientName: client.name,
        healthStatus: "critical",
        summary: `Could not generate a health check for this account: ${
          result.reason instanceof Error ? result.reason.message : String(result.reason)
        }`,
        keyNotes: [],
        flags: [{ title: "Report generation failed", detail: String(result.reason), severity: "critical" }],
        optimizations: [],
        snapshot: {
          fetchedAt: new Date().toISOString(),
          accountId: client.metaAdAccountId,
          datePreset: "yesterday",
          totals: { spend: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0, cpm: 0, reach: 0, conversions: 0, roas: 0 },
          previousPeriodTotals: {
            spend: 0,
            impressions: 0,
            clicks: 0,
            ctr: 0,
            cpc: 0,
            cpm: 0,
            reach: 0,
            conversions: 0,
            roas: 0,
          },
          campaigns: [],
        },
      });
    }
  }

  return { generatedAt: new Date().toISOString(), clients: clientReports };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const preview = request.nextUrl.searchParams.get("preview") === "1";

  try {
    const report = await buildDailyReport();

    if (preview) {
      return new NextResponse(renderDailyReportHtml(report), { headers: { "Content-Type": "text/html" } });
    }

    await sendDailyReportEmail(report);
    return NextResponse.json({
      sent: true,
      generatedAt: report.generatedAt,
      clients: report.clients.map((c) => ({ clientId: c.clientId, healthStatus: c.healthStatus })),
    });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
