import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getClient } from "@/lib/clients";
import { PLATFORM_FETCHERS, PLATFORM_LABELS } from "@/lib/platforms";
import type { PlatformId } from "@/lib/clients";
import type { PlatformSnapshot } from "@/lib/platforms/types";

export const dynamic = "force-dynamic";

const TOOL_NAME = "report_insights";

function buildPrompt(clientName: string, snapshots: PlatformSnapshot[]): string {
  const blocks = snapshots.map((s) => {
    const label = PLATFORM_LABELS[s.platform as PlatformId] || s.platform;
    const campaigns = s.campaigns
      .map(
        (c) =>
          `  - ${c.name} (${c.status}): spend $${c.spend.toFixed(2)}, CTR ${c.ctr.toFixed(2)}%, CPC $${c.cpc.toFixed(2)}, conversions ${c.conversions}, ROAS ${c.roas.toFixed(2)}`
      )
      .join("\n");
    return `${label}:\n  Totals: spend $${s.totals.spend.toFixed(2)}, impressions ${Math.round(s.totals.impressions).toLocaleString()}, clicks ${Math.round(s.totals.clicks).toLocaleString()}, conversions ${Math.round(s.totals.conversions)}, ROAS ${s.totals.roas.toFixed(2)}\n  Campaigns:\n${campaigns}`;
  });

  return `You are a paid-media analyst reviewing today's ad performance for client "${clientName}".\n\n${blocks.join("\n\n")}\n\nProvide the top insights and concrete prioritized action items. Reference specific campaigns and platforms. Be specific and brief.`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ clientSlug: string }> }
) {
  const { clientSlug } = await params;
  const client = getClient(clientSlug);
  if (!client) return NextResponse.json({ message: `Client "${clientSlug}" not found` }, { status: 404 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ message: "ANTHROPIC_API_KEY not configured" }, { status: 500 });

  const results = await Promise.allSettled(
    client.platforms.map((p) => PLATFORM_FETCHERS[p](clientSlug))
  );

  const snapshots: PlatformSnapshot[] = results
    .filter((r): r is PromiseFulfilledResult<PlatformSnapshot> => r.status === "fulfilled")
    .map((r) => r.value);

  if (snapshots.length === 0) {
    return NextResponse.json({ message: "No platform data available" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [{ role: "user", content: buildPrompt(client.name, snapshots) }],
    tools: [
      {
        name: TOOL_NAME,
        description: "Report structured insights and action items for the client's ad performance.",
        input_schema: {
          type: "object",
          properties: {
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  detail: { type: "string" },
                  severity: { type: "string", enum: ["info", "warning", "critical"] },
                  platform: { type: "string" },
                },
                required: ["title", "detail", "severity"],
              },
            },
            actionItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  reason: { type: "string" },
                  platform: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] },
                },
                required: ["title", "reason", "priority"],
              },
            },
          },
          required: ["insights", "actionItems"],
        },
      },
    ],
    tool_choice: { type: "tool", name: TOOL_NAME },
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    return NextResponse.json({ message: "Model did not return structured insights" }, { status: 500 });
  }

  return NextResponse.json({
    ...(toolUse.input as object),
    fetchedAt: new Date().toISOString(),
    platformsAnalyzed: snapshots.map((s) => s.platform),
  });
}
