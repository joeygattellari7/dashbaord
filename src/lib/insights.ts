import Anthropic from "@anthropic-ai/sdk";
import { WINDOWS, type AccountSnapshot, type WindowSnapshot } from "./meta";
import type { ClientConfig } from "./clients";
import type { ClientHealthCheck } from "./types";

const TOOL_NAME = "report_health_check";

const HEALTH_CHECK_SCHEMA = {
  type: "object" as const,
  properties: {
    healthStatus: { type: "string", enum: ["good", "warning", "critical"] },
    summary: {
      type: "string",
      description:
        "2-3 sentence plain-English summary of how this account is doing right now, referencing short vs. longer-term trend where relevant.",
    },
    keyNotes: {
      type: "array",
      description:
        "Short, notable facts worth knowing — trend shifts across the 7/14/30-day windows, standout campaigns, seasonality. Not necessarily problems.",
      items: { type: "string" },
    },
    flags: {
      type: "array",
      description: "Problems, risks, or anomalies that need attention, most severe first.",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          severity: { type: "string", enum: ["info", "warning", "critical"] },
          campaignId: { type: "string" },
        },
        required: ["title", "detail", "severity"],
      },
    },
    optimizations: {
      type: "array",
      description: "Concrete, actionable optimizations (budget shifts, pausing/scaling, creative/targeting fixes).",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          expectedImpact: { type: "string" },
          campaignId: { type: "string" },
        },
        required: ["title", "detail"],
      },
    },
  },
  required: ["healthStatus", "summary", "keyNotes", "flags", "optimizations"],
};

function fmtTotals(t: WindowSnapshot["totals"]) {
  return `spend $${t.spend.toFixed(2)}, impressions ${Math.round(t.impressions)}, clicks ${Math.round(
    t.clicks
  )}, CTR ${t.ctr.toFixed(2)}%, CPC $${t.cpc.toFixed(2)}, CPM $${t.cpm.toFixed(2)}, conversions ${Math.round(
    t.conversions
  )}, cost/conversion $${t.conversions > 0 ? (t.spend / t.conversions).toFixed(2) : "n/a"}, ROAS ${t.roas.toFixed(2)}x`;
}

function fmtCampaigns(w: WindowSnapshot): string {
  if (w.campaigns.length === 0) return "(no campaign activity in this window)";
  return w.campaigns
    .map(
      (c) =>
        `- [${c.campaignId}] ${c.campaignName} (${c.status}): spend $${c.spend.toFixed(2)}, CTR ${c.ctr.toFixed(
          2
        )}%, CPC $${c.cpc.toFixed(2)}, CPM $${c.cpm.toFixed(2)}, conversions ${c.conversions}, cost/conversion $${c.costPerConversion.toFixed(
          2
        )}, ROAS ${c.roas.toFixed(2)}x`
    )
    .join("\n");
}

function buildPrompt(client: ClientConfig, snapshot: AccountSnapshot): string {
  const sections = WINDOWS.map((window) => {
    const w = snapshot.windows[window];
    return `### Last ${window}\nTotals: ${fmtTotals(w.totals)}\nCampaigns:\n${fmtCampaigns(w)}`;
  }).join("\n\n");

  return `You are a senior paid-media analyst doing a daily health check on a Meta (Facebook/Instagram) Ads account for a client of an agency.

Client: ${client.name}

You are given the SAME account across three overlapping windows — last 7 days, last 14 days, and last 30 days — so you can distinguish short-term noise from a real trend (e.g. "CPA is up over 30 days but has recovered in the last 7" vs. "CPA has been climbing steadily across all three windows").

${sections}

Produce ONE daily health check for this client that synthesizes all three windows:
1. healthStatus: an overall traffic-light read (good/warning/critical) for this account right now, weighted toward the most recent (7-day) data but informed by the longer trend.
2. summary: plain-English, 2-3 sentences, written for the account owner (not a media buyer) — no jargon dumps. Call out whether things are trending up, down, or flat across the windows.
3. keyNotes: short factual notes worth flagging — trend shifts between the 7/14/30-day windows, standout campaigns, seasonality. These are FYI, not necessarily problems.
4. flags: real risks or anomalies visible in any window (budget pacing issues, CTR/CPM red flags, conversion drop-offs, learning phase stuck, frequency/creative fatigue, a metric getting steadily worse across windows). Most severe first. Note which window(s) the issue shows up in.
5. optimizations: specific, actionable next steps referencing campaign names/IDs (pause X, shift budget from X to Y, refresh creative on X, tighten targeting on X, raise/lower bid on X). Be concrete, not generic advice.

Reference campaign names (and IDs where useful) directly. Keep everything concise and skimmable.`;
}

export async function generateClientHealthCheck(
  anthropic: Anthropic,
  client: ClientConfig,
  snapshot: AccountSnapshot
): Promise<ClientHealthCheck> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [{ role: "user", content: buildPrompt(client, snapshot) }],
    tools: [
      {
        name: TOOL_NAME,
        description: "Report a structured daily health check for a Meta Ads account.",
        input_schema: HEALTH_CHECK_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: TOOL_NAME },
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error(`Model did not return a structured health check for ${client.name}`);
  }

  const result = toolUse.input as Omit<ClientHealthCheck, "clientId" | "clientName">;
  return { clientId: client.id, clientName: client.name, ...result };
}
