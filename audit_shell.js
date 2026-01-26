
const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

const rootDir = process.cwd();
const missingShell = [];

console.log("Scanning for files missing #app-shell...");

walkDir(rootDir, (filePath) => {
    if (path.extname(filePath) === '.html') {
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('id="app-shell"')) {
            // Exclude verify_fix.html or similar debug files if any
            if (!filePath.includes('debug') && !filePath.includes('backup')) {
                missingShell.push(filePath);
            }
        }
    }
});

console.log("Files missing #app-shell:");
missingShell.forEach(f => console.log(f));
