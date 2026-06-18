# Meta Ads Dashboard

Real-time(ish) dashboard for Meta (Facebook/Instagram) ad performance, with AI-generated insights and action items.

## How it works

- **Metrics**: `src/lib/meta.ts` calls the Meta Marketing API for today's campaign-level insights, aggregated into account totals.
- **Live updates**: `src/app/api/metrics/stream/route.ts` is a Server-Sent Events (SSE) endpoint that polls Meta on an interval (`METRICS_POLL_INTERVAL_SECONDS`, default 300s) and pushes new snapshots to the browser. Meta's API has no real-time webhook for ad metrics, so polling is the practical "real-time" mechanism — keep the interval at or above a few minutes to stay within rate limits.
- **Insights & action items**: `src/app/api/insights/route.ts` sends the latest snapshot to Claude (Anthropic API) and asks for structured insights (trends/anomalies) and prioritized action items, rendered in the dashboard via a "Generate Insights" button.

## Setup

1. Copy `env.example` to `.env.local` and fill in:
   - `META_ACCESS_TOKEN` — a Meta Marketing API access token with `ads_read` permission on the target ad account.
   - `META_AD_ACCOUNT_ID` — your ad account ID, in the form `act_XXXXXXXXXX`.
   - `ANTHROPIC_API_KEY` — for generating insights.
2. `npm install`
3. `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000).

## Notes

- Metrics are scoped to "today" (`date_preset: today`) at the campaign level; adjust `src/lib/meta.ts` if you want a different date range or ad-set/ad granularity.
- The insights endpoint is called on demand from the UI (not on every poll) to control Claude API cost; wire it into the poll loop if you want insights to refresh automatically.
