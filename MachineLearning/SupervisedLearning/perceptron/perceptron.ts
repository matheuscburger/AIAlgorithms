import * as sa from "../supervised_algorithm"

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

export interface Activation {
    activate(x:number):number;
    gradient(x:number):number;
}

export class Step implements Activation {
  constructor(){}
  public activate (x:number):number {
      let res:number = (x >= 0)?1:0;
      return(res);
  }

  public gradient (x:number):number {
      return(1)
  }
}

export class Logistic implements Activation {
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


export class Perceptron implements sa.SupervisedAlgorithm {
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


