class StaticObject {
  constructor(radius, a, s) {
    this.p = createVector(0, radius);
    this.p.rotate(a);
    this.s = s;
  }

  checkCollision(that) {
    if (this.p.dist(that.p) <= this.s) {
      this.collide(that);
    }
  }

  update() {
    this.p.rotate(rr);
  }

  collide(entity) {}

  draw() {}
}

class Goal extends StaticObject {
  constructor(active, assembled, s) {
    super(0, 0, s);
    this.active = active;
    this.assembled = assembled;
    this.f = false;
    this.t = 0;
    this.particles_r = [];
    this.particles_a = [];
    for (let i = 0; i < 300; i++) {
      this.particles_r.push(Math.random());
      this.particles_a.push(Math.random() * TWO_PI);
    }
  }

  checkCollision(that) {
    if (that instanceof Player) {
      super.checkCollision(that);
    }
  }

  collide(entity) {
    if (this.active && this.assembled) {
      this.f = true;
    }
  }

  draw() {
    fill(color(50));
    stroke(color(0, 0, 0));
    if (this.assembled) {
      strokeWeight(5);
      ellipse(this.p.x, this.p.y, this.s * 2 + 10, this.s * 2 + 10);
      if (this.active) {
        stroke(color(0, 0, 255));
        fill(color(0, 155, 255));
        ellipse(this.p.x, this.p.y, this.s * 2, this.s * 2);
        noFill();
        if (!this.f) {
          for (let i = 0; i < this.particles_a.length; i++) {
            let s = this.s / 2;
            let r = s - ((s * this.particles_r[i] + frameCount * 1) % s);
            let a = (this.particles_a[i] + frameCount * 0.03) % TWO_PI;
            strokeWeight(2 * sqrt(r / s));
            point(r * Math.cos(a), r * Math.sin(a));
          }
        }
      }
    }
  }
}

class Key extends StaticObject {
  constructor(radius, a) {
    super(radius, a, 60);
    this.collected = false;
  }

  checkCollision(that) {
    if (that instanceof Player) {
      super.checkCollision(that);
    }
  }

  collide(entity) {
    if (!this.collected) {
      var audio = new Audio('./assets/sound/sfx_coin_single1.wav');
      audio.play();

      this.collected = true;
      totalCollected += 1;
      if (totalCollected >= totalGoal) {
        goal.active = true;
      }
    }
  }

  draw() {
    let x = this.p.x,
      y = this.p.y;
    noFill();
    strokeWeight(6);
    if (!this.collected) {
      stroke(250, 220, 50);
    } else {
      stroke(200);
    }
    ellipse(x - 15, y + 15, 24, 24);
    line(x - 6, y + 6, x + 15, y - 15);
    line(x + 15, y - 15, x + 22, y - 8);
  }
}
