class LevelButton {
  constructor(n, x, y, txt = '', dir = '') {
    this.n = n;
    this.x = x;
    this.y = y;
    this.txt = txt;
    this.dir = dir;
    this.a = 50;
    this.s = !n; // 0 = locked, 1 = unlocked, anything else = beaten
    if (this.txt == '') {
      this.txt += n + 1;
    }
  }

  click() {
    if (dist(mouseX, mouseY, this.x, this.y) <= 63 && this.s) {
      this.a = 100;
      if (clicked) {
        if (this.dir == '') {
          gameticks = 0;
          levelNumber = this.n;
          readLevel(levelFiles[levelNumber]);
          tPage = 'Game';
          homeButton.x = 100;
          homeButton.y = dim - 100;
          totalCollected = 0;
        } else {
          tPage = this.dir;
        }
      }
    } else {
      this.a = 50;
    }
  }

  draw() {
    this.click();
    strokeWeight(4);
    if (this.s == 0) {
      stroke(90);
      fill(100, this.a);
    } else if (this.s == 1) {
      stroke(200);
      fill(225, this.a);
    } else {
      stroke(15, 150, 50);
      fill(75, 255, 75, this.a);
    }
    ellipse(this.x, this.y, 125, 125);
    if (this.s == 0) {
      fill(90);
    } else if (this.s == 1) {
      fill(200);
    } else {
      fill(15, 150, 50);
    }
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(50 / Math.pow(this.txt.length, 1 / 3));
    text(this.txt, this.x, this.y);
  }
}
