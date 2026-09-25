const pptxgen = require("pptxgenjs");

const BG    = "0D1825";
const WHITE = "FFFFFF";
const CORAL = "E8541C";
const GREY  = "CCCCCC";
const MUTED = "999999";
const ROW1  = "142030";
const ROW2  = "0F1A28";
const HDR   = "E8541C";
const PP    = "Poppins";

const DISC = "The KPIs outlined are indicative only and subject to change based on the final campaign assets, confirmed budgets, duration of the campaigns, confirmation of available channels and key objectives defined by the client.";

const p = new pptxgen();
p.defineLayout({ name:"WIDE", width:13.333, height:7.5 });
p.layout = "WIDE";

function buildSlide(title, highlight, objective, rows) {
  const s = p.addSlide();
  s.background = { color: BG };

  // gms logo top right
  s.addText("gms", { x:11.6, y:0.22, w:1.5, h:0.48, fontFace:PP, fontSize:20, bold:true, color:CORAL, align:"right", isTextBox:true, margin:0 });

  // title — "Indicative " plain white, then highlight part coral
  s.addText([
    { text:"Indicative ", options:{ color:WHITE, bold:true, fontSize:36, fontFace:PP } },
    { text:highlight+" ", options:{ color:CORAL, bold:true, fontSize:36, fontFace:PP } },
    { text:">", options:{ color:WHITE, bold:true, fontSize:36, fontFace:PP } }
  ], { x:0.5, y:0.28, w:12, h:0.72, isTextBox:true, margin:0 });

  // objective italic
  s.addText("Objective: "+objective, { x:0.5, y:1.08, w:11, h:0.32, fontFace:PP, fontSize:13, italic:true, color:GREY, isTextBox:true, margin:0 });

  // table
  const tX=0.5, tY=1.6, tW=12.33;
  const colKpi=3.1, colTgt=4.5, colMeas=tW-colKpi-colTgt;
  const hdrH=0.5;
  const rowH = (7.5 - tY - 0.9 - hdrH) / rows.length;

  // header band
  s.addShape("RECTANGLE", { x:tX, y:tY, w:tW, h:hdrH, fill:{color:HDR}, line:{color:HDR,width:0} });
  const hOpts = { fontFace:PP, fontSize:13, bold:true, color:WHITE, valign:"middle", isTextBox:true, margin:[0,0,0,14] };
  s.addText("KPI",                  { x:tX,              y:tY, w:colKpi, h:hdrH, ...hOpts });
  s.addText("Target / Benchmark",   { x:tX+colKpi,       y:tY, w:colTgt, h:hdrH, ...hOpts });
  s.addText("Measurement Insight",  { x:tX+colKpi+colTgt,y:tY, w:colMeas,h:hdrH, ...hOpts });

  rows.forEach((r, i) => {
    const ry = tY + hdrH + i * rowH;
    const bg = i % 2 === 0 ? ROW1 : ROW2;
    const border = { color:"1E3A50", width:0.5 };

    s.addShape("RECTANGLE", { x:tX,               y:ry, w:colKpi, h:rowH, fill:{color:bg}, line:border });
    s.addShape("RECTANGLE", { x:tX+colKpi,        y:ry, w:colTgt, h:rowH, fill:{color:bg}, line:border });
    s.addShape("RECTANGLE", { x:tX+colKpi+colTgt, y:ry, w:colMeas,h:rowH, fill:{color:bg}, line:border });

    const rOpts = { fontFace:PP, valign:"middle", isTextBox:true, margin:[0,0,0,14], lineSpacingMultiple:1.3 };
    s.addText(r.kpi,    { x:tX,               y:ry, w:colKpi, h:rowH, fontSize:12, bold:true,  color:WHITE, ...rOpts });
    s.addText(r.target, { x:tX+colKpi,        y:ry, w:colTgt, h:rowH, fontSize:12, bold:false, color:GREY,  ...rOpts });
    s.addText(r.insight,{ x:tX+colKpi+colTgt, y:ry, w:colMeas,h:rowH, fontSize:12, bold:false, color:GREY,  ...rOpts });
  });

  // disclaimer
  s.addText(DISC, { x:0.5, y:6.82, w:9, h:0.52, fontFace:PP, fontSize:8.5, color:MUTED, isTextBox:true, margin:0, lineSpacingMultiple:1.3 });
}

// ─── SLIDE 1 — Conversion ──────────────────────────────────────────
buildSlide(
  "Indicative KPIs",
  "KPIs (Conversion)",
  "Turn engagement into measurable leads, bookings, and applications.",
  [
    { kpi:"Increase Store Visits",                           target:"5–30% YoY",                                                                      insight:"Track POS sales, AOV and units per transaction per location via Redcat." },
    { kpi:"Paid App Install Volume",                         target:"800+/mo (Meta iOS) · currently 440/mo\nGoogle & TikTok: new channels — baseline TBC", insight:"Meta iOS: 1,721 paid installs on $10.6K spend (all-time, CPI $6.16). No CPI target — priority is lifting volume and building signal before optimising cost." },
    { kpi:"App Registration Rate",                           target:"20%+ iOS reg rate · currently 18.7%\nAndroid already at 63.6%",                     insight:"iOS deep-link gap is the primary unlock. Fix redirect flow first — every install lost pre-registration wastes paid spend." },
    { kpi:"Google Search Impression Share – Non Branded",    target:"Establish baseline (new channel)",                                                   insight:"Drive awareness and actions via non-branded search intent. Track share of voice against category terms." },
    { kpi:"Branded Search Impression Share",                 target:"Min 94% · 0% lost to controllable factors\n(budget, bidding, creative)",             insight:"Google measurements provided. Protect brand terms at all times — loss here directly impacts lowest-funnel conversion." },
    { kpi:"ROAS (Trackable Only)",                           target:"2–5×",                                                                               insight:"In-app transaction revenue vs media spend, measurable data only. Member RTG campaigns tracking 10–35× in holdout tests." },
  ]
);

// ─── SLIDE 2 — Member Retargeting ─────────────────────────────────
buildSlide(
  "Indicative KPIs",
  "KPIs (Member Retargeting)",
  "Re-engage existing members, drive repeat purchase frequency and reward redemption.",
  [
    { kpi:"Reactivation ROAS",          target:"≥ 25×",                   insight:"In-app transaction revenue attributed to Customer Match audiences vs media spend." },
    { kpi:"Repeat Visit Frequency",     target:"12–14 day cycle",          insight:"Days between member transactions tracked via Redcat CRM against campaign-exposed cohort." },
    { kpi:"Member Revenue Share",       target:"≥ 25% of total revenue",   insight:"Loyalty member sales as % of total POS revenue — baseline tracked monthly." },
    { kpi:"Customer Match Rate",        target:"> 60%",                    insight:"% of uploaded CRM list matched by Google. Below 60% indicates list hygiene issue — refresh quarterly." },
    { kpi:"Stamp Redemption Rate",      target:"+15% vs control",          insight:"Reward redemptions from campaign-exposed members vs unexposed holdout. Measured via Redcat." },
  ]
);

p.writeFile({ fileName:"GMS_Oakberry_KPIs.pptx" }).then(() => console.log("done"));
