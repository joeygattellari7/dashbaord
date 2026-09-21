const pptxgen = require("pptxgenjs");

const BG    = "0D1B2A";
const CORAL = "E8541C";
const WHITE = "FFFFFF";
const GREY  = "7A8FA8";
const CARD  = "162535";
const CARD2 = "1C2F42";
const HF = "Arial Black";
const BF = "Calibri";

const p = new pptxgen();
p.defineLayout({ name:"WIDE", width:13.333, height:7.5 });
p.layout = "WIDE";
// see file for full slide definitions
p.writeFile({ fileName:"GMS_Oakberry_Reactivation_Audit.pptx" }).then(() => console.log("done"));
