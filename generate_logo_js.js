const fs = require('fs');
const path = require('path');

const logoPath = 'assets/images/logo.png';
try {
    const bitmap = fs.readFileSync(logoPath);
    const base64 = Buffer.from(bitmap).toString('base64');
    const dataUri = 'data:image/png;base64,' + base64;

    const jsContent = `// Hardcoded Logo Base64 for Share Cards
const logoBase64 = "${dataUri}";`;

    fs.writeFileSync('assets/js/logo.js', jsContent);
    console.log('Successfully created assets/js/logo.js with Base64 data.');
} catch (err) {
    console.error('Error converting logo to base64:', err);
}
