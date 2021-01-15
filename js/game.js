let page = 'Home',
  tPage = 'Home';

let keys, ball, fix, platforms, features, goal, entities;
let clicked = false;
let totalCollected = 0;
let totalGoal;
let rot, drot;
let dim = 800;
let file;
let r, rr, MAX_SPEED, JUMP;
let kx, ky;
let gameticks = 0;

let stars;

let levelNumber = 1;
let levelFiles = [];
let levelButtons = [];
const levels = ['Level 1', 'Level 2', 'Level 3', 'Level 4'];

let homeButton, playAgainButton, aboutButton;
let donea = 0;
let trana = 0;

function preload() {
  for (let i = 0; i < levels.length; i++) {
    levelFiles[i] = loadLevel(levels[i]);
  }
}

function setup() {
  createCanvas(dim, dim);
  smooth();
  keys = [];
  stars = [[], [], []];
  let nstars = (dim * dim) / 400 / 3;
  for (let s = 0; s < 3; s++) {
    for (let i = 0; i < nstars; i++) {
      stars[s].push([
        (Math.random() - 0.5) * dim * sqrt(2),
        (Math.random() - 0.5) * dim * sqrt(2),
      ]);
    }
  }
  for (let i = 0; i < levels.length; i += 4) {
    let w = min(4, levels.length - i);
    for (let j = i; j < i + w; j++) {
      levelButtons[j] = new LevelButton(
        j,
        dim / 2 + (j - w / 2 + 0.5) * 150,
        dim / 2 - 50 + i * 150
      );
    }
  }
  aboutButton = new LevelButton(0, dim - 100, dim - 100, '?', 'About');
  homeButton = new LevelButton(0, 100, dim - 100, 'Home', 'Home');
  rot = 0;
}

function keyPressed() {
  keys[keyCode] = true;
}

function keyReleased() {
  keys[keyCode] = false;
}

function mouseClicked() {
  clicked = true;
}

// Is angle a between b -> c
function angleCheck(a, b, c) {
  if (b + TWO_PI == c) return true;
  a = ((a % TWO_PI) + TWO_PI) % TWO_PI;
  b = ((b % TWO_PI) + TWO_PI) % TWO_PI;
  c = ((c % TWO_PI) + TWO_PI) % TWO_PI;
  return b <= c ? b <= a && a <= c : b <= a || a <= c;
}

function rotation() {
  return (((gameticks * rr) % TWO_PI) + TWO_PI) % TWO_PI;
}

function loadLevel(filename) {
  return loadStrings('./assets/levels/' + filename + '.txt');
}

function readLevel(f) {
  platforms = [];
  goal = new Goal(false, true, 60);
  features = [goal];
  let fi = 0,
    n;
  let t = splitTokens(f[fi++]);
  (r = int(t[0])),
    (rr = float(t[1])),
    (MAX_SPEED = float(t[2])),
    (JUMP = float(t[3]));

  // Platforms
  n = int(f[fi++]);
  while (n--) {
    t = splitTokens(f[fi++]);
    platforms.push(
      new Platform(int(t[0]), float(t[1]), float(t[2]), color(0), float(t[3]))
    );
  }
  platforms.push(new Platform(r, 0, TWO_PI));

  // Keys
  n = int(f[fi++]);
  totalGoal = n;
  while (n--) {
    t = splitTokens(f[fi++]);
    features.push(new Key(int(t[0]), float(t[1])));
  }

  // Spikes
  n = int(f[fi++]);
  while (n--) {
    t = splitTokens(f[fi++]);
  }

  n = int(f[fi++]);
  while (n--) {
    t = splitTokens(f[fi++]);
  }
  // Level display
  kx = levels[levelNumber].length * 24 + 65;
  ky = 45;

  // Player setup
  fix = [];
  ball = new Player(20, color(209, 50, 227), r, 0, platforms.length - 1);

  entities = [ball];
  for (let i = 0; i < 12; i++) {
    entities.push(
      new Marker(
        20,
        color(255, 0, 0),
        r,
        (i * PI) / 6 + PI / 12,
        platforms.length - 1
      )
    );
  }
  drot = 0;
}

function display() {
  noStroke();
  ellipse(0, 0, r * 2, r * 2);

  for (let i = 0; i < entities.length; i++) {
    entities[i].draw();
  }
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }
  for (let i = 0; i < features.length; i++) {
    features[i].draw();
  }
}

function updateLevel() {
  for (let i = 0; i < entities.length; i++) {
    entities[i].update();
  }
  for (let i = 0; i < features.length; i++) {
    features[i].update();
  }
}

function drawHome() {
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('Courier New', 60);
  text('Forces of Coriolis', dim / 2, dim / 4);
  textSize(20);
  textAlign(LEFT, BOTTOM);
  text('By segfault0x61', 30, dim - 30);
  for (let i = 0; i < levels.length; i++) {
    levelButtons[i].draw();
  }
  aboutButton.draw();

  // Background rotation
  rot += 0.001;
}

function drawLevel() {
  updateLevel();

  // Level
  push();
  translate(dim / 2, dim / 2);
  rotate(-rot + HALF_PI);
  translate(-ball.p.x, -ball.p.y);
  fill(250);
  display();
  pop();

  // Minimap
  push();
  noStroke();
  translate(dim - dim / 8 - 10, dim - dim / 8 - 10);
  rotate(-rot + HALF_PI);
  scale(0.1, 0.1);
  fill(255, 200);
  display();
  pop();

  // Level info
  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  textFont('Courier New', 40);
  text(levels[levelNumber], 30, 50);
  text(totalCollected + '/' + totalGoal, kx + 25, 50);
  textFont('Courier New', 20);
  text('Time: ' + (gameticks / 60).toFixed(2), 35, 80);
  stroke(250, 220, 50);
  strokeWeight(4);
  noFill();
  ellipse(kx - 10, ky + 10, 16, 16);
  line(kx - 4, ky + 4, kx + 10, ky - 10);
  line(kx + 10, ky - 10, kx + 15, ky - 5);
  homeButton.draw();

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

  // Check if done
  if (goal.f) {
    playAgainButton = new LevelButton(
      levelNumber,
      dim / 2 + 75,
      dim / 2 + 100,
      'Again'
    );
    playAgainButton.s = 1;
    homeButton.x = dim / 2 - 75;
    homeButton.y = dim / 2 + 100;
    donea = 0;
    page = tPage = 'Done';
  }
}

function drawDone() {
  push();
  translate(dim / 2, dim / 2);
  rotate(-rot + HALF_PI);
  translate(-ball.p.x, -ball.p.y);
  fill(250);
  display();
  pop();
  noStroke();
  fill(0, donea);
  rect(0, 0, dim, dim);
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text(
    'Level complete\nTime: ' + (gameticks / 60).toFixed(2),
    dim / 2,
    dim / 3
  );
  homeButton.draw();
  playAgainButton.draw();

  // Update level data
  levelButtons[levelNumber].s = 2;
  if (levelNumber + 1 < levels.length) {
    levelButtons[levelNumber + 1].s |= 1;
  }

  // Fade out
  donea += (200 - donea) / 10;
}

function drawAbout() {
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('Courier New', 60);
  text('About', dim / 2, dim / 4);
  textSize(20);
  textAlign(LEFT, TOP);
  text(
    "This is a platformer game with a twist... there's no gravity. Instead, you're on a circular map that spins and generates rotational gravity. You'll find that you move differently, and you're highly encouraged to explore the mechanics of jumping.\n\nPS: arrow keys to move.",
    100,
    dim / 3,
    dim - 200,
    dim
  );
  homeButton.x = 100;
  homeButton.y = dim - 100;
  homeButton.draw();

  // Background rotation
  rot += 0.001;
}

function draw() {
  background(0);

  // Stars
  push();
  translate(dim / 2, dim / 2);
  rotate(-rot + HALF_PI);
  stroke(color(255));
  fill(255, 255, 220);
  for (let s = 0; s < stars.length; s++) {
    strokeWeight(s + 1);
    for (let i = 0; i < stars[s].length; i++) {
      point(stars[s][i][0], stars[s][i][1]);
    }
  }
  pop();
  if (page === 'Home') {
    drawHome();
  }
  if (page === 'Game') {
    drawLevel();
    gameticks++;
  }
  if (page === 'Done') {
    drawDone();
  }
  if (page === 'About') {
    drawAbout();
  }

  // Generage scene transition animation
  if (page != tPage) {
    trana += (255 - trana) / 5;
    if (trana >= 250) {
      page = tPage;

      // Align camera to player
      if (tPage == 'Game') {
        rot = ball.p.heading();
      }
    }
  } else {
    trana -= trana / 5;
  }
  noStroke();
  fill(0, trana);
  rect(0, 0, dim, dim);
  clicked = false;
}
