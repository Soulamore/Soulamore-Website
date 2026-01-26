const fs = require('fs');
const path = require('path');

// CONFIG
const BASE_URL = 'https://soulamore.com';
const ROOT_DIR = path.resolve(__dirname, '../');
const EXCLUDES = ['_BACKUPS', 'node_modules', '.git', 'scripts', 'backend', 'functions'];

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

        const url = `${BASE_URL}/${relativePath}`;
        xml += `    <url>\n        <loc>${url}</loc>\n        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    </url>\n`;
    });

    xml += '</urlset>';

    fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), xml);
    console.log(`Sitemap generated with ${files.length} URLs at ${path.join(ROOT_DIR, 'sitemap.xml')}`);
}

generateSitemap();
