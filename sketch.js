// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/aKiyCeIuwn4

var activeBirds = [];
var allBirds = [];
var pipes = [];
var counter = 0;

function setup() {
  createCanvas(600, 400);
  for (var i = 0; i < 100; i++) {
    var bird = new Bird();
    activeBirds[i] = bird;
    allBirds[i] = bird;
  }
}



function draw() {
  background(0);

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  for (var i = activeBirds.length - 1; i >= 0; i--) {
    var bird = activeBirds[i];
    bird.think(pipes);
    bird.update();
    bird.show();
    for (var j = 0; j < pipes.length; j++) {
      if (pipes[j].hits(activeBirds[i])) {
        activeBirds.splice(i, 1);
        break;
        //console.log("HIT");
      }
    }
  }

  if (counter % 100 == 0) {
    pipes.push(new Pipe());
  }
  counter++;

  if (activeBirds.length == 0) {
    nextGeneration();
  }



}

function keyPressed() {
  if (key == ' ') {
    bird.up();
  }
}
