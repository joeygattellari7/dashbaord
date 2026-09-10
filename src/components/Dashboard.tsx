"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { PlatformSnapshot, InsightsResponse } from "@/lib/types";

interface ClientInfo {
  slug: string;
  name: string;
  platforms: string[];
}

const PLATFORM_LABELS: Record<string, string> = {
  meta: "Meta Ads",
  tiktok: "TikTok Ads",
  google: "Google Ads",
  hyros: "HYROS",
};

const SEVERITY_STYLE: Record<string, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
  warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
  critical: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

const fmt = {
  currency: (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  number: (n: number) => Math.round(n).toLocaleString(),
  pct: (n: number) => `${n.toFixed(2)}%`,
  roas: (n: number) => `${n.toFixed(2)}x`,
};

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-zinc-400">{sub}</div>}
    </div>
  );
}

function PlatformView({
  clientSlug,
  platform,
}: {
  clientSlug: string;
  platform: string;
}) {
  const [snapshot, setSnapshot] = useState<PlatformSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
    setSnapshot(null);
    setError(null);

    const source = new EventSource(`/api/${clientSlug}/${platform}/stream`);
    sourceRef.current = source;

    source.addEventListener("snapshot", (e) => {
      setError(null);
      setSnapshot(JSON.parse((e as MessageEvent).data));
    });

    source.addEventListener("error", (e) => {
      const d = (e as MessageEvent).data;
      if (d) {
        try { setError(JSON.parse(d).message); } catch { setError("Stream error"); }
      }
    });

    return () => { source.close(); };
  }, [clientSlug, platform]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-zinc-400" />
        Connecting to {PLATFORM_LABELS[platform] || platform}...
      </div>
    );
  }

  const showReach = snapshot.totals.reach > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Spend Today" value={fmt.currency(snapshot.totals.spend)} />
        <MetricCard label="ROAS" value={fmt.roas(snapshot.totals.roas)} />
        <MetricCard
          label="Clicks"
          value={fmt.number(snapshot.totals.clicks)}
          sub={`CTR ${fmt.pct(snapshot.totals.ctr)}`}
        />
        <MetricCard
          label="Conversions"
          value={fmt.number(snapshot.totals.conversions)}
          sub={`CPC ${fmt.currency(snapshot.totals.cpc)}`}
        />
        {showReach && (
          <MetricCard label="Reach" value={fmt.number(snapshot.totals.reach)} />
        )}
        <MetricCard label="Impressions" value={fmt.number(snapshot.totals.impressions)} />
        <MetricCard label="CPM" value={fmt.currency(snapshot.totals.cpm)} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-2.5">Campaign</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Spend</th>
              <th className="px-4 py-2.5">CTR</th>
              <th className="px-4 py-2.5">CPC</th>
              <th className="px-4 py-2.5">CPM</th>
              <th className="px-4 py-2.5">Conv.</th>
              <th className="px-4 py-2.5">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.campaigns.map((c) => (
              <tr
                key={c.id}
                className="border-t border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
              >
                <td className="max-w-xs truncate px-4 py-2.5 font-medium text-zinc-900 dark:text-zinc-50">{c.name}</td>
                <td className="px-4 py-2.5">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-2.5">{fmt.currency(c.spend)}</td>
                <td className="px-4 py-2.5">{fmt.pct(c.ctr)}</td>
                <td className="px-4 py-2.5">{fmt.currency(c.cpc)}</td>
                <td className="px-4 py-2.5">{fmt.currency(c.cpm)}</td>
                <td className="px-4 py-2.5">{fmt.number(c.conversions)}</td>
                <td className="px-4 py-2.5">{fmt.roas(c.roas)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-zinc-400">
        Last updated {new Date(snapshot.fetchedAt).toLocaleTimeString()}
      </p>
    </div>
  );
}

export default function Dashboard({ clients }: { clients: ClientInfo[] }) {
  const [activeClient, setActiveClient] = useState<ClientInfo | null>(clients[0] ?? null);
  const [activePlatform, setActivePlatform] = useState<string | null>(
    clients[0]?.platforms[0] ?? null
  );
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  const selectClient = (client: ClientInfo) => {
    setActiveClient(client);
    setActivePlatform(client.platforms[0] ?? null);
    setInsights(null);
    setInsightsError(null);
    setShowInsights(false);
  };

  const loadInsights = useCallback(async () => {
    if (!activeClient) return;
    setInsightsLoading(true);
    setInsightsError(null);
    try {
      const res = await fetch(`/api/${activeClient.slug}/insights`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setInsights(data);
      setShowInsights(true);
    } catch (err) {
      setInsightsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setInsightsLoading(false);
    }
  }, [activeClient]);

  if (clients.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">No clients configured</h1>
        <p className="mt-3 text-zinc-500">
          Add clients to <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">src/lib/clients.ts</code> and set
          their credentials in <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Client switcher header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-6 py-3">
          <span className="mr-3 text-sm font-medium text-zinc-400">Client</span>
          {clients.map((client) => (
            <button
              key={client.slug}
              onClick={() => selectClient(client)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeClient?.slug === client.slug
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {client.name}
            </button>
          ))}
        </div>
      </header>

      {activeClient && (
        <main className="mx-auto max-w-6xl px-6 py-8">
          {/* Page title + insights button */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{activeClient.name}</h1>
              <p className="text-sm text-zinc-500">Today&apos;s performance across all platforms</p>
            </div>
            <button
              onClick={loadInsights}
              disabled={insightsLoading}
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {insightsLoading ? "Analyzing..." : "✦ Generate Insights"}
            </button>
          </div>

          {/* Platform tabs */}
          <div className="mb-6 flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
            {activeClient.platforms.map((p) => (
              <button
                key={p}
                onClick={() => setActivePlatform(p)}
                className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activePlatform === p
                    ? "border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {PLATFORM_LABELS[p] || p}
              </button>
            ))}
          </div>

          {activePlatform && (
            <PlatformView clientSlug={activeClient.slug} platform={activePlatform} />
          )}

          {insightsError && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {insightsError}
            </div>
          )}

          {showInsights && insights && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">Insights</h2>
                <div className="flex flex-col gap-2">
                  {insights.insights.map((insight, i) => (
                    <div key={i} className={`rounded-lg border px-4 py-3 text-sm ${SEVERITY_STYLE[insight.severity]}`}>
                      {insight.platform && (
                        <span className="mb-1 block text-xs font-medium uppercase opacity-60">
                          {PLATFORM_LABELS[insight.platform] || insight.platform}
                        </span>
                      )}
                      <div className="font-semibold">{insight.title}</div>
                      <div className="mt-0.5 text-xs opacity-80">{insight.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">Action Items</h2>
                <div className="flex flex-col gap-2">
                  {insights.actionItems.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[item.priority]}`} />
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</span>
                      </div>
                      {item.platform && (
                        <span className="mt-0.5 block text-xs font-medium uppercase text-zinc-400">
                          {PLATFORM_LABELS[item.platform] || item.platform}
                        </span>
                      )}
                      <p className="mt-1 text-xs text-zinc-500">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
