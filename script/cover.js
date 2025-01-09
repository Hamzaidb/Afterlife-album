let img;
let currentSrc = "/assets/Afterlife_blue.jpg";
let src2 = "/assets/Afterlife_orange_grey.jpg";
let src3 = "/assets/Afterlife_red.jpg";
let src4 = "/assets/Afterlife_blue.jpg";
let src5 = "/assets/Afterlife_grey.jpg";
let src6 = "/assets/Afterlife_red_white.jpg";
let src7 = "/assets/Afterlife_doree.jpg";
let src8 = "/assets/Afterlife_white.jpg";


function preload() {
    img = loadImage(currentSrc);
}


function updateImage(newSrc) {
  currentSrc = newSrc;
  img = loadImage(currentSrc, () => {
      console.log("Image updated to:", currentSrc);
      init(); // Réinitialise les Wanderers
      redrawCanvas(); // Redessine immédiatement le canvas
  });
}

function redrawCanvas() {
  clear(); // Efface le canvas actuel
  drawCanvasBackground(); // Redessine l'arrière-plan
  for (let w of ws) {
      w.render(); // Affiche les Wanderers
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

  // Méthode pour dessiner l'image, appelée dans render()
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


let ws;
let isAnimating = true; // Contrôle de l'état d'animation
let stopTimeout; // Variable pour stocker le timeout

let currentBackgroundBrightness = 0; 


function setup() {
  let canvas = createCanvas(600, 600); // Définit la taille du canvas
  canvas.parent("canvas-container2"); // Associe ce canvas à l'élément HTML avec l'ID canvas-container2
  pixelDensity(1);
  colorMode(HSB, 1, 1, 1);
  init();
  startAnimation();
  drawCanvasBackground(); 
  img = loadImage(currentSrc, () => {
      console.log("Initial image loaded:", currentSrc);
      init(); // Initialise les Wanderers
      startAnimation(); // Démarre l'animation
      drawCanvasBackground();
  });
}

function drawCanvasBackground() {
  background(0, 0, currentBackgroundBrightness); // Fond basé sur la luminosité
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
  }, 7000);
}

// Lorsqu'on clique, redémarre l'animation
function mousePressed() {
  if (!isAnimating) {
    init(); // Réinitialise les wanderers
    startAnimation(); // Redémarre l'animation avec un nouveau timeout
    console.log("Animation redémarrée.");
  }
}

//document.getElementById("btn1").addEventListener("click", () => updateImage(currentSrc));
document.getElementById("btn2").addEventListener("click", () => updateImage(src2));
document.getElementById("btn3").addEventListener("click", () => updateImage(src3));
document.getElementById("btn4").addEventListener("click", () => updateImage(src5));
document.getElementById("btn1").addEventListener("click", () => updateImage(src4));
document.getElementById("btn5").addEventListener("click", () => updateImage(src6));
document.getElementById("btn6").addEventListener("click", () => updateImage(src7));
document.getElementById("btn7").addEventListener("click", () => updateImage(src8));



