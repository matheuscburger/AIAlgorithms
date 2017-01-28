function inner_product (x:Array<number>, y:Array<number>):number {
    if (x.length != y.length) {
        throw new Error("Input arrays should have the same length!");
    }
    let res:number = 0;
    for(let i=0; i < x.length; i++){
        res = res + x[i] * y[i];
    }
    return(res);
}

interface Activation {
    activate(x:number):number;
    gradient(x:number):number;
}

class Step implements Activation {
  constructor(){}
  public activate (x:number):number {
      let res:number = (x >= 0)?1:0;
      return(res);
  }

  public gradient (x:number):number {
      return(1)
  }
}

class Logistic implements Activation {
  constructor(){}
  public activate (x:number):number {
      let res:number;
      res=1/(1 + Math.exp(-x)); // logistic function
      return(res);
  }

  public gradient (x:number):number {
      let log:number = this.activate(x);
      let res:number = log*(1-log); // logistic derivative
      return(res)
  }
}

class Perceptron {
    public weights: Array<number>;
    public learning_rate: number;
    public activation: Activation;

    constructor(len:number, activation: Activation){
        this.learning_rate = 0.9;
        this.activation = activation;
        this.weights = new Array(len+1);
        for(let i:number = 0; i <= len; i++){
            this.weights[i] = 0;
        }
    }

    public update_weights(features:Array<number>, real_output:number):void{
        let feat:Array<number> = features.slice(0);
        feat.unshift(1); // add bias
        let new_w:Array<number> = this.weights.slice(0);
        let output:number = this.predict(features);
        let error:number = (real_output - output);
        let grad:number = this.activation.gradient(inner_product(feat, this.weights));
        for(let i:number=0; i < this.weights.length; i++){
            new_w[i] = this.weights[i] + this.learning_rate * error * grad * feat[i];
        }
        this.weights = new_w;
    }

    public train_one_epoch(arr_features:Array<Array<number>>,
      outputs:Array<number>): void {
        for(let i:number=0; i < outputs.length; i++){
            this.update_weights(arr_features[i], outputs[i]);
        }
    }

    public train(arr_features:Array<Array<number>>,
      outputs:Array<number>, eps=0.01, max_iter=1e6):void{
        let iter:number = 0;
        let mean_error:number = 1000;
        while(mean_error > eps || iter < max_iter){
            this.train_one_epoch(arr_features, outputs);
            let sum_error:number = 0;
            for(let i:number=0; i < arr_features.length; i++){
                let pred:number = this.predict(arr_features[i]);
                sum_error += Math.abs(pred-outputs[i]);
            }
            mean_error = sum_error/arr_features.length;
            iter ++;
        }
    }

    public predict(features:Array<number>):number{
        let feat:Array<number> = features.slice(0);
        feat.unshift(1); // add bias
        let res:number = this.activation.activate(inner_product(feat, this.weights));
        return(res);
    }

}

//tests

console.log(inner_product([1,2], [1,2]));

let logistic:Logistic = new Logistic();
let step:Step = new Step();

console.log("----- NOT -----");
let data_1d:Array<Array<number>> = [[0], [1]];
let not_out:Array<number> = [1, 0];
let percep_not:Perceptron = new Perceptron(1, step);
percep_not.train(data_1d, not_out, 0.1, 100);
console.log(percep_not.weights);
console.log(data_1d[0], not_out[0], percep_not.predict(data_1d[0]));
console.log(data_1d[1], not_out[1], percep_not.predict(data_1d[1]));

// 2d data
let data = [[0, 0],
            [0, 1],
            [1, 0],
            [1, 1]];

console.log("----- AND -----");
let and_out = [0, 0, 0, 1];
let percep_and:Perceptron = new Perceptron(2, step);
percep_and.train(data, and_out);
console.log(percep_and.weights);

for(let i=0; i < 4; i++){
    console.log(data[i], and_out[i], percep_and.predict(data[i]));
}

console.log("----- NAND -----");
let nand_out = [1, 1, 1, 0];
let percep_nand:Perceptron = new Perceptron(2, step);
percep_nand.train(data, nand_out);
console.log(percep_nand.weights);

for(let i=0; i < 4; i++){
    console.log(data[i], nand_out[i], percep_nand.predict(data[i]));
}

console.log("----- OR -----");
let or_out = [0, 1, 1, 1];
let percep_or:Perceptron = new Perceptron(2, step);
percep_or.train(data, or_out);
console.log(percep_or.weights);

for(let i=0; i < 4; i++){
    console.log(data[i], or_out[i], percep_or.predict(data[i]));
}

console.log("----- XOR -----");
let xor_out = [0, 1, 1, 0];
function xor(features:Array<number>):number{
    let or = percep_or.predict(features);
    let nand = percep_nand.predict(features);
    let and = percep_and.predict([or, nand]);
    return(and);
}

for(let i=0; i < 4; i++){
    console.log(data[i], xor_out[i], xor(data[i]));
}

console.log("----- Half Adder -----");
let half_adder_out = [[0, 0], [1, 0], [1, 0], [0, 1]];
function half_adder(features:Array<number>):Array<number>{
    let sum_bit = xor(features);
    let carry_bit = percep_and.predict(features);
    return([sum_bit, carry_bit]);
}

for(let i=0; i < 4; i++){
    console.log(data[i], half_adder_out[i], half_adder(data[i]));
}
