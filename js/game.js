let keys, ball, fix;
const dim = 800;
const rotation = 1000;
const rotationRate = 10;

function setup() {
  createCanvas(dim, dim);
  smooth();
  angleMode('degrees');
  keys = [];
  fix = [];
  ball = new Ball(1, 40, color(50, 150, 250));
  for (let i = 0; i < 30; i++) {
    fix[i] = new Ball(0, 20, color(169, 169, 169), i * 12);
  }
}

function keyPressed() {
  keys[keyCode] = true;
}

function keyReleased() {
  keys[keyCode] = false;
}

class Ball {
  constructor(user, size, color, angle = 0) {
    this.u = user;
    this.c = color;
    this.s = size;
    this.p = createVector(0, rotation - this.s / 2);
    this.v = createVector(rotationRate, 0);
    this.p.rotate(angle);
    this.v.rotate(angle);
  }

  move() {
    if (this.p.mag() >= rotation - this.s / 2) {
      if (keys[UP_ARROW]) {
        this.v.add(p5.Vector.mult(this.p, -0.01));
      }
      if (keys[LEFT_ARROW] && this.v.mag() > 0.1) {
        this.v.setMag(max(0.1, this.v.mag() - 1));
      }
      if (keys[RIGHT_ARROW] && this.v.mag() < 2 * rotationRate) {
        this.v.setMag(min(2 * rotationRate, this.v.mag() + 1));
      }
    }
  }

  update() {
    if (this.u) {
      this.move();
    }
    this.p.add(this.v);
    if (this.p.mag() >= rotation - this.s / 2) {
      this.p.setMag(rotation - this.s / 2);
      this.v.rotate(this.p.heading() - 90 - this.v.heading());
      // Friction
      if (this.v.mag() <= rotationRate) {
        this.v.setMag(this.v.mag() + 0.2);
      }
      if (this.v.mag() >= rotationRate) {
        this.v.setMag(max(rotationRate, this.v.mag() - 0.2));
      }
      this.v.limit(3 * rotationRate);
    }
  }

  draw() {
    noStroke();
    fill(this.c);
    ellipse(this.p.x, this.p.y, this.s, this.s);
  }
}

function draw() {
  background(235);
  ball.update();
  for (let i = 0; i < 30; i++) {
    fix[i].update();
  }
  translate(dim / 2, dim / 2);
  rotate(-ball.p.heading() + 90);
  translate(-ball.p.x, -ball.p.y);
  noFill();
  stroke(0);
  strokeWeight(1);
  ellipse(0, 0, rotation * 2, rotation * 2);
  ball.draw();
  for (let i = 0; i < 30; i++) {
    fix[i].draw();
  }
}
