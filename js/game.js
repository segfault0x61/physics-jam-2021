let keys, ball, fix, platforms;
const dim = 800;
const r = 500; // Station radius in pixels
const rr = -0.01; // rotation rate in radians per frame
const MAX_SPEED = 10;
const FRICTION = 0.5;
const JUMP = 6;

function setup() {
  createCanvas(dim, dim);
  smooth();
  keys = [];
  fix = [];
  platforms = [
    new Platform(r - 150, -0.5, 0.5),
    new Platform(r - 100, HALF_PI - 0.2, HALF_PI + 0.2),
    new Platform(r - 50, HALF_PI + 0.1, QUARTER_PI + HALF_PI + 0.1),
    new Platform(r - 50, QUARTER_PI, HALF_PI),
    new Platform(r, 0, TWO_PI),
  ];
  ball = new Player(1, 40, color(50, 150, 250));
  for (let i = 0; i < 30; i++) {
    fix[i] = new Player(0, 20, color(125, 125, 125), (i * PI) / 6);
  }
}

function keyPressed() {
  keys[keyCode] = true;
}

function keyReleased() {
  keys[keyCode] = false;
}

function collide(r, a, yv, s) {
  for (let i = 0; i < platforms.length; i++) {
    if (
      platforms[i].a < a &&
      (platforms[i].b > a ||
        (platforms[i].a < 0 && platforms[i].a + TWO_PI < a)) &&
      platforms[i].r >= r + s / 2 &&
      platforms[i].r <= r + s / 2 + yv
    ) {
      return i;
    }
  }
  return -1;
}

function rotation() {
  return (((frameCount * rr) % TWO_PI) + TWO_PI) % TWO_PI;
}

function draw() {
  background(235);
  ball.update();
  for (let i = 0; i < 30; i++) {
    fix[i].update();
  }
  translate(dim / 2, dim / 2);
  //   rotate(-ball.p.heading() + HALF_PI);
  translate(-ball.p.x, -ball.p.y);
  // noFill();
  // stroke(0);
  // strokeWeight(1);
  // ellipse(0, 0, r*2, r*2);
  ball.draw();
  for (let i = 0; i < 30; i++) {
    fix[i].draw();
  }
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }
}
