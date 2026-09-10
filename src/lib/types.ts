// Re-export from platforms for client-side use
export type { CampaignRow, PlatformSnapshot, PlatformTotals } from "./platforms/types";

export interface Insight {
  title: string;
  detail: string;
  severity: "info" | "warning" | "critical";
  platform?: string;
}

export interface ActionItem {
  title: string;
  reason: string;
  platform?: string;
  priority: "high" | "medium" | "low";
}

export interface InsightsResponse {
  insights: Insight[];
  actionItems: ActionItem[];
  fetchedAt: string;
  platformsAnalyzed: string[];
}
