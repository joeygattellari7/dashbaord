export interface CampaignInsight {
  campaignId: string;
  campaignName: string;
  status: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  reach: number;
  conversions: number;
  costPerConversion: number;
  roas: number;
}

export interface AccountSnapshot {
  fetchedAt: string;
  accountId: string;
  totals: {
    spend: number;
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    cpm: number;
    reach: number;
    conversions: number;
    roas: number;
  };
  campaigns: CampaignInsight[];
}

export interface Insight {
  title: string;
  detail: string;
  severity: "info" | "warning" | "critical";
}

export interface ActionItem {
  title: string;
  reason: string;
  campaignId?: string;
}

export interface InsightsResponse {
  insights: Insight[];
  actionItems: ActionItem[];
  fetchedAt: string;
}
