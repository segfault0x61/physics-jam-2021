class Entity {
  constructor(size, angle = 0) {
    this.s = size;
    this.p = createVector(0, r - this.s / 2);
    this.v = createVector(rr, 0);
    this.p.rotate(angle);
    this.v.rotate(angle);
    this.l = platforms.length - 1;
    this.collisions = false;
  }

  update() {
    var rv = rr * this.p.mag(); // The speed of the ground
    if (this.l != -1) {
      this.onPlatform();
    }
    let current_r = this.p.mag();
    let current_a = (this.p.heading() - rotation() + 2 * TWO_PI) % TWO_PI;
    let yv = this.v.dot(this.p) / this.p.mag();
    if (this.l == -1) {
      this.p.add(this.v);
      let collision = -1;
      for (let i = 0; i < platforms.length; i++) {
        if (
          platforms[i].checkCollision(
            current_r,
            current_a,
            this.p.mag(),
            this.s
          )
        ) {
          collision = i;
          break;
        }
      }
      if (collision != -1) {
        this.onCollide(collision);
      }
    }
    if (this.l != -1) {
      // Check if we walked off the platform
      if (!angleCheck(current_a, platforms[this.l].a, platforms[this.l].b)) {
        this.onFall();
      }
    }
    if (this.collisions) {
      for (let i = 0; i < entities.length; i++) {
        if (
          entities[i] != this &&
          this.p.dist(entities[i].p) <= this.s + entities[i].s
        ) {
          this.onCollideEntity(entities[i]);
        }
      }
    }
    for (let i = 0; i < features.length; i++) {
      features[i].checkCollision(this);
    }
  }

  onPlatform() {}

  onCollide(collision) {}

  onCollideEntity(entity) {}

  onFall() {}

  draw() {}

  inflict(damage) {}
}

class SolidEntity extends Entity {
  constructor(size, angle = 0) {
    super(size, angle);
    this.vt = rr * this.p.mag(); // Velocity tangential, used when landed
  }

  onPlatform() {
    var rv = rr * this.p.mag(); // The speed of the ground
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

  onCollide(collision) {
    this.l = collision;
    this.p.setMag(platforms[collision].r - this.s / 2);
    this.vt = -1 * Math.sin(this.v.angleBetween(this.p)) * this.v.mag();
    this.v.rotate(this.p.heading() + HALF_PI - this.v.heading());
    this.v.setMag(this.vt);
  }

  onFall() {
    this.l = -1;
  }
}

class Player extends SolidEntity {
  constructor(size, color, angle = 0) {
    super(size, angle);
    this.c = color;
    this.collisions = true;
  }

  update() {
    if (this.l != -1) {
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
    super.update();
  }

  draw() {
    noStroke();
    fill(this.c);
    ellipse(this.p.x, this.p.y, this.s, this.s);
  }

  onCollideEntity(entity) {
    console.log(entity);
  }

  inflict(damage) {
    if (damage >= 10) {
      console.log('YOU LOSE!');
    }
  }
}

class Marker extends SolidEntity {
  constructor(size, color, angle = 0) {
    super(size, angle);
    this.c = color;
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

  checkCollision(r, a, nr, s) {
    return (
      angleCheck(a, this.a, this.b) &&
      this.r >= r + s / 2 &&
      this.r <= nr + s / 2
    );
  }

  draw() {
    noFill();
    stroke(this.c);
    strokeWeight(2);
    arc(0, 0, this.r * 2, this.r * 2, this.a + rotation(), this.b + rotation());
  }
}

class StaticFeature {
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

class Goal extends StaticFeature {
  constructor(active, assembled, s) {
    super(0, 0, s);
    this.active = active;
    this.assembled = assembled;
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
      console.log('YOU WIN!');
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
        for (let i = 0; i < this.particles_a.length; i++) {
          let r =
            this.s - ((this.s * this.particles_r[i] + frameCount * 1) % this.s);
          let a = (this.particles_a[i] + frameCount * 0.03) % TWO_PI;
          strokeWeight(2 * sqrt(r / this.s));
          point(r * Math.cos(a), r * Math.sin(a));
        }
      }
    }
  }
}

class Key extends StaticFeature {
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
      this.collected = true;
      tCollected += 1;
      if (tCollected >= tGoal) {
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
