// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&

function Bird(brain) {
  this.y = height / 2;
  this.x = 64;

  if (brain) {
    this.brain = brain;
  } else {
    this.brain = new NeuralNetwork(4, 100, 1);
  }
  this.score = 0;
  this.gravity = 0.6;
  this.lift = -15;
  this.velocity = 0;

  this.copy = function() {
    return new Bird(this.brain);
  }

  this.show = function() {
    fill(255, 100);
    stroke(255);
    ellipse(this.x, this.y, 32, 32);
    this.score++;
  }

  this.mutate = function() {
    this.brain.mutate();
  }

  this.think = function(pipes) {
    var closest = null;
    var record = Infinity;
    for (var i = 0; i < pipes.length; i++) {
      var diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    if (closest != null) {
      var inputs = [];
      inputs[0] = closest.x / width;
      inputs[1] = closest.top / height;
      inputs[2] = closest.bottom / height;
      inputs[3] = this.y / height;
      var action = this.brain.query(inputs);
      if (action[0] > 0.5) {
        this.up();
      }
    }




  }

  this.up = function() {
    this.velocity += this.lift;
  }

  this.update = function() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }

  }

}
