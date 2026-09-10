export interface CampaignRow {
  id: string;
  name: string;
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

export interface PlatformTotals {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  reach: number;
  conversions: number;
  roas: number;
}

export interface PlatformSnapshot {
  platform: string;
  fetchedAt: string;
  totals: PlatformTotals;
  campaigns: CampaignRow[];
  extras?: Record<string, unknown>; // platform-specific bonus fields
}

export type PlatformFetcher = (clientSlug: string) => Promise<PlatformSnapshot>;
