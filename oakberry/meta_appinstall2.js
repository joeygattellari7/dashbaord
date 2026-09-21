const pptxgen = require("pptxgenjs");

const BG       = "0D1B2A";
const CORAL    = "E8541C";
const WHITE    = "FFFFFF";
const GREY     = "8A9BB4";
const CARD     = "162535";
const CARD2    = "1A2E42";
const META_BLUE= "0082FB";
const GREEN    = "4ECB71";
const HF       = "Arial Black";
const BF       = "Calibri";

const p = new pptxgen();
p.defineLayout({ name:"WIDE", width:13.333, height:7.5 });
p.layout = "WIDE";

// SLIDE 1 — NOW: Current state + audience intelligence
const s1 = p.addSlide();
s1.background = { color: BG };

s1.addText("gms", { x:11.6, y:0.2, w:1.5, h:0.5, fontFace:HF, fontSize:18, color:CORAL, align:"right", isTextBox:true, margin:0 });
s1.addText("SECTION 02", { x:0.55, y:0.28, w:3, h:0.32, fontFace:BF, fontSize:11, bold:true, color:CORAL, charSpacing:1, isTextBox:true, margin:0 });
s1.addText("META – APP INSTALL", { x:0.55, y:0.65, w:10, h:0.82, fontFace:HF, fontSize:42, bold:true, color:WHITE, isTextBox:true, margin:0 });
s1.addShape("line", { x:0.55, y:1.56, w:5.5, h:0, line:{ color:"2A4A6A", width:2, dashType:"sysDot" } });

// NOW card (top-left)
s1.addShape("roundRect", { x:0.45, y:1.72, w:6.1, h:2.78, rectRadius:0.12, fill:{color:CARD2}, line:{color:"2A4A6A", width:1} });
s1.addText("NOW", { x:0.75, y:1.92, w:2, h:0.36, fontFace:BF, fontSize:13, bold:true, color:CORAL, isTextBox:true, margin:0 });
s1.addText(
  "4 months live. $6.13 CPI — running Advantage+ App Campaigns (AAC) with Reels + Stories video-first creative. " +
  "iOS install-to-registration sitting at 18.7%; Android 63.6%. Deep-link gap is costing roughly 45% of iOS sign-ups.\n\n" +
  "Audience is cold Lookalike only — top 5% member LTV seed pulled from Redcat export. No retargeting layer has been added yet. " +
  "Limited creative variants tested to date — algorithm has not had enough signal to compress CPI.\n\n" +
  "13,000 monthly active app users. App transactions +42% YoY in August (3,340 → 4,762). The install base is thin but engaging — avg session 3 min 29 sec.",
  { x:0.75, y:2.32, w:5.6, h:2.02, fontFace:BF, fontSize:11.5, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.3 }
);

// AUDIENCE card (top-right)
s1.addShape("roundRect", { x:6.78, y:1.72, w:6.1, h:2.78, rectRadius:0.12, fill:{color:CARD2}, line:{color:"2A4A6A", width:1} });
s1.addText("AUDIENCE", { x:7.08, y:1.92, w:3, h:0.36, fontFace:BF, fontSize:13, bold:true, color:CORAL, isTextBox:true, margin:0 });
s1.addText(
  "Primary target: Females 18–34. GMS audience data shows 74% female across paid social — skews youngest on TikTok, slightly older (25–34) on Meta.\n\n" +
  "NSW + QLD account for 74% of current reach — mirrors store density. Audiences should be geo-weighted to store catchments rather than national.\n\n" +
  "Seed audience: top 5% member LTV from Redcat export. Expand LAL tiers — 1%, 2%, 5% to be tested sequentially. Members exposed to ads are 7× more likely to transact than organic: " +
  "56.8% conversion rate vs 8.05% baseline, confirmed across July and August holdout tests.",
  { x:7.08, y:2.32, w:5.6, h:2.02, fontFace:BF, fontSize:11.5, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.3 }
);

// METRICS strip (full-width bottom)
s1.addShape("roundRect", { x:0.45, y:4.68, w:12.43, h:2.36, rectRadius:0.12, fill:{color:CARD2}, line:{color:"2A4A6A", width:1} });

const metrics = [
  { val:"$6.13", lbl:"Current CPI" },
  { val:"18.7%", lbl:"iOS Reg Rate" },
  { val:"63.6%", lbl:"Android Reg Rate" },
  { val:"13K",   lbl:"Monthly Active Users" },
  { val:"+42%",  lbl:"App Txns YoY (Aug)" },
  { val:"34.9×", lbl:"Reactivation ROAS Aug" },
];
const mW = 12.43 / 6;
metrics.forEach((m, i) => {
  const mx = 0.45 + i * mW;
  if (i < metrics.length - 1) {
    s1.addShape("line", { x: mx + mW, y:4.78, w:0, h:2.14, line:{ color:"2A4A6A", width:1 } });
  }
  const valColor = m.val.startsWith("+") ? GREEN : (m.val === "$6.13" ? CORAL : WHITE);
  s1.addText(m.val, { x:mx+0.1, y:4.88, w:mW-0.2, h:0.7, fontFace:HF, fontSize:26, bold:true, color:valColor, align:"center", isTextBox:true, margin:0 });
  s1.addText(m.lbl, { x:mx+0.1, y:5.58, w:mW-0.2, h:0.36, fontFace:BF, fontSize:10, color:GREY, align:"center", isTextBox:true, margin:0 });
});

s1.addText("∞", { x:11.55, y:6.3, w:1.5, h:1.0, fontFace:"Arial", fontSize:58, bold:true, color:META_BLUE, align:"right", isTextBox:true, margin:0 });


// SLIDE 2 — NEXT + TARGET: Strategy and goals
const s2 = p.addSlide();
s2.background = { color: BG };

s2.addText("gms", { x:11.6, y:0.2, w:1.5, h:0.5, fontFace:HF, fontSize:18, color:CORAL, align:"right", isTextBox:true, margin:0 });
s2.addText("SECTION 02", { x:0.55, y:0.28, w:3, h:0.32, fontFace:BF, fontSize:11, bold:true, color:CORAL, charSpacing:1, isTextBox:true, margin:0 });
s2.addText("META – APP INSTALL", { x:0.55, y:0.65, w:10, h:0.82, fontFace:HF, fontSize:42, bold:true, color:WHITE, isTextBox:true, margin:0 });
s2.addShape("line", { x:0.55, y:1.56, w:5.5, h:0, line:{ color:"2A4A6A", width:2, dashType:"sysDot" } });

// NEXT card (top-left)
s2.addShape("roundRect", { x:0.45, y:1.72, w:6.1, h:2.78, rectRadius:0.12, fill:{color:CARD2}, line:{color:"2A4A6A", width:1} });
s2.addText("NEXT", { x:0.75, y:1.92, w:2, h:0.36, fontFace:BF, fontSize:13, bold:true, color:CORAL, isTextBox:true, margin:0 });
s2.addText(
  "Fix the iOS deep-link gap first — closing that gap lifts iOS registration rate from 18.7% to the Android benchmark (63%+), compressing effective CPA before any spend increase.\n\n" +
  "Scale creative volume inside Advantage+: CPI compresses materially as the algorithm gets more signal. Test Reels-first UGC, stamp-card loyalty creative, and seasonal summer hooks simultaneously. " +
  "Three creative variants minimum per ad set.\n\n" +
  "Layer member retargeting via TalkBox → Redcat sync once install base reaches critical mass. " +
  "Build sequential LAL tiers: 1% → 2% → 5% from top-LTV seed, testing one tier at a time against a held-out control group.",
  { x:0.75, y:2.32, w:5.6, h:2.02, fontFace:BF, fontSize:11.5, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.3 }
);

// TARGET card (top-right)
s2.addShape("roundRect", { x:6.78, y:1.72, w:6.1, h:2.78, rectRadius:0.12, fill:{color:CARD2}, line:{color:"2A4A6A", width:1} });
s2.addText("TARGET", { x:7.08, y:1.92, w:2, h:0.36, fontFace:BF, fontSize:13, bold:true, color:CORAL, isTextBox:true, margin:0 });
s2.addText(
  "Hold CPI near $6 in the short term; drive toward GMS target of <$3.50 as creative is optimised.\n\n" +
  "15,000+ monthly active app users by December 2026. App transactions +20% month-on-month for three consecutive months.\n\n" +
  "Install-to-registration: iOS to 25%+ (deep-link fix, month 1). Cost per new registered member: under $7 blended. " +
  "Member share of sales: above 20% through the Oct–Feb peak trading window.\n\n" +
  "Budget split: 50% acquisition (brand/reach) · 20% app install AAC · 20% member remarketing (TalkBox) · 10% hybrid LAL from member base.",
  { x:7.08, y:2.32, w:5.6, h:2.02, fontFace:BF, fontSize:11.5, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.3 }
);

// BUDGET ALLOCATION (full-width bottom)
s2.addShape("roundRect", { x:0.45, y:4.68, w:12.43, h:2.36, rectRadius:0.12, fill:{color:CARD2}, line:{color:"2A4A6A", width:1} });
s2.addText("BUDGET SPLIT", { x:0.75, y:4.85, w:3, h:0.3, fontFace:BF, fontSize:11, bold:true, color:CORAL, charSpacing:1, isTextBox:true, margin:0 });

const splits = [
  { pct:"50%", lbl:"Acquisition", sub:"Brand/reach — cold audiences\nReels + Stories" },
  { pct:"20%", lbl:"App Install AAC", sub:"Advantage+\nLAL 1-2-5% tiers" },
  { pct:"20%", lbl:"Member RTG", sub:"TalkBox → Redcat sync\nLapsed 31–180 day" },
  { pct:"10%", lbl:"Hybrid LAL", sub:"Top LTV member seed\nLookalike expansion" },
];
const bW = 12.43 / 4;
splits.forEach((sp, i) => {
  const bx = 0.45 + i * bW;
  if (i > 0) {
    s2.addShape("line", { x:bx, y:4.78, w:0, h:2.14, line:{ color:"2A4A6A", width:1 } });
  }
  s2.addShape("rect", { x:bx+0.2, y:5.52, w:bW-0.4, h:0.22, fill:{color:"1E3A52"}, line:{color:"2A4A6A", width:0} });
  const fillW = (parseInt(sp.pct) / 100) * (bW - 0.4);
  s2.addShape("rect", { x:bx+0.2, y:5.52, w:fillW, h:0.22, fill:{color:CORAL}, line:{color:CORAL, width:0} });
  s2.addText(sp.pct, { x:bx+0.1, y:5.12, w:bW-0.2, h:0.38, fontFace:HF, fontSize:22, bold:true, color:WHITE, align:"center", isTextBox:true, margin:0 });
  s2.addText(sp.lbl, { x:bx+0.1, y:4.85, w:bW-0.2, h:0.26, fontFace:BF, fontSize:10.5, bold:true, color:GREY, align:"center", isTextBox:true, margin:0 });
  s2.addText(sp.sub, { x:bx+0.1, y:5.78, w:bW-0.2, h:0.52, fontFace:BF, fontSize:9.5, color:GREY, align:"center", isTextBox:true, margin:0, lineSpacingMultiple:1.2 });
});

s2.addText("∞", { x:11.55, y:6.3, w:1.5, h:1.0, fontFace:"Arial", fontSize:58, bold:true, color:META_BLUE, align:"right", isTextBox:true, margin:0 });

p.writeFile({ fileName:"GMS_Oakberry_Meta_AppInstall_2Slides.pptx" }).then(() => console.log("done"));
