let img;
let currentSrc = "https://images.squarespace-cdn.com/content/v1/6195288d4315b3125cd7af80/c4dd9495-2f81-41b9-b976-9c1db6635351/AL51___FINAL_PLAIN.jpg";
let src2 = "https://images.squarespace-cdn.com/content/v1/6195288d4315b3125cd7af80/511d579b-d512-40e7-96e7-ce68eeb3413c/AL48______FINAL.jpg";
let src3 = "https://images.squarespace-cdn.com/content/v1/6195288d4315b3125cd7af80/8d692300-2dc6-4b45-9b38-493599f165f5/AL079-PACKSHOT.jpg";

function preload() {
    img = loadImage(currentSrc);
}

function updateImage(newSrc) {
    currentSrc = newSrc;
    img = loadImage(currentSrc, () => {
        console.log("Image updated to:", currentSrc);
        init(); // Réinitialise les Wanderers
        redrawCanvas(); // Redessine le canvas
    });
}

let maxWidth = 100; // Largeur maximale par défaut
let maxHeight = 100; // Hauteur maximale par défaut

document.getElementById("bg-color-slider").addEventListener("input", (event) => {
  let hue = parseFloat(event.target.value); // Récupère la valeur du slider
  background(hue, 1, 1); // Change le fond
  console.log(`Couleur de fond mise à jour: teinte=${hue}`);
});


document.getElementById("width-slider").addEventListener("input", (event) => {
    maxWidth = parseInt(event.target.value);
    updateShapeDimensions();
});

document.getElementById("height-slider").addEventListener("input", (event) => {
    maxHeight = parseInt(event.target.value);
    updateShapeDimensions();
});

function updateShapeDimensions() {
  for (let w of ws) {
      w.w.setBounds(20, maxWidth); // Largeur dynamique
      w.h.setBounds(20, maxHeight); // Hauteur dynamique
  }
  console.log(`Dimensions mises à jour: largeur max=${maxWidth}, hauteur max=${maxHeight}`);
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
    // Met également à jour l'objectif pour refléter les nouvelles bornes
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
    this.w = new LerpVal(20, 50, 0.01, 0.05);
    this.h = new LerpVal(20, 50, 0.01, 0.05);
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
    rotate(this.a.val);
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
    pop();
  }
}
let ws;
let isAnimating = true; // Contrôle de l'état d'animation
let stopTimeout; // Variable pour stocker le timeout

function setup() {
  let canvas = createCanvas(600, 600); // Définit la taille du canvas
  canvas.parent("canvas-container2"); // Associe ce canvas à l'élément HTML avec l'ID canvas-container2
  pixelDensity(1);
  colorMode(HSB, 1, 1, 1);
  init();
  startAnimation();
}

function init() {
  ws = [];
  for (let i = 0; i < 15; i++) {
    ws.push(new Wanderer());
  }
  background(0);
}

function draw() {
  if (!isAnimating) return; // Ne dessine plus si l'animation est arrêtée

  for (let i = 0; i < 10; i++) {
    for (let w of ws) {
      w.update();
      w.render();
    }
  }
}

function startAnimation() {
  isAnimating = true;

  // Si un timeout précédent existe, on le supprime
  if (stopTimeout) clearTimeout(stopTimeout);

  // Arrêter l'animation après 5 secondes
  stopTimeout = setTimeout(() => {
    isAnimating = false;
    console.log("Animation stoppée après 5 secondes.");
  }, 5000);
}

// Lorsqu'on clique, redémarre l'animation
function mousePressed() {
  if (!isAnimating) {
    init(); // Réinitialise les wanderers
    startAnimation(); // Redémarre l'animation avec un nouveau timeout
    console.log("Animation redémarrée.");
  }
}

document.getElementById("btn1").addEventListener("click", () => updateImage(src));
document.getElementById("btn2").addEventListener("click", () => updateImage(src2));
document.getElementById("btn3").addEventListener("click", () => updateImage(src3));
