/**
 * SOULBOT VISUALS V2.0 (Futuristic Edition)
 * Highlights: Neural Sphere 3D Core, Interactive Constellation Mesh
 */

// Global Mouse State
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

/* =========================================
   1. CONSTELLATION FIELD (Subtle & Interactive)
   ========================================= */
class ConstellationField {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeTimeout = null;

        this.resize();
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.resize(), 200);
        });
        this.animate();
    }

    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.initParticles();
    }

    initParticles() {
        this.particles = [];
        // Optimized density: Less particles, smoother performance
        // increased divisor from 10000 to 18000
        const count = Math.floor((this.w * this.h) / 18000);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                vx: (Math.random() - 0.5) * 0.3, // Slower, calmer movement
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2,
                alpha: Math.random() * 0.5 + 0.1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        // BATCH DRAWING: Draw all dots first
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        this.ctx.beginPath();

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Soft Bounce
            if (p.x < 0 || p.x > this.w) p.vx *= -1;
            if (p.y < 0 || p.y > this.h) p.vy *= -1;

            this.ctx.moveTo(p.x, p.y);
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        this.ctx.fill();

        // BATCH DRAWING: Draw connections
        // We use a fixed color for efficiency: faint white
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();

        // N^2 Loop Optimization: 
        // 1. Reduced particle count in init
        // 2. Strict distance cap (80px)
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // Mouse Interaction (Aggressive but batched per particle logic if needed, 
            // but for LINES it's faster to batch here)
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                // Push particles away slightly (Parallax)
                p.x -= dx * 0.02;
                p.y -= dy * 0.02;
            }

            // Connect Neighbors
            // Optimization: Only check next 15 particles to avoid full N^2 scan while keeping randomness
            const checkLimit = Math.min(this.particles.length, i + 15);
            for (let j = i + 1; j < checkLimit; j++) {
                const p2 = this.particles[j];
                const d2 = Math.abs(p.x - p2.x) + Math.abs(p.y - p2.y); // Manhattan approx for speed first
                if (d2 < 100) { // Broad check
                    if (Math.hypot(p.x - p2.x, p.y - p2.y) < 80) { // Precise check
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                    }
                }
            }
        }
        this.ctx.stroke();

        // MOUSE CONNECTIONS (Separate Batch for different color)
        this.ctx.strokeStyle = "rgba(78, 205, 196, 0.4)";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            if (Math.abs(dx) < 150 && Math.abs(dy) < 150) { // Fast box check
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(mouse.x, mouse.y);
                }
            }
        }
        this.ctx.stroke();

        requestAnimationFrame(() => this.animate());
    }
}

/* =========================================
   2. NEURAL SPHERE (The New SoulBot)
   ========================================= */
class NeuralSphere {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.rotation = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };

        this.resize();
        this.initSphere(250); // Number of neurons
        this.animate();
    }

    resize() {
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);

        this.width = rect.width;
        this.height = rect.height;
        this.cx = this.width / 2;
        this.cy = this.height / 2;
        this.radius = Math.min(this.width, this.height) * 0.35; // Size of sphere
    }

    initSphere(count) {
        // Fibonacci Sphere Algorithm for even distribution
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden Angle
        for (let i = 0; i < count; i++) {
            const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
            const radius = Math.sqrt(1 - y * y); // Radius at y
            const theta = phi * i;

            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;

            this.points.push({
                x: x * this.radius,
                y: y * this.radius,
                z: z * this.radius,
                originX: x * this.radius,
                originY: y * this.radius,
                originZ: z * this.radius,
                pulse: Math.random() * Math.PI, // Independent blink phase
                color: Math.random() > 0.8 ? '#F49F75' : '#4ECDC4' // Peach accents, Teal dominant
            });
        }
    }

    rotate3D(point, rotX, rotY) {
        // Rotate Y (Horizontal Mouse)
        let x1 = point.x * Math.cos(rotY) - point.z * Math.sin(rotY);
        let z1 = point.z * Math.cos(rotY) + point.x * Math.sin(rotY);

        // Rotate X (Vertical Mouse)
        let y1 = point.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = z1 * Math.cos(rotX) + point.y * Math.sin(rotX);

        return { x: x1, y: y1, z: z2 };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Calculate Rotation based on mouse
        // Map mouse position to -PI to PI
        const targetX = (mouse.y - window.innerHeight / 2) * 0.005; // Pitch
        const targetY = (mouse.x - window.innerWidth / 2) * 0.005; // Yaw

        // Smooth interpolation (Ease out)
        this.rotation.x += (targetX - this.rotation.x) * 0.05;
        this.rotation.y += (targetY - this.rotation.y) * 0.05;

        // Auto rotation drift
        const time = Date.now() * 0.001;
        const autoRot = time * 0.2;

        // 2. Draw Core Glow (Central Brain)
        const glow = this.ctx.createRadialGradient(this.cx, this.cy, this.radius * 0.2, this.cx, this.cy, this.radius * 1.5);
        glow.addColorStop(0, 'rgba(78, 205, 196, 0.1)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(this.cx, this.cy, this.radius * 1.5, 0, Math.PI * 2);
        this.ctx.fill();

        // 3. Process Points
        this.points.forEach(p => {
            // Apply Rotation
            let rotated = this.rotate3D({ x: p.originX, y: p.originY, z: p.originZ }, this.rotation.x, this.rotation.y + autoRot);

            // Perspective Projection
            const fov = 300;
            const scale = fov / (fov + rotated.z);
            const x2d = rotated.x * scale + this.cx;
            const y2d = rotated.y * scale + this.cy;

            // Pulse Effect
            const alpha = (Math.sin(time * 2 + p.pulse) + 1) / 2 * 0.8 + 0.2;
            const size = (scale * 2) * ((rotated.z + this.radius) / (this.radius * 2) + 0.5); // Depth sorting visual

            // Draw Node
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = alpha;
            this.ctx.beginPath();
            this.ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;

            // Draw Connections (Neural Synapses) - Only short ones
            // Optimization: Only check a few neighbors or random subset? 
            // Better: Just draw connections if they appear close in 2D space? No, 3D space.
            // For simple visual, connect if origin distance is close.

            // Since this is N^2, skip for performance or use precomputed neighbors. 
            // Let's just draw lines to center for "Star Burst" effect occasionally?
        });

        // 4. Draw Outer "Data Ring"
        this.ctx.strokeStyle = 'rgba(78, 205, 196, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.ellipse(this.cx, this.cy, this.radius * 1.2, this.radius * 0.4, time * 0.5, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.strokeStyle = 'rgba(244, 159, 117, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(this.cx, this.cy, this.radius * 1.1, this.radius * 1.1, time * -0.2, 0, Math.PI * 2);
        this.ctx.stroke();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ConstellationField('particles');
    if (document.getElementById('neural-canvas')) {
        new NeuralSphere('neural-canvas');
    }
});
