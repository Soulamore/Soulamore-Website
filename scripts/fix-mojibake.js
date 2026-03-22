const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const IGNORE_DIRS = new Set([
  "_BACKUPS",
  "Git Tools Open Source",
  "journal",
  "journal-lab",
  "node_modules",
  ".git",
  ".vscode"
]);

const FILE_EXT = new Set([".html", ".js", ".css", ".md"]);

const REPLACEMENTS = [
  { pattern: /\u00e2\u20ac\u2122/g, value: "'" },
  { pattern: /\u00e2\u20ac\u02dc/g, value: "'" },
  { pattern: /\u00e2\u20ac\u0153/g, value: '"' },
  { pattern: /\u00e2\u20ac(?:\u009d|\u009c)/g, value: '"' },
  { pattern: /\u00e2\u20ac\u201c/g, value: "-" },
  { pattern: /\u00e2\u20ac\u201d/g, value: "-" },
  { pattern: /\u00e2\u20ac\u00a6/g, value: "..." },
  { pattern: /\u00e2\u20ac\u00a2/g, value: "•" },
  { pattern: /\u00e2\u2020\u2019/g, value: "->" },
  { pattern: /\u00ef\u00bf\u00bd/g, value: "-" },
  { pattern: /\u00c2/g, value: "" },
  { pattern: /\u00f0\u0178\u0152\u008d/g, value: "&#127757;" },
  { pattern: /\u00e2\u0153\u02c6\u00ef\u00b8\u008f/g, value: "&#9992;&#65039;" },
  { pattern: /\u00e2\u009d\u00a4\u00ef\u00b8\u008f/g, value: "&#10084;&#65039;" },
  { pattern: /\u00f0\u0178\u00a7\u00a1/g, value: "<3" },
  { pattern: /\ufffd/g, value: "-" }
];

function shouldSkipDir(dirName) {
  return IGNORE_DIRS.has(dirName);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!shouldSkipDir(entry.name)) walk(full, out);
      continue;
    }
    if (!entry.isFile()) continue;
    if (FILE_EXT.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function normalizeUtf8NoBom(filePath, content) {
  fs.writeFileSync(filePath, content, { encoding: "utf8" });
}

function fixFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  let next = original;
  for (const replacement of REPLACEMENTS) {
    next = next.replace(replacement.pattern, replacement.value);
  }
  if (next !== original) {
    normalizeUtf8NoBom(filePath, next);
    return true;
  }
  return false;
}

const files = walk(ROOT);
const changed = [];
for (const file of files) {
  if (fixFile(file)) changed.push(path.relative(ROOT, file).replaceAll("\\", "/"));
}

console.log(`Processed ${files.length} files`);
console.log(`Updated ${changed.length} files`);
for (const file of changed) console.log(file);
