import * as p from "../../perceptron"
import * as sa from "../../../supervised_algorithm"

export interface Alg {
    data:Array<Array<number>>;
    out:Array<number>;
    algorithm:sa.SupervisedAlgorithm;
}

export function start_alg(activation:string, gate:string):Alg{

    let activ: p.Activation;
    if(activation == "step"){
        activ = new p.Step();
    } else if (activation == "logistic") { 
        activ = new p.Logistic();
    }

    // 2d data
    let data = [[0, 0], [0, 1], [1, 0], [1, 1]];

    let outputs:any = {'and':  [0, 0, 0, 1],
                       'nand': [1, 1, 1, 0],
                       'or':   [0, 1, 1, 1],
                       'nor':  [1, 0, 0, 0],
                       'xor':  [0, 1, 1, 0]}
    let out = outputs[gate];
    let algorithm = new p.Perceptron(2, activ);
    let results:Alg = {data: data, out: out, algorithm: algorithm};
    return(results) 
}
