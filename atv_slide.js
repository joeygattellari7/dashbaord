const pptxgen = require("pptxgenjs");

const BG    = "0B1929";
const CARD  = "0F2236";
const WHITE = "FFFFFF";
const GREY  = "7A8FA8";
const CORAL = "E8541C";
const MUTED = "1E3A55";
const PP    = "Poppins";

const p = new pptxgen();
p.defineLayout({ name:"WIDE", width:13.333, height:7.5 });
p.layout = "WIDE";

const s = p.addSlide();
s.background = { color: BG };

// gms logo
s.addText("gms", { x:11.9, y:0.18, w:1.2, h:0.38, fontFace:PP, fontSize:16, bold:true, color:CORAL, align:"right", isTextBox:true, margin:0 });

// Section label
s.addText("SECTION 04", { x:0.5, y:0.22, w:4, h:0.26, fontFace:PP, fontSize:10, bold:true, color:CORAL, charSpacing:1.5, isTextBox:true, margin:0 });

// Headline
s.addText("ADS DRIVE VOLUME,\nNOT SPEND SIZE.", { x:0.5, y:0.55, w:12, h:1.2, fontFace:PP, fontSize:42, bold:true, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.05 });

// Divider line
s.addShape(p.ShapeType.rect, { x:0.5, y:1.9, w:12.3, h:0.04, fill:{ color:MUTED }, line:{ color:MUTED } });

// ── LEFT card — ad-exposed ──
s.addShape(p.ShapeType.roundRect, { x:0.55, y:2.1, w:5.5, h:4.7, fill:{ color:CARD }, line:{ color:CARD }, rectRadius:0.12 });
s.addText("AD-EXPOSED", { x:0.55, y:2.32, w:5.5, h:0.28, fontFace:PP, fontSize:11, bold:true, color:GREY, align:"center", isTextBox:true, margin:0 });
s.addText("346", { x:0.55, y:2.65, w:5.5, h:1.1, fontFace:PP, fontSize:80, bold:true, color:CORAL, align:"center", isTextBox:true, margin:0 });
s.addText("MEMBERS RETURNED", { x:0.55, y:3.82, w:5.5, h:0.28, fontFace:PP, fontSize:10, color:GREY, align:"center", isTextBox:true, margin:0 });
s.addShape(p.ShapeType.rect, { x:1.3, y:4.28, w:4.0, h:0.03, fill:{ color:MUTED }, line:{ color:MUTED } });
s.addText("$28.67 ATV", { x:0.55, y:4.42, w:5.5, h:0.32, fontFace:PP, fontSize:14, bold:true, color:WHITE, align:"center", isTextBox:true, margin:0 });
s.addText("AUGUST 2026", { x:0.55, y:4.85, w:5.5, h:0.26, fontFace:PP, fontSize:10, bold:true, color:CORAL, align:"center", isTextBox:true, margin:0 });

// ── RIGHT card — holdout ──
s.addShape(p.ShapeType.roundRect, { x:7.28, y:2.1, w:5.5, h:4.7, fill:{ color:CARD }, line:{ color:CARD }, rectRadius:0.12 });
s.addText("HOLDOUT GROUP", { x:7.28, y:2.32, w:5.5, h:0.28, fontFace:PP, fontSize:11, bold:true, color:GREY, align:"center", isTextBox:true, margin:0 });
s.addText("49", { x:7.28, y:2.65, w:5.5, h:1.1, fontFace:PP, fontSize:80, bold:true, color:WHITE, align:"center", isTextBox:true, margin:0 });
s.addText("MEMBERS RETURNED", { x:7.28, y:3.82, w:5.5, h:0.28, fontFace:PP, fontSize:10, color:GREY, align:"center", isTextBox:true, margin:0 });
s.addShape(p.ShapeType.rect, { x:8.03, y:4.28, w:4.0, h:0.03, fill:{ color:MUTED }, line:{ color:MUTED } });
s.addText("$29.93 ATV", { x:7.28, y:4.42, w:5.5, h:0.32, fontFace:PP, fontSize:14, bold:true, color:WHITE, align:"center", isTextBox:true, margin:0 });
s.addText("AUGUST 2026", { x:7.28, y:4.85, w:5.5, h:0.26, fontFace:PP, fontSize:10, bold:true, color:CORAL, align:"center", isTextBox:true, margin:0 });

// ── VS badge ──
s.addShape(p.ShapeType.ellipse, { x:5.92, y:3.3, w:1.5, h:1.5, fill:{ color:BG }, line:{ color:CORAL, width:2 } });
s.addText("VS", { x:5.92, y:3.3, w:1.5, h:1.5, fontFace:PP, fontSize:22, bold:true, color:CORAL, align:"center", valign:"middle", isTextBox:true, margin:0 });

// ── Bottom callout ──
s.addText("7× MORE MEMBERS RETURNED  ·  ATV NEARLY IDENTICAL", { x:0.5, y:6.98, w:12.3, h:0.35, fontFace:PP, fontSize:13, bold:true, color:CORAL, align:"center", isTextBox:true, margin:0 });
s.addText("Ads drove the decision to return — not basket size.", { x:0.5, y:6.58, w:12.3, h:0.3, fontFace:PP, fontSize:13, color:WHITE, align:"center", isTextBox:true, margin:0 });

// Source note
s.addText("ATV measured via Meta holdout methodology. Source: Meta Ads Manager & Redcat.", { x:0.5, y:7.22, w:11, h:0.22, fontFace:PP, fontSize:7.5, color:"3A5A70", isTextBox:true, margin:0 });

p.writeFile({ fileName:"GMS_Oakberry_ATV_Slide.pptx" }).then(() => console.log("done"));
