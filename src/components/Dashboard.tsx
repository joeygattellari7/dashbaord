"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { WINDOWS } from "@/lib/meta";
import type { AccountSnapshot, ClientConfig, InsightsResponse, Window } from "@/lib/types";

interface ClientSnapshot {
  client: ClientConfig;
  snapshot: AccountSnapshot;
}

const currency = (n: number) => `$${n.toFixed(2)}`;
const number = (n: number) => Math.round(n).toLocaleString();
const windowLabel: Record<Window, string> = { "7d": "Last 7 days", "14d": "Last 14 days", "30d": "Last 30 days" };

const severityStyles: Record<string, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  critical: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
};

const healthDot: Record<string, string> = {
  good: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

export default function Dashboard() {
  const [clientSnapshots, setClientSnapshots] = useState<ClientSnapshot[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeWindow, setActiveWindow] = useState<Window>("7d");
  const [insightsByClient, setInsightsByClient] = useState<Record<string, InsightsResponse>>({});
  const [insightsLoading, setInsightsLoading] = useState<string | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const source = new EventSource("/api/metrics/stream");
    sourceRef.current = source;

    source.addEventListener("snapshot", (event) => {
      setConnectionError(null);
      const data = JSON.parse((event as MessageEvent).data) as { clients: ClientSnapshot[] };
      setClientSnapshots(data.clients);
      setSelectedId((prev) => prev ?? data.clients[0]?.client.id ?? null);
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

  const selected = useMemo(
    () => clientSnapshots.find((c) => c.client.id === selectedId) ?? null,
    [clientSnapshots, selectedId]
  );
  const selectedWindow = selected?.snapshot.windows[activeWindow];

  const loadInsights = async (clientId: string) => {
    setInsightsLoading(clientId);
    setInsightsError(null);
    try {
      const res = await fetch(`/api/insights?clientId=${encodeURIComponent(clientId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load insights");
      setInsightsByClient((prev) => ({ ...prev, [clientId]: data }));
    } catch (err) {
      setInsightsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setInsightsLoading(null);
    }
  };

  const agencyTotals = clientSnapshots.reduce(
    (acc, c) => {
      acc.spend += c.snapshot.windows[activeWindow].totals.spend;
      acc.conversions += c.snapshot.windows[activeWindow].totals.conversions;
      return acc;
    },
    { spend: 0, conversions: 0 }
  );

  const selectedInsights = selectedId ? insightsByClient[selectedId] : undefined;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Client Ads Health Dashboard</h1>
          <p className="text-sm text-zinc-500">
            {clientSnapshots.length > 0
              ? `${clientSnapshots.length} accounts · spend ${currency(agencyTotals.spend)} · ${number(
                  agencyTotals.conversions
                )} conversions (${windowLabel[activeWindow].toLowerCase()}) · Meta only`
              : "Connecting to live metrics..."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-full border border-zinc-300 p-0.5 dark:border-zinc-700">
            {WINDOWS.map((w) => (
              <button
                key={w}
                onClick={() => setActiveWindow(w)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  activeWindow === w
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
          <a
            href="/api/daily-report?preview=1"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Preview daily email
          </a>
        </div>
      </header>

      {connectionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {connectionError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="flex flex-col gap-1">
          {clientSnapshots.map(({ client, snapshot }) => {
            const health = insightsByClient[client.id]?.healthStatus;
            return (
              <button
                key={client.id}
                onClick={() => setSelectedId(client.id)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                  selectedId === client.id
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {health && <span className={`h-2 w-2 shrink-0 rounded-full ${healthDot[health]}`} />}
                  {client.name}
                </span>
                <span className="shrink-0 text-xs opacity-70">{currency(snapshot.windows[activeWindow].totals.spend)}</span>
              </button>
            );
          })}
        </aside>

        <div className="flex flex-col gap-8">
          {selected && selectedWindow && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{selected.client.name}</h2>
                  <p className="text-xs text-zinc-500">{windowLabel[activeWindow]}</p>
                </div>
                <button
                  onClick={() => loadInsights(selected.client.id)}
                  disabled={insightsLoading === selected.client.id}
                  className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
                >
                  {insightsLoading === selected.client.id ? "Analyzing..." : "Run health check"}
                </button>
              </div>

              <section className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <MetricCard label="Spend" value={currency(selectedWindow.totals.spend)} />
                <MetricCard label="Impressions" value={number(selectedWindow.totals.impressions)} />
                <MetricCard
                  label="Clicks"
                  value={number(selectedWindow.totals.clicks)}
                  sub={`CTR ${selectedWindow.totals.ctr.toFixed(2)}%`}
                />
                <MetricCard
                  label="Conversions"
                  value={number(selectedWindow.totals.conversions)}
                  sub={`ROAS ${selectedWindow.totals.roas.toFixed(2)}x`}
                />
                <MetricCard label="CPC" value={currency(selectedWindow.totals.cpc)} sub={`CPM ${currency(selectedWindow.totals.cpm)}`} />
              </section>

              <section className="grid grid-cols-3 divide-x divide-zinc-200 rounded-xl border border-zinc-200 text-sm dark:divide-zinc-800 dark:border-zinc-800">
                {WINDOWS.map((w) => {
                  const t = selected.snapshot.windows[w].totals;
                  return (
                    <div key={w} className={`p-3 ${activeWindow === w ? "bg-zinc-50 dark:bg-zinc-900" : ""}`}>
                      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">{windowLabel[w]}</div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-zinc-600 dark:text-zinc-300">
                        <span>{currency(t.spend)} spend</span>
                        <span>{number(t.conversions)} conv.</span>
                        <span>{t.roas.toFixed(2)}x ROAS</span>
                      </div>
                    </div>
                  );
                })}
              </section>

              <section>
                <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">Campaigns ({windowLabel[activeWindow].toLowerCase()})</h3>
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
                      {selectedWindow.campaigns.map((c) => (
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
                      {selectedWindow.campaigns.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-6 text-center text-zinc-400">
                            No campaign activity in this window.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {insightsError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                  {insightsError}
                </div>
              )}

              {selectedInsights && (
                <section className="flex flex-col gap-6">
                  <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-1 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-50">
                      <span className={`h-2 w-2 rounded-full ${healthDot[selectedInsights.healthStatus]}`} />
                      Summary (7/14/30-day analysis)
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-300">{selectedInsights.summary}</div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Biggest flags</h4>
                      <div className="flex flex-col gap-2">
                        {selectedInsights.flags.length === 0 && (
                          <div className="text-sm text-zinc-400">No flags — looking clean.</div>
                        )}
                        {selectedInsights.flags.map((f, i) => (
                          <div key={i} className={`rounded-lg border px-4 py-3 text-sm ${severityStyles[f.severity]}`}>
                            <div className="font-medium">{f.title}</div>
                            <div className="mt-0.5 text-xs opacity-80">{f.detail}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Key notes</h4>
                      <div className="flex flex-col gap-2">
                        {selectedInsights.keyNotes.length === 0 && (
                          <div className="text-sm text-zinc-400">Nothing notable.</div>
                        )}
                        {selectedInsights.keyNotes.map((n, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                          >
                            {n}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Optimizations</h4>
                      <div className="flex flex-col gap-2">
                        {selectedInsights.optimizations.length === 0 && (
                          <div className="text-sm text-zinc-400">No changes recommended.</div>
                        )}
                        {selectedInsights.optimizations.map((o, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                          >
                            <div className="font-medium text-zinc-900 dark:text-zinc-50">{o.title}</div>
                            <div className="mt-0.5 text-xs text-zinc-500">{o.detail}</div>
                            {o.expectedImpact && (
                              <div className="mt-1 text-xs italic text-zinc-400">{o.expectedImpact}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
