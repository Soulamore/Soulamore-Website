const path = require('path');

// Mock TTY properties
process.stdout.isTTY = true;
process.stderr.isTTY = true;
process.stdin.isTTY = true;

// Set up arguments for firebase login:add contact.soulamore@gmail.com --no-localhost
process.argv = [
    process.argv[0],
    'firebase',
    'login:add',
    'contact.soulamore@gmail.com',
    '--no-localhost'
];

// Load firebase-tools
const firebaseBin = 'C:\\Users\\adity\\AppData\\Roaming\\npm\\node_modules\\firebase-tools\\lib\\bin\\firebase.js';
require(firebaseBin);
