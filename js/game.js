let keys, ball, fix;
const dim = 800;
const r = 1000; //  Station radius in meters
const rr = -0.01; // Rotation rate in radians per second

function setup() {
  createCanvas(dim, dim);
  smooth();
  keys = [];
  fix = [];
  ball = new Ball(1, 40, color(50, 150, 250));
  for (let i = 0; i < 30; i++) {
    fix[i] = new Ball(0, 20, color(169, 169, 169), (i * Math.PI) / 6);
  }
}

function keyPressed() {
  keys[keyCode] = true;
}

function keyReleased() {
  keys[keyCode] = false;
}

function draw() {
  background(235);
  ball.update();
  for (let i = 0; i < 30; i++) {
    fix[i].update();
  }
  translate(dim / 2, dim / 2);
  rotate(-ball.p.heading() + Math.PI / 2);
  translate(-ball.p.x, -ball.p.y);
  noFill();
  stroke(0);
  strokeWeight(1);
  ellipse(0, 0, r * 2, r * 2);
  ball.draw();
  for (let i = 0; i < 30; i++) {
    fix[i].draw();
  }
}

class Ball {
  constructor(user, size, color, angle = 0) {
    this.u = user;
    this.c = color;
    this.s = size;
    this.p = createVector(0, r - this.s / 2);
    this.v = createVector(rr, 0);
    this.p.rotate(angle);
    this.v.rotate(angle);
    this.vt = 0; // Velocity tangential, used when landed
    this.l = false;
  }

  move() {
    var rv = rr * this.p.mag(); // The speed of the ground
    if (this.l) {
      if (keys[UP_ARROW]) {
        this.v.add(p5.Vector.mult(this.p, -5 / this.p.mag()));
        this.l = false;
      }
      if (keys[RIGHT_ARROW] && this.vt > rv - 10) {
        this.vt = max(rv - 2, this.vt - 1);
      }
      if (keys[LEFT_ARROW] && this.vt < rv + 10) {
        this.vt = min(rv + 2, this.vt + 1);
      }
    }
  }

  update() {
    var rv = rr * this.p.mag(); // The speed of the ground
    if (this.u) {
      this.move();
    }
    if (this.l) {
      // Friction: Tries to match ground velocity
      if (this.vt < rv) {
        this.vt = min(rv, this.vt + 0.2);
      }
      if (this.vt > rv) {
        this.vt = max(rv, this.vt - 0.2);
      }
      this.v.rotate(this.p.heading() + Math.PI / 2 - this.v.heading());
      this.v.setMag(this.vt); 
      this.p.rotate(this.vt / this.p.mag());
      console.log(this.vt);
    } else {
      this.p.add(this.v);
      if (this.p.mag() >= r - this.s / 2) {
        this.l = true;
        this.p.setMag(r - this.s / 2);
      }
    }
  }

  draw() {
    noStroke();
    fill(this.c);
    ellipse(this.p.x, this.p.y, this.s, this.s);
  }
}
