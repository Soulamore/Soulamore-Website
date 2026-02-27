const fs = require('fs');
const path = require('path');

// CONFIG
const BASE_URL = 'https://soulamore.com';
const ROOT_DIR = path.resolve(__dirname, '../');
const EXCLUDES = ['_BACKUPS', 'node_modules', '.git', 'scripts', 'backend', 'functions'];

// IMPORT DYNAMIC DATA (Simulated for Node environment)
function getDynamicUrls() {
    const urls = [];
    try {
        // Since we are in Node, we might need a different way to read these if they use 'export default' or window
        // For now, we'll parse the files as strings to extract IDs if they are not standard CommonJS
        const assessmentContent = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/assessment-data.js'), 'utf8');
        const blogContent = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/blog-data.js'), 'utf8');

        // Regex to find assessment keys
        const assessmentMatches = assessmentContent.matchAll(/'([^']+)': \{/g);
        for (const match of assessmentMatches) {
            urls.push(`${BASE_URL}/spaces/assessments/landing.html?id=${match[1]}`);
        }

        // Regex to find blog slugs
        const blogMatches = blogContent.matchAll(/slug: '([^']+)'/g);
        for (const match of blogMatches) {
            urls.push(`${BASE_URL}/community/blog-view.html?post=${match[1]}`);
        }
    } catch (e) {
        console.warn('Could not parse dynamic data files for sitemap:', e.message);
    }
    return urls;
}

// RECURSIVE FILE FINDER
function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!EXCLUDES.includes(file)) {
                getHtmlFiles(filePath, fileList);
            }
        } else {
            if (file.endsWith('.html')) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

// GENERATE XML
function generateSitemap() {
    console.log('Generating Sitemap...');
    const files = getHtmlFiles(ROOT_DIR);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    files.forEach(file => {
        let relativePath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');

        // Skip portals except login
        if (relativePath.includes('portal/') && !relativePath.includes('login.html')) return;
        // Skip results/engine as they need IDs
        if (relativePath.includes('engine.html') || relativePath.includes('results.html')) return;

        const url = `${BASE_URL}/${relativePath}`;
        xml += `    <url>\n        <loc>${url}</loc>\n        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    </url>\n`;
    });

    // Add Dynamic URLs
    const dynamicUrls = getDynamicUrls();
    dynamicUrls.forEach(url => {
        xml += `    <url>\n        <loc>${url}</loc>\n        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n        <changefreq>weekly</changefreq>\n    </url>\n`;
    });

    xml += '</urlset>';

    fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), xml);
    console.log(`Sitemap generated with ${files.length} URLs at ${path.join(ROOT_DIR, 'sitemap.xml')}`);
}

generateSitemap();
