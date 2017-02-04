import * as p from "../perceptron"

//tests

let logistic:p.Logistic = new p.Logistic();
let step:p.Step = new p.Step();

console.log("----- NOT -----");
let data_1d:Array<Array<number>> = [[0], [1]];
let not_out:Array<number> = [1, 0];
let percep_not:p.Perceptron = new p.Perceptron(1, step);
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
let percep_and:p.Perceptron = new p.Perceptron(2, step);
percep_and.train(data, and_out);
console.log(percep_and.weights);

for(let i=0; i < 4; i++){
    console.log(data[i], and_out[i], percep_and.predict(data[i]));
}

console.log("----- NAND -----");
let nand_out = [1, 1, 1, 0];
let percep_nand:p.Perceptron = new p.Perceptron(2, step);
percep_nand.train(data, nand_out);
console.log(percep_nand.weights);

for(let i=0; i < 4; i++){
    console.log(data[i], nand_out[i], percep_nand.predict(data[i]));
}

console.log("----- OR -----");
let or_out = [0, 1, 1, 1];
let percep_or:p.Perceptron = new p.Perceptron(2, step);
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
