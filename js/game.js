let keys, ball, fix, platforms;
let rot, drot;
const dim = 800;
const r = 1000; //  Station radius in pixels
const rr = -0.01; // Rotation rate in radians per frame
const MAX_SPEED = 10;
const FRICTION = 0.5;
const JUMP = 10;

function setup() {
  createCanvas(dim, dim);
  smooth();
  keys = [];
  fix = [];
  platforms = [
    new Platform(r - 800, 0.75, 2),
    new Platform(r - 500, -0.5, 0.5),
    new Platform(r - 300, HALF_PI - 0.2, HALF_PI + 0.2),
    new Platform(r - 100, HALF_PI + 0.1, QUARTER_PI + HALF_PI + 0.1),
    new Platform(r - 100, QUARTER_PI, HALF_PI),
    new Platform(r, 0, TWO_PI),
  ];
  ball = new Ball(1, 40, color(50, 150, 250));
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
  background(230);
  ball.update();
  for (let i = 0; i < 30; i++) {
    fix[i].update();
  }
  translate(dim / 2, dim / 2);
  rotate(-rot + HALF_PI);
  scale(0.5, 0.5);
  translate(-ball.p.x, -ball.p.y);
  ball.draw();
  for (let i = 0; i < 30; i++) {
    fix[i].draw();
  }
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }
  // Smooth rotation
  rot = (rot + TWO_PI) % TWO_PI;
  let targ = (ball.p.heading() + TWO_PI) % TWO_PI;
  let mv = targ - TWO_PI;
  for (let i = 0; i < 2; i++) {
    if (abs(targ - rot) < abs(mv - rot)) {
      mv = targ;
    }
    targ += TWO_PI;
  }
  mv -= rot;
  mv = constrain(mv / 3, -50 / r, 50 / r);
  if (drot < mv) drot = min(mv, drot + 0.001);
  if (drot > mv) drot = max(mv, drot - 0.001);
  rot += drot;
}
