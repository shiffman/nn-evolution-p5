// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Evolutionary "Steering Behavior" Simulation

function Sensor(pos) {
  this.pos = pos;
  this.vals = [0, 0];
}

// Create a new vehicle
function Vehicle(x, y, dna) {

  // All the physics stuff
  this.acceleration = createVector();
  this.velocity = p5.Vector.random2D();
  this.position = createVector(x, y);
  this.r = 3;
  this.maxforce = 0.5;
  this.maxspeed = 3;
  this.velocity.setMag(this.maxspeed);

  this.sensors = [];
  var radius = 50;
  for (var i = 0; i < 360; i += 20) {
    var xoff = radius * cos(radians(i));
    var yoff = radius * sin(radians(i));
    var pos = createVector(xoff, yoff);
    this.sensors.push(new Sensor(pos));
  }

  // Health
  this.health = 1;
}


// Method to update location
Vehicle.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset acceleration to 0 each cycle
  this.acceleration.mult(0);

  // Slowly die unless you eat
  this.health -= 0.002;

}

// Return true if health is less than zero
Vehicle.prototype.dead = function() {
  return (this.health < 0);
}

// Small chance of returning a new child vehicle
Vehicle.prototype.birth = function() {
  var r = random(1);
  if (r < 0.001) {
    // Same location, same DNA
    return new Vehicle(this.position.x, this.position.y, this.dna);
  }
}

// Check against array of food or poison
// index = 0 for food, index = 1 for poison
Vehicle.prototype.eat = function(list, index) {

  for (var j = 0; j < this.sensors.length; j++) {
    this.sensors[j].vals[index] = 0;
  }

  for (var i = 0; i < list.length; i++) {
    for (var j = 0; j < this.sensors.length; j++) {
      var a = this.position;
      var b = p5.Vector.add(a, this.sensors[j].pos);
      var c = list[i];
      var r = 5;
      var intersection = intersecting(a, b, c, r);
      if (intersection) {
        this.sensors[j].vals[index] = 1;
      }
    }
  }


  // What's the closest?
  var closest = null;
  var closestD = Infinity;
  // Look at everything
  for (var i = list.length - 1; i >= 0; i--) {
    // Calculate distance
    var d = p5.Vector.dist(list[i], this.position);
    // If we're withing 5 pixels, eat it!
    if (d < 5) {
      list.splice(i, 1);
      // Add or subtract from health based on kind of food
      this.health += nutrition[index];
    }
  }
}

// Add force to acceleration
Vehicle.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}


Vehicle.prototype.display = function() {

  // Color based on health
  var green = color(0, 255, 0);
  var red = color(255, 0, 0);
  var col = lerpColor(red, green, this.health)

  // Draw a triangle rotated in the direction of velocity
  var theta = this.velocity.heading() + PI / 2;
  push();
  translate(this.position.x, this.position.y);

  // Extra info
  if (debug.checked()) {
    for (var i = 0; i < this.sensors.length; i++) {
      if (this.sensors[i].vals[1] == 1) {
        stroke(255, 0,0);
      } else if (this.sensors[i].vals[0] == 1) {
        stroke(0,255,0);
      } else {
        stroke(255, 100);
      }
      line(0, 0, this.sensors[i].pos.x, this.sensors[i].pos.y);
    }
  }
  rotate(theta);

  // Draw the vehicle itself
  fill(col);
  stroke(col);
  beginShape();
  vertex(0, -this.r * 2);
  vertex(-this.r, this.r * 2);
  vertex(this.r, this.r * 2);
  endShape(CLOSE);
  pop();
}

// A force to keep it on screen
Vehicle.prototype.boundaries = function() {
  var d = 10;
  var desired = null;
  if (this.position.x < d) {
    desired = createVector(this.maxspeed, this.velocity.y);
  } else if (this.position.x > width - d) {
    desired = createVector(-this.maxspeed, this.velocity.y);
  }

  if (this.position.y < d) {
    desired = createVector(this.velocity.x, this.maxspeed);
  } else if (this.position.y > height - d) {
    desired = createVector(this.velocity.x, -this.maxspeed);
  }

  if (desired !== null) {
    desired.setMag(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
}
