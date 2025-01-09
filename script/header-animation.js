window.onload = function(){
    const canvas = document.getElementById('canvas-header');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    console.log('loaded');
}

const mouse = {
    x: 0,
    y: 0,
}

window.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
});



class FlowFieldEffect {
    #ctx;
    #width;
    #height;
    #count;
    #radius;
    constructor(ctx, width, height, gradient) {
        this.#ctx = ctx;
        this.#ctx.lineWidth = 0.9;
        this.#width = width;
        this.#height = height;
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.#radius = 3.5;
        this.vr = 0.03;
        this.#mapField();
        this.timer = 0;
        this.cellSize = 15;
        this.interval = 1000/60;
        this.timer = 0;
        this.lastTime = 0;
    }
  
    #createGradient() {
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop("0.1", "rgb(20, 20, 20)");   // Gris très foncé
        this.gradient.addColorStop("0.3", "rgb(80, 80, 80)");   // Gris foncé
        this.gradient.addColorStop("0.5", "rgb(150, 150, 150)"); // Gris moyen
        this.gradient.addColorStop("0.7", "rgb(200, 200, 200)"); // Gris clair
        this.gradient.addColorStop("0.9", "rgb(240, 240, 240)"); // Presque blanc
    }
    
    #mapField(timeStamp){
        let deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        if (this.timer > this.interval){
            this.#ctx.fillStyle = 'rgba(10, 10, 10, 0.1)'; // Gris très foncé semi-transparent

            this.#ctx.clearRect(0,0,this.#width, this.#height);
            
            this.#radius += this.vr;
            if (this.#radius > 5  || this.#radius < -5) this.vr *= -1
            for (let y = 0; y < this.#height; y+= this.cellSize){
                for (let x = 0; x < this.#width; x += this.cellSize){
                    const angle = this.#getValue(x, y);
                    this.#draw(angle,x,y);
                }
            }
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }

        requestAnimationFrame(this.#mapField.bind(this));

    }
    #getValue(x, y){
        return (Math.cos(mouse.y/3 * x * 0.00005) + Math.sin(mouse.x/3 * y * 0.00005)) * this.#radius;
    }
    #draw(angle,x,y){
        let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = (dx * dx + dy * dy);
        let length = distance > 150000 ? distance : 150000;
        if (length > 900000) length = 900000;

       
        this.#ctx.beginPath();
        this.#ctx.moveTo(positionX,positionY);
        this.#ctx.lineTo(positionX+Math.cos(angle) * length/10000, positionY+Math.sin(angle) * length/10000);
        
        this.#ctx.stroke();
    }
}