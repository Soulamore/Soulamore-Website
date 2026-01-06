const fs = require('fs');
try {
    const html = fs.readFileSync('tools/drop-it.html', 'utf8');
    const lines = html.split('\r\n'); // Windows style

    // Locate the Main Script Block
    // Starts with "let logoBase64"
    // Ends with "loop();" before the closing tag

    let start = -1;
    let end = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('let logoBase64 =')) start = i;
        if (lines[i].includes('loop();')) end = i;
    }

    if (start === -1 || end === -1) {
        // Try split by \n if \r\n failed
        console.log("CRITICAL: Markers not found with CRLF, retrying with LF");
        const linesLF = html.split('\n');
        for (let i = 0; i < linesLF.length; i++) {
            if (linesLF[i].includes('let logoBase64 =')) start = i;
            if (linesLF[i].includes('loop();')) end = i;
        }
        if (start === -1 || end === -1) {
            throw new Error(`Could not find markers. Start: ${start}, End: ${end}`);
        }
        const js = linesLF.slice(start, end + 2).join('\n');
        fs.writeFileSync('debug.js', js);
    } else {
        const js = lines.slice(start, end + 2).join('\n');
        fs.writeFileSync('debug.js', js);
    }

    console.log(`Extracted JS to debug.js (Lines ${start} to ${end})`);

} catch (e) {
    console.error(e.message);
    process.exit(1);
}
