const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "reports", "contrast-scan.json");
const IGNORE = [
  "_BACKUPS",
  "Git Tools Open Source",
  "journal",
  "journal-lab",
  "node_modules",
  "tmp"
];
const EXCLUDED_PATH_PREFIXES = ["assets/templates/emails/"];
const EXCLUDED_FILES = new Set(["spaces/assessments/index.backup-pre-ux-redesign.html"]);

function shouldIgnore(filePath) {
  return IGNORE.some((part) => filePath.includes(`${path.sep}${part}${path.sep}`));
}

function collectHtmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE.includes(entry.name)) collectHtmlFiles(full, out);
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".html") && !shouldIgnore(full)) {
      out.push(full);
    }
  }
  return out;
}

function hasPattern(text, pattern) {
  return pattern.test(text);
}

const htmlFiles = collectHtmlFiles(ROOT);
const rows = htmlFiles.map((absPath) => {
  const relPath = path.relative(ROOT, absPath).replaceAll("\\", "/");
  if (
    EXCLUDED_PATH_PREFIXES.some((prefix) => relPath.startsWith(prefix)) ||
    EXCLUDED_FILES.has(relPath)
  ) {
    return null;
  }
  const text = fs.readFileSync(absPath, "utf8");
  const hasDarkBody = hasPattern(
    text,
    /body\s*\{[\s\S]*?background(?:-color)?\s*:\s*(?:var\(--deep-space\)|#0f172a|#0a0f1c|#111827|linear-gradient\([\s\S]*?#0f172a)/i
  );
  const hasLightModeBlock = hasPattern(text, /body\.light-mode/i);
  const hasLowOpacityText = hasPattern(text, /opacity\s*:\s*0\.[4-8]/i);
  const hasHardcodedDarkSurface = hasPattern(
    text,
    /rgba\(\s*(15,\s*23,\s*42|30,\s*41,\s*59)\s*,|background(?:-color)?\s*:\s*#(?:0f172a|1e293b|111827)/i
  );
  const hasPaleTextToken = hasPattern(text, /#94a3b8|#cbd5e1|#e2e8f0/i);

  return {
    file: relPath,
    hasDarkBody,
    hasLightModeBlock,
    hasLowOpacityText,
    hasHardcodedDarkSurface,
    hasPaleTextToken
  };
}).filter(Boolean);

const summary = {
  scannedAt: new Date().toISOString(),
  totalFiles: rows.length,
  darkBodyWithoutLightMode: rows.filter((r) => r.hasDarkBody && !r.hasLightModeBlock).length,
  lowOpacityTextFiles: rows.filter((r) => r.hasLowOpacityText).length,
  hardcodedDarkSurfaceFiles: rows.filter((r) => r.hasHardcodedDarkSurface).length
};

const payload = {
  summary,
  files: rows.sort((a, b) => a.file.localeCompare(b.file))
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
console.log(`Wrote ${OUTPUT}`);
