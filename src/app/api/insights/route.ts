import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchAccountSnapshot, type AccountSnapshot } from "@/lib/meta";

export const dynamic = "force-dynamic";

interface InsightsResult {
  insights: { title: string; detail: string; severity: "info" | "warning" | "critical" }[];
  actionItems: { title: string; reason: string; campaignId?: string }[];
}

const TOOL_NAME = "report_insights";

function buildPrompt(snapshot: AccountSnapshot): string {
  return `You are a paid-media analyst reviewing today's Meta Ads performance.

Account totals: ${JSON.stringify(snapshot.totals)}

Campaigns:
${snapshot.campaigns
  .map(
    (c) =>
      `- ${c.campaignName} (${c.status}): spend $${c.spend.toFixed(2)}, CTR ${c.ctr.toFixed(2)}%, CPC $${c.cpc.toFixed(
        2
      )}, CPM $${c.cpm.toFixed(2)}, conversions ${c.conversions}, cost/conversion $${c.costPerConversion.toFixed(
        2
      )}, ROAS ${c.roas.toFixed(2)}`
  )
  .join("\n")}

Identify the most important insights (trends, anomalies, underperformers, standouts) and concrete, prioritized action items (e.g. pause/scale a specific campaign, adjust budget, fix a high CPM). Be specific and reference campaign names. Keep it concise.`;
}

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const snapshot = await fetchAccountSnapshot();
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: buildPrompt(snapshot) }],
      tools: [
        {
          name: TOOL_NAME,
          description: "Report structured insights and action items about Meta Ads performance.",
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
                    campaignId: { type: "string" },
                  },
                  required: ["title", "reason"],
                },
              },
            },
            required: ["insights", "actionItems"],
          },
        },
      ],
      tool_choice: { type: "tool", name: TOOL_NAME },
    });

    const toolUse = response.content.find((block) => block.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      throw new Error("Model did not return structured insights");
    }

    const result = toolUse.input as InsightsResult;
    return NextResponse.json({ ...result, fetchedAt: snapshot.fetchedAt });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
