const pptxgen = require("pptxgenjs");

const BG    = "0B1929";
const CARD  = "0F2236";
const WHITE = "FFFFFF";
const GREY  = "7A8FA8";
const CORAL = "E8541C";
const TEAL  = "00BFA5";
const AMBER = "FFB347";
const GREEN = "3DAA6E";
const META  = "0082FB";
const PP    = "Poppins";

const p = new pptxgen();
p.defineLayout({ name:"WIDE", width:13.333, height:7.5 });
p.layout = "WIDE";

function pill(s, x, y, w, h, bg, txt) {
  s.addShape("roundRect", { x, y, w, h, rectRadius:0.05, fill:{color:bg}, line:{color:bg, width:0} });
  s.addText(txt, { x, y, w, h, fontFace:PP, fontSize:9, bold:true, color:WHITE, align:"center", valign:"middle", isTextBox:true, margin:0 });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 1 — GOAL + 3 CAMPAIGN TYPES
// ─────────────────────────────────────────────────────────────
const s1 = p.addSlide();
s1.background = { color: BG };

// header
s1.addText("gms", { x:11.9, y:0.18, w:1.2, h:0.38, fontFace:PP, fontSize:16, bold:true, color:CORAL, align:"right", isTextBox:true, margin:0 });
s1.addText("SECTION 02", { x:0.5, y:0.22, w:4, h:0.28, fontFace:PP, fontSize:10, bold:true, color:CORAL, charSpacing:1.5, isTextBox:true, margin:0 });
s1.addText("META – APP INSTALL", { x:0.5, y:0.54, w:11, h:0.72, fontFace:PP, fontSize:38, bold:true, color:WHITE, isTextBox:true, margin:0 });
s1.addShape("line", { x:0.5, y:1.34, w:3.8, h:0, line:{ color:"2A5070", width:2, dashType:"sysDot" } });
s1.addText("Campaign Pillars", { x:0.5, y:1.48, w:6, h:0.44, fontFace:PP, fontSize:18, bold:true, color:CORAL, isTextBox:true, margin:0 });

// ── TOP: Full-width GOAL card ─────────────────────────────────
const goalY = 2.05;
const goalH = 1.72;
s1.addShape("roundRect", { x:0.5, y:goalY, w:12.5, h:goalH, rectRadius:0.1, fill:{color:CARD}, line:{color:"1A3A55", width:1} });

// left: label + headline
s1.addText("THE GOAL", { x:0.82, y:goalY+0.2, w:2.5, h:0.28, fontFace:PP, fontSize:9.5, bold:true, color:CORAL, charSpacing:1.2, isTextBox:true, margin:0 });
s1.addText("Drive installs → registrations → first transactions → frequency.", { x:0.82, y:goalY+0.52, w:5.8, h:0.52, fontFace:PP, fontSize:17, bold:true, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.1 });
s1.addText("6% of $255K has gone to app since July 2025. Members are now 20% of sales. We shift the engine.", { x:0.82, y:goalY+1.1, w:5.6, h:0.44, fontFace:PP, fontSize:10.5, color:GREY, isTextBox:true, margin:0 });

// vertical divider
s1.addShape("line", { x:7.1, y:goalY+0.18, w:0, h:goalH-0.36, line:{ color:"1A3A55", width:1 } });

// right: 3 KPI stats inline
const kpis = [
  { val:"800+/mo",  lbl:"Paid Install Target", base:"from 440/mo",  color:GREEN },
  { val:"20%+",     lbl:"iOS Reg Rate",         base:"from 18.7%",   color:TEAL  },
  { val:"15K",      lbl:"MAU Goal",             base:"currently 13K",color:AMBER },
];
const kpiW = (12.5 - 7.1 - 0.5) / 3;
kpis.forEach((k, i) => {
  const kx = 7.4 + i * (kpiW + 0.18);
  s1.addText(k.val, { x:kx, y:goalY+0.18, w:kpiW, h:0.6, fontFace:PP, fontSize:26, bold:true, color:k.color, align:"center", isTextBox:true, margin:0 });
  s1.addText(k.lbl, { x:kx, y:goalY+0.82, w:kpiW, h:0.26, fontFace:PP, fontSize:9.5, bold:true, color:GREY, align:"center", isTextBox:true, margin:0 });
  s1.addText(k.base,{ x:kx, y:goalY+1.1,  w:kpiW, h:0.24, fontFace:PP, fontSize:8.5, color:"3A5A70", align:"center", isTextBox:true, margin:0 });
  if (i < 2) s1.addShape("line", { x:kx+kpiW+0.09, y:goalY+0.18, w:0, h:goalH-0.36, line:{ color:"1A3A55", width:1 } });
});

// ── BOTTOM: 3 Campaign type cards ────────────────────────────
const campaigns = [
  {
    pillBg:"1A6878", pillTxt:"Campaign 01 · Always-On",
    title:"Advantage+ App\nCampaigns (AAC)",
    kpiLabel:"Focus", kpiVal:"Install Volume ↑", kpiColor:GREEN,
    body:"Always-on · Reels + Stories video-first · cold LAL audiences (1% → 2% → 5% from top 5% LTV Redcat seed) · priority is lifting install volume and building signal before optimising cost"
  },
  {
    pillBg:"2A6B3A", pillTxt:"Campaign 02 · Seasonal",
    title:"Summer & Launch\nWindows",
    kpiLabel:"Burst period", kpiVal:"Oct – Feb", kpiColor:AMBER,
    body:"Higher budget during peak trading · product-led creative (mango, acai) · broader interest layering · time-limited urgency overlaid on AAC base"
  },
  {
    pillBg:"5A3A80", pillTxt:"Campaign 03 · Prospecting",
    title:"Interest + Geo\nProspecting",
    kpiLabel:"Geo focus", kpiVal:"NSW + QLD", kpiColor:TEAL,
    body:"Health / food / lifestyle interests · geo-weighted to store catchments · new-to-brand cold audience · runs parallel to LAL tiers as volume layer"
  },
];

const cW = (12.5 - 0.3) / 3;
const cGap = 0.15;
const cY = goalY + goalH + 0.2;
const cH = 7.5 - cY - 0.28;

campaigns.forEach((c, i) => {
  const cx = 0.5 + i * (cW + cGap);
  s1.addShape("roundRect", { x:cx, y:cY, w:cW, h:cH, rectRadius:0.1, fill:{color:CARD}, line:{color:"1A3A55", width:1} });
  pill(s1, cx+0.22, cY+0.22, 2.1, 0.28, c.pillBg, c.pillTxt);
  s1.addText(c.title, { x:cx+0.22, y:cY+0.62, w:cW-0.44, h:0.82, fontFace:PP, fontSize:17, bold:true, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.1 });

  // divider
  s1.addShape("line", { x:cx+0.22, y:cY+1.56, w:cW-0.44, h:0, line:{ color:"1A3A55", width:1 } });

  s1.addText(c.body, { x:cx+0.22, y:cY+1.68, w:cW-0.44, h:1.1, fontFace:PP, fontSize:10.5, color:GREY, isTextBox:true, margin:0, lineSpacingMultiple:1.4 });

  // KPI chip bottom
  s1.addShape("roundRect", { x:cx+0.22, y:cY+cH-0.66, w:cW-0.44, h:0.5, rectRadius:0.06, fill:{color:"0A1520"}, line:{color:c.kpiColor, width:1} });
  s1.addText(c.kpiLabel.toUpperCase() + "  " + c.kpiVal, { x:cx+0.22, y:cY+cH-0.66, w:cW-0.44, h:0.5, fontFace:PP, fontSize:10, bold:true, color:c.kpiColor, align:"center", valign:"middle", isTextBox:true, margin:0 });
});

s1.addText("∞", { x:12.55, y:7.0, w:0.6, h:0.55, fontFace:"Arial", fontSize:36, bold:true, color:META, align:"center", isTextBox:true, margin:0 });


// ─────────────────────────────────────────────────────────────
// SLIDE 2 — STRATEGY: 3 moves + budget bar
// ─────────────────────────────────────────────────────────────
const s2 = p.addSlide();
s2.background = { color: BG };

s2.addText("gms", { x:11.9, y:0.18, w:1.2, h:0.38, fontFace:PP, fontSize:16, bold:true, color:CORAL, align:"right", isTextBox:true, margin:0 });
s2.addText("SECTION 02", { x:0.5, y:0.22, w:4, h:0.28, fontFace:PP, fontSize:10, bold:true, color:CORAL, charSpacing:1.5, isTextBox:true, margin:0 });
s2.addText("META – APP INSTALL", { x:0.5, y:0.54, w:11, h:0.72, fontFace:PP, fontSize:38, bold:true, color:WHITE, isTextBox:true, margin:0 });
s2.addShape("line", { x:0.5, y:1.34, w:3.8, h:0, line:{ color:"2A5070", width:2, dashType:"sysDot" } });
s2.addText("The Strategy", { x:0.5, y:1.48, w:6, h:0.44, fontFace:PP, fontSize:18, bold:true, color:CORAL, isTextBox:true, margin:0 });

const pillars = [
  {
    num:"01", numColor:CORAL,
    title:"Fix the leak before\nscaling spend.",
    kpi:"iOS reg rate  ·  20%+ target Month 1", kpiColor:CORAL,
    body:"iOS deep-link gap loses 45% of installs before registration. iOS sits at 18.7% vs Android's 63.6%. Fix this first — closing it compresses effective CPA immediately, before any budget increase."
  },
  {
    num:"02", numColor:TEAL,
    title:"Build creative.\nLet Advantage+ drive volume.",
    kpi:"Install volume ↑  ·  6-month horizon", kpiColor:TEAL,
    body:"Advantage+ learns from signal — thin creative is the constraint. Minimum 3 variants: Reels UGC (15s, app experience), stamp-card loyalty ('2 stamps from a free bowl'), seasonal hook (mango/acai summer)."
  },
  {
    num:"03", numColor:GREEN,
    title:"Expand audiences\none tier at a time.",
    kpi:"MAU growth  ·  December 2026", kpiColor:GREEN,
    body:"LAL 1% first (top 5% LTV seed from Redcat). Prove volume, then open to 2%, then 5%. Layer Interest + Geo (geo-weighted NSW + QLD) once LAL tiers are validated with a held-out control group."
  },
];

const p2cW = (12.5 - 0.3) / 3;
const p2cGap = 0.15;
const p2cY = 2.05;
const p2cH = 4.6;

pillars.forEach((pl, i) => {
  const px = 0.5 + i * (p2cW + p2cGap);
  s2.addShape("roundRect", { x:px, y:p2cY, w:p2cW, h:p2cH, rectRadius:0.1, fill:{color:CARD}, line:{color:"1A3A55", width:1} });

  s2.addText(pl.num, { x:px+0.22, y:p2cY+0.22, w:0.7, h:0.55, fontFace:PP, fontSize:26, bold:true, color:pl.numColor, isTextBox:true, margin:0 });
  s2.addText(pl.title, { x:px+0.22, y:p2cY+0.82, w:p2cW-0.44, h:0.95, fontFace:PP, fontSize:16, bold:true, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.15 });
  s2.addShape("line", { x:px+0.22, y:p2cY+1.88, w:p2cW-0.44, h:0, line:{ color:"1A3A55", width:1 } });
  s2.addText(pl.body, { x:px+0.22, y:p2cY+2.02, w:p2cW-0.44, h:1.7, fontFace:PP, fontSize:10.5, color:GREY, isTextBox:true, margin:0, lineSpacingMultiple:1.4 });

  s2.addShape("roundRect", { x:px+0.22, y:p2cY+p2cH-0.62, w:p2cW-0.44, h:0.46, rectRadius:0.06, fill:{color:"0A1520"}, line:{color:pl.kpiColor, width:1} });
  s2.addText(pl.kpi, { x:px+0.22, y:p2cY+p2cH-0.62, w:p2cW-0.44, h:0.46, fontFace:PP, fontSize:10, bold:true, color:pl.kpiColor, align:"center", valign:"middle", isTextBox:true, margin:0 });
});

// Budget bar
const barY2 = p2cY + p2cH + 0.28;
s2.addText("BUDGET SPLIT", { x:0.5, y:barY2, w:2.2, h:0.22, fontFace:PP, fontSize:8.5, bold:true, color:GREY, charSpacing:1.5, isTextBox:true, margin:0 });

const budgets = [
  { pct:50, lbl:"50%  Acquisition",     color:CORAL },
  { pct:20, lbl:"20%  App Install AAC", color:"1A7CC7" },
  { pct:20, lbl:"20%  Member RTG",      color:GREEN },
  { pct:10, lbl:"10%  Hybrid LAL",      color:"7B5EA7" },
];
const barW = 12.5;
let bx = 0.5;
budgets.forEach(b => {
  const w = (b.pct / 100) * barW;
  s2.addShape("RECTANGLE", { x:bx, y:barY2+0.28, w:w, h:0.24, fill:{color:b.color}, line:{color:b.color, width:0} });
  bx += w;
});
bx = 0.5;
budgets.forEach(b => {
  const w = (b.pct / 100) * barW;
  s2.addText(b.lbl, { x:bx+0.05, y:barY2+0.56, w:w, h:0.22, fontFace:PP, fontSize:9, color:GREY, isTextBox:true, margin:0 });
  bx += w;
});

s2.addText("∞", { x:12.55, y:7.0, w:0.6, h:0.55, fontFace:"Arial", fontSize:36, bold:true, color:META, align:"center", isTextBox:true, margin:0 });

p.writeFile({ fileName:"GMS_Oakberry_Meta_AppInstall_v7.pptx" }).then(() => console.log("done"));
