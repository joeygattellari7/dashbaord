const pptxgen = require("pptxgenjs");

const BG    = "0D1B2A";
const CORAL = "E8541C";
const WHITE = "FFFFFF";
const GREY  = "8A9BB4";
const CARD  = "162535";
const DARK  = "0A1520";
const GREEN = "4ECB71";
const META  = "0082FB";
const HF    = "Arial Black";
const BF    = "Calibri";

const p = new pptxgen();
p.defineLayout({ name:"WIDE", width:13.333, height:7.5 });
p.layout = "WIDE";

const s1 = p.addSlide();
s1.background = { color: BG };

s1.addText("gms", { x:11.8, y:0.22, w:1.3, h:0.38, fontFace:HF, fontSize:16, color:CORAL, align:"right", isTextBox:true, margin:0 });
s1.addText("META APP INSTALL  ·  WHERE WE ARE", { x:0.5, y:0.3, w:5.4, h:0.3, fontFace:BF, fontSize:9.5, bold:true, color:CORAL, charSpacing:1.5, isTextBox:true, margin:0 });
s1.addText("7×", { x:0.5, y:0.7, w:5.4, h:2.1, fontFace:HF, fontSize:110, bold:true, color:WHITE, isTextBox:true, margin:0 });
s1.addText("more likely to\ntransact with ads", { x:0.5, y:2.75, w:4.6, h:0.9, fontFace:BF, fontSize:18, color:GREY, isTextBox:true, margin:0, lineSpacingMultiple:1.3 });
s1.addText("56.8% conversion vs 8.05% organic\nJuly + August holdout test — confirmed", { x:0.5, y:3.72, w:4.8, h:0.65, fontFace:BF, fontSize:11, color:GREY, isTextBox:true, margin:0, lineSpacingMultiple:1.35 });

const tiles1 = [
  { val:"$6.13", lbl:"Current CPI", color:CORAL },
  { val:"13K",   lbl:"Monthly Active Users", color:WHITE },
  { val:"+42%",  lbl:"App Txns YoY (Aug)", color:GREEN },
];
tiles1.forEach((t, i) => {
  const tx = 0.5 + i * 1.75;
  s1.addShape("RECTANGLE", { x:tx, y:4.55, w:1.6, h:1.25, fill:{color:CARD}, line:{color:"1E3A52", width:1} });
  s1.addText(t.val, { x:tx+0.1, y:4.65, w:1.4, h:0.6, fontFace:HF, fontSize:28, bold:true, color:t.color, align:"center", isTextBox:true, margin:0 });
  s1.addText(t.lbl, { x:tx+0.1, y:5.22, w:1.4, h:0.44, fontFace:BF, fontSize:9, color:GREY, align:"center", isTextBox:true, margin:0, lineSpacingMultiple:1.2 });
});

const tiles2 = [
  { val:"18.7%", lbl:"iOS Reg Rate", color:CORAL },
  { val:"63.6%", lbl:"Android Reg Rate", color:WHITE },
  { val:"34.9×", lbl:"Reactivation ROAS", color:GREEN },
];
tiles2.forEach((t, i) => {
  const tx = 0.5 + i * 1.75;
  s1.addShape("RECTANGLE", { x:tx, y:5.92, w:1.6, h:1.25, fill:{color:CARD}, line:{color:"1E3A52", width:1} });
  s1.addText(t.val, { x:tx+0.1, y:6.02, w:1.4, h:0.58, fontFace:HF, fontSize:26, bold:true, color:t.color, align:"center", isTextBox:true, margin:0 });
  s1.addText(t.lbl, { x:tx+0.1, y:6.58, w:1.4, h:0.44, fontFace:BF, fontSize:9, color:GREY, align:"center", isTextBox:true, margin:0, lineSpacingMultiple:1.2 });
});

s1.addShape("line", { x:5.85, y:0.28, w:0, h:7.0, line:{ color:"1E3A52", width:1 } });

s1.addText("AUDIENCE INTEL", { x:6.1, y:0.3, w:6.9, h:0.3, fontFace:BF, fontSize:9.5, bold:true, color:CORAL, charSpacing:1.5, isTextBox:true, margin:0 });

const rows = [
  { stat:"74% Female",       body:"Skews 25–34 on Meta. Youngest cohort (18–24) cheaper to reach on TikTok. Target F25-34 for Meta install campaigns." },
  { stat:"NSW + QLD = 74%",  body:"Of current reach. Geo-weight audiences to store catchments — national targeting dilutes spend on unreachable postcodes." },
  { stat:"Top 5% LTV Seed",  body:"Lookalike built from Redcat member export. Only 1% LAL tier active. 2% and 5% tiers untested — cost per install expected to drop as tiers expand." },
  { stat:"No RTG Layer Yet", body:"Zero retargeting running. TalkBox → Redcat sync ready to activate. Lapsed 31–180 day segment proven at 10–35× ROAS — same audience, app objective." },
];
rows.forEach((r, i) => {
  const ry = 0.75 + i * 1.63;
  s1.addText(r.stat, { x:6.1, y:ry, w:6.9, h:0.38, fontFace:HF, fontSize:18, bold:true, color:WHITE, isTextBox:true, margin:0 });
  s1.addText(r.body, { x:6.1, y:ry+0.42, w:6.9, h:0.85, fontFace:BF, fontSize:11.5, color:GREY, isTextBox:true, margin:0, lineSpacingMultiple:1.35 });
  if (i < rows.length - 1) {
    s1.addShape("line", { x:6.1, y:ry+1.44, w:6.9, h:0, line:{ color:"1E3A52", width:1 } });
  }
});

s1.addText("∞", { x:5.0, y:6.4, w:0.9, h:0.9, fontFace:"Arial", fontSize:44, bold:true, color:META, align:"center", isTextBox:true, margin:0 });

const s2 = p.addSlide();
s2.background = { color: BG };

s2.addText("gms", { x:11.8, y:0.22, w:1.3, h:0.38, fontFace:HF, fontSize:16, color:CORAL, align:"right", isTextBox:true, margin:0 });
s2.addText("META APP INSTALL  ·  STRATEGY", { x:0.5, y:0.3, w:8, h:0.3, fontFace:BF, fontSize:9.5, bold:true, color:CORAL, charSpacing:1.5, isTextBox:true, margin:0 });
s2.addText("Three moves.\nOne objective.", { x:0.5, y:0.68, w:5.5, h:1.5, fontFace:HF, fontSize:48, bold:true, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.05 });
s2.addText("Drive installs → registrations → first transactions → frequency", { x:0.5, y:2.25, w:7, h:0.36, fontFace:BF, fontSize:13, color:GREY, isTextBox:true, margin:0 });

const pillars = [
  { num:"01", title:"Fix the leak", body:"iOS deep-link gap is losing 45% of installs before registration. Fix first — no spend increase until this is resolved. Lifts iOS reg rate from 18.7% to Android benchmark (63%+).", kpi:"iOS reg to 25%+ · Month 1" },
  { num:"02", title:"Scale creative", body:"Advantage+ compresses CPI as it gets more signal. Current creative library is too thin. Minimum 3 variants per ad set — Reels UGC, stamp-card loyalty, seasonal summer hook.", kpi:"Target CPI <$3.50 · 6 months" },
  { num:"03", title:"Layer retargeting", body:"TalkBox → Redcat sync activates lapsed 31–180 day members against the app objective. Same audience already proven at 10–35× ROAS on reactivation campaigns.", kpi:"15K MAUs by Dec 2026" },
];
pillars.forEach((pl, i) => {
  const px = 0.5 + i * 4.25;
  s2.addShape("RECTANGLE", { x:px, y:2.78, w:4.0, h:3.5, fill:{color:CARD}, line:{color:"1E3A52", width:1} });
  s2.addText(pl.num, { x:px+0.22, y:2.92, w:1.0, h:0.5, fontFace:HF, fontSize:22, bold:true, color:CORAL, isTextBox:true, margin:0 });
  s2.addText(pl.title, { x:px+0.22, y:3.38, w:3.6, h:0.5, fontFace:HF, fontSize:18, bold:true, color:WHITE, isTextBox:true, margin:0 });
  s2.addText(pl.body, { x:px+0.22, y:3.92, w:3.6, h:1.55, fontFace:BF, fontSize:11, color:GREY, isTextBox:true, margin:0, lineSpacingMultiple:1.4 });
  s2.addShape("RECTANGLE", { x:px+0.22, y:5.6, w:3.56, h:0.42, fill:{color:DARK}, line:{color:CORAL, width:1} });
  s2.addText(pl.kpi, { x:px+0.22, y:5.62, w:3.56, h:0.38, fontFace:BF, fontSize:10, bold:true, color:CORAL, align:"center", isTextBox:true, margin:0 });
});

s2.addText("BUDGET SPLIT", { x:0.5, y:6.42, w:2, h:0.24, fontFace:BF, fontSize:8.5, bold:true, color:GREY, charSpacing:1.5, isTextBox:true, margin:0 });
const budgets = [
  { pct:50, lbl:"Acquisition", color:CORAL },
  { pct:20, lbl:"App Install AAC", color:"1A7CC7" },
  { pct:20, lbl:"Member RTG", color:"2A9D6F" },
  { pct:10, lbl:"Hybrid LAL", color:"7B5EA7" },
];
const barW = 12.35;
const barX = 0.5;
const barY = 6.72;
let cx = barX;
budgets.forEach(b => {
  const w = (b.pct / 100) * barW;
  s2.addShape("RECTANGLE", { x:cx, y:barY, w:w, h:0.32, fill:{color:b.color}, line:{color:b.color, width:0} });
  cx += w;
});
cx = barX;
budgets.forEach(b => {
  const w = (b.pct / 100) * barW;
  s2.addText(`${b.pct}%  ${b.lbl}`, { x:cx, y:barY+0.38, w:w, h:0.24, fontFace:BF, fontSize:8.5, color:GREY, isTextBox:true, margin:0 });
  cx += w;
});

s2.addText("∞", { x:12.2, y:2.5, w:0.9, h:0.9, fontFace:"Arial", fontSize:44, bold:true, color:META, align:"center", isTextBox:true, margin:0 });

p.writeFile({ fileName:"GMS_Oakberry_Meta_Install_Power.pptx" }).then(() => console.log("done"));
