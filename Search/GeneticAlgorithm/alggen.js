
function float2binary(value){
    var signal = [(value > 0)? 0:1];
    value = Math.abs(value);
    var integer = Math.floor(value);
    var frac = value - integer;
    var bin_frac = frac2binary(frac);
    var mantissa, exponent = 0;
    if(integer != 0){
        var bin_int = integer2binary(integer);
        mantissa = bin_int.concat(bin_frac).slice(1,24);
        exponent = bin_int.length - 1;
    } else {
        mantissa = bin_frac;
    do{
        first_bit = mantissa.shift();
        exponent -= 1;
        }while(first_bit == 0);
        mantissa = mantissa.slice(0,23);
    }
    mantissa = mantissa.concat(Array(23 - mantissa.length).fill(0));
    var norm_exp = 127 + exponent;
    var bin_exp = integer2binary(norm_exp);
    if(bin_exp.length > 8){
        console.warn("Exponent greater than expected");
    } else {
        bin_exp = Array(8 - bin_exp.length).fill(0).concat(bin_exp);
    }
    return(signal.concat(bin_exp).concat(mantissa));
}

function frac2binary(value){
    if(value >= 1){
        console.warn("Value greater than one.");
    value -= Math.floor(Math.abs(value));
    }
    var new_value, new_integer, count = 0, res = [];
    while(value != 0 && count < 32){
        new_value = value * 2;
        new_integer = Math.floor(new_value);
    res.push(new_integer);
    value = new_value - new_integer;
        count += 1;
    }
    return res;
}

function integer2binary(value){
    // converts integer to binary
    var res = [];
    var div = Math.abs(value);
    do {
        var rem = div % 2;
        div = Math.floor(div / 2);
        res.unshift(rem);
    } while(div != 0);
    return(res);
}

function binary2float(arr){
    var signal = (arr[0] == 0)? 1:-1;
    var exponent = binary2integer(arr.slice(1,9)) - 127;
    var bin_mantissa = arr.slice(9, arr.length);
    var integer = 0, frac_bin, frac, res;
    if(exponent < 0){
        bin_mantissa.unshift(1);
    exponent++;
    while(exponent < 0){
        bin_mantissa.unshift(0);
        exponent++;
    }
    res = binary2frac(bin_mantissa);
    } else {
        frac_bin = bin_mantissa.splice(exponent);
        frac = binary2frac(frac_bin);
    bin_mantissa.unshift(1);
    integer = binary2integer(bin_mantissa);
    res = integer + frac;
    }
    return(res*signal);
}

function binary2integer(arr){
    var res = 0;
    for(var i=0; i < arr.length; i++){
        res += arr[i] * Math.pow(2, arr.length-1-i);
    }
    return(res);
}

function binary2frac(arr){
    var res = 0;
    for(var i=0; i < arr.length; i++){
        res += arr[i] * Math.pow(2, -i-1);
    }
    return(res);
}

//classe cromossomo
// recebe um numero inteiro
// cria um vetor binario que representa o inteiro
//metodo mutar
// recebe probabilidade e muta o cromossomo
//metodo cross
// recebe outro cromossomo e realiza crossover em ponto aleatorio

var Chromosome = function(value){
    this.chrom = float2binary(value);
}

Chromosome.prototype.mutate = function(prob){
    for(var i = 0; i < this.chrom.length; i++){
        if(Math.random() < prob){
            console.log("Mutation on position "+i);
            this.chrom[i] = Math.abs(this.chrom[i] - 1);
        }
    }
}

function crossover(chrom1, chrom2){
    var pos = Math.floor(Math.random() * chrom1.length) + 1; 
    console.log("Cross-over on position "+pos);
    var chrom1_1 = chrom1.chrom.splice(0,pos);
    var chrom2_1 = chrom2.chrom.splice(0,pos);
    chrom1.chrom = chrom2_1.concat(chrom1.chrom);
    chrom2.chrom = chrom1_1.concat(chrom2.chrom);
}


//classe GenAlg
// construtor recebe todos os parametros
// numero de cromossomos
// probabilidade de mutacao
// probabilidade de crossover
// cria vetor com cromossomos
//metodo avaliar
// avalia cromossomos e retorna vetor ordenado com x% melhores
//metodo nova_geracao
// retona 10% melhores mais filhos
var GenAlg = function(num_ind, mut, cross, sel, fitness){
    this.num_ind = num_ind;
    this.mut_prob = mut;
    this.cross_prob = cross;
    this.prop_sel = sel;
    this.fitness_str = fitness;
    this.generation = 0;
    this.individues = [];
    for(var i=0; i < num_ind; i++){
        var sign = Math.random() > .5? 1:-1;
        chr = new Chromosome(Math.random() * 10000 * sign);
        this.individues.unshift(chr);
    }
}

GenAlg.prototype.fitness = function(chromossome){
    x = binary2float(chromossome.chrom);
    return(eval(this.fitness_str));
}

GenAlg.prototype.evaluate = function(prop){
    var result = [];
    var evaluation = []; 
    var num_sel = Math.max(2, Math.floor(prop * this.num_ind));
    for(var i = 0; i < this.individues.length; i++){
        evaluation.push(this.fitness(this.individues[i]));
    }
    // sort indices
    var len = evaluation.length;
    var indices = new Array(len);
    for (var i = 0; i < len; ++i) indices[i] = i;
    indices.sort(function (a, b) { return evaluation[a] < evaluation[b] ? -1 : evaluation[a] > evaluation[b] ? 1 : 0; });
    // get last num_sel indices with higher fitness
    ind_sel = indices.slice(-num_sel)
    for(var i = 0; i < ind_sel.length; i++){
        result.unshift(this.individues[ind_sel[i]]);
    }
    return(result);
}

GenAlg.prototype.nextgen = function(){
    selected = this.evaluate(this.prop_sel);
    nextgen_ind = [];
    nextgen_ind = nextgen_ind.concat(selected);
    while(nextgen_ind.length < this.num_ind){
        //select randomly two individues from selected array
        index1 = Math.floor(Math.random() * this.individues.length);
        chr1 = new Chromosome(binary2float(this.individues[index1].chrom));
        index2 = Math.floor(Math.random() * this.individues.length);
        chr2 = new Chromosome(binary2float(this.individues[index2].chrom));
        if(Math.random() < this.cross_prob){
            crossover(chr1, chr2);
        }
        chr1.mutate(this.mut_prob);
        chr2.mutate(this.mut_prob);
        nextgen_ind.push(chr1);
        nextgen_ind.push(chr2);
    }
    this.individues = nextgen_ind;
    this.generation += 1;
}
