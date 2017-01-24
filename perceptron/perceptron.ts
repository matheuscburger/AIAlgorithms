interface Vector {
    values: Array<number>;
}

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


class Perceptron {
    weights:  Array<number>;
    constructor(len:number){
        this.weights = new Array(len+1);
        for(let i:number = 0; i <= len; i++){
            this.weights[i] = 0;
        }
    }

    public activation (x:number):number {
      let res:number = (x >= 0)?1:0;
      return(res);
    }

    public update_weights(features:Array<number>, real_output:number):void{
        let feat:Array<number> = features.slice(0);
        feat.unshift(1); // add bias
        let new_w:Array<number> = this.weights.slice(0);
        let output:number = this.predict(features);
        for(let i:number=0; i < this.weights.length; i++){
            new_w[i] = this.weights[i] + (real_output - output) * feat[i];
        }
        this.weights = new_w;
    }

    public train_one_epoch(arr_features:Array<Array<number>>,
      outputs:Array<number>): void {
        console.log(this.weights);
        for(let i:number=0; i < outputs.length; i++){
            this.update_weights(arr_features[i], outputs[i]);
        }
    }

    public predict(features:Array<number>):number{
        let feat:Array<number> = features.slice(0);
        feat.unshift(1); // add bias
        let res:number = this.activation(inner_product(feat, this.weights));
        return(res);
    }
}

//tests

console.log(inner_product([1,2], [1,2]));

let percep:Perceptron = new Perceptron(2);
let and_data = [[0, 0],
                [0, 1],
                [1, 0],
                [1, 1]]

let and_out = [0, 0, 0, 1];

for(let i:number=0; i < 5; i++)
    percep.train_one_epoch(and_data, and_out);



console.log(percep.weights);

console.log(percep.predict(and_data[0]));
console.log(percep.predict(and_data[1]));
console.log(percep.predict(and_data[2]));
console.log(percep.predict(and_data[3]));
