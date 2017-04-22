// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Based on "Make Your Own Neural Network" by Tariq Rashid
// https://github.com/makeyourownneuralnetwork/

// Sigmoid function
// This is used for activation
// https://en.wikipedia.org/wiki/Sigmoid_function
function sigmoid(x) {
  var y = 1 / (1 + pow(Math.E, -x));
  return y;
}

// This is the Sigmoid derivative!
function dSigmoid(x) {
  return x * (1 - x);
}

// This is how we adjust weights ever so slightly
function mutate(x) {
  if (random(1) < 0.1) {
    var offset = randomGaussian() * 0.1;
    var newx = constrain(x + offset,-1,1);
    return newx;
  } else {
    return x;
  }
}

// Neural Network constructor function
function NeuralNetwork(inputnodes, hiddennodes, outputnodes, learningrate) {

  // Number of nodes in layer (input, hidden, output)
  // This network is limited to 3 layers
  this.inodes = inputnodes;
  this.hnodes = hiddennodes;
  this.onodes = outputnodes;

  // These are the weight matrices
  // wih: weights from input to hidden
  // who: weights from hidden to output
  // weights inside the arrays are w_i_j
  // where link is from node i to node j in the next layer
  // Matrix is rows X columns
  this.wih = new Matrix(this.hnodes, this.inodes);
  this.who = new Matrix(this.onodes, this.hnodes);

  // Start with random values
  this.wih.randomize();
  this.who.randomize();

  // Learning rate
  this.lr = learningrate;
}


// Query the network!
NeuralNetwork.prototype.query = function(inputs_array) {

  // Turn input array into a matrix
  var inputs = Matrix.fromArray(inputs_array);

  // The input to the hidden layer is the weights (wih) multiplied by inputs
  var hidden_inputs = Matrix.dot(this.wih, inputs);
  // The outputs of the hidden layer pass through sigmoid activation function
  var hidden_outputs = Matrix.map(hidden_inputs, sigmoid);

  // The input to the output layer is the weights (who) multiplied by hidden layer
  var output_inputs = Matrix.dot(this.who, hidden_outputs);

  // The output of the network passes through sigmoid activation function
  var outputs = Matrix.map(output_inputs, sigmoid);

  // Return the result as an array
  return outputs.toArray();
}

NeuralNetwork.prototype.mutate = function() {
  Matrix.map(this.wih, mutate);
  Matrix.map(this.who, mutate);
}
