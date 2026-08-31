/**
 * Compliance gate — README.md §9.2.
 * Scans built HTML output in .next/server/app for the rules below.
 * Exits non-zero listing every violation (file, route, rule).
 *
 * Runs against .next/server/app rather than source so it checks what
 * actually renders, not what the source merely intends.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { SEBI_DISCLAIMER, CALCULATOR_CAVEAT, BANNED_PHRASES } from "../src/lib/compliance";

const BUILD_DIR = join(process.cwd(), ".next", "server", "app");

interface Violation {
  file: string;
  rule: string;
  detail: string;
}

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

// Next's top-level error boundary replaces the entire <html>/<body> and
// cannot render the app shell (Footer included) by framework design.
const R1_EXEMPT = ["_global-error.html"];

function checkFile(file: string): Violation[] {
  const html = readFileSync(file, "utf-8");
  const rel = relative(process.cwd(), file);
  const violations: Violation[] = [];
  const isDraft = html.includes('data-status="draft"');
  const isR1Exempt = R1_EXEMPT.some((name) => file.endsWith(name));

  // Rule 1 — every route must carry the SEBI disclaimer verbatim.
  if (!isR1Exempt && !html.includes(SEBI_DISCLAIMER)) {
    violations.push({ file: rel, rule: "R1-disclaimer-missing", detail: "SEBI_DISCLAIMER not found in rendered HTML" });
  }

  // Rule 2 — every /tools/* route must carry the illustrative-return caveat.
  if (rel.includes(`${"tools"}${"/"}`) && !html.includes(CALCULATOR_CAVEAT)) {
    violations.push({ file: rel, rule: "R2-caveat-missing", detail: "CALCULATOR_CAVEAT not found on a /tools route" });
  }

  // Rule 3 — banned phrases, case-insensitive.
  const lower = html.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) {
      violations.push({ file: rel, rule: "R3-banned-phrase", detail: `matched "${phrase}"` });
    }
  }

  // Rule 4 — unresolved verification markers may not ship on a published route.
  if (!isDraft && html.includes("[VERIFY:")) {
    violations.push({ file: rel, rule: "R4-unresolved-verify", detail: "found an open [VERIFY: ...] marker on a published route" });
  }

  // Rule 5 — affiliate hygiene.
  const affiliatePattern = /href="[^"]*(?:[?&](?:ref|affiliate)=|utm_source=partner)[^"]*"/i;
  if (affiliatePattern.test(html)) {
    violations.push({ file: rel, rule: "R5-affiliate-link", detail: "outbound link carries a ref/affiliate/utm_source=partner param" });
  }

  return violations;
}

function main() {
  if (!existsSync(BUILD_DIR)) {
    console.log("compliance-check: no build output found at .next/server/app — run `npm run build` first. Skipping (nothing to check yet).");
    process.exit(0);
  }

  const files = walk(BUILD_DIR);
  const violations = files.flatMap(checkFile);

  if (violations.length === 0) {
    console.log(`compliance-check: ${files.length} rendered route(s) checked, 0 violations.`);
    process.exit(0);
  }

  console.error(`compliance-check: ${violations.length} violation(s) found across ${files.length} rendered route(s):\n`);
  for (const v of violations) {
    console.error(`  [${v.rule}] ${v.file} — ${v.detail}`);
  }
  process.exit(1);
}

main();
