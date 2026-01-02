/**
 * SOULBOT VISUALS
 * Handles the "Gravity Mesh" background and the "SoulEarth" avatar animation.
 */

// Global Mouse State (Shared)
const mouse = { x: -1000, y: -1000 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});


/* =========================================
   1. GRAVITY FIELD (Antigravity Background)
   ========================================= */
class GravityField {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.gap = 50; // Distance between grid points

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.initGrid();
    }

    initGrid() {
        this.points = [];
        const cols = Math.ceil(this.w / this.gap);
        const rows = Math.ceil(this.h / this.gap);

        for (let x = 0; x <= cols; x++) {
            for (let y = 0; y <= rows; y++) {
                this.points.push({
                    baseX: x * this.gap,
                    baseY: y * this.gap,
                    x: x * this.gap,
                    y: y * this.gap,
                    vx: 0,
                    vy: 0,
                    mass: Math.random() * 2 + 1 // Random lightness
                });
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        // Physics Loop
        for (let p of this.points) {
            // 1. Mouse Repulsion / Attraction
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 200;

            if (dist < maxDist) {
                const force = (maxDist - dist) / maxDist; // 0 to 1
                const angle = Math.atan2(dy, dx);
                // Push away
                const push = force * 15;
                p.vx -= Math.cos(angle) * push;
                p.vy -= Math.sin(angle) * push;
            }

            // 2. Spring Back (Return to home)
            const hdx = p.baseX - p.x;
            const hdy = p.baseY - p.y;

            p.vx += hdx * 0.05; // Spring stiffness
            p.vy += hdy * 0.05;

            // 3. Friction
            p.vx *= 0.85;
            p.vy *= 0.85;

            // Apply
            p.x += p.vx;
            p.y += p.vy;

            // Draw Point
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * p.mass})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}


/* =========================================
   2. SOUL EARTH (Avatar System)
   ========================================= */
class SoulEarth {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // Configuration
        this.orbits = [
            { radius: 40, angle: 0, speed: 0.02, particles: 2 },
            { radius: 70, angle: 45, speed: 0.015, particles: 3 },
            { radius: 110, angle: -45, speed: 0.01, particles: 1 },
            { radius: 130, angle: 90, speed: 0.005, particles: 2 }
        ];

        // Particle State
        this.satellites = [];
        this.initSatellites();

        this.resize();
        this.animate();
    }

    resize() {
        // Assume fixed size container for avatar usually, but handle it
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.cx = this.w / 2;
        this.cy = this.h / 2;
    }

    initSatellites() {
        this.orbits.forEach((orbit, i) => {
            for (let j = 0; j < orbit.particles; j++) {
                this.satellites.push({
                    orbitIndex: i,
                    theta: Math.random() * Math.PI * 2,
                    size: Math.random() * 3 + 2,
                    color: i % 2 === 0 ? '#4ECDC4' : '#F49F75' // Teal/Peach
                });
            }
        });
    }

    drawEllipse(ctx, x, y, radiusX, radiusY, rotation) {
        ctx.beginPath();
        ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        // 1. Draw Core (Earth)
        const gradient = this.ctx.createRadialGradient(this.cx, this.cy, 5, this.cx, this.cy, 25);
        gradient.addColorStop(0, '#4ECDC4');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.cx, this.cy, 20, 0, Math.PI * 2);
        this.ctx.fill();

        // 2. Draw Orbits & Satellites
        this.orbits.forEach((orbit, i) => {
            // Draw Orbit Path (Flattened for 3D effect)
            // We simulate 3D rotation by squashing Y radius
            const rx = orbit.radius;
            const ry = orbit.radius * 0.4; // Squash factor
            const rot = (orbit.angle * Math.PI) / 180;

            this.ctx.save();
            this.ctx.translate(this.cx, this.cy);
            this.ctx.rotate(rot);

            // Draw path
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(78, 205, 196, 0.1)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            this.ctx.restore();
        });

        // 3. Update & Draw Satellites
        this.satellites.forEach(sat => {
            const orbit = this.orbits[sat.orbitIndex];

            // Move
            sat.theta += orbit.speed;

            // Calculate Position (2D projection of 3D orbit)
            const rx = orbit.radius;
            const ry = orbit.radius * 0.4;
            const rot = (orbit.angle * Math.PI) / 180;

            // Point on unrotated ellipse
            const px = rx * Math.cos(sat.theta);
            const py = ry * Math.sin(sat.theta);

            // Rotate point
            const x = px * Math.cos(rot) - py * Math.sin(rot) + this.cx;
            const y = px * Math.sin(rot) + py * Math.cos(rot) + this.cy;

            // Depth Scale (fake z-index sizing)
            // Z would be roughly sin(theta) if we view from top, but simplified:
            // Moving "behind" earth?

            this.ctx.fillStyle = sat.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = sat.color;

            this.ctx.beginPath();
            this.ctx.arc(x, y, sat.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        requestAnimationFrame(() => this.animate());
    }
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // 1. Init Background
    new GravityField('particles');

    // 2. Init Avatar (if exists)
    // Try to find the canvas, if not found, it might be on another page or hidden
    const avatarCanvas = document.getElementById('neural-canvas');
    if (avatarCanvas) {
        new SoulEarth('neural-canvas');
    }
});
