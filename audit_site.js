
const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const IGNORE_DIRS = ['.git', '.gemini', '_BACKUPS', 'node_modules'];

// 1. GET ALL HTML FILES
function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                getAllHtmlFiles(filePath, fileList);
            }
        } else {
            if (path.extname(file).toLowerCase() === '.html') {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

const allHtmlFiles = getAllHtmlFiles(ROOT_DIR);
const allHtmlFilesSet = new Set(allHtmlFiles.map(f => path.normalize(f).toLowerCase()));

// 2. EXTRACT LINKS
const links = []; // { source: '...', target: '...', type: 'href|js', valid: boolean }
const linkedFiles = new Set();
// Always mark index.html as linked (entry point)
linkedFiles.add(path.normalize(path.join(ROOT_DIR, 'index.html')).toLowerCase());

// Helper to resolve path
function resolveLink(sourceFile, link) {
    // Ignore external, anchors, mailto, tel
    if (link.match(/^(http|https|mailto:|tel:|#|javascript:)/)) return 'EXTERNAL';

    // Clean query params/hashes
    const cleanLink = link.split('?')[0].split('#')[0];
    if (!cleanLink) return 'EXTERNAL';

    try {
        let absPath;
        if (cleanLink.startsWith('/')) {
            // Root relative (assuming ROOT_DIR is server root)
            absPath = path.join(ROOT_DIR, cleanLink);
        } else {
            // Relative to source
            absPath = path.join(path.dirname(sourceFile), cleanLink);
        }
        return path.normalize(absPath);
    } catch (e) {
        return 'ERROR';
    }
}

// A. Process HTML Files
allHtmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Regex for href (approximate)
    const hrefRegex = /href=["']([^"']+)["']/g;
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
        const link = match[1];
        const resolved = resolveLink(file, link);

        if (resolved !== 'EXTERNAL' && resolved !== 'ERROR') {
            const exists = fs.existsSync(resolved);
            links.push({ source: file, raw: link, target: resolved, exists });
            if (exists && resolved.toLowerCase().endsWith('.html')) {
                linkedFiles.add(resolved.toLowerCase());
            }
        }
    }

    // Regex for window.location (simple check)
    const jsLocationRegex = /(?:window\.location\.href|location\.href|window\.location)\s*=\s*["']([^"']+)["']/g;
    while ((match = jsLocationRegex.exec(content)) !== null) {
        const link = match[1];
        const resolved = resolveLink(file, link);
        if (resolved !== 'EXTERNAL' && resolved !== 'ERROR') {
            const exists = fs.existsSync(resolved);
            links.push({ source: file, raw: link, target: resolved, exists, type: 'js' });
            if (exists && resolved.toLowerCase().endsWith('.html')) {
                linkedFiles.add(resolved.toLowerCase());
            }
        }
    }
});

// B. Process components.js (Special Case - Injected Header)
// We treat links in components.js as relative to ROOT if strictly needed, 
// BUT components.js uses `rootPath` variable often.
// We will try to simulate standard links found in the NAV_DATA structure.
const componentsPath = path.join(ROOT_DIR, 'assets', 'js', 'components.js');
if (fs.existsSync(componentsPath)) {
    const content = fs.readFileSync(componentsPath, 'utf8');
    // Look for href: '...' inside the js file (often used in NAV_DATA)
    const jsHrefRegex = /href:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = jsHrefRegex.exec(content)) !== null) {
        let link = match[1];
        if (link === '#') continue;

        // In components.js, paths are mostly relative to root (appended to rootPath)
        // So we resolve them against ROOT_DIR
        const resolved = path.normalize(path.join(ROOT_DIR, link));
        const exists = fs.existsSync(resolved);

        links.push({ source: 'components.js', raw: link, target: resolved, exists });
        if (exists && resolved.toLowerCase().endsWith('.html')) {
            linkedFiles.add(resolved.toLowerCase());
        }
    }
    // Look for direct html strings: href="${rootPath}..."
    const htmlStringRegex = /href="\${rootPath}([^"]+)"/g;
    while ((match = htmlStringRegex.exec(content)) !== null) {
        let link = match[1];
        const resolved = path.normalize(path.join(ROOT_DIR, link));
        const exists = fs.existsSync(resolved);
        links.push({ source: 'components.js html', raw: link, target: resolved, exists });
        if (exists && resolved.toLowerCase().endsWith('.html')) {
            linkedFiles.add(resolved.toLowerCase());
        }
    }
}

// 3. ANALYZE RESULTS
const brokenLinks = links.filter(l => !l.exists);
const orphanFiles = allHtmlFiles.filter(f => !linkedFiles.has(path.normalize(f).toLowerCase()));


// 4. OUTPUT REPORT (Orphans Only)
console.log('--- POTENTIAL HIDDEN CONTENT (Orphans) ---');
orphanFiles.forEach(f => {
    const relPath = path.relative(ROOT_DIR, f);
    // Filter out obvious noise
    if (relPath.includes('_BACKUPS') ||
        relPath.includes('test') ||
        relPath.includes('demo') ||
        relPath.toLowerCase().includes('backup')) return;

    console.log(relPath);
});

console.log('--- STATS ---');
console.log(`Total Orphans: ${orphanFiles.length}`);
