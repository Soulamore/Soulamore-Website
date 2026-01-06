// Mock Browser Environment
global.window = {
    innerWidth: 1920,
    innerHeight: 1080,
    addEventListener: () => { },
    bgHue: 0
};
global.document = {
    getElementById: (id) => {
        if (id === 'gameCanvas') return global.canvas;
        return { style: {}, classList: { add: () => { }, remove: () => { } }, innerHTML: "" };
    },
    querySelector: () => ({ classList: { remove: () => { } } }),
    createElement: () => ({ style: {} }),
    body: { appendChild: () => { } }
};
global.canvas = {
    width: 1920,
    height: 1080,
    getContext: () => ({
        createRadialGradient: () => ({ addColorStop: () => { } }),
        beginPath: () => { }, arc: () => { }, fill: () => { }, fillRect: () => { },
        stroke: () => { }, strokeRect: () => { }, save: () => { }, restore: () => { },
        translate: () => { }, rotate: () => { }, ellipse: () => { },
        drawImage: () => { },
        createOscillator: () => ({ connect: () => { }, start: () => { }, stop: () => { }, frequency: { setValueAtTime: () => { }, exponentialRampToValueAtTime: () => { }, linearRampToValueAtTime: () => { } } }),
        createGain: () => ({ connect: () => { }, gain: { setValueAtTime: () => { }, linearRampToValueAtTime: () => { } } }),
        measureText: () => ({ width: 10 })
    }),
    getBoundingClientRect: () => ({ width: 1920, height: 1080, left: 0, top: 0 }),
    addEventListener: () => { }
};
global.Image = class { constructor() { this.src = ''; } };
global.requestAnimationFrame = () => { };
global.performance = { now: () => Date.now() };

// Add LOGO_DATA mock
global.LOGO_DATA = "data:image/png;base64,mock";

// Execute the code
try {
    const fs = require('fs');
    const code = fs.readFileSync('debug.js', 'utf8');
    eval(code);
    console.log("Script executed successfully.");
    if (typeof initGame === 'function') {
        console.log("initGame IS DEFINED.");
    } else {
        console.log("initGame IS NOT DEFINED.");
    }
} catch (e) {
    console.error("RUNTIME ERROR:", e);
}
