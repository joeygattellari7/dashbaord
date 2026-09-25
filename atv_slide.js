const pptxgen = require("pptxgenjs");
const path = require("path");

const BG   = "0B1929";
const PP   = "Poppins";
const CORAL = "E8541C";

const p = new pptxgen();
p.defineLayout({ name:"WIDE", width:13.333, height:7.5 });
p.layout = "WIDE";

const s = p.addSlide();
s.background = { color: BG };

// gms logo
s.addText("gms", { x:11.9, y:0.18, w:1.2, h:0.38, fontFace:PP, fontSize:16, bold:true, color:CORAL, align:"right", isTextBox:true, margin:0 });

// embed the graphic — centred, full height minus margins
s.addImage({ path: path.join(__dirname, "atv_graphic.png"), x:0.5, y:0.3, w:12.333, h:6.9 });

p.writeFile({ fileName:"GMS_Oakberry_ATV_Slide.pptx" }).then(() => console.log("done"));
