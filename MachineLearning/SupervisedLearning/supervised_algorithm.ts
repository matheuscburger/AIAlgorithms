
export interface SupervisedAlgorithm {
    train(arr_features:Array<Array<number>>,
          outputs:Array<number>):void;
    predict(features:Array<number>):any;
}
