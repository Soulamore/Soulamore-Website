
// --- NEURAL ORB CANVAS ANIMATION ---
(function () {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;

    // Configuration
    const particles = [];
    const particleCount = 60;
    const globeRadius = 90;
    const colors = ['#4ECDC4', '#F49F75', '#e2e8f0', '#2dd4bf']; // Theme colors

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            // Random point on sphere surface
            this.theta = Math.random() * Math.PI * 2;
            this.phi = Math.acos((Math.random() * 2) - 1);

            this.x = 0;
            this.y = 0;
            this.z = 0;

            this.speedTheta = (Math.random() - 0.5) * 0.05;
            this.speedPhi = (Math.random() - 0.5) * 0.05;

            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.theta += this.speedTheta;
            this.phi += this.speedPhi;

            // Convert spherical to cartesian
            this.x = globeRadius * Math.sin(this.phi) * Math.cos(this.theta);
            this.y = globeRadius * Math.sin(this.phi) * Math.sin(this.theta);
            this.z = globeRadius * Math.cos(this.phi);

            // Simple rotation of the whole globe
            const time = Date.now() * 0.001;
            const rotX = this.x * Math.cos(time) - this.z * Math.sin(time);
            const rotZ = this.x * Math.sin(time) + this.z * Math.cos(time);
            this.x = rotX;
            this.z = rotZ;
        }

        draw() {
            const perspective = 300;
            const scale = perspective / (perspective + this.z);
            const activeX = width / 2 + this.x * scale;
            const activeY = height / 2 + this.y * scale;

            // Size modulation by depth
            const currentSize = this.size * scale;

            ctx.beginPath();
            ctx.arc(activeX, activeY, Math.max(0, currentSize), 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, (scale - 0.5) * 2); // Fade at back
            ctx.fill();

            // Connection lines (optional, mimics neural network)
            /*
            particles.forEach(p => {
                const d = Math.hypot(p.x - this.x, p.y - this.y, p.z - this.z);
                if(d < 40 && Math.random() > 0.9) {
                    ctx.beginPath();
                    ctx.moveTo(activeX, activeY);
                    //... expensive to calculate perspective for both every frame
                }
            });
            */
        }
    }

    // Initialize
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw Core Glow
        const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, globeRadius * 1.5);
        grad.addColorStop(0, 'rgba(78, 205, 196, 0.1)'); // Inner Teal
        grad.addColorStop(0.5, 'rgba(15, 23, 42, 0)'); // Fade out
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Draw connecting halo rings (Swirls)
        const time = Date.now() * 0.002;
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.strokeStyle = 'rgba(78, 205, 196, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Ellipse 1
        ctx.ellipse(0, 0, globeRadius + 10, globeRadius - 20, time, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(244, 159, 117, 0.3)';
        ctx.beginPath();
        // Ellipse 2
        ctx.ellipse(0, 0, globeRadius - 10, globeRadius + 20, -time * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Sort for depth
        particles.sort((a, b) => b.z - a.z);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
})();
