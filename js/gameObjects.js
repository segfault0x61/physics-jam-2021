class Ball {
  constructor(user, size, color, angle = 0) {
    this.u = user;
    this.c = color;
    this.s = size;
    this.p = createVector(0, r - this.s / 2);
    this.v = createVector(rr, 0);
    this.p.rotate(angle);
    this.v.rotate(angle);
    this.vt = rr * this.p.mag(); // Velocity tangential, used when landed
    this.l = platforms.length - 1;
  }

  move() {
    var platform = platforms[this.l];
    var rv = rr * this.p.mag(); // The speed of the ground
    if (keys[RIGHT_ARROW] && this.vt > rv - MAX_SPEED) {
      this.vt = max(rv - MAX_SPEED, this.vt - platform.friction * 2);
    }
    if (keys[LEFT_ARROW] && this.vt < rv + MAX_SPEED) {
      this.vt = min(rv + MAX_SPEED, this.vt + platform.friction * 2);
    }
    if (keys[UP_ARROW]) {
      this.v.add(p5.Vector.mult(this.p, (-1 * JUMP) / this.p.mag()));
      this.l = -1;
    }
  }

  update() {
    if (this.u && this.l != -1) {
      this.move();
    }
    var rv = rr * this.p.mag(); // The speed of the ground
    if (this.l != -1) {
      var platform = platforms[this.l];

      // Friction: Tries to match ground velocity
      if (this.vt < rv) {
        this.vt = min(rv, this.vt + platform.friction);
      }
      if (this.vt > rv) {
        this.vt = max(rv, this.vt - platform.friction);
      }
      this.p.rotate(this.vt / this.p.mag());
      this.v.rotate(this.p.heading() + HALF_PI - this.v.heading());
      this.v.setMag(this.vt);
    }
    let current_r = this.p.mag();
    let current_a = (this.p.heading() - rotation() + 2 * TWO_PI) % TWO_PI;
    let yv = this.v.dot(this.p) / this.p.mag();
    if (this.l == -1) {
      this.p.add(this.v);
      let collision = collide(current_r, current_a, yv, this.s);
      if (collision != -1) {
        this.l = collision;
        this.p.setMag(platforms[collision].r - this.s / 2);
        this.v.rotate(this.p.heading() + HALF_PI - this.v.heading());
        this.v.setMag(this.vt);
      }
    }
    if (this.l != -1) {
      // Check if we walked off a platform
      if (
        (current_a > platforms[this.l].b &&
          (platforms[this.l].a >= 0 ||
            platforms[this.l].a + TWO_PI > current_a)) ||
        current_a < platforms[this.l].a
      ) {
        this.l = -1;
      }
    }
  }

  draw() {
    noStroke();
    fill(this.c);
    ellipse(this.p.x, this.p.y, this.s, this.s);
  }
}

class Platform {
  constructor(radius, a, b, c = color(0, 0, 0), f = 0.5) {
    this.r = radius;
    this.a = a;
    this.b = b;
    this.c = c;
    this.friction = f;
  }

  draw() {
    noFill();
    stroke(this.c);
    strokeWeight(2);
    arc(0, 0, this.r * 2, this.r * 2, this.a + rotation(), this.b + rotation());
  }
}

class Goal {
  constructor(active, assembled, r) {
    this.active = active;
    this.assembled = assembled;
    this.r = r;
    this.t = 0;
    this.particles_r = [];
    this.particles_a = [];
    for (let i = 0; i < 300; i++) {
      this.particles_r.push(Math.random());
      this.particles_a.push(Math.random() * TWO_PI);
    }
  }

  draw() {
    fill(color(50));
    stroke(color(0, 0, 0));
    if (this.assembled) {
      strokeWeight(10);
      ellipse(0, 0, this.r * 2 + 20, this.r * 2 + 20);
      if (this.active) {
        // strokeWeight(1);
        // noFill();
        // stroke(color(0,155,255));
        // ellipse(0,0,this.r*2+20,this.r*2+20);
        strokeWeight(10);
        stroke(color(0, 0, 255));
        fill(color(0, 155, 255));
        ellipse(0, 0, this.r * 2, this.r * 2);
        noFill();
        for (let i = 0; i < this.particles_a.length; i++) {
          let r =
            this.r - ((this.r * this.particles_r[i] + frameCount * 1) % this.r);
          let a = (this.particles_a[i] + frameCount * 0.03) % TWO_PI;
          strokeWeight(5 * sqrt(r / this.r));
          point(r * Math.cos(a), r * Math.sin(a));
        }
      }
    }
  }
}
