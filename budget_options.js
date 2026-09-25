const pptxgen = require("pptxgenjs");

const BG   = "0B1929";
const WHITE= "FFFFFF";
const GREY = "7A8FA8";
const CORAL= "E8541C";
const GREEN= "3DAA6E";
const TEAL = "00BFA5";
const AMBER= "FFB347";
const BLUE = "5BA3E0";
const PP   = "Poppins";

const HDR  = { color: "E8541C" };  // coral header fill
const R1   = { color: "0F2236" };  // row 1
const R2   = { color: "0A1828" };  // row 2
const RSECT= { color: "091520" };  // section / KPI row
const BDR  = { pt: 1, color: "1E3A50" };

const p = new pptxgen();
p.defineLayout({ name:"WIDE", width:13.333, height:7.5 });
p.layout = "WIDE";

// Helper: single-line header cell
function hdr(txt) {
  return { text: txt, options: { fill: HDR, color: WHITE, bold: true, align: "center", valign: "middle", fontFace: PP, fontSize: 11, margin: [6,8,6,8] } };
}

// Helper: body cell
function bc(lines, fill, opts={}) {
  // lines: string or array of {text, options}
  const textVal = Array.isArray(lines)
    ? lines
    : [{ text: lines, options: {} }];
  return { text: textVal, options: { fill, color: WHITE, valign: "middle", fontFace: PP, fontSize: 10, margin: [6,8,6,8], ...opts } };
}

// ─────────────────────────────────────────────────────────────
// SLIDE 1 — OVERVIEW (one table, all 3 options)
// ─────────────────────────────────────────────────────────────
const s1 = p.addSlide();
s1.background = { color: BG };

s1.addText("gms", { x:11.9, y:0.16, w:1.2, h:0.36, fontFace:PP, fontSize:16, bold:true, color:CORAL, align:"right", isTextBox:true, margin:0 });
s1.addText("SECTION 05", { x:0.5, y:0.2, w:4, h:0.26, fontFace:PP, fontSize:10, bold:true, color:CORAL, charSpacing:1.5, isTextBox:true, margin:0 });
s1.addText("BUDGET OPTIONS", { x:0.5, y:0.5, w:11, h:0.66, fontFace:PP, fontSize:36, bold:true, color:WHITE, isTextBox:true, margin:0 });
s1.addShape("line", { x:0.5, y:1.24, w:5, h:0, line:{ color:"2A5070", width:2, dashType:"sysDot" } });
s1.addText("50% Acquisition  ·  50% Member Retargeting  ·  Meta, Google & TikTok across all tiers", { x:0.5, y:1.36, w:12, h:0.28, fontFace:PP, fontSize:11, color:GREY, isTextBox:true, margin:0 });

const overview = [
  // Row 0 — header
  [
    hdr("Campaign Stage"),
    hdr("% Split"),
    hdr("Option 01  ·  $10K / month"),
    hdr("Option 02  ·  $15K / month"),
    hdr("Option 03  ·  $20K / month"),
  ],
  // Row 1 — Acquisition
  [
    bc([{text:"Acquisition", options:{bold:true}}, {text:"\nApp Installs", options:{fontSize:9, color:GREY}}], R1),
    bc("50%", R1, { align:"center", bold:true, fontSize:13 }),
    bc([
      {text:"$5,000  ", options:{bold:true, color:CORAL}},
      {text:"acquisition budget", options:{fontSize:9, color:GREY}},
      {text:"\nMeta · $2,500  ·  Advantage+ App Campaigns", options:{fontSize:9, color:GREY}},
      {text:"\nGoogle · $1,500  ·  App Campaigns for Installs", options:{fontSize:9, color:GREY}},
      {text:"\nTikTok · $1,000  ·  ACO Phase 1 Baseline", options:{fontSize:9, color:GREY}},
    ], R1),
    bc([
      {text:"$7,500  ", options:{bold:true, color:CORAL}},
      {text:"acquisition budget", options:{fontSize:9, color:GREY}},
      {text:"\nMeta · $3,750  ·  AAC · LAL 1%→2%→5%", options:{fontSize:9, color:GREY}},
      {text:"\nGoogle · $2,250  ·  ACi + YouTube / Demand Gen", options:{fontSize:9, color:GREY}},
      {text:"\nTikTok · $1,500  ·  ACO + Spark Ads", options:{fontSize:9, color:GREY}},
    ], R1),
    bc([
      {text:"$10,000  ", options:{bold:true, color:CORAL}},
      {text:"acquisition budget", options:{fontSize:9, color:GREY}},
      {text:"\nMeta · $5,000  ·  AAC · Full LAL Stack", options:{fontSize:9, color:GREY}},
      {text:"\nGoogle · $3,000  ·  ACi + YouTube + Search", options:{fontSize:9, color:GREY}},
      {text:"\nTikTok · $2,000  ·  ACO + TopView + Spark Ads", options:{fontSize:9, color:GREY}},
    ], R1),
  ],
  // Row 2 — Member RTG
  [
    bc([{text:"Member Retargeting", options:{bold:true}}, {text:"\nExisting Members", options:{fontSize:9, color:GREY}}], R2),
    bc("50%", R2, { align:"center", bold:true, fontSize:13 }),
    bc([
      {text:"$5,000  ", options:{bold:true, color:BLUE}},
      {text:"retargeting budget", options:{fontSize:9, color:GREY}},
      {text:"\nMeta · $3,000  ·  At-Risk / Churned / Active", options:{fontSize:9, color:GREY}},
      {text:"\nGoogle · $2,000  ·  Customer Match RTG", options:{fontSize:9, color:GREY}},
    ], R2),
    bc([
      {text:"$7,500  ", options:{bold:true, color:BLUE}},
      {text:"retargeting budget", options:{fontSize:9, color:GREY}},
      {text:"\nMeta · $4,500  ·  At-Risk / Churned / Active", options:{fontSize:9, color:GREY}},
      {text:"\nGoogle · $3,000  ·  Customer Match · Full Funnel", options:{fontSize:9, color:GREY}},
    ], R2),
    bc([
      {text:"$10,000  ", options:{bold:true, color:BLUE}},
      {text:"retargeting budget", options:{fontSize:9, color:GREY}},
      {text:"\nMeta · $6,000  ·  At-Risk / Churned / Active + Hybrid LAL", options:{fontSize:9, color:GREY}},
      {text:"\nGoogle · $4,000  ·  Customer Match + YouTube RTG", options:{fontSize:9, color:GREY}},
    ], R2),
  ],
  // Row 3 — Paid Installs KPI
  [
    bc("Paid Installs / mo", RSECT, { bold:true, fontSize:9, color:GREY }),
    bc("—", RSECT, { align:"center", color:GREY }),
    bc("650+", RSECT, { align:"center", bold:true, fontSize:20, color:GREEN }),
    bc("985+", RSECT, { align:"center", bold:true, fontSize:20, color:GREEN }),
    bc("1,300+", RSECT, { align:"center", bold:true, fontSize:20, color:GREEN }),
  ],
  // Row 4 — ROAS KPI
  [
    bc("Member RTG ROAS", R1, { bold:true, fontSize:9, color:GREY }),
    bc("—", R1, { align:"center", color:GREY }),
    bc("10–25×", R1, { align:"center", bold:true, fontSize:18, color:TEAL }),
    bc("10–25×", R1, { align:"center", bold:true, fontSize:18, color:TEAL }),
    bc("10–35×", R1, { align:"center", bold:true, fontSize:18, color:TEAL }),
  ],
  // Row 5 — MAU KPI
  [
    bc("MAU Trajectory", R2, { bold:true, fontSize:9, color:GREY }),
    bc("—", R2, { align:"center", color:GREY }),
    bc("13K → 14K", R2, { align:"center", bold:true, fontSize:13, color:AMBER }),
    bc("13K → 15K", R2, { align:"center", bold:true, fontSize:13, color:AMBER }),
    bc("13K → 15K+", R2, { align:"center", bold:true, fontSize:13, color:AMBER }),
  ],
];

s1.addTable(overview, {
  x: 0.5, y: 1.72, w: 12.5,
  colW: [1.8, 0.7, 3.33, 3.33, 3.34],
  rowH: [0.38, 1.1, 0.9, 0.46, 0.42, 0.42],
  border: BDR,
  fontFace: PP,
});

s1.addText("Meta iOS CPI $6.16 actual · Google ACi est. $5–6 · TikTok TBC (new channel, no prior data) · Install estimates exclude TikTok", {
  x:0.5, y:7.26, w:12.5, h:0.2, fontFace:PP, fontSize:7.5, color:"3A5A70", isTextBox:true, margin:0
});


// ─────────────────────────────────────────────────────────────
// SLIDES 2–4 — DETAIL PER TIER
// ─────────────────────────────────────────────────────────────
const tiers = [
  {
    label:"Option 01  ·  $10,000 / month",
    note:"Meta iOS CPI $6.16 actual · Google ACi est. $5–6 · TikTok TBC (new channel, no prior data)",
    rows: [
      [hdr("Campaign Stage"), hdr("% Split"), hdr("Budget"), hdr("Campaign Objective"), hdr("Platform & Campaigns"), hdr("Target Audiences")],
      [
        bc([{text:"Acquisition", options:{bold:true}},{text:"\nApp Installs", options:{fontSize:9,color:GREY}}], R1),
        bc("50%", R1, {align:"center", bold:true, fontSize:14}),
        bc([{text:"$5,000", options:{bold:true, color:CORAL, fontSize:14}}], R1, {align:"center"}),
        bc("Drive paid app installs → registrations → first transactions → frequency", R1, {fontSize:9, color:GREY}),
        bc([
          {text:"Meta  ·  Advantage+ App Campaigns (AAC)", options:{bold:true, fontSize:9}},
          {text:"\nGoogle  ·  App Campaigns for Installs (ACi)", options:{bold:true, fontSize:9}},
          {text:"\nTikTok  ·  ACO Phase 1 Baseline", options:{bold:true, fontSize:9}},
        ], R1),
        bc([
          {text:"LAL 1–5% from Redcat LTV seed", options:{fontSize:9, color:GREY}},
          {text:"\nGeo: NSW + QLD store catchments", options:{fontSize:9, color:GREY}},
          {text:"\nCold interest + behaviour audiences", options:{fontSize:9, color:GREY}},
        ], R1),
      ],
      [
        bc([{text:"Member\nRetargeting", options:{bold:true}},{text:"\nExisting Members", options:{fontSize:9,color:GREY}}], R2),
        bc("50%", R2, {align:"center", bold:true, fontSize:14}),
        bc([{text:"$5,000", options:{bold:true, color:BLUE, fontSize:14}}], R2, {align:"center"}),
        bc("Re-engage existing members to drive repeat purchase frequency and stamp redemption", R2, {fontSize:9, color:GREY}),
        bc([
          {text:"Meta  ·  Member Retargeting (3 segments)", options:{bold:true, fontSize:9}},
          {text:"\nGoogle  ·  Customer Match RTG + RLSA + Display", options:{bold:true, fontSize:9}},
        ], R2),
        bc([
          {text:"At-Risk 31–90d  ·  stamp-card deeplink", options:{fontSize:9, color:GREY}},
          {text:"\nChurned 91d+  ·  win-back offer", options:{fontSize:9, color:GREY}},
          {text:"\nActive loyalty  ·  upsell + double stamp", options:{fontSize:9, color:GREY}},
          {text:"\nCustomer Match segments (Redcat)", options:{fontSize:9, color:GREY}},
        ], R2),
      ],
      [
        bc("KPIs", RSECT, {bold:true, fontSize:9, color:GREY}),
        bc("$10K\nTotal", RSECT, {align:"center", bold:true, fontSize:11, color:WHITE}),
        bc("650+\nPaid Installs/mo", RSECT, {align:"center", bold:true, fontSize:13, color:GREEN}),
        bc("10–25×\nMember RTG ROAS", RSECT, {align:"center", bold:true, fontSize:13, color:TEAL}),
        bc("13K → 14K\nMAU Target", RSECT, {align:"center", bold:true, fontSize:13, color:AMBER}),
        bc(">60%\nCustomer Match Rate", RSECT, {align:"center", bold:true, fontSize:11, color:BLUE}),
      ],
    ],
    rowH:[0.38, 1.35, 1.25, 0.52],
  },
  {
    label:"Option 02  ·  $15,000 / month",
    note:"Meta iOS CPI $6.16 actual · Google ACi est. $5–6 · TikTok signal building from Month 1",
    rows: [
      [hdr("Campaign Stage"), hdr("% Split"), hdr("Budget"), hdr("Campaign Objective"), hdr("Platform & Campaigns"), hdr("Target Audiences")],
      [
        bc([{text:"Acquisition", options:{bold:true}},{text:"\nApp Installs", options:{fontSize:9,color:GREY}}], R1),
        bc("50%", R1, {align:"center", bold:true, fontSize:14}),
        bc([{text:"$7,500", options:{bold:true, color:CORAL, fontSize:14}}], R1, {align:"center"}),
        bc("Drive paid app installs → registrations → first transactions → frequency", R1, {fontSize:9, color:GREY}),
        bc([
          {text:"Meta  ·  AAC · LAL 1%→2%→5% · seasonal burst", options:{bold:true, fontSize:9}},
          {text:"\nGoogle  ·  ACi + YouTube / Demand Gen burst", options:{bold:true, fontSize:9}},
          {text:"\nTikTok  ·  ACO + Spark Ads from organic UGC", options:{bold:true, fontSize:9}},
        ], R1),
        bc([
          {text:"LAL 1%→2%→5% from Redcat seed", options:{fontSize:9, color:GREY}},
          {text:"\nGeo: NSW + QLD + VIC expansion", options:{fontSize:9, color:GREY}},
          {text:"\nSpark Ads creator UGC credibility layer", options:{fontSize:9, color:GREY}},
        ], R1),
      ],
      [
        bc([{text:"Member\nRetargeting", options:{bold:true}},{text:"\nExisting Members", options:{fontSize:9,color:GREY}}], R2),
        bc("50%", R2, {align:"center", bold:true, fontSize:14}),
        bc([{text:"$7,500", options:{bold:true, color:BLUE, fontSize:14}}], R2, {align:"center"}),
        bc("Re-engage existing members to drive repeat purchase frequency and stamp redemption", R2, {fontSize:9, color:GREY}),
        bc([
          {text:"Meta  ·  Member RTG · 3 segments · seasonal hooks", options:{bold:true, fontSize:9}},
          {text:"\nGoogle  ·  Customer Match · Full Funnel (Gmail + Display)", options:{bold:true, fontSize:9}},
        ], R2),
        bc([
          {text:"At-Risk · Churned · Active Loyalty + seasonal", options:{fontSize:9, color:GREY}},
          {text:"\nCustomer Match 3 segments (Redcat)", options:{fontSize:9, color:GREY}},
          {text:"\nHoldout-validated creative from 10–35× ROAS tests", options:{fontSize:9, color:GREY}},
        ], R2),
      ],
      [
        bc("KPIs", RSECT, {bold:true, fontSize:9, color:GREY}),
        bc("$15K\nTotal", RSECT, {align:"center", bold:true, fontSize:11, color:WHITE}),
        bc("985+\nPaid Installs/mo", RSECT, {align:"center", bold:true, fontSize:13, color:GREEN}),
        bc("10–25×\nMember RTG ROAS", RSECT, {align:"center", bold:true, fontSize:13, color:TEAL}),
        bc("13K → 15K\nMAU Target", RSECT, {align:"center", bold:true, fontSize:13, color:AMBER}),
        bc(">60%\nCustomer Match Rate", RSECT, {align:"center", bold:true, fontSize:11, color:BLUE}),
      ],
    ],
    rowH:[0.38, 1.35, 1.25, 0.52],
  },
  {
    label:"Option 03  ·  $20,000 / month",
    note:"Meta iOS CPI $6.16 actual · Google ACi est. $5–6 · TikTok scaled from validated Phase 1 signal",
    rows: [
      [hdr("Campaign Stage"), hdr("% Split"), hdr("Budget"), hdr("Campaign Objective"), hdr("Platform & Campaigns"), hdr("Target Audiences")],
      [
        bc([{text:"Acquisition", options:{bold:true}},{text:"\nApp Installs", options:{fontSize:9,color:GREY}}], R1),
        bc("50%", R1, {align:"center", bold:true, fontSize:14}),
        bc([{text:"$10,000", options:{bold:true, color:CORAL, fontSize:14}}], R1, {align:"center"}),
        bc("Drive paid app installs → registrations → first transactions → frequency", R1, {fontSize:9, color:GREY}),
        bc([
          {text:"Meta  ·  AAC Full LAL Stack · national reach", options:{bold:true, fontSize:9}},
          {text:"\nGoogle  ·  ACi + YouTube + Search intent", options:{bold:true, fontSize:9}},
          {text:"\nTikTok  ·  ACO + TopView burst + Spark Ads", options:{bold:true, fontSize:9}},
        ], R1),
        bc([
          {text:"Full LAL stack 1% / 2% / 5% from Redcat", options:{fontSize:9, color:GREY}},
          {text:"\nNational geo expansion", options:{fontSize:9, color:GREY}},
          {text:"\nTopView for awareness spike at launch / seasonal", options:{fontSize:9, color:GREY}},
        ], R1),
      ],
      [
        bc([{text:"Member\nRetargeting", options:{bold:true}},{text:"\nExisting Members", options:{fontSize:9,color:GREY}}], R2),
        bc("50%", R2, {align:"center", bold:true, fontSize:14}),
        bc([{text:"$10,000", options:{bold:true, color:BLUE, fontSize:14}}], R2, {align:"center"}),
        bc("Re-engage existing members to drive repeat purchase frequency and stamp redemption", R2, {fontSize:9, color:GREY}),
        bc([
          {text:"Meta  ·  Member RTG + Hybrid LAL from high-LTV members", options:{bold:true, fontSize:9}},
          {text:"\nGoogle  ·  Customer Match + YouTube RTG + full funnel", options:{bold:true, fontSize:9}},
        ], R2),
        bc([
          {text:"At-Risk · Churned · Active + Hybrid LAL", options:{fontSize:9, color:GREY}},
          {text:"\nYouTube remarketing to lapsed app users", options:{fontSize:9, color:GREY}},
          {text:"\nCustomer Match 3 segments + YouTube audience", options:{fontSize:9, color:GREY}},
        ], R2),
      ],
      [
        bc("KPIs", RSECT, {bold:true, fontSize:9, color:GREY}),
        bc("$20K\nTotal", RSECT, {align:"center", bold:true, fontSize:11, color:WHITE}),
        bc("1,300+\nPaid Installs/mo", RSECT, {align:"center", bold:true, fontSize:13, color:GREEN}),
        bc("10–35×\nMember RTG ROAS", RSECT, {align:"center", bold:true, fontSize:13, color:TEAL}),
        bc("13K → 15K+\nMAU Target", RSECT, {align:"center", bold:true, fontSize:13, color:AMBER}),
        bc(">60%\nCustomer Match Rate", RSECT, {align:"center", bold:true, fontSize:11, color:BLUE}),
      ],
    ],
    rowH:[0.38, 1.35, 1.25, 0.52],
  },
];

tiers.forEach((t) => {
  const s = p.addSlide();
  s.background = { color: BG };

  s.addText("gms", { x:11.9, y:0.16, w:1.2, h:0.36, fontFace:PP, fontSize:16, bold:true, color:CORAL, align:"right", isTextBox:true, margin:0 });
  s.addText("SECTION 05", { x:0.5, y:0.2, w:4, h:0.26, fontFace:PP, fontSize:10, bold:true, color:CORAL, charSpacing:1.5, isTextBox:true, margin:0 });
  s.addText(t.label, { x:0.5, y:0.5, w:11, h:0.6, fontFace:PP, fontSize:30, bold:true, color:WHITE, isTextBox:true, margin:0 });
  s.addShape("line", { x:0.5, y:1.18, w:5, h:0, line:{ color:"2A5070", width:2, dashType:"sysDot" } });
  s.addText("50% Acquisition  ·  50% Member Retargeting", { x:0.5, y:1.3, w:8, h:0.28, fontFace:PP, fontSize:11, color:GREY, isTextBox:true, margin:0 });

  s.addTable(t.rows, {
    x: 0.5, y: 1.66, w: 12.5,
    colW: [1.6, 0.8, 1.0, 2.5, 3.5, 3.1],
    rowH: t.rowH,
    border: BDR,
    fontFace: PP,
  });

  s.addText(t.note, { x:0.5, y:7.26, w:12.5, h:0.2, fontFace:PP, fontSize:7.5, color:"3A5A70", isTextBox:true, margin:0 });
});

p.writeFile({ fileName:"GMS_Oakberry_Budget_Options.pptx" }).then(() => console.log("done"));
