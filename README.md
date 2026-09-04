# Client Ads Health Dashboard

A daily health-check dashboard across all your client ad accounts — currently **Meta (Facebook/Instagram) only**. Shows live metrics, AI-generated flags/optimizations per client, and emails you a daily digest.

Google Ads, TikTok Ads and LinkedIn Ads are not wired in yet (no API access configured for those in this environment) — see "Adding another platform" below for how to extend it.

## How it works

- **Clients**: `src/lib/clients.ts` reads the `CLIENTS` env var (a JSON array of `{id, name, metaAdAccountId}`) — pre-filled with your current 10 clients (11 ad accounts, since Fast Client Formula runs separate USA/AU accounts).
- **Metrics**: `src/lib/meta.ts` calls the Meta Marketing API per client for yesterday's campaign-level insights plus a trailing-7-day baseline for trend comparison.
- **Live dashboard**: `src/app/api/metrics/stream/route.ts` is a Server-Sent Events endpoint that polls every client on an interval (`METRICS_POLL_INTERVAL_SECONDS`, default 300s). The UI (`src/components/Dashboard.tsx`) lists every client with a health dot, and lets you drill into one account's campaigns.
- **Health check (flags/notes/optimizations)**: `src/lib/insights.ts` sends a client's snapshot to Claude and asks for a structured health check: overall status, plain-English summary, key notes, biggest flags (ranked by severity), and concrete optimizations. Triggered on demand per client via "Run health check" in the UI (`/api/insights?clientId=...`), or for every client at once by the daily report.
- **Daily email**: `src/app/api/daily-report/route.ts` runs the health check for every client, renders one email with a section per client, and sends it via Gmail SMTP (`src/lib/email.ts`). Preview it anytime at `/api/daily-report?preview=1` without sending.

## Setup

1. `cp env.example .env.local` and fill in:
   - `META_ACCESS_TOKEN` — a Meta Marketing API System User token with `ads_read` on every client account listed in `CLIENTS`.
   - `ANTHROPIC_API_KEY` — for generating health checks.
   - `GMAIL_USER` / `GMAIL_APP_PASSWORD` — a Gmail address and an [App Password](https://myaccount.google.com/apppasswords) (not your regular password) to send from.
   - `EMAIL_TO` — defaults to `joey.gattellari7@gmail.com`.
   - `CRON_SECRET` — any random string; required so only your scheduler can trigger `/api/daily-report`.
   - `CLIENTS` — already populated with your 10 clients. Edit as clients are added/removed. **Note:** Quantum Key Institute's ad account is currently `IN_GRACE_PERIOD` in Meta — worth checking before relying on its numbers.
2. `npm install`
3. `npm run dev`, open [http://localhost:3000](http://localhost:3000).

## Scheduling the daily email

`vercel.json` already defines a cron (`0 21 * * *` UTC ≈ 7-8am AEST/AEDT) that hits `/api/daily-report` once a day — this works automatically if you deploy to Vercel with `CRON_SECRET` unset, or set it and Vercel Cron will need `Authorization: Bearer <CRON_SECRET>`; if you'd rather keep the secret, use a different scheduler that can send a header (e.g. GitHub Actions, cron-job.org, or a Vercel Cron project setting), or open `/api/daily-report?secret=...`.

If you're not deploying to Vercel, point any scheduler (cron, GitHub Actions, cron-job.org) at:
```
GET https://<your-domain>/api/daily-report?secret=<CRON_SECRET>
```
once a day.

## Adding another platform (Google / TikTok / LinkedIn)

Follow the pattern in `src/lib/meta.ts` + `src/lib/clients.ts`:
1. Add a `lib/<platform>.ts` with a `fetchAccountSnapshot(accountId)` returning the same `AccountSnapshot` shape (or a platform-specific variant).
2. Extend `ClientConfig` with e.g. `googleAdsCustomerId`, and loop over configured platforms per client in the snapshot/insights/daily-report routes.
3. Add the platform's credentials to `.env.local`.

## Notes

- Metrics default to `date_preset: yesterday` (a full day of data) with a `last_7d` baseline for trend deltas; adjust in `src/lib/meta.ts` if you want a different window or ad-set/ad granularity.
- Per-client health checks are called on demand (UI button) or once daily (email) to control Claude API cost — not on every metrics poll.
