const pptxgen = require("pptxgenjs");

const NAVY = "0D1F2D", CORAL = "FF7C50", WHITE = "F7F4EF";
const MUTED = "A9B7C0", CARD = "142B3C", CARD2 = "1A3348";
const GREEN = "5FD39A", AMBER = "FFC46D";
const PG = "5FD39A", PG_BG = "0F3F2D";
const BLUE = "7EC8F5", BLUE_BG = "1E5C8A";
const GREEN2 = GREEN, GREEN_BG = "2D4A1E";
const TF = "Poppins", BF = "Poppins";
const TOTAL = 4;

function deck() {
  const p = new pptxgen();
  p.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
  p.layout = "WIDE";
  return p;
}
function bg(s) { s.background = { color: NAVY }; }
function logo(s) {
  s.addText("gms", { x:11.9, y:0.35, w:1.1, h:0.45, fontFace:TF, fontSize:16, bold:true, color:CORAL, align:"right", isTextBox:true, margin:0 });
}
function eyebrow(s, text) {
  s.addText(text.toUpperCase(), { x:0.7, y:0.52, w:9, h:0.32, fontFace:BF, fontSize:11, bold:true, color:PG, charSpacing:2, isTextBox:true, margin:0 });
}
function pgNum(s, n) {
  s.addText(String(n).padStart(2,"0"), { x:0.7, y:7.1, w:0.8, h:0.28, fontFace:BF, fontSize:10, color:MUTED, isTextBox:true, margin:0 });
}
function dots(s, active) {
  const sz=0.09, gap=0.22, sw=TOTAL*gap, sx=13.333-0.7-sw;
  for (let i=0;i<TOTAL;i++) {
    s.addShape("ellipse",{ x:sx+i*gap, y:7.15, w:sz, h:sz, fill:{color:i===active?PG:"2E4455"}, line:{type:"none"} });
  }
}
function card(s, x, y, w, h, col) {
  s.addShape("roundRect",{ x,y,w,h, rectRadius:0.08, fill:{color:col||CARD}, line:{type:"none"} });
}
function pill(s, x, y, w, h, bg2, text, col) {
  s.addShape("roundRect",{ x,y,w,h, rectRadius:h/2, fill:{color:bg2}, line:{type:"none"} });
  s.addText(text,{ x,y,w,h, fontFace:BF, fontSize:10.5, bold:true, color:col, align:"center", valign:"middle", isTextBox:true, margin:0 });
}
function hline(s, x1, y1, x2, col) {
  s.addShape("line",{ x:x1, y:y1, w:x2-x1, h:0, line:{color:col||"2E4455", width:1.2, dashType:"dash"} });
}

const p = deck();

// ── SLIDE 1: Cover ──────────────────────────────────────────────────────────
{
  const s = p.addSlide(); bg(s); logo(s);
  s.addShape("roundRect",{ x:0.65, y:2.28, w:0.06, h:2.9, rectRadius:0.03, fill:{color:PG}, line:{type:"none"} });
  s.addText("GMS × Oakberry", { x:0.9, y:2.38, w:9, h:0.52, fontFace:BF, fontSize:18, bold:true, color:MUTED, isTextBox:true, margin:0 });
  s.addText("Programmatic\nStrategy", { x:0.88, y:2.85, w:10.5, h:2.1, fontFace:TF, fontSize:58, bold:true, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.02 });
  s.addText("Powered by Blis · Location Intelligence · Rich Media Display", {
    x:0.9, y:5.02, w:10, h:0.4, fontFace:BF, fontSize:15, color:PG, italic:true, isTextBox:true, margin:0,
  });
  s.addText("Two campaigns. Three Blis audience types. App Install → Evergreen → Promo cycle.", {
    x:0.9, y:5.44, w:10.5, h:0.36, fontFace:BF, fontSize:13.5, color:MUTED, isTextBox:true, margin:0,
  });
  s.addText("Oakberry Australia · September 2026", { x:0.9, y:6.75, w:8, h:0.3, fontFace:BF, fontSize:11, color:MUTED, isTextBox:true, margin:0 });
  pgNum(s,1); dots(s,0);
}

// ── SLIDE 2: Two Campaigns → Three Blis Audience Types ──────────────────────
{
  const s = p.addSlide(); bg(s); logo(s);
  eyebrow(s, "Programmatic Campaign Architecture · Powered by Blis");
  s.addText("Two Campaigns → Three Audience Types", { x:0.65, y:1.0, w:10.5, h:0.72, fontFace:TF, fontSize:32, bold:true, color:WHITE, isTextBox:true, margin:0 });
  s.addText("Each Blis audience type feeds both campaigns — targeting method and signal quality vary by audience.", {
    x:0.65, y:1.72, w:11.5, h:0.38, fontFace:BF, fontSize:13.5, color:MUTED, isTextBox:true, margin:0,
  });

  const campX=0.65, campW=4.1;

  // App Install campaign
  card(s, campX, 2.35, campW, 2.1, CARD);
  pill(s, campX+0.25, 2.58, 2.1, 0.35, BLUE_BG, "Campaign 01 · App Install", BLUE);
  s.addText("Drive App Downloads\nvia Location Signals", { x:campX+0.25, y:3.08, w:campW-0.5, h:0.85, fontFace:TF, fontSize:18, bold:true, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.1 });
  s.addText("Incentivised offer · split URL · rich media only · device in hand = immediacy", { x:campX+0.25, y:3.98, w:campW-0.5, h:0.38, fontFace:BF, fontSize:12, color:MUTED, isTextBox:true, margin:0 });

  // Member Retargeting campaign
  card(s, campX, 4.7, campW, 2.1, CARD);
  pill(s, campX+0.25, 4.93, 2.1, 0.35, GREEN_BG, "Campaign 02 · Member Retargeting", GREEN2);
  s.addText("Re-engage Members\nby Recency & Location", { x:campX+0.25, y:5.43, w:campW-0.5, h:0.85, fontFace:TF, fontSize:18, bold:true, color:WHITE, isTextBox:true, margin:0, lineSpacingMultiple:1.1 });
  s.addText("Evergreen always-on + promo activation · dynamic creative · cycles back after each promo", { x:campX+0.25, y:6.33, w:campW-0.5, h:0.38, fontFace:BF, fontSize:12, color:MUTED, isTextBox:true, margin:0 });

  // Centre label
  s.addText("↓ by audience type", { x:5.1, y:4.3, w:2.2, h:0.38, fontFace:BF, fontSize:11, color:MUTED, italic:true, align:"center", isTextBox:true, margin:0 });

  // Three Blis audience type boxes
  const audX=8.1, audW=4.55;
  const audiences = [
    { tag:"Real-Time",   col:BLUE,  win:"In-Proximity Now",   note:"Tight store radius (≤200m) · always-on during trading hours · highest-intent signal",          ey:2.35 },
    { tag:"Historical",  col:AMBER, win:"2+ Visits / 6 Months", note:"Frequent store visitors · best install candidates · proven physical behaviour",               ey:3.95 },
    { tag:"LAM",         col:PG,    win:"Catchment · Key Periods", note:"Mornings & weekends · dynamic creative by time + location · in-catchment targeting",       ey:5.55 },
  ];
  audiences.forEach(a => {
    card(s, audX, a.ey, audW, 1.45, CARD2);
    pill(s, audX+0.25, a.ey+0.25, 1.2, 0.33, a.col === BLUE ? BLUE_BG : a.col === AMBER ? "3F2B00" : PG_BG, a.tag, a.col);
    s.addText(a.win, { x:audX+1.6, y:a.ey+0.2, w:audW-1.85, h:0.42, fontFace:TF, fontSize:15, bold:true, color:a.col, isTextBox:true, margin:0 });
    s.addText(a.note, { x:audX+0.25, y:a.ey+0.72, w:audW-0.5, h:0.62, fontFace:BF, fontSize:11.5, color:MUTED, isTextBox:true, margin:0, lineSpacingMultiple:1.2 });
  });

  // Connectors
  const midX=6.45, c1Y=3.4, c2Y=5.75;
  const audMids=[3.075, 4.675, 6.275];
  hline(s, campX+campW, c1Y, midX, BLUE_BG);
  hline(s, campX+campW, c2Y, midX, GREEN_BG);
  s.addShape("ellipse",{ x:midX-0.06, y:c1Y-0.06, w:0.12, h:0.12, fill:{color:BLUE}, line:{type:"none"} });
  s.addShape("ellipse",{ x:midX-0.06, y:c2Y-0.06, w:0.12, h:0.12, fill:{color:GREEN2}, line:{type:"none"} });
  s.addShape("line",{ x:midX, y:c1Y, w:0, h:c2Y-c1Y, line:{color:"2E4455", width:1.2, dashType:"dash"} });
  audMids.forEach(ay => {
    hline(s, midX, ay, audX, "2E4455");
    s.addShape("ellipse",{ x:midX-0.06, y:ay-0.06, w:0.12, h:0.12, fill:{color:"2E4455"}, line:{type:"none"} });
    s.addShape("ellipse",{ x:audX-0.09, y:ay-0.06, w:0.12, h:0.12, fill:{color:MUTED}, line:{type:"none"} });
  });

  pgNum(s,2); dots(s,1);
}

// ── SLIDE 3: Content & Messaging + Campaign Flow ─────────────────────────────
{
  const s = p.addSlide(); bg(s); logo(s);
  eyebrow(s, "Programmatic Content · Pre-Campaign Brief · Campaign Cycle");
  s.addText("What Goes Into Each Campaign", { x:0.65, y:1.0, w:10, h:0.68, fontFace:TF, fontSize:28, bold:true, color:WHITE, isTextBox:true, margin:0 });

  const colXs = [0.55,  2.0,    4.55,   7.1,    9.65];
  const colWs = [1.35,  2.45,   2.45,   2.45,   2.45];

  // Campaign span headers
  s.addShape("roundRect",{ x:colXs[1], y:1.85, w:colWs[1]+colWs[2]+0.08, h:0.35, rectRadius:0.06, fill:{color:BLUE_BG}, line:{type:"none"} });
  s.addText("Campaign 01 · App Install — Rich Media, Split URL, Incentivised Offer", { x:colXs[1]+0.12, y:1.85, w:colWs[1]+colWs[2]-0.05, h:0.35, fontFace:BF, fontSize:10.5, bold:true, color:BLUE, valign:"middle", isTextBox:true, margin:0 });

  s.addShape("roundRect",{ x:colXs[3], y:1.85, w:colWs[3]+colWs[4]+0.08, h:0.35, rectRadius:0.06, fill:{color:GREEN_BG}, line:{type:"none"} });
  s.addText("Campaign 02 · Member Retargeting — Evergreen → Promo → Evergreen Cycle", { x:colXs[3]+0.12, y:1.85, w:colWs[3]+colWs[4]-0.05, h:0.35, fontFace:BF, fontSize:10.5, bold:true, color:GREEN2, valign:"middle", isTextBox:true, margin:0 });

  // Sub-headers
  s.addShape("rect",{ x:0.55, y:2.2, w:11.65, h:0.34, fill:{color:CARD2}, line:{type:"none"} });
  ["Blis Audience","Messaging","Ad Format + Split URL","Messaging","Ad Format + Creative State"].forEach((h,i) => {
    s.addText(h.toUpperCase(),{ x:colXs[i]+0.12, y:2.2, w:colWs[i]-0.12, h:0.34, fontFace:BF, fontSize:8.8, bold:true, color:MUTED, charSpacing:0.8, valign:"middle", isTextBox:true, margin:0 });
  });

  const rows = [
    {
      tag:"Real-Time", tagCol:BLUE, rowH:1.28,
      c1msg:"You're right next to us. Download the app and claim your offer now. Highest urgency — device in hand.",
      c1cre:"Rich media expandable · store locator + app download CTA\nSplit URL: app open → offer · no app → App Store",
      c2msg:"You're nearby — here's what's on right now. Product + ambient. Promo triggers when activation is live.",
      c2cre:"Evergreen: product/menu dynamic · Promo: offer overlay activates on promo start, reverts same day promo ends",
    },
    {
      tag:"Historical", tagCol:AMBER, rowH:1.28,
      c1msg:"You've been in before — now get the most out of every visit. App download = exclusive access.",
      c1cre:"Rich media · loyalty benefit showcase + install CTA\nSplit URL: existing app users routed to offer, not store",
      c2msg:"Welcome back. Here's what's new since your last visit. Promo when live — deepest offer for proven visitors.",
      c2cre:"Evergreen: 'new since you last visited' product rotation\nPromo: strongest offer tier — this audience has highest ROAS potential",
    },
    {
      tag:"LAM", tagCol:PG, rowH:1.28,
      c1msg:"Good morning — Oakberry is 5 minutes away. Download the app and order ahead. Time-triggered, location-aware.",
      c1cre:"Dynamic rich media · time + location personalised headline\nSplit URL: order-ahead deep-link (app) or App Store",
      c2msg:"Morning, weekend, near you. Right message, right moment. Dynamic creative matches time of day and period.",
      c2cre:"Evergreen: dynamic time/location headline rotation\nPromo: LAM timing layer added to promo creative — morning + weekend amplified",
    },
  ];

  let y = 2.54;
  rows.forEach((row, ri) => {
    if (ri%2===0) s.addShape("rect",{ x:0.55, y, w:11.65, h:row.rowH, fill:{color:CARD}, line:{type:"none"} });
    const pillBg = row.tagCol===BLUE ? BLUE_BG : row.tagCol===AMBER ? "3F2B00" : PG_BG;
    pill(s, colXs[0]+0.1, y+(row.rowH-0.34)/2, 1.1, 0.34, pillBg, row.tag, row.tagCol);
    [null, row.c1msg, row.c1cre, row.c2msg, row.c2cre].forEach((cell,ci) => {
      if (!cell) return;
      s.addText(cell, { x:colXs[ci]+0.12, y:y+0.1, w:colWs[ci]-0.18, h:row.rowH-0.2, fontFace:BF, fontSize:11, color:MUTED, valign:"middle", isTextBox:true, margin:0, lineSpacingMultiple:1.25 });
    });
    y += row.rowH + 0.06;
  });

  // Placements strip
  const placY = y + 0.06;
  card(s, 0.55, placY, 11.65, 0.55, CARD2);
  s.addText("PLACEMENTS", { x:0.75, y:placY+0.08, w:1.4, h:0.22, fontFace:BF, fontSize:8.5, bold:true, color:MUTED, charSpacing:1, isTextBox:true, margin:0 });
  const placements = [
    { l:"Mobile In-App", col:PG },
    { l:"Mobile Web", col:PG },
    { l:"Rich Media Expandable", col:CORAL },
  ];
  const noList = ["No Desktop", "No Pre-Roll"];
  let px = 2.2;
  placements.forEach(pl => {
    card(s, px, placY+0.1, 2.1, 0.35, PG_BG);
    s.addText(pl.l, { x:px+0.1, y:placY+0.1, w:1.9, h:0.35, fontFace:BF, fontSize:11, bold:true, color:pl.col, valign:"middle", align:"center", isTextBox:true, margin:0 });
    px += 2.22;
  });
  px += 0.25;
  noList.forEach(nl => {
    s.addShape("roundRect",{ x:px, y:placY+0.1, w:1.45, h:0.35, rectRadius:0.06, fill:{color:"2E1A1A"}, line:{type:"none"} });
    s.addText(nl, { x:px, y:placY+0.1, w:1.45, h:0.35, fontFace:BF, fontSize:11, bold:true, color:"C0413A", valign:"middle", align:"center", isTextBox:true, margin:0 });
    px += 1.58;
  });

  // Campaign cycle strip at bottom
  const stripY = placY + 0.61;
  card(s, 0.55, stripY, 11.65, 0.72, CARD2);
  s.addText("CAMPAIGN 02 CYCLE", { x:0.75, y:stripY+0.06, w:1.85, h:0.24, fontFace:BF, fontSize:8.5, bold:true, color:MUTED, charSpacing:1, isTextBox:true, margin:0 });
  const states=[
    {l:"App Install",col:BLUE},
    {l:"→",col:MUTED},
    {l:"Evergreen",col:PG},
    {l:"→",col:MUTED},
    {l:"Promo Active",col:CORAL},
    {l:"→",col:MUTED},
    {l:"Evergreen",col:PG},
    {l:"→",col:MUTED},
    {l:"Promo Active",col:CORAL},
    {l:"→  …",col:MUTED},
  ];
  let sx=2.68;
  states.forEach(st => {
    const isArrow = st.l.startsWith("→");
    const sw = isArrow ? 0.38 : st.l==="Evergreen" ? 1.1 : st.l==="Promo Active" ? 1.2 : 1.1;
    s.addText(st.l, { x:sx, y:stripY+0.14, w:sw, h:0.44, fontFace:BF, fontSize:isArrow?14:12, bold:!isArrow, color:st.col, align:"center", valign:"middle", isTextBox:true, margin:0 });
    sx += sw + 0.06;
  });

  pgNum(s,3); dots(s,2);
}

// ── SLIDE 4: Tracking & Attribution ─────────────────────────────────────────
{
  const s = p.addSlide(); bg(s); logo(s);
  eyebrow(s, "Programmatic Tracking & Attribution");
  s.addText("Closing the Loop", { x:0.65, y:1.0, w:9, h:0.72, fontFace:TF, fontSize:34, bold:true, color:WHITE, isTextBox:true, margin:0 });
  s.addText("Blis confirms physical presence. TalkBox closes the CRM loop. Artiq BI validates the business outcome.", {
    x:0.65, y:1.72, w:11.2, h:0.38, fontFace:BF, fontSize:13.5, color:MUTED, isTextBox:true, margin:0,
  });

  const cards3 = [
    {
      tag:"Blis", tagBg:PG_BG, tagCol:PG,
      title:"Location Intelligence",
      pts:[
        "Confirms ad exposure happened at or near the store",
        "Store visit uplift: Blis-exposed vs. matched control group",
        "Historical audience refreshed monthly — re-pulls 2+/mo visitors",
        "LAM audience quality validation — are catchment users converting?",
        "Footfall attribution per campaign type (install vs. retargeting)",
      ],
    },
    {
      tag:"TalkBox", tagBg:BLUE_BG, tagCol:BLUE,
      title:"CRM & Audience Match",
      pts:[
        "Redcat member export → DSP custom audience onboarding",
        "Confirms match rates + segment sizes before each flight",
        "Recency bucket shifts flagged → audience refresh triggered",
        "Post-campaign: confirms member transacted after ad exposure",
        "Audience exclusions: prevent active purchasers hitting lapsed ads",
      ],
    },
    {
      tag:"Artiq BI", tagBg:"2D4A1E", tagCol:GREEN,
      title:"Business Outcomes",
      pts:[
        "ROAS by campaign state — install vs. evergreen vs. promo",
        "Visit frequency delta: target 12–14 days vs current ~17",
        "Member revenue share: target 25% vs current 19.7%",
        "App install conversion: impression → first open → first order",
        "Promo lift: revenue delta vs prior evergreen baseline",
      ],
    },
  ];

  const cw3=3.88, gap3=0.19;
  cards3.forEach((c,i) => {
    const x = 0.62 + i*(cw3+gap3);
    card(s, x, 2.32, cw3, 4.1, CARD);
    pill(s, x+0.22, 2.54, 1.4, 0.33, c.tagBg, c.tag, c.tagCol);
    s.addText(c.title, { x:x+0.22, y:3.0, w:cw3-0.44, h:0.5, fontFace:TF, fontSize:16, bold:true, color:WHITE, isTextBox:true, margin:0 });
    s.addText(c.pts.map((t,j)=>({text:t,options:{bullet:{code:"2022"},color:MUTED,breakLine:j<c.pts.length-1,paraSpaceAfter:9}})), {
      x:x+0.22, y:3.6, w:cw3-0.44, h:2.65, fontFace:BF, fontSize:12, isTextBox:true, margin:0,
    });
  });

  // Refresh cadence strip
  card(s, 0.62, 6.52, 5.9, 0.68, CARD2);
  s.addText("AUDIENCE REFRESH CADENCE", { x:0.82, y:6.55, w:2.6, h:0.24, fontFace:BF, fontSize:8.5, bold:true, color:MUTED, charSpacing:1, isTextBox:true, margin:0 });
  [["Real-Time","Always-on",BLUE],["Historical","Monthly",AMBER],["LAM","Always-on",PG]].forEach(([l,v,col],i) => {
    const rx = 3.5 + i*1.65;
    s.addText(l, { x:rx, y:6.52, w:1.5, h:0.34, fontFace:BF, fontSize:11, color:col, isTextBox:true, margin:0, valign:"bottom" });
    s.addText(v, { x:rx, y:6.85, w:1.5, h:0.28, fontFace:BF, fontSize:11, bold:true, color:WHITE, isTextBox:true, margin:0 });
  });

  // KPIs
  const kpis=[
    {l:"Reactivation ROAS", v:"≥ 20x",    s:"DSP benchmark"},
    {l:"Store Visit Uplift", v:"> 15%",    s:"Blis exposed vs control"},
    {l:"App Install CPI",    v:"< $3.50",  s:"Rich media only target"},
    {l:"Audience Refresh",   v:"< 48 hrs", s:"Redcat → DSP sync SLA"},
  ];
  kpis.forEach((kpi,i) => {
    const x = 6.82 + (i < 2 ? i*2.88 : 0);
    if (i >= 2) return; // only 2 KPIs on right side given space
    card(s, x, 6.52, 2.7, 0.68, CARD2);
    s.addText(kpi.l.toUpperCase(), { x:x+0.18, y:6.56, w:1.55, h:0.22, fontFace:BF, fontSize:8.5, bold:true, color:MUTED, charSpacing:0.7, isTextBox:true, margin:0 });
    s.addText(kpi.v, { x:x+1.75, y:6.54, w:0.78, h:0.32, fontFace:TF, fontSize:16, bold:true, color:CORAL, align:"right", isTextBox:true, margin:0 });
    s.addText(kpi.s, { x:x+0.18, y:6.78, w:2.4, h:0.22, fontFace:BF, fontSize:9.5, color:MUTED, isTextBox:true, margin:0 });
  });
  // place last 2 KPIs
  [{l:"App Install CPI",v:"< $3.50",s:"Rich media only target"},{l:"Audience Refresh",v:"< 48 hrs",s:"Redcat → DSP sync SLA"}].forEach((kpi,i) => {
    const x = 6.82 + i*2.88 + 5.76 - 5.76; // recalc
    const xx = [6.82, 9.72][i];
    card(s, xx, 6.52, 2.7, 0.68, CARD2);
    s.addText(kpi.l.toUpperCase(), { x:xx+0.18, y:6.56, w:1.55, h:0.22, fontFace:BF, fontSize:8.5, bold:true, color:MUTED, charSpacing:0.7, isTextBox:true, margin:0 });
    s.addText(kpi.v, { x:xx+1.75, y:6.54, w:0.78, h:0.32, fontFace:TF, fontSize:16, bold:true, color:CORAL, align:"right", isTextBox:true, margin:0 });
    s.addText(kpi.s, { x:xx+0.18, y:6.78, w:2.4, h:0.22, fontFace:BF, fontSize:9.5, color:MUTED, isTextBox:true, margin:0 });
  });

  pgNum(s,4); dots(s,3);
}

p.writeFile({ fileName: "GMS_Oakberry_Programmatic_v3.pptx" }).then(() => console.log("done"));
