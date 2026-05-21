/**
 * extract-momentum-v2.mjs — PDF extraction using pdf-parse v2 API
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const PDF_PATH = "C:\\Users\\Kevan\\OneDrive - FTH Trading\\11-Downloads\\momentum.pdf";
const OUT_RAW = resolve(repoRoot, "docs/troptions/momentum/extracted/raw.txt");
const OUT_FULL = resolve(repoRoot, "docs/troptions/momentum/extracted/momentum-full-text.md");
const OUT_INDEX = resolve(repoRoot, "docs/troptions/momentum/extracted/momentum-page-index.json");

const mod = require("./node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs");
console.log("PDFParse type:", typeof mod.PDFParse);

const buf = readFileSync(PDF_PATH);
const parser = new mod.PDFParse();

const result = await parser.parse(buf);
console.log("Type of result:", typeof result);
console.log("Result keys:", Object.keys(result || {}));

if (result && result.pages) {
  const text = result.pages.map((pg) => pg.content || "").join("\n\n--- PAGE BREAK ---\n\n");
  writeFileSync(OUT_RAW, text);
  console.log("Pages:", result.pages.length, "chars:", text.length);
  process.exit(0);
}
console.log("Result:", JSON.stringify(result)?.substring(0, 500));
