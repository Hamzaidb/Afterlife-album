// Ce fichier a été généré à l'aide d'une IA (chatGPT)


const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const duration = 20000;
const loopStart = performance.now();
const logoSrc = "../assets/afterlife_logo.png";
const logo = new Image(1, 1);
logo.src = logoSrc;

let pauseVisualizer = false;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function createGradient(progress) {
    const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    );
    const hue1 = (progress * 360 + 180) % 360;
    const hue2 = (progress * 360) % 360;
    gradient.addColorStop(0, `hsl(${hue1}, 60%, 30%)`);
    gradient.addColorStop(1, `hsl(${hue2}, 80%, 10%)`);
    return gradient;
}

function drawTechnoShapes(progress) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    for (let i = 0; i < 10; i++) {
        const radius = map(i, 0, 10, 50, canvas.width / 2);
        ctx.beginPath();
        ctx.arc(0, 0, radius * (1 + 0.05 * Math.sin(progress * Math.PI * 2 + i)), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - i / 10})`;
        ctx.lineWidth = map(i, 0, 10, 4, 1);
        ctx.stroke();
    }

    for (let i = 0; i < 5; i++) {
        const x1 = random(-canvas.width / 2, canvas.width / 2);
        const y1 = random(-canvas.height / 2, canvas.height / 2);
        const x2 = random(-canvas.width / 2, canvas.width / 2);
        const y2 = random(-canvas.height / 2, canvas.height / 2);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${random(0.1, 0.5)})`;
        ctx.lineWidth = random(0.5, 2);
        ctx.stroke();
    }

    ctx.restore();
}

function drawRotatingLogo(progress) {
    if (!logo.complete) return;

    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const maxWidth = canvas.width * 0.5;
    const aspectRatio = logo.height / logo.width;

    const scale = Math.abs(Math.sin((progress * Math.PI * 2) + Math.PI / 2)); // Start fully visible
    const width = maxWidth * scale;
    const height = maxWidth * aspectRatio;

    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(logo, -width / 2, -height / 2, width, height);
    ctx.restore();
}

// Particles array
const particles = [];

// Create particles
function createParticles(count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: random(0, canvas.width),
            y: random(0, canvas.height),
            size: random(1, 5),
            speedX: random(-0.5, 0.5),
            speedY: random(-0.5, 0.5),
            alpha: random(0.5, 1),
        });
    }
}

// Update and draw particles
function drawParticles() {
    particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap particles around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
        ctx.fill();
    });
}

// Initialize particles
createParticles(50); // Adjust the number of particles


function animateVisualizer() {
    if (pauseVisualizer) {
        requestAnimationFrame(animateVisualizer); // Continue checking even when paused
        return;
    }

    const now = performance.now();
    const elapsed = (now - loopStart) % duration;
    const progress = elapsed / duration;

    // Clear canvas
    ctx.fillStyle = createGradient(progress);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawParticles();
    drawTechnoShapes(progress);
    drawRotatingLogo(progress);

    requestAnimationFrame(animateVisualizer);
}

logo.onload = () => {
    setTimeout(() => {
        pauseVisualizer = true;
    }, 100);
    animateVisualizer();
};
