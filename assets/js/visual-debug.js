
(function () {
    // Create Debug Window
    const debugBox = document.createElement('div');
    debugBox.id = 'visual-debugger';
    debugBox.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        width: 300px;
        height: 200px;
        background: rgba(0, 0, 0, 0.85);
        color: #0f0;
        font-family: monospace;
        font-size: 10px;
        overflow-y: auto;
        z-index: 100000;
        padding: 5px;
        border: 1px solid #333;
        pointer-events: auto;
    `;

    const title = document.createElement('div');
    title.innerText = '🛠️ Debugger (Latest First)';
    title.style.borderBottom = '1px solid #555';
    title.style.marginBottom = '5px';
    debugBox.appendChild(title);

    document.body.appendChild(debugBox);

    // Intercept Console
    const oldLog = console.log;
    const oldWarn = console.warn;
    const oldError = console.error;

    function print(type, args) {
        const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
        const line = document.createElement('div');
        line.innerText = `[${type}] ${msg}`;
        if (type === 'ERROR') line.style.color = '#ff5555';
        if (type === 'WARN') line.style.color = '#ffb86c';

        // Insert at top inside debugBox (after title)
        debugBox.insertBefore(line, debugBox.children[1]);
    }

    console.log = function (...args) { oldLog.apply(console, args); print('LOG', args); };
    console.warn = function (...args) { oldWarn.apply(console, args); print('WARN', args); };
    console.error = function (...args) { oldError.apply(console, args); print('ERROR', args); };

    // Catch Global Errors
    window.addEventListener('error', (e) => {
        print('CRASH', [e.message, e.filename, e.lineno]);
    });

    console.log("Debugger Active. Window Loaded.");
})();
