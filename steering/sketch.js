// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Evolutionary "Steering Behavior" Simulation

// An array of vehicles
var population = [];

// An array of "food"
var food = [];
// An array of "poison"
var poison = [];

// How good is food, how bad is poison?
var nutrition = [0.1, -1];

// Show additional info on DNA?
var debug;

function setup() {

  // Add canvas and grab checkbox
  var canvas = createCanvas(640, 360);
  canvas.parent('canvascontainer');
  debug = select('#debug');

  // Create 10 vehicles
  angleMode(RADIANS);
  for (var i = 0; i < 50; i++) {
    population[i] = new Vehicle(width / 2, height / 2);
  }
  // Start with some food
  for (var i = 0; i < 10; i++) {
    food[i] = createVector(random(width), random(height));
  }
  // Start with some poison
  for (var i = 0; i < 5; i++) {
    //poison[i] = createVector(random(width), random(height));
  }
}

// Add new vehicles by dragging mouse
function mouseDragged() {
  population.push(new Vehicle(mouseX, mouseY));
}

function draw() {
  background(0);

  // 10% chance of new food
  if (random(1) < 0.1) {
    food.push(createVector(random(width), random(height)));
  }

  // 1% chance of new poison
  if (random(1) < 0.01) {
    //poison.push(createVector(random(width), random(height)));
  }

  // Go through all vehicles
  for (var i = population.length - 1; i >= 0; i--) {
    var v = population[i];

    // Eat the food (index 0)
    v.eat(food, 0);
    // Eat the poison (index 1)
    // v.eat(poison, 1);
    // Check boundaries
    v.boundaries();

    // Update and draw
    v.update();
    v.display();

    // If the vehicle has died, remove
    if (v.dead()) {
      population.splice(i, 1);
    } else {
      // Every vehicle has a chance of cloning itself
      var child = v.birth();
      if (child != null) {
        population.push(child);
      }
    }
  }

  // Draw all the food and all the poison
  for (var i = 0; i < food.length; i++) {
    fill(0, 255, 0, 100);
    noStroke();
    ellipse(food[i].x, food[i].y, eat_threshold*2);
  }

  for (var i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 4);
  }
}
