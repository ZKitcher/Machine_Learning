class NeuralNetwork {
    constructor(input, hidden, output) {
        this.input_nodes = input;
        this.hidden_nodes = hidden;
        this.output_nodes = output;

        this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
        this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
        this.weights_ih.randomise();
        this.weights_ho.randomise();

        this.bias_hidden = new Matrix(this.hidden_nodes, 1);
        this.bias_output = new Matrix(this.output_nodes, 1);
        this.bias_hidden.randomise();
        this.bias_output.randomise();

        this.learning_rate = 0.1;
    }

    updateLearningRate = (n) => this.learning_rate = n;

    predict = (inputs) => {
        if (!(inputs instanceof Matrix)) {
            inputs = Matrix.fromArray(inputs);
        }

        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_hidden);
        hidden.map(sigmoid);

        let output = Matrix.multiply(this.weights_ho, hidden);
        output.add(this.bias_output);
        output.map(sigmoid)

        return output.toArray();
    }

    train = (inputs_array, target_array) => {

        // Feed forward
        let inputs = Matrix.fromArray(inputs_array)
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_hidden);
        hidden.map(sigmoid);

        let outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_output);
        outputs.map(sigmoid)


        let targets = Matrix.fromArray(target_array);
        

        // Calculate Errors
        let output_errors = Matrix.subtract(targets, outputs)

        
        // Calculate Gradient
        let gradients = Matrix.map(outputs, dsigmoid)
        gradients.multiply(output_errors);
        gradients.multiply(this.learning_rate);

        // Calculate Deltas
        let hidden_T = Matrix.transpose(hidden);
        let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);

        // Adjust Weights and Bias by deltas
        this.weights_ho.add(weight_ho_deltas);
        this.bias_output.add(gradients);



        // calculate the hidden layer errors
        let weights_ho_transposed = Matrix.transpose(this.weights_ho);
        let hidden_errors = Matrix.multiply(weights_ho_transposed, output_errors)

        // Calculate Hidden Gradient
        let hidden_gradient = Matrix.map(hidden, dsigmoid)
        hidden_gradient.multiply(hidden_errors);
        hidden_gradient.multiply(this.learning_rate);

        // Calculate input to hidden Deltas
        let inputs_T = Matrix.transpose(inputs);
        let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

        // Adjust Weights and Bias by deltas
        this.weights_ih.add(weight_ih_deltas);
        this.bias_hidden.add(hidden_gradient);
    }
}

class Neuron {
    constructor() {

    }
}

const sigmoid = (x) => 1 / (1 + Math.exp(-x));

const dsigmoid = (x) => x * (1 - x);
//const dsigmoid = (x) => sigmoid(x) * (1 - sigmoid(x))