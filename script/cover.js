let minYchange = 0;
let maxYchange = 50;
let layers = 8;
let rotStripe = 0;
let lines = true;
let alph = 255;
let colRand = false;  
let filling = true;
let colorLines = false;
let sw = 3;
let extraBlack = 0;
let extraBlackAlph = 255;
let r, g, b;



function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-container2");

   document.getElementById('minYchange').addEventListener('input', function() {
    minYchange = parseInt(this.value);
    document.getElementById('minYchangeValue').textContent = minYchange;
    redraw();
  });

  document.getElementById('maxYchange').addEventListener('input', function() {
    maxYchange = parseInt(this.value);
    document.getElementById('maxYchangeValue').textContent = maxYchange;
    redraw();
  });

  document.getElementById('layers').addEventListener('input', function() {
    layers = parseInt(this.value);
    redraw();
  });

  document.getElementById('rotStripe').addEventListener('input', function() {
    rotStripe = parseInt(this.value);
    redraw();
  });

  canvas.mousePressed(setup);
  if (lines == true) {
    stroke(0, 0, 0, extraBlackAlph);
    strokeWeight(sw);
  } else {
    noStroke();
  }
  angleMode(DEGREES);
  
  let colorChoice = random(["red", "green", "blue", "beige", "purple", "yellow", "orange", "grey"]);

  let end = height / 2 + 500;
  for (let i = 0; i < layers; i++) {
    let y1;
    if (i == 0) {
      y1 = -height / 2 - 300;
    } else {
      y1 = -height / 2 + (height / layers) * i;
    }
    let y2 = y1, y3 = y1, y4 = y1, y5 = y1, y6 = y1;
    let rotLayer = random(359);
    let rotThisStripe = 0;
    while (
      (y1 < end) & 
      (y2 < end) & 
      (y3 < end) & 
      (y4 < end) & 
      (y5 < end) & 
      (y6 < end) & 
      (-maxYchange < minYchange)
    ) {
      y1 += random(minYchange, maxYchange);
      y2 += random(minYchange, maxYchange);
      y3 += random(minYchange, maxYchange);
      y4 += random(minYchange, maxYchange);
      y5 += random(minYchange, maxYchange);
      y6 += random(minYchange, maxYchange);
      
      // Génération des nuances de couleur selon le choix aléatoire
      if (colRand == false) {
        if (colorChoice === "red") {
          r = random(255);  // Rouge entre 0 et 255
          g = 0;            // Vert fixe à 0
          b = 0;            // Bleu fixe à 0
        } else if (colorChoice === "green") {
          r = 0;            // Rouge fixe à 0
          g = random(255);  // Vert entre 0 et 255
          b = 0;            // Bleu fixe à 0
        } else if (colorChoice === "blue") {
          r = 0;            // Rouge fixe à 0
          g = 0;            // Vert fixe à 0
          b = random(255);  // Bleu entre 0 et 255
        } else if (colorChoice === "pink") {
          r = random(255);  // Rouge entre 0 et 255
          g = random(100);  // Vert entre 0 et 100 pour donner une teinte rose
          b = random(255);  // Bleu entre 0 et 255 pour une nuance de rose
        } else if (colorChoice === "beige") {
          r = random(200, 255);  // Rouge entre 200 et 255
          g = random(150, 220);  // Vert entre 150 et 220
          b = random(100, 180);  // Bleu entre 100 et 180
        } else if (colorChoice === "purple") {
          r = random(100, 255);  // Rouge entre 100 et 255
          g = random(0, 100);    // Vert entre 0 et 100
          b = random(150, 255);  // Bleu entre 150 et 255
        } else if (colorChoice === "yellow") {
          r = random(200, 255);  // Rouge entre 200 et 255
          g = random(200, 255);  // Vert entre 200 et 255
          b = 0;                  // Bleu fixe à 0
        } else if (colorChoice === "orange") {
          r = random(200, 255);  // Rouge entre 200 et 255
          g = random(100, 150);  // Vert entre 100 et 150
          b = 0;                  // Bleu fixe à 0
        } else if (colorChoice === "gray") {
          r = random(50, 200);  // Gris moyen entre 50 et 200
          g = r;                // Rouge et vert égaux pour un gris
          b = r;                // Bleu égal au rouge et vert pour un gris
        }
      }
      
      
      if (filling == true) {
        fill(r, g, b, alph);
      } else {
        noFill();
      }
      
      if (colorLines == true) {
        stroke(r, g, b, alph);
      }
      
      push();
      translate(width / 2, height / 2);
      rotThisStripe += rotStripe;
      rotate(rotThisStripe + rotLayer);
      let xStart = -width / 2;
      beginShape();
      curveVertex(xStart - 300, height / 2 + 500);
      curveVertex(xStart - 300, y1);
      curveVertex(xStart + (width / 5) * 1, y2);
      curveVertex(xStart + (width / 5) * 2, y3);
      curveVertex(xStart + (width / 5) * 3, y4);
      curveVertex(xStart + (width / 5) * 4, y5);
      curveVertex(width / 2 + 300, y6);
      curveVertex(width / 2 + 300, height / 2 + 500);
      endShape(CLOSE);
      pop();
    }
  }
}


function keyTyped() {
    if (key === "s") {
      saveCanvas("myCoverAfterlife", "jpg");
    }
  }
  
