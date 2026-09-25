const pptxgen = require("pptxgenjs");

const BG    = "0B1929";
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
s.addText("SECTION 01", { x:0.5, y:0.22, w:4, h:0.26, fontFace:PP, fontSize:10, bold:true, color:CORAL, charSpacing:1.5, isTextBox:true, margin:0 });

// Big headline left
s.addText("$2,814 IN.\n$58,587 BACK.", { x:0.5, y:0.55, w:5.8, h:1.4, fontFace:PP, fontSize:42, bold:true, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.05 });

// Chart — grouped bar: Spend vs Revenue, Jul & Aug
s.addChart(p.ChartType.bar, [
  {
    name: "Spend",
    labels: ["Jul 26", "Aug 26"],
    values: [1595, 1219],
  },
  {
    name: "Revenue Returned",
    labels: ["Jul 26", "Aug 26"],
    values: [16013, 42574],
  },
], {
  x: 0.4, y: 2.08, w: 6.2, h: 4.9,
  barDir: "col",
  barGrouping: "clustered",
  chartColors: [MUTED, CORAL],
  chartColorsOpacity: 100,
  showLegend: true,
  legendPos: "t",
  legendFontSize: 10,
  legendColor: GREY,
  showTitle: false,
  showValue: true,
  dataLabelColor: WHITE,
  dataLabelFontSize: 10,
  dataLabelFontBold: true,
  dataLabelPosition: "outEnd",
  valAxisLabelColor: GREY,
  valAxisLabelFontSize: 9,
  catAxisLabelColor: GREY,
  catAxisLabelFontSize: 11,
  catAxisLabelFontBold: true,
  valGridLine: { color: "1A3A55", size: 1 },
  catGridLine: { style: "none" },
  valAxisLineShow: false,
  catAxisLineShow: false,
  plotAreaFillColor: BG,
  chartAreaFillColor: BG,
  chartAreaBorderColor: BG,
  plotAreaBorderColor: BG,
});

// ROAS callout labels
s.addText("ROAS 10.04×", { x:1.05, y:4.95, w:1.6, h:0.3, fontFace:PP, fontSize:9, bold:true, color:CORAL, align:"center", isTextBox:true, margin:0 });
s.addText("ROAS 34.93×", { x:3.5, y:3.15, w:1.6, h:0.3, fontFace:PP, fontSize:9, bold:true, color:CORAL, align:"center", isTextBox:true, margin:0 });

// Right side — bullet points
const bullets = [
  "Last two months of reactivation campaigns. Total spend: $2,814. Total revenue returned: $58,587.",
  "July: $1,595 spent, $16,013 in member revenue. ROAS 10.04×.",
  "August: $1,219 spent, $42,574 in member revenue. ROAS 34.93×.",
  "ROAS nearly tripled month-on-month as the methodology matured and the audience warmed.",
];

bullets.forEach((b, i) => {
  s.addText("➤", { x:6.9, y:1.7 + i*1.22, w:0.38, h:0.38, fontFace:"Arial", fontSize:18, color:CORAL, isTextBox:true, margin:0 });
  s.addText(b, { x:7.38, y:1.65 + i*1.22, w:5.6, h:1.1, fontFace:PP, fontSize:13, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.4 });
});

// Source note
s.addText("Member revenue attributed to reactivation campaigns via Meta holdout methodology. Source: Meta Ads Manager & Redcat.", {
  x:0.5, y:7.22, w:9, h:0.22, fontFace:PP, fontSize:7.5, color:"3A5A70", isTextBox:true, margin:0
});

p.writeFile({ fileName:"GMS_Oakberry_ROAS_Slide.pptx" }).then(() => console.log("done"));
