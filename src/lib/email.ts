import nodemailer from "nodemailer";
import { WINDOWS } from "./meta";
import type { DailyReport } from "./types";

const severityRank: Record<string, number> = { critical: 0, warning: 1, info: 2 };
const healthColor: Record<string, string> = { critical: "#dc2626", warning: "#d97706", good: "#16a34a" };
const healthLabel: Record<string, string> = { critical: "Needs attention", warning: "Watch", good: "Healthy" };
const windowLabel: Record<string, string> = { "7d": "7 days", "14d": "14 days", "30d": "30 days" };

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function currency(n: number) {
  return `$${n.toFixed(2)}`;
}

function renderClientSection(entry: DailyReport["clients"][number]): string {
  const { clientName, healthStatus, summary, keyNotes, flags, optimizations, snapshot } = entry;
  const sortedFlags = [...flags].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return `
  <tr><td style="padding:28px 0 0 0;border-top:1px solid #e4e4e7;">
    <table role="presentation" width="100%">
      <tr>
        <td>
          <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${healthColor[healthStatus]};margin-right:8px;"></span>
          <span style="font-size:17px;font-weight:600;color:#18181b;">${escapeHtml(clientName)}</span>
          <span style="float:right;font-size:12px;font-weight:600;color:${healthColor[healthStatus]};">${healthLabel[healthStatus]}</span>
        </td>
      </tr>
    </table>
    <p style="margin:10px 0 12px 0;font-size:13px;color:#3f3f46;line-height:1.5;">${escapeHtml(summary)}</p>
    <table role="presentation" width="100%" style="margin-bottom:12px;border-collapse:collapse;">
      <tr style="font-size:11px;color:#71717a;">
        <td style="padding:2px 8px 2px 0;"></td>
        <td style="padding:2px 8px;">Spend</td>
        <td style="padding:2px 8px;">Conversions</td>
        <td style="padding:2px 8px;">CTR</td>
        <td style="padding:2px 8px;">CPC</td>
        <td style="padding:2px 8px;">ROAS</td>
      </tr>
      ${WINDOWS.map((w) => {
        const t = snapshot.windows[w].totals;
        return `<tr style="font-size:12px;color:#18181b;border-top:1px solid #f4f4f5;">
          <td style="padding:3px 8px 3px 0;font-weight:600;color:#71717a;">${windowLabel[w]}</td>
          <td style="padding:3px 8px;">${currency(t.spend)}</td>
          <td style="padding:3px 8px;">${Math.round(t.conversions)}</td>
          <td style="padding:3px 8px;">${t.ctr.toFixed(2)}%</td>
          <td style="padding:3px 8px;">${currency(t.cpc)}</td>
          <td style="padding:3px 8px;">${t.roas.toFixed(2)}x</td>
        </tr>`;
      }).join("")}
    </table>
    ${
      sortedFlags.length
        ? `<div style="margin-bottom:10px;"><div style="font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:.03em;margin-bottom:4px;">Biggest flags</div>
      ${sortedFlags
        .map(
          (f) =>
            `<div style="font-size:13px;color:#3f3f46;padding:4px 0;"><b style="color:${healthColor[f.severity] || "#3f3f46"};">${escapeHtml(f.title)}</b> — ${escapeHtml(f.detail)}</div>`
        )
        .join("")}</div>`
        : ""
    }
    ${
      keyNotes.length
        ? `<div style="margin-bottom:10px;"><div style="font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:.03em;margin-bottom:4px;">Key notes</div>
      ${keyNotes.map((n) => `<div style="font-size:13px;color:#3f3f46;padding:2px 0;">• ${escapeHtml(n)}</div>`).join("")}</div>`
        : ""
    }
    ${
      optimizations.length
        ? `<div><div style="font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:.03em;margin-bottom:4px;">Optimizations to make</div>
      ${optimizations
        .map(
          (o) =>
            `<div style="font-size:13px;color:#3f3f46;padding:2px 0;">→ <b>${escapeHtml(o.title)}</b> — ${escapeHtml(o.detail)}${o.expectedImpact ? ` <i style="color:#71717a;">(${escapeHtml(o.expectedImpact)})</i>` : ""}</div>`
        )
        .join("")}</div>`
        : ""
    }
  </td></tr>`;
}

export function renderDailyReportHtml(report: DailyReport): string {
  const dateStr = new Date(report.generatedAt).toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const critical = report.clients.filter((c) => c.healthStatus === "critical").length;
  const warning = report.clients.filter((c) => c.healthStatus === "warning").length;

  return `<!doctype html>
<html><body style="margin:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
<table role="presentation" width="100%" style="background:#f4f4f5;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="640" style="background:#ffffff;border-radius:12px;padding:32px;">
<tr><td>
  <div style="font-size:20px;font-weight:700;color:#18181b;">Daily Ads Health Check</div>
  <div style="font-size:13px;color:#71717a;margin-top:2px;">${dateStr} · ${report.clients.length} accounts · 7/14/30-day trend${
    critical ? ` · <span style="color:#dc2626;font-weight:600;">${critical} need attention</span>` : ""
  }${warning ? ` · <span style="color:#d97706;font-weight:600;">${warning} to watch</span>` : ""}</div>
</td></tr>
${report.clients.map(renderClientSection).join("")}
<tr><td style="padding-top:24px;font-size:11px;color:#a1a1aa;">Generated automatically from Meta Ads data. Google, TikTok and LinkedIn are not yet connected to this report.</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export async function sendDailyReportEmail(report: DailyReport): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.EMAIL_TO;
  if (!user || !pass || !to) {
    throw new Error("GMAIL_USER, GMAIL_APP_PASSWORD and EMAIL_TO must be configured to send the daily report");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const critical = report.clients.filter((c) => c.healthStatus === "critical").length;
  const subjectFlag = critical > 0 ? ` — ${critical} need attention` : "";

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || user,
    to,
    subject: `Daily Ads Health Check${subjectFlag} — ${new Date(report.generatedAt).toLocaleDateString()}`,
    html: renderDailyReportHtml(report),
  });
}
