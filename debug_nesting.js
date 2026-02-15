const fs = require('fs');
const path = require('path');

const filePath = 'portal/user-dashboard.html';
// Resolving path relative to the current working directory which usually is the project root, 
// but here we might need to be careful. I'll assume the relative path works or try absolute if provided.
// The user provided absolute paths in previous turns.
const absPath = "g:\\Other computers\\My laptop\\Get Rich Quick Plans\\Aditya Harsh\\Soulamore\\01 - Website\\02- Version 2\\HTML Pages\\New\\Soulamore-Website\\portal\\user-dashboard.html";

try {
    const content = fs.readFileSync(absPath, 'utf8');
    console.log("File read successfully.");

    let depth = 0;
    // Match <div>, </div>, and id="view-..."
    // We need to be careful about matching. specific regex for tags.
    const regex = /<div|<\/div>|id=["']view-[^"']+["']/gi;

    let match;
    let viewDepths = [];

    // We also want line numbers
    let lineNo = 1;
    let lastIndex = 0;

    while ((match = regex.exec(content)) !== null) {
        // Count newlines since last match to track line number
        const chunk = content.substring(lastIndex, match.index);
        lineNo += (chunk.match(/\n/g) || []).length;
        lastIndex = match.index;

        if (match[0].toLowerCase().startsWith('<div')) {
            depth++;
        } else if (match[0].toLowerCase().startsWith('</div')) {
            depth--;
        } else {
            // It's a view ID
            console.log(`Line ${lineNo}: Found ${match[0]} at depth ${depth}`);
            viewDepths.push({ id: match[0], depth: depth, line: lineNo });
        }
    }

    console.log("\nSummary of View Depths:");
    viewDepths.forEach(v => {
        console.log(`${v.id} : Depth ${v.depth}`);
    });

    // Check if they are siblings (same depth)
    if (viewDepths.length > 0) {
        const baseDepth = viewDepths[0].depth;
        const nested = viewDepths.filter(v => v.depth > baseDepth);
        if (nested.length > 0) {
            console.log("\n[!] NESTING DETECTED:");
            nested.forEach(v => console.log(`   ${v.id} is nested deeper (Depth ${v.depth}) than the first view (Depth ${baseDepth})`));
        } else {
            console.log("\n[+] All views are at the same depth. Structure looks flat.");
        }
    }

} catch (err) {
    console.error("Error reading file:", err);
}
