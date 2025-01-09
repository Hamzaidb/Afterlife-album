let img;
let currentSrc = "/assets/Afterlife_blue.jpg";
let src2 = "/assets/Afterlife_orange_grey.jpg";
let src3 = "/assets/Afterlife_red.jpg";
let src4 = "/assets/Afterlife_blue.jpg";
let src5 = "/assets/Afterlife_grey.jpg";
let src6 = "/assets/Afterlife_red_white.jpg";
let src7 = "/assets/Afterlife_doree.jpg";
let src8 = "/assets/Afterlife_white.jpg";

let ws;
let isAnimating = true;
let stopTimeout;
let currentBackgroundBrightness = 0;
let generationDuration = 5000;

function preload() {
    img = loadImage(currentSrc);
}

function updateDuration(seconds) {
    generationDuration = seconds * 1000;
    document.getElementById('duration-value').textContent = seconds + 's';
    if (isAnimating) {
        startAnimation();
    }
}

function updateImage(newSrc) {
    currentSrc = newSrc;
    img = loadImage(currentSrc, () => {
        console.log("Image updated to:", currentSrc);
        init();
        redrawCanvas();
    });
}

function redrawCanvas() {
    clear();
    drawCanvasBackground();
    for (let w of ws) {
        w.render();
    }
}

class LerpVal {
    constructor(min, max, amt, chance) {
        this.min = min;
        this.max = max;
        this.val = random(min, max);
        this.goalVal = this.val;
        this.amt = amt;
        this.chance = chance;
    }

    update() {
        this.val = lerp(this.val, this.goalVal, this.amt);
        if (random() < this.chance) this.goalVal = random(this.min, this.max);
    }

    setBounds(newMin, newMax) {
        this.min = newMin;
        this.max = newMax;
        this.goalVal = random(this.min, this.max);
    }
}

class Rect {
    constructor() {
        this.x = random(img.width);
        this.y = random(img.height);
        this.w = new LerpVal(20, 150, 0.01, 0.05);
        this.h = new LerpVal(20, 150, 0.01, 0.05);
        let a = random(PI * 9);
        this.dx = cos(a) * 0.2;
        this.dy = sin(a) * 0.2;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < this.w.val || this.x - this.w.val > img.width) this.dx *= -1;
        if (this.y < this.h.val || this.y - this.h.val > img.height) this.dy *= -1;
        this.w.update();
        this.h.update();
    }
}

class Wanderer {
    constructor(w, h) {
        this.x = random(width);
        this.y = random(height);
        this.w = new LerpVal(20, 100, 0.01, 0.05);
        this.h = new LerpVal(20, 100, 0.01, 0.05);
        this.a = new LerpVal(-PI * 2, PI * 2, 0.005, 0.01);
        this.dh = new LerpVal(-0.01, 0.01, 0.05, 0.01);
        this.heading = 0;
        this.speed = 0.9;
        this.rect = new Rect();
    }

    update() {
        this.x += cos(this.heading) * this.speed;
        this.y += sin(this.heading) * this.speed;
        this.heading += this.dh.val;
        if (this.x < 0) this.x += width;
        if (this.x > width) this.x -= width;
        if (this.y < 0) this.y += height;
        if (this.y > height) this.y -= height;
        this.a.update();
        this.dh.update();
        this.rect.update();
    }

    render() {
        push();
        translate(this.x, this.y);
        this._drawImage();
        pop();
    }

    _drawImage() {
        let v = createVector(cos(this.heading - this.a.val), sin(this.heading - this.a.val));
        if (v.dot(createVector(0, -1)) > 0)
            image(
                img,
                -this.w.val / 2,
                -this.h.val / 2,
                this.w.val,
                1,
                this.rect.x - this.rect.w.val / 2,
                this.rect.y - this.rect.h.val / 2,
                this.rect.w.val,
                1
            );
        if (v.dot(createVector(0, 1)) > 0)
            image(
                img,
                -this.w.val / 2,
                this.h.val / 2,
                this.w.val,
                1,
                this.rect.x + this.rect.w.val / 2,
                this.rect.y - this.rect.h.val / 2,
                this.rect.w.val,
                1
            );
    }
}

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent("canvas-container2");
    pixelDensity(1);
    colorMode(HSB, 1, 1, 1);
    init();
    startAnimation();
    drawCanvasBackground();
    img = loadImage(currentSrc, () => {
        console.log("Initial image loaded:", currentSrc);
        init();
        startAnimation();
        drawCanvasBackground();
    });
}

function drawCanvasBackground() {
    background(0, 0, currentBackgroundBrightness);
}

function init() {
    ws = [];
    for (let i = 0; i < 15; i++) {
        ws.push(new Wanderer());
    }
    background(0);
}

function draw() {
    if (!isAnimating) return;

    for (let i = 0; i < 10; i++) {
        for (let w of ws) {
            w.update();
            w.render();
        }
    }
}

function startAnimation() {
    isAnimating = true;

    if (stopTimeout) clearTimeout(stopTimeout);

    stopTimeout = setTimeout(() => {
        isAnimating = false;
        console.log(`Animation stoppée après ${generationDuration/1000} secondes.`);
    }, generationDuration);
}

function mousePressed() {
    if (!isAnimating) {
        init();
        startAnimation();
        console.log("Animation redémarrée.");
    }
}

// Event Listeners
document.getElementById("duration-slider").addEventListener("input", (e) => {
    updateDuration(parseInt(e.target.value));
});

document.getElementById("btn2").addEventListener("click", () => updateImage(src2));
document.getElementById("btn3").addEventListener("click", () => updateImage(src3));
document.getElementById("btn4").addEventListener("click", () => updateImage(src5));
document.getElementById("btn1").addEventListener("click", () => updateImage(src4));
document.getElementById("btn5").addEventListener("click", () => updateImage(src6));
document.getElementById("btn6").addEventListener("click", () => updateImage(src7));