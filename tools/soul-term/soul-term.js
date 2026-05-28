#!/usr/bin/env node

/**
 * SOUL-TERM (v1.0.0)
 * Standalone, zero-dependency interactive CLI companion.
 * 
 * Features:
 * - Vendor Decoupling: Hot-swappable engines (Gemini, Claude, OpenAI)
 * - Persistent Memory: Automatically bundles markdown files in 'memory/'
 * - Conversation Sync: Saves chats as markdown files in 'chats/'
 * - Git Integration: Optional automated hooks to commit changes
 * 
 * Run: node tools/soul-term/soul-term.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const https = require('https');
const { execSync } = require('child_process');

// --- ANSI Escape Codes for HSL-like Premium UI styling ---
const COLOR = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    teal: '\x1b[38;5;45m',
    amber: '\x1b[38;5;214m',
    indigo: '\x1b[38;5;99m',
    crimson: '\x1b[38;5;196m',
    emerald: '\x1b[38;5;46m',
    gray: '\x1b[38;5;244m',
    bgTeal: '\x1b[48;5;30m',
    bgDark: '\x1b[48;5;234m'
};

// --- CLI State ---
let config = {
    activeModel: 'gemini', // Default model
    systemInstruction: '',
    chatHistory: [],
    sessionChatFile: '',
    memoryFilesLoaded: []
};

// --- Resolve Directories (Fallback from working dir to local term dir) ---
const workingDir = process.cwd();
const termHomeDir = path.dirname(__filename);

const dirs = {
    memory: fs.existsSync(path.join(workingDir, 'memory')) ? path.join(workingDir, 'memory') : path.join(termHomeDir, 'memory'),
    chats: fs.existsSync(path.join(workingDir, 'chats')) ? path.join(workingDir, 'chats') : path.join(termHomeDir, 'chats'),
    env: fs.existsSync(path.join(workingDir, '.env')) ? path.join(workingDir, '.env') : path.join(termHomeDir, '../../.env')
};

// Ensure directories exist
if (!fs.existsSync(dirs.memory)) fs.mkdirSync(dirs.memory, { recursive: true });
if (!fs.existsSync(dirs.chats)) fs.mkdirSync(dirs.chats, { recursive: true });

// --- Load Environment Variables ---
const envVars = {};
if (fs.existsSync(dirs.env)) {
    const envContent = fs.readFileSync(dirs.env, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            let value = match[2] ? match[2].trim() : '';
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            envVars[match[1]] = value;
        }
    });
}

// Merge with shell environment variables
Object.assign(envVars, process.env);

// --- Load Memory Profiles ---
function loadMemory() {
    config.systemInstruction = '';
    config.memoryFilesLoaded = [];
    
    try {
        const files = fs.readdirSync(dirs.memory).filter(f => f.endsWith('.md'));
        if (files.length === 0) {
            // Scaffold default files if empty
            scaffoldDefaultMemory();
            return loadMemory();
        }

        let compiledMemory = 'You are a supportive, direct, and elite AI development companion.\n\n';
        compiledMemory += '--- BACKGROUND SYSTEM CONTEXT ---\n';

        files.forEach(file => {
            const filePath = path.join(dirs.memory, file);
            const content = fs.readFileSync(filePath, 'utf8');
            compiledMemory += `\n[Memory Profile: ${file}]\n${content}\n`;
            config.memoryFilesLoaded.push(file);
        });

        compiledMemory += '\n--- END OF CONTEXT ---\n';
        compiledMemory += 'Always maintain the tone, constraints, and instructions defined in these profiles.';
        config.systemInstruction = compiledMemory;
    } catch (err) {
        config.systemInstruction = 'You are a premium AI assistant.';
    }
}

// --- Scaffold default profiles if missing ---
function scaffoldDefaultMemory() {
    const defaultFiles = {
        'profile.md': `# My Profile\n- Name: Aryan\n- Focus: Tech Architect & Engineer\n- Preferences: High aesthetics, clean code, minimal boilerplate, zero warnings.`,
        'tech_stack.md': `# Technical Stack\n- Languages: TypeScript, JavaScript, Python, HTML/CSS.\n- Ecosystem: Firebase (Firestore, Auth, Functions), Node.js, Express, Next.js.\n- Styling: HSL palettes, CSS variables, glassmorphism, responsive designs.`,
        'rules.md': `# Core Directives\n- Keep explanations extremely clean and direct.\n- Proactively run builds and tests; enforce linting.\n- Do not output lazy generic code.`
    };

    Object.keys(defaultFiles).forEach(name => {
        const filePath = path.join(dirs.memory, name);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, defaultFiles[name], 'utf8');
        }
    });
}

// --- Dynamic File Name for current session ---
function initSessionChatFile() {
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Math.floor(Date.now() / 1000).toString().slice(-4);
    config.sessionChatFile = path.join(dirs.chats, `chat_${date}_${timestamp}.md`);
    
    // Write header
    const header = `# Chat Session: ${date}\n- Model: ${config.activeModel.toUpperCase()}\n- Memory Profiles: ${config.memoryFilesLoaded.join(', ')}\n\n---\n\n`;
    fs.writeFileSync(config.sessionChatFile, header, 'utf8');
}

// --- Append message to markdown logs ---
function appendChatLog(role, text) {
    if (!config.sessionChatFile) return;
    const logText = `### **${role.toUpperCase()}** (${new Date().toLocaleTimeString()})\n${text}\n\n`;
    fs.appendFileSync(config.sessionChatFile, logText, 'utf8');
}

// --- API Request Dispatcher ---
function makeApiRequest(url, headers, body) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error(`Failed to parse response JSON: ${e.message}`));
                    }
                } else {
                    reject(new Error(`API Error ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', err => reject(err));
        req.write(JSON.stringify(body));
        req.end();
    });
}

// --- Core LLM Handler ---
async function fetchResponse(prompt) {
    const model = config.activeModel;

    if (model === 'gemini') {
        const key = envVars.GEMINI_API_KEY;
        if (!key) throw new Error('GEMINI_API_KEY is not defined in the environment config.');
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
        
        // Map history to Gemini format
        const contents = [];
        config.chatHistory.forEach(msg => {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        });
        contents.push({ role: 'user', parts: [{ text: prompt }] });

        const body = {
            contents: contents,
            systemInstruction: {
                parts: [{ text: config.systemInstruction }]
            },
            generationConfig: {
                temperature: 0.7
            }
        };

        const res = await makeApiRequest(url, {}, body);
        return res.candidates[0].content.parts[0].text;
    } 
    
    if (model === 'claude') {
        const key = envVars.ANTHROPIC_API_KEY;
        if (!key) throw new Error('ANTHROPIC_API_KEY is not defined in the environment config.');
        
        const url = 'https://api.anthropic.com/v1/messages';
        const headers = {
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
        };

        const messages = [];
        config.chatHistory.forEach(msg => {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            });
        });
        messages.push({ role: 'user', content: prompt });

        const body = {
            model: 'claude-3-5-sonnet-latest',
            max_tokens: 4096,
            system: config.systemInstruction,
            messages: messages,
            temperature: 0.7
        };

        const res = await makeApiRequest(url, headers, body);
        return res.content[0].text;
    }

    if (model === 'openai') {
        const key = envVars.OPENAI_API_KEY;
        if (!key) throw new Error('OPENAI_API_KEY is not defined in the environment config.');

        const url = 'https://api.openai.com/v1/chat/completions';
        const headers = {
            'Authorization': `Bearer ${key}`
        };

        const messages = [{ role: 'system', content: config.systemInstruction }];
        config.chatHistory.forEach(msg => {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            });
        });
        messages.push({ role: 'user', content: prompt });

        const body = {
            model: 'gpt-4o',
            messages: messages,
            temperature: 0.7
        };

        const res = await makeApiRequest(url, headers, body);
        return res.choices[0].message.content;
    }

    throw new Error(`Unsupported engine model: ${model}`);
}

// --- Git Hook Integration ---
function runGitHook() {
    try {
        console.log(`\n${COLOR.gray}[git] Staging conversation logs...${COLOR.reset}`);
        execSync(`git add "${dirs.chats}/*"`, { stdio: 'ignore' });
        
        const date = new Date().toISOString().split('T')[0];
        execSync(`git commit -m "chat(soul-term): auto-save discussion logs ${date}"`, { stdio: 'ignore' });
        
        console.log(`${COLOR.emerald}[git] Staged & Committed successfully!${COLOR.reset}`);
        
        // Ask if they want to push
        return true;
    } catch (e) {
        console.log(`${COLOR.gray}[git] No changes to commit or Git repository not initialized here.${COLOR.reset}`);
        return false;
    }
}

// --- CLI Layout Render Utilities ---
function printBanner() {
    console.clear();
    console.log(`${COLOR.teal}${COLOR.bold}`);
    console.log(` ░██████╗░██████╗░██╗░░██╗██╗░░░░░░░████████╗███████╗██████╗░███╗░░░███╗`);
    console.log(` ██╔════╝██╔═══██╗██║░░██║██║░░░░░░░╚══██╔══╝██╔════╝██╔══██╗████╗░████║`);
    console.log(` ╚█████╗░██║░░░██║██║░░██║██║░░░░░░░░░░██║░░░█████╗░░██████╔╝██╔████╔██║`);
    console.log(` ░╚═══██╗██║░░░██║██║░░██║██║░░░░░░░░░░██║░░░██╔══╝░░██╔══██╗██║╚██╔╝██║`);
    console.log(` ██████╔╝╚██████╔╝╚██████╔╝███████╗░░░░██║░░░███████╗██║░░██║██║░╚═╝░██║`);
    console.log(` ╚═════╝░░╚═════╝░░╚═════╝░╚══════╝░░░░╚═╝░░░╚══════╝╚═╝░░╚═╝╚═╝░░░░░╚═╝`);
    console.log(`${COLOR.reset}`);
    console.log(`${COLOR.gray}----------------------------------------------------------------------------${COLOR.reset}`);
    console.log(`${COLOR.bold}🔒 Vendor Decoupled Terminal Client | Memory-Driven Development${COLOR.reset}`);
    console.log(`${COLOR.gray}Directories:`);
    console.log(`  📂 Memory: ${COLOR.indigo}${dirs.memory}${COLOR.reset}`);
    console.log(`  📂 Chats:  ${COLOR.indigo}${dirs.chats}${COLOR.reset}`);
    console.log(`${COLOR.gray}Loaded memory: ${COLOR.emerald}${config.memoryFilesLoaded.join(', ')}${COLOR.reset}`);
    console.log(`${COLOR.gray}----------------------------------------------------------------------------${COLOR.reset}`);
    console.log(`${COLOR.dim}Commands: /model <gemini|claude|openai> | /memory (reload) | /git (sync) | /exit${COLOR.reset}\n`);
}

// --- Output Markdown Renderer ---
function renderMarkdown(text) {
    let lines = text.split('\n');
    let insideCode = false;

    lines = lines.map(line => {
        // Toggle code block
        if (line.trim().startsWith('```')) {
            insideCode = !insideCode;
            return `${COLOR.indigo}${line}${COLOR.reset}`;
        }
        
        if (insideCode) {
            return `${COLOR.gray}${line}${COLOR.reset}`;
        }

        // Headers
        if (line.startsWith('# ')) return `\n${COLOR.teal}${COLOR.bold}${line.slice(2)}${COLOR.reset}`;
        if (line.startsWith('## ')) return `\n${COLOR.teal}${COLOR.bold}${line.slice(3)}${COLOR.reset}`;
        if (line.startsWith('### ')) return `\n${COLOR.teal}${COLOR.bold}${line.slice(4)}${COLOR.reset}`;

        // Inline formatting
        let formatted = line
            .replace(/\*\*(.*?)\*\*/g, `${COLOR.bold}${COLOR.amber}$1${COLOR.reset}`)
            .replace(/\*(.*?)\*/g, `\x1b[3m$1${COLOR.reset}`)
            .replace(/`(.*?)`/g, `${COLOR.indigo}$1${COLOR.reset}`);

        return formatted;
    });

    console.log(lines.join('\n'));
}

// --- Interactive Shell Main Loop ---
function startShell() {
    loadMemory();
    initSessionChatFile();
    printBanner();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${COLOR.teal}[${config.activeModel}] > ${COLOR.reset}`
    });

    rl.prompt();

    rl.on('line', async (line) => {
        const input = line.trim();
        if (!input) {
            rl.prompt();
            return;
        }

        // --- Commands Handler ---
        if (input.startsWith('/')) {
            const parts = input.split(' ');
            const command = parts[0].toLowerCase();
            const arg = parts[1] ? parts[1].toLowerCase().trim() : '';

            if (command === '/exit' || command === '/quit') {
                console.log(`\n${COLOR.amber}Saving session conversation log...${COLOR.reset}`);
                console.log(`${COLOR.emerald}Session saved to: ${config.sessionChatFile}${COLOR.reset}`);
                
                // Prompt Git auto commit
                const staged = runGitHook();
                console.log(`\n${COLOR.teal}Thank you for breathing with Soul-Term. Goodbye!${COLOR.reset}\n`);
                process.exit(0);
            }

            if (command === '/model') {
                if (['gemini', 'claude', 'openai'].includes(arg)) {
                    config.activeModel = arg;
                    console.log(`\n${COLOR.emerald}Changed active execution engine to: ${arg.toUpperCase()}${COLOR.reset}\n`);
                    
                    // Update header of log
                    fs.appendFileSync(config.sessionChatFile, `\n\n> **SYSTEM NOTICE**: Switched active engine to **${arg.toUpperCase()}**\n\n`, 'utf8');
                } else {
                    console.log(`\n${COLOR.crimson}Invalid model. Choose: gemini | claude | openai${COLOR.reset}\n`);
                }
                rl.setPrompt(`${COLOR.teal}[${config.activeModel}] > ${COLOR.reset}`);
                rl.prompt();
                return;
            }

            if (command === '/memory') {
                console.log(`\n${COLOR.teal}Reloading memory profiles...${COLOR.reset}`);
                loadMemory();
                console.log(`${COLOR.emerald}Memory reloaded: ${config.memoryFilesLoaded.join(', ')}${COLOR.reset}\n`);
                rl.prompt();
                return;
            }

            if (command === '/git') {
                runGitHook();
                console.log('');
                rl.prompt();
                return;
            }

            console.log(`\n${COLOR.crimson}Unknown command: ${command}${COLOR.reset}\n`);
            rl.prompt();
            return;
        }

        // --- Chat Query Handler ---
        appendChatLog('user', input);
        console.log(`\n${COLOR.gray}Channelling thoughts via ${config.activeModel.toUpperCase()}...${COLOR.reset}\n`);

        try {
            const response = await fetchResponse(input);
            console.log(`${COLOR.emerald}${COLOR.bold}SoulBot:${COLOR.reset}`);
            renderMarkdown(response);
            console.log('');

            // Save to local logs & history
            appendChatLog('bot', response);
            config.chatHistory.push({ role: 'user', content: input });
            config.chatHistory.push({ role: 'bot', content: response });

        } catch (err) {
            console.log(`\n${COLOR.crimson}Channelling failed: ${err.message}${COLOR.reset}\n`);
        }

        rl.prompt();
    });

    rl.on('SIGINT', () => {
        console.log(`\n\n${COLOR.amber}Session interrupted. Saving conversation logs...${COLOR.reset}`);
        console.log(`${COLOR.emerald}Saved to: ${config.sessionChatFile}${COLOR.reset}`);
        runGitHook();
        console.log(`\n${COLOR.teal}Thank you for breathing with Soul-Term. Goodbye!${COLOR.reset}\n`);
        process.exit(0);
    });
}

// Start
startShell();
