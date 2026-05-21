/**
 * extract-momentum-pdf.mjs
 *
 * Extracts text from the legacy momentum.pdf and writes structured output
 * into docs/troptions/momentum/extracted/.
 *
 * SAFETY: Read-only operation. No blockchain execution, no payments, no asset issuance.
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const SRC_PDF = "C:\\Users\\Kevan\\OneDrive - FTH Trading\\11-Downloads\\momentum.pdf";
const DEST_PDF = resolve(repoRoot, "docs/troptions/momentum/original-momentum.pdf");
const OUT_TEXT = resolve(repoRoot, "docs/troptions/momentum/extracted/momentum-full-text.md");
const OUT_INDEX = resolve(repoRoot, "docs/troptions/momentum/extracted/momentum-page-index.json");
const OUT_NOTES = resolve(repoRoot, "docs/troptions/momentum/extracted/momentum-extraction-notes.md");

console.log("=== Troptions Momentum PDF Extractor ===");
console.log("Safety: read-only. No blockchain execution. No payments.");

// Step 1: Verify source PDF
if (!existsSync(SRC_PDF)) {
  console.error(`ERROR: PDF not found at: ${SRC_PDF}`);
  process.exit(1);
}
console.log("✓ PDF found:", SRC_PDF);

// Step 2: Copy original to repo archive
copyFileSync(SRC_PDF, DEST_PDF);
console.log("✓ Archived to:", DEST_PDF);

// Step 3: Extract text
let pdfParse;
try {
  pdfParse = (await import("pdf-parse")).default;
} catch (e) {
  writeFileSync(
    OUT_NOTES,
    `# Momentum PDF Extraction Notes\n\n## Status: FAILED — pdf-parse not available\n\n**Error:** ${e.message}\n\n**Required action:** Run \`npm install --save-dev pdf-parse\` then re-run this script.\n\n**Fallback:** Export the PDF to text manually and paste into \`momentum-full-text.md\`.\n`,
  );
  console.error("ERROR: pdf-parse not available:", e.message);
  process.exit(1);
}

const pdfBuffer = readFileSync(SRC_PDF);
let data;
try {
  data = await pdfParse(pdfBuffer);
} catch (e) {
  writeFileSync(
    OUT_NOTES,
    `# Momentum PDF Extraction Notes\n\n## Status: FAILED — pdf-parse threw error\n\n**Error:** ${e.message}\n\n**Required action:** PDF may be encrypted, scanned/image-only, or malformed. Manual OCR export needed.\n\nFallback steps:\n1. Open in Adobe Acrobat or Chrome\n2. File > Export as Text\n3. Paste into \`momentum-full-text.md\`\n`,
  );
  console.error("ERROR: PDF parse failed:", e.message);
  process.exit(1);
}

// Step 4: Write full text
const fullText = data.text || "";
const totalPages = data.numpages || 0;
const info = data.info || {};

const mdContent = [
  `# Momentum PDF — Extracted Text`,
  ``,
  `> **Source:** \`momentum.pdf\` (legacy document — treat all claims as requiring review)`,
  `> **Pages:** ${totalPages}`,
  `> **Extracted:** ${new Date().toISOString()}`,
  `> **Status:** Raw extraction — NOT reviewed, NOT approved, NOT reused as-is`,
  ``,
  `---`,
  ``,
  `## Raw Extracted Text`,
  ``,
  "```",
  fullText,
  "```",
].join("\n");

writeFileSync(OUT_TEXT, mdContent);
console.log("✓ Full text written:", OUT_TEXT);

// Step 5: Write page index (pdf-parse gives us whole-doc text, rough page markers)
const pageIndex = {
  source: SRC_PDF,
  extractedAt: new Date().toISOString(),
  totalPages,
  totalCharacters: fullText.length,
  totalWords: fullText.split(/\s+/).filter(Boolean).length,
  pdfInfo: {
    title: info.Title || null,
    author: info.Author || null,
    subject: info.Subject || null,
    creator: info.Creator || null,
    producer: info.Producer || null,
    creationDate: info.CreationDate || null,
    modDate: info.ModDate || null,
  },
  note: "pdf-parse returns full concatenated text. Page-by-page split is approximate.",
};

writeFileSync(OUT_INDEX, JSON.stringify(pageIndex, null, 2));
console.log("✓ Page index written:", OUT_INDEX);

// Step 6: Write extraction notes
const wordCount = pageIndex.totalWords;
const riskKeywords = [
  "guaranteed", "profit", "return", "yield", "investment", "passive income",
  "risk-free", "SEC compliant", "government approved", "bank", "exchange",
  "broker", "lending", "custody", "airdrop", "token appreciation",
];
const foundKeywords = riskKeywords.filter((kw) => fullText.toLowerCase().includes(kw.toLowerCase()));

const notesContent = [
  `# Momentum PDF Extraction Notes`,
  ``,
  `## Status: SUCCESS`,
  ``,
  `| Field | Value |`,
  `|-------|-------|`,
  `| Source file | \`momentum.pdf\` |`,
  `| Pages | ${totalPages} |`,
  `| Characters | ${fullText.length.toLocaleString()} |`,
  `| Words | ${wordCount.toLocaleString()} |`,
  `| Extracted | ${new Date().toISOString()} |`,
  ``,
  `## Risk Keyword Scan`,
  ``,
  `The following potentially risky keywords were found in the raw text:`,
  ``,
  foundKeywords.length > 0
    ? foundKeywords.map((kw) => `- ⚠️ \`${kw}\``).join("\n")
    : "- ✅ No high-risk keywords detected in initial scan",
  ``,
  `**All flagged keywords require manual review.** Presence of a keyword does not`,
  `automatically mean the claim is prohibited — context determines risk level.`,
  ``,
  `## Required Next Steps`,
  ``,
  `1. Review \`momentum-full-text.md\` and classify all claims in \`legacy-claim-audit.md\``,
  `2. Attorney review before any public reuse of legacy content`,
  `3. Do NOT publish extracted text as-is`,
  `4. All compliance modernization work goes in \`revamp/\` subdirectory`,
].join("\n");

writeFileSync(OUT_NOTES, notesContent);
console.log("✓ Extraction notes written:", OUT_NOTES);

console.log("");
console.log("=== Extraction Complete ===");
console.log(`Pages: ${totalPages} | Words: ${wordCount.toLocaleString()}`);
console.log(`Risk keywords found: ${foundKeywords.length} — ${foundKeywords.join(", ") || "none"}`);
console.log("Safety confirmed: no blockchain execution, no payments, no asset issuance.");
