let keys, ball, fix, platforms, entities;
let rot, drot;
let dim = 800;
let file;
let r, rr, MAX_SPEED, JUMP;
const FRICTION = 0.5;

function preload() {
  file = loadLevel('test');
}

function setup() {
  readLevel(file);
  createCanvas(dim, dim);
  smooth();
  keys = [];
  fix = [];
  ball = new Player(40, color(50, 150, 250));
  entities = [ball];
  goal = new Goal(true, true, 150);
  for (let i = 0; i < 30; i++) {
    entities.push(new Marker(20, color(125, 125, 125), (i * PI) / 6));
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

// Is angle a between b->c
function angleCheck(a, b, c) {
  if (b + TWO_PI == c) return true;
  a = ((a % TWO_PI) + TWO_PI) % TWO_PI;
  b = ((b % TWO_PI) + TWO_PI) % TWO_PI;
  c = ((c % TWO_PI) + TWO_PI) % TWO_PI;
  return b <= c ? b <= a && a <= c : b <= a || a <= c;
}

function collide(r, a, yv, s) {
  for (let i = 0; i < platforms.length; i++) {
    if (
      angleCheck(a, platforms[i].a, platforms[i].b) &&
      platforms[i].r >= r + s / 2 &&
      platforms[i].r <= r + s / 2 + yv &&
      platforms[i].solid
    ) {
      return i;
    }
  }
  return -1;
}

function rotation() {
  return (((frameCount * rr) % TWO_PI) + TWO_PI) % TWO_PI;
}

function loadLevel(filename) {
  return loadStrings('./assets/levels/' + filename + '.txt');
}

function readLevel(f) {
  let fi = 0,
    n;
  let t = splitTokens(f[fi++]);
  (r = int(t[0])),
    (rr = float(t[1])),
    (MAX_SPEED = float(t[2])),
    (JUMP = float(t[3]));

  // Platforms
  n = int(f[fi++]);
  platforms = [];
  while (n--) {
    t = splitTokens(f[fi++]);
    platforms.push(new Platform(int(t[0]), float(t[1]), float(t[2])));
  }
  platforms.push(new Platform(r, 0, TWO_PI));
  // Keys
  n = int(f[fi++]);
  while (n--) {
    t = splitTokens(f[fi++]);
  }
  // Spikes
  n = int(f[fi++]);
  while (n--) {
    t = splitTokens(f[fi++]);
  }
  // Enemies

  n = int(f[fi++]);
  while (n--) {
    t = splitTokens(f[fi++]);
  }
}

function drawLevel() {
  ball.update();
  for (let i = 0; i < entities.length; i++) {
    entities[i].update();
  }
  translate(dim / 2, dim / 2);
  // rotate(-ball.p.heading()+HALF_PI);
  // scale(0.5,0.5);
  // translate(-ball.p.x,-ball.p.y);
  // noFill();
  // stroke(0);
  // strokeWeight(1);
  // ellipse(0, 0, r*2, r*2);
  rotate(-rot + HALF_PI);
  scale(0.3, 0.3);
  // translate(-ball.p.x,-ball.p.y);
  goal.draw();
  for (let i = 0; i < entities.length; i++) {
    entities[i].draw();
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
  if (drot < mv) drot = min(mv, drot + 0.005);
  if (drot > mv) drot = max(mv, drot - 0.005);
  rot += drot;
}

function draw() {
  background(230);
  drawLevel();
}
