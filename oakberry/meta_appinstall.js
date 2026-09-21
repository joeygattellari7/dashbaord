const pptxgen = require("pptxgenjs");

const BG    = "0D1B2A";
const CORAL = "E8541C";
const WHITE = "FFFFFF";
const GREY  = "8A9BB4";
const CARD  = "162535";
const CARD2 = "1A2E42";
const META_BLUE = "0082FB";
const HF = "Arial Black";
const BF = "Calibri";

const p = new pptxgen();
p.defineLayout({ name:"WIDE", width:13.333, height:7.5 });
p.layout = "WIDE";

const s = p.addSlide();
s.background = { color: BG };

s.addText("gms", { x:11.6, y:0.2, w:1.5, h:0.5, fontFace:HF, fontSize:18, color:CORAL, align:"right", isTextBox:true, margin:0 });
s.addText("SECTION 02", { x:0.55, y:0.28, w:3, h:0.32, fontFace:BF, fontSize:11, bold:true, color:CORAL, charSpacing:1, isTextBox:true, margin:0 });
s.addText("META – APP INSTALL", { x:0.55, y:0.65, w:10, h:0.82, fontFace:HF, fontSize:42, bold:true, color:WHITE, isTextBox:true, margin:0 });
s.addShape("line", { x:0.55, y:1.56, w:5.5, h:0, line:{ color:"2A4A6A", width:2, dashType:"sysDot" } });

s.addShape("roundRect", { x:0.45, y:1.72, w:6.1, h:2.78, rectRadius:0.12, fill:{color:CARD2}, line:{color:"2A4A6A", width:1} });
s.addText("NOW", { x:0.75, y:1.92, w:2, h:0.36, fontFace:BF, fontSize:13, bold:true, color:CORAL, isTextBox:true, margin:0 });
s.addText(
  "$240K of $255K has gone to brand since Jul 2025. App activity is 6% of spend and only since June 2026.\n\n" +
  "App install campaigns launched via Advantage+ (AAC) with Reels + Stories video-first creative. CPI is currently $6.13 — four months in, limited creative testing to date.\n\n" +
  "Lookalike audiences built from top 5% member LTV via Redcat export. Audience is cold — no retargeting layer yet.",
  { x:0.75, y:2.32, w:5.6, h:2.02, fontFace:BF, fontSize:12, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.3 }
);

s.addShape("roundRect", { x:6.78, y:1.72, w:6.1, h:2.78, rectRadius:0.12, fill:{color:CARD2}, line:{color:"2A4A6A", width:1} });
s.addText("NEXT", { x:7.08, y:1.92, w:2, h:0.36, fontFace:BF, fontSize:13, bold:true, color:CORAL, isTextBox:true, margin:0 });
s.addText(
  "Drive new app installs and signups, then first-time activations, before pivoting to lifecycle activation and member visit frequency lift.\n\n" +
  "Scale Advantage+ as the creative library grows — CPI is expected to drop materially as the algorithm learns. Test 1%, 2%, and 5% LAL tiers from top LTV members.\n\n" +
  "Layer member retargeting (TalkBox → Redcat sync) alongside install campaigns once install base reaches critical mass.",
  { x:7.08, y:2.32, w:5.6, h:2.02, fontFace:BF, fontSize:12, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.3 }
);

s.addShape("roundRect", { x:0.45, y:4.68, w:12.43, h:2.36, rectRadius:0.12, fill:{color:CARD2}, line:{color:"2A4A6A", width:1} });
s.addText("TARGET", { x:0.75, y:4.85, w:2, h:0.36, fontFace:BF, fontSize:13, bold:true, color:CORAL, isTextBox:true, margin:0 });
s.addText(
  "Hold cost per install near $6 in the short term; drive toward GMS target of <$3.50 as creative is optimised. Cost per new member: under $7. Member share of sales: above 20% through the Oct–Feb peak.\n\n" +
  "Budget split: 50% acquisition (brand/reach), 20% app install (AAC), 20% member remarketing (TalkBox), 10% hybrid (lookalike from member base).",
  { x:0.75, y:5.26, w:11.3, h:1.65, fontFace:BF, fontSize:12.5, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.3 }
);

s.addText("∞", { x:11.55, y:6.3, w:1.5, h:1.0, fontFace:"Arial", fontSize:58, bold:true, color:META_BLUE, align:"right", isTextBox:true, margin:0 });

p.writeFile({ fileName:"GMS_Oakberry_Meta_AppInstall_Slide.pptx" }).then(() => console.log("done"));
