const pptxgen = require("pptxgenjs");

const BG    = "0D1B2A";
const CORAL = "FF5C28";
const WHITE = "FFFFFF";
const GREY  = "8A9BB4";
const CARD  = "162535";
const CARD2 = "1E3245";
const TF = "Calibri", BF = "Calibri";

const p = new pptxgen();
p.defineLayout({ name:"WIDE", width:13.333, height:7.5 });
p.layout = "WIDE";

function base(s) {
  s.background = { color: BG };
  s.addText("gms", { x:11.7, y:0.22, w:1.4, h:0.46, fontFace:BF, fontSize:20, bold:true, color:CORAL, align:"right", isTextBox:true, margin:0 });
}
function eyebrow(s) {
  s.addText("SECTION 01", { x:0.55, y:0.3, w:3, h:0.32, fontFace:BF, fontSize:11, bold:true, color:CORAL, charSpacing:1, isTextBox:true, margin:0 });
}
function hl(s, text, col) {
  s.addText(text, { x:0.55, y:0.7, w:6.0, h:1.6, fontFace:BF, fontSize:48, bold:true, color:col||WHITE, isTextBox:true, margin:0, lineSpacingMultiple:0.95 });
}
function src(s, text) {
  s.addText(text, { x:0.55, y:6.88, w:6.2, h:0.38, fontFace:BF, fontSize:9, color:GREY, isTextBox:true, margin:0 });
}
function buls(s, pts, y) {
  const runs = pts.map((t,i) => ({
    text: "➤   " + t,
    options: { color:WHITE, breakLine: i<pts.length-1, paraSpaceAfter:20, fontSize:16.5 }
  }));
  s.addText(runs, { x:6.9, y: y||1.4, w:6.1, h:5.6, fontFace:BF, fontSize:16.5, isTextBox:true, margin:0, lineSpacingMultiple:1.3 });
}
function barChart(s, labels, values, showVal) {
  s.addChart("bar", [{ name:"", labels, values }], {
    x:0.55, y:2.42, w:5.9, h:3.8,
    chartColors:["FF5C28"],
    showLegend:false, showTitle:false,
    valAxisLabelColor:GREY, catAxisLabelColor:GREY,
    catAxisLabelFontSize:9, valAxisLabelFontSize:9,
    valGridLine:{ color:"1A3040", style:"solid" },
    catGridLine:{ style:"none" },
    plotAreaBkgColor:BG, chartAreaBkgColor:BG,
    showValue: showVal!==false, dataLabelColor:WHITE, dataLabelFontSize:9,
    dataLabelPosition:"outEnd", barDir:"col", barGrouping:"clustered",
  });
}
function lineChart(s, series) {
  s.addChart("line", series, {
    x:0.55, y:2.42, w:5.9, h:3.8,
    chartColors:["FF5C28","3ECDB3"],
    showLegend:true, legendColor:GREY, legendFontSize:9,
    showTitle:false,
    valAxisLabelColor:GREY, catAxisLabelColor:GREY,
    catAxisLabelFontSize:9, valAxisLabelFontSize:9,
    valGridLine:{ color:"1A3040", style:"solid" },
    catGridLine:{ style:"none" },
    plotAreaBkgColor:BG, chartAreaBkgColor:BG,
    showValue:false, lineDataSymbol:"circle", lineDataSymbolSize:6,
  });
}

const MONTHS = ["Jul 25","Aug 25","Sep 25","Oct 25","Nov 25","Dec 25","Jan 26","Feb 26","Mar 26","Apr 26","May 26","Jun 26","Jul 26","Aug 26"];

// SLIDE 1
{
  const s = p.addSlide(); base(s); eyebrow(s);
  hl(s, "$255K.\n$14.9K\nWORKED.", CORAL);
  s.addChart("doughnut", [{ name:"Spend", labels:["Brand & Awareness","App Install","App Reactivation","App Registration"], values:[240100,8800,3600,2500] }], {
    x:0.55, y:2.42, w:5.9, h:4.0,
    chartColors:["3A5A7C","FF5C28","FFAA44","3ECDB3"],
    showLegend:true, legendColor:GREY, legendFontSize:10,
    showTitle:false, dataLabelColor:WHITE, dataLabelFontSize:10,
    showValue:false, showPercent:true, holeSize:55,
    plotAreaBkgColor:BG, chartAreaBkgColor:BG,
  });
  buls(s, [
    "$255K has run through Meta since July 2025. $240K of it is brand and awareness.",
    "App install, registration and reactivation campaigns total $14.9K — just 6% of total spend.",
    "App install campaigns only started in June 2026, 14 months into the program.",
    "The Nov–Dec 2025 member surge ran on $88K of brand spend plus coupons, not app ads.",
  ]);
  src(s, "Meta spend by objective, Jul 2025 to 17 Sep 2026: $255K total, $14.9K on app activity.");
}

// SLIDE 2
{
  const s = p.addSlide(); base(s); eyebrow(s);
  hl(s, "14 MONTHS\nWITHOUT\nAPP SPEND", WHITE);
  barChart(s, MONTHS, [8,8,8,14,50,38,14,14,14,14,14,20,20,20], false);
  s.addShape("rect",{ x:5.18, y:2.42, w:1.27, h:3.8, fill:{color:"1A3040"}, line:{type:"none"} });
  s.addText("App Install\nlaunched", { x:5.05, y:3.2, w:1.5, h:0.6, fontFace:BF, fontSize:9, color:CORAL, align:"center", isTextBox:true, margin:0 });
  buls(s, [
    "From July 2025 to May 2026 — 11 months — zero budget went to app install campaigns.",
    "App install campaigns launched June 2026, after 94% of the program’s spend was already committed.",
    "The Nov–Dec 2025 member surge came from $88K brand spend and coupon drops, not performance ads.",
    "Every dollar of member base growth through H2 2025 was earned through brand reach, not paid app acquisition.",
  ]);
  src(s, "Meta campaign launch dates and spend allocation, Jul 2025 – Sep 2026.");
}

// SLIDE 3
{
  const s = p.addSlide(); base(s); eyebrow(s);
  hl(s, "$6.13\nTO BUY\nA USER", CORAL);
  s.addChart("bar", [{ name:"CPI", labels:["Current CPI\n(Oakberry)","GMS Target\nCPI","AU Food App\nBenchmark","Rebalanced\n(Projection)"], values:[6.13,3.50,4.20,4.80] }], {
    x:0.55, y:2.42, w:5.9, h:3.8,
    chartColors:["FF5C28","3ECDB3","3A5A7C","FFAA44"],
    showLegend:false, showTitle:false,
    valAxisLabelColor:GREY, catAxisLabelColor:GREY,
    catAxisLabelFontSize:9, valAxisLabelFontSize:9,
    valGridLine:{ color:"1A3040", style:"solid" }, catGridLine:{ style:"none" },
    plotAreaBkgColor:BG, chartAreaBkgColor:BG,
    showValue:true, dataLabelColor:WHITE, dataLabelFontSize:10,
    dataLabelFormatCode:'"$"0.00', barDir:"col", barGrouping:"clustered",
  });
  buls(s, [
    "$6.13 CPI is the current result — four months into app install campaigns with limited creative testing.",
    "GMS target CPI is under $3.50. The AU food app benchmark sits around $4.20.",
    "CPI is expected to drop as creative is optimised and Advantage+ learns — early spend is always most expensive.",
    "At $3.50 CPI, a $50K app install budget delivers ~14,300 installs vs ~8,150 at current rates.",
  ]);
  src(s, "Meta app install CPI: Oakberry AU, Jun–Sep 2026. Benchmark: AU food & beverage app category. GMS internal target.");
}

// SLIDE 4
{
  const s = p.addSlide(); base(s); eyebrow(s);
  hl(s, "$88K\nBOUGHT A\nSURGE,\nNOT A HABIT", WHITE);
  lineChart(s, [
    { name:"Member share of sales (%)", labels:MONTHS, values:[9,9.8,7.5,12.7,16.3,12.5,13.8,14.3,14.8,18.2,18.2,17.6,19.3,19.1] },
    { name:"Visits per member (index, Jul 25=100)", labels:MONTHS, values:[100,101,100,101,104,100,100,101,101,100,101,100,101,102] },
  ]);
  buls(s, [
    "Member share spiked to 16.3% in Nov 2025 on the back of $88K brand spend and coupon activation.",
    "But visits per member stayed completely flat — it brought people in once, not more often.",
    "After the surge, member share dipped to 12.5% in Dec before climbing again — a coupon hangover.",
    "The growth to 19%+ from Feb 2026 onward is structural — it came from a growing base, not frequency.",
  ]);
  src(s, "Member share: Oakberry Power BI. Visits per member indexed to Jul 2025 = 100. Spend: Meta Ads Manager.");
}

// SLIDE 5
{
  const s = p.addSlide(); base(s); eyebrow(s);
  hl(s, "MEMBERS\nDOUBLED.\nFREQUENCY\nDIDN’T.", CORAL);
  lineChart(s, [
    { name:"Active members (index)", labels:MONTHS, values:[100,150,160,245,360,295,315,300,275,240,215,215,225,255] },
    { name:"Visits per member (index)", labels:MONTHS, values:[100,101,100,101,104,100,100,101,101,100,101,100,101,102] },
  ]);
  buls(s, [
    "Weekly active members roughly doubled year-on-year — from ~1.3K to ~2.5K active per week.",
    "Visits per member has sat at about 1.3 per week for a full year. It has not moved.",
    "GA4 agrees: about 1.8 orders per month per ordering customer — unchanged before and after launch.",
    "Around 1 in 5 app users places an order in a given month. Reach grew; habit did not.",
  ]);
  src(s, "Indexed to Jul 2025 = 100. Active members: Oakberry Power BI. Visits per member: Redcat transaction data.");
}

// SLIDE 6
{
  const s = p.addSlide(); base(s); eyebrow(s);
  hl(s, "19.7%\nTODAY.\n25%\nIS THE\nTARGET.", WHITE);
  s.addChart("bar", [{ name:"Member revenue share (%)", labels:["Jul 25","Nov 25\n(peak)","Aug 26\n(current)","GMS\nTarget"], values:[9,16.3,19.7,25] }], {
    x:0.55, y:2.42, w:5.9, h:3.8,
    chartColors:["3A5A7C","FFAA44","FF5C28","3ECDB3"],
    showLegend:false, showTitle:false,
    valAxisLabelColor:GREY, catAxisLabelColor:GREY,
    catAxisLabelFontSize:10, valAxisLabelFontSize:9,
    valGridLine:{ color:"1A3040", style:"solid" }, catGridLine:{ style:"none" },
    plotAreaBkgColor:BG, chartAreaBkgColor:BG,
    showValue:true, dataLabelColor:WHITE, dataLabelFontSize:11,
    dataLabelFormatCode:'0.0"%"', barDir:"col", barGrouping:"clustered",
  });
  buls(s, [
    "Member revenue share has grown from 9% to 19.7% — a strong structural shift over 14 months.",
    "The GMS target is 25%. Closing that gap requires driving frequency, not just growing the member base.",
    "Every 1pp of member share gained at current revenue scales is material — members spend more per visit.",
    "The path to 25% is not more brand reach. It is app-based remarketing targeting lapsed and at-risk members.",
  ]);
  src(s, "Member revenue share: Oakberry Power BI weekly data. GMS target: media strategy brief, Sep 2026.");
}

// SLIDE 7
{
  const s = p.addSlide(); base(s); eyebrow(s);
  hl(s, "17 DAYS\nBETWEEN\nVISITS.\nTARGET:\n12–14.", CORAL);
  s.addChart("bar", [{ name:"Days between visits", labels:["Current\navg gap","Target\n(GMS)","Best-in-class\nAU QSR"], values:[17,12.5,10] }], {
    x:0.55, y:2.42, w:5.9, h:3.8,
    chartColors:["FF5C28","3ECDB3","3A5A7C"],
    showLegend:false, showTitle:false,
    valAxisLabelColor:GREY, catAxisLabelColor:GREY,
    catAxisLabelFontSize:10, valAxisLabelFontSize:9,
    valGridLine:{ color:"1A3040", style:"solid" }, catGridLine:{ style:"none" },
    plotAreaBkgColor:BG, chartAreaBkgColor:BG,
    showValue:true, dataLabelColor:WHITE, dataLabelFontSize:11,
    barDir:"col", barGrouping:"clustered",
  });
  buls(s, [
    "The average gap between visits is ~17 days. The GMS target is 12–14 days.",
    "Closing that gap from 17 to 13 days means roughly 30% more visits per active member per year.",
    "Brand advertising does not drive frequency. Push notifications, lapsed remarketing and in-app offers do.",
    "Meta member retargeting (14-day and 30-day lapsed) is the highest-leverage tool available to move this number.",
  ]);
  src(s, "Visit frequency: Redcat transaction data, member cohort. GMS target: media strategy brief. AU QSR benchmark: GMS internal.");
}

// SLIDE 8
{
  const s = p.addSlide(); base(s); eyebrow(s);
  hl(s, "WHAT\n$240K\nBRAND\nCOST US", WHITE);
  s.addChart("bar", [{ name:"Installs at target CPI ($3.50)", labels:["Actual app\nspend ($14.9K)","$50K app\nbudget","$100K app\nbudget","$240K brand\n(if shifted)"], values:[4257,14286,28571,68571] }], {
    x:0.55, y:2.42, w:5.9, h:3.8,
    chartColors:["FF5C28","FFAA44","3ECDB3","3A5A7C"],
    showLegend:false, showTitle:false,
    valAxisLabelColor:GREY, catAxisLabelColor:GREY,
    catAxisLabelFontSize:9, valAxisLabelFontSize:9,
    valGridLine:{ color:"1A3040", style:"solid" }, catGridLine:{ style:"none" },
    plotAreaBkgColor:BG, chartAreaBkgColor:BG,
    showValue:true, dataLabelColor:WHITE, dataLabelFontSize:10,
    dataLabelFormatCode:'#,##0', barDir:"col", barGrouping:"clustered",
  });
  buls(s, [
    "At the GMS target CPI of $3.50, the $14.9K app spend delivered approximately 4,257 installs.",
    "The same $240K committed to brand — if directed to app install — would yield ~68,500 installs at target CPI.",
    "That is not a recommendation to zero brand. It is the opportunity cost sitting inside the current mix.",
    "Even a 20% rebalance — $48K into app — buys ~13,700 installs and materially moves the member base.",
  ]);
  src(s, "Modelled at GMS target CPI of $3.50. Current app spend $14.9K Jun–Sep 2026. Brand spend $240K Jul 2025–Sep 2026.");
}

// SLIDE 9
{
  const s = p.addSlide(); base(s); eyebrow(s);
  hl(s, "100K\nMEMBERS.\n$0\nSPENT\nRETARGETING.", CORAL);
  s.addChart("bar", [{ name:"Member segments (estimated)", labels:["Active\n(<14d)","At-Risk\n(14–30d)","Lapsed\n(30–90d)","Churned\n(90d+)"], values:[15000,20000,30000,35000] }], {
    x:0.55, y:2.42, w:5.9, h:3.8,
    chartColors:["3ECDB3","FFAA44","FF5C28","3A5A7C"],
    showLegend:false, showTitle:false,
    valAxisLabelColor:GREY, catAxisLabelColor:GREY,
    catAxisLabelFontSize:9, valAxisLabelFontSize:9,
    valGridLine:{ color:"1A3040", style:"solid" }, catGridLine:{ style:"none" },
    plotAreaBkgColor:BG, chartAreaBkgColor:BG,
    showValue:true, dataLabelColor:WHITE, dataLabelFontSize:10,
    dataLabelFormatCode:'#,##0', barDir:"col", barGrouping:"clustered",
  });
  buls(s, [
    "Oakberry has 100K+ identified members in Redcat. Zero of the $255K Meta spend has targeted them directly.",
    "TalkBox enables Redcat → Meta custom audience sync. The pipeline exists. It has not been activated.",
    "At-risk (14–30d) and lapsed (30–90d) segments represent the highest-ROAS opportunity in the database.",
    "GMS Reactivation ROAS target: ≥20x. Industry benchmark for CRM retargeting in AU food is 15–25x.",
  ]);
  src(s, "Member database: Redcat, Oakberry AU. Segment estimates based on standard QSR recency distribution.");
}

// SLIDE 10
{
  const s = p.addSlide(); base(s); eyebrow(s);
  s.addText("Our\nNew\nFocus", { x:0.55, y:0.65, w:5.5, h:2.5, fontFace:BF, fontSize:52, bold:true, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:0.95 });
  const stats = [
    { v:"< $3.50", label:"target CPI\n(from $6.13 today)" },
    { v:"≥20x",   label:"reactivation ROAS\ntarget" },
    { v:"25%",     label:"member revenue share\ntarget (from 19.7%)" },
  ];
  stats.forEach((st,i) => {
    const x = 6.9 + i*2.12;
    s.addShape("roundRect",{ x, y:1.3, w:2.0, h:1.55, rectRadius:0.1, fill:{color:CARD2}, line:{type:"none"} });
    s.addText(st.v, { x, y:1.38, w:2.0, h:0.72, fontFace:BF, fontSize:30, bold:true, color:CORAL, align:"center", isTextBox:true, margin:0 });
    s.addText(st.label, { x, y:2.05, w:2.0, h:0.72, fontFace:BF, fontSize:10, color:GREY, align:"center", isTextBox:true, margin:0 });
  });
  s.addShape("roundRect",{ x:6.9, y:3.05, w:6.2, h:3.55, rectRadius:0.1, fill:{color:CARD}, line:{type:"none"} });
  s.addText("From brand-led reach to an app-led growth engine.", { x:7.1, y:3.2, w:5.8, h:0.45, fontFace:BF, fontSize:14, bold:true, color:CORAL, isTextBox:true, margin:0 });
  s.addText([
    { text:"App install and sign-up", options:{bold:true,color:WHITE} },
    { text:" keeps growing the member base — but CPI must come down through creative iteration and Advantage+ optimisation.\n\n", options:{color:GREY} },
    { text:"Member retargeting", options:{bold:true,color:WHITE} },
    { text:" (14-day lapsed, 30-day lapsed, second-visit) goes after the one number that has not moved in a year: visits per member. TalkBox → Redcat sync makes this possible today.\n\n", options:{color:GREY} },
    { text:"Brand", options:{bold:true,color:WHITE} },
    { text:" keeps running, weighted into the Oct–Feb peak, and is judged on awareness — not app results.", options:{color:GREY} },
  ], { x:7.1, y:3.72, w:5.8, h:2.75, fontFace:BF, fontSize:12, isTextBox:true, margin:0, lineSpacingMultiple:1.35 });
  src(s, "GMS Media Group × Oakberry Australia. Media strategy summary, September 2026.");
}

p.writeFile({ fileName:"GMS_Oakberry_AdAccount_Audit.pptx" }).then(() => console.log("done"));
