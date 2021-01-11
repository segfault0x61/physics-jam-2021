let keys, ball, fix, platforms, goal;
let rot, drot;
const dim = 800;
const r = 1000; //  Station radius in pixels
const rr = -0.01; // Rotation rate in radians per frame
const MAX_SPEED = 10;
const JUMP = 10;

function setup() {
  createCanvas(dim, dim);
  smooth();
  keys = [];
  fix = [];
  platforms = [
    new Platform(r - 300, -HALF_PI, QUARTER_PI),
    new Platform(r - 250, -0.5, HALF_PI),
    new Platform(r - 150, -0.5, 0.5),
    new Platform(r - 100, HALF_PI - 0.2, HALF_PI + 0.2),
    new Platform(r - 50, HALF_PI + 0.1, QUARTER_PI + HALF_PI + 0.1),
    new Platform(r - 50, QUARTER_PI, HALF_PI, color(0, 255, 255), 0.05),
    new Platform(r, 0, TWO_PI),
  ];
  ball = new Ball(1, 40, color(50, 150, 250));
  goal = new Goal(true, true, 150);
  for (let i = 0; i < 30; i++) {
    fix[i] = new Ball(0, 20, color(125, 125, 125), (i * PI) / 6);
  }
  rot = ball.p.heading();
  drot = 0;
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
  background(250);
  ball.update();
  for (let i = 0; i < 30; i++) {
    fix[i].update();
  }
  translate(dim / 2, dim / 2);
  goal.draw();
  ball.draw();
  for (let i = 0; i < 30; i++) {
    fix[i].draw();
  }
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }
}
