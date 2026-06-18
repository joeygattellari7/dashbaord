"use client";

import { useEffect, useRef, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import type { AccountSnapshot, InsightsResponse } from "@/lib/types";

const currency = (n: number) => `$${n.toFixed(2)}`;
const number = (n: number) => Math.round(n).toLocaleString();

const severityStyles: Record<string, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  critical: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
};

export default function Dashboard() {
  const [snapshot, setSnapshot] = useState<AccountSnapshot | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const source = new EventSource("/api/metrics/stream");
    sourceRef.current = source;

    source.addEventListener("snapshot", (event) => {
      setConnectionError(null);
      setSnapshot(JSON.parse((event as MessageEvent).data));
    });

    source.addEventListener("error", (event) => {
      const messageEvent = event as MessageEvent;
      if (messageEvent.data) {
        try {
          setConnectionError(JSON.parse(messageEvent.data).message);
        } catch {
          setConnectionError("Connection to metrics stream lost. Retrying...");
        }
      }
    });

    return () => source.close();
  }, []);

  const loadInsights = async () => {
    setInsightsLoading(true);
    setInsightsError(null);
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load insights");
      setInsights(data);
    } catch (err) {
      setInsightsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setInsightsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Meta Ads Dashboard</h1>
          <p className="text-sm text-zinc-500">
            {snapshot
              ? `Last updated ${new Date(snapshot.fetchedAt).toLocaleTimeString()}`
              : "Connecting to live metrics..."}
          </p>
        </div>
        <button
          onClick={loadInsights}
          disabled={insightsLoading}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {insightsLoading ? "Analyzing..." : "Generate Insights"}
        </button>
      </header>

      {connectionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {connectionError}
        </div>
      )}

      {snapshot && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetricCard label="Spend Today" value={currency(snapshot.totals.spend)} />
          <MetricCard label="Impressions" value={number(snapshot.totals.impressions)} />
          <MetricCard label="Clicks" value={number(snapshot.totals.clicks)} sub={`CTR ${snapshot.totals.ctr.toFixed(2)}%`} />
          <MetricCard label="Conversions" value={number(snapshot.totals.conversions)} sub={`ROAS ${snapshot.totals.roas.toFixed(2)}x`} />
        </section>
      )}

      {snapshot && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Campaigns</h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left text-zinc-500 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-2">Campaign</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Spend</th>
                  <th className="px-4 py-2">CTR</th>
                  <th className="px-4 py-2">CPC</th>
                  <th className="px-4 py-2">CPM</th>
                  <th className="px-4 py-2">Conv.</th>
                  <th className="px-4 py-2">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.campaigns.map((c) => (
                  <tr key={c.campaignId} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-50">{c.campaignName}</td>
                    <td className="px-4 py-2 text-zinc-500">{c.status}</td>
                    <td className="px-4 py-2">{currency(c.spend)}</td>
                    <td className="px-4 py-2">{c.ctr.toFixed(2)}%</td>
                    <td className="px-4 py-2">{currency(c.cpc)}</td>
                    <td className="px-4 py-2">{currency(c.cpm)}</td>
                    <td className="px-4 py-2">{number(c.conversions)}</td>
                    <td className="px-4 py-2">{c.roas.toFixed(2)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {insightsError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {insightsError}
        </div>
      )}

      {insights && (
        <section className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Insights</h2>
            <div className="flex flex-col gap-2">
              {insights.insights.map((insight, i) => (
                <div key={i} className={`rounded-lg border px-4 py-3 text-sm ${severityStyles[insight.severity]}`}>
                  <div className="font-medium">{insight.title}</div>
                  <div className="mt-0.5 text-xs opacity-80">{insight.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Action Items</h2>
            <div className="flex flex-col gap-2">
              {insights.actionItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="font-medium text-zinc-900 dark:text-zinc-50">{item.title}</div>
                  <div className="mt-0.5 text-xs text-zinc-500">{item.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
