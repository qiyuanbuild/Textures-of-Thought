let particles = [];
let flowField = [];
let cols, rows;
let scale = 900;

let zoff = 0;
let particleCount;

function setup() {
  createCanvas(900, 900);
  colorMode(HSB, 360, 100, 100, 100);
  particleCount = floor(random(6000, 9001));
  background(0);

  cols = floor(width / scale);
  rows = floor(height / scale);

  flowField = new Array(cols * rows);

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  let yoff = 0;

  // build flow field
  for (let y = 0; y < rows; y++) {
    let xoff = 0;

    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;

      let angle = noise(xoff, yoff, zoff) * TWO_PI * 2;

      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);

      flowField[index] = v;

      xoff += 0.1;
    }

    yoff += 0.1;
  }

  zoff += 0.002;

  // update particles
  for (let p of particles) {
    p.follow(flowField);
    p.update();
    p.edges();
    p.show();
  }
}

// ---------------- PARTICLE ----------------

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.prev = this.pos.copy();

    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.maxSpeed = 2;
  }

  follow(vectors) {
    let x = floor(this.pos.x / scale);
    let y = floor(this.pos.y / scale);

    let index = x + y * cols;

    let force = vectors[index];
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);

    this.pos.add(this.vel);

    this.acc.mult(0);
  }

  show() {
    // spatial color field
    let hue = noise(this.pos.x * 0.002, this.pos.y * 0.002) * 360;

    stroke(hue, 60, 100, 8);
    strokeWeight(0.8);

    line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);

    this.prev = this.pos.copy();
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prev = this.pos.copy();
    }

    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prev = this.pos.copy();
    }

    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prev = this.pos.copy();
    }

    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prev = this.pos.copy();
    }
  }
}

// save image

function keyPressed() {
  if (key === "s") {
    saveCanvas("thought_topographies", "png");
  }
}
