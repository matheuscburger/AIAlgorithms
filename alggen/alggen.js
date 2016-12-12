
//classe cromossomo
// recebe um numero inteiro
// cria um vetor binario que representa o inteiro
//metodo mutar
// recebe probabilidade e muta o cromossomo
//metodo cross
// recebe outro cromossomo e realiza crossover em ponto aleatorio

function decimal2binary(value, length){
    // converts decimal to binary
    var res = [];
    var div = Math.abs(value);
    do {
        var rem = div % 2;
        div = Math.floor(div / 2);
        res.unshift(rem);
    } while(div != 0);
    for(var i=res.length; i < length; i++){
        res.unshift(0);
    }
    if(res.length > length){
        console.warn("Binary vector is bigger than expected!");
    }
    if(value < 0){
        res.unshift(0);
    } else {
        res.unshift(1);
    }
    return(res);
}

function binary2decimal(arr){
    var res = 0;
    sign = arr[0] == 0 ? -1:1;
    for(var i=1; i < arr.length; i++){
        res += arr[i] * 2**(arr.length-1-i);
    }
    return(res * sign);
}

var Chromosome = function(value, length){
    this.length = length;
    this.chrom = decimal2binary(parseInt(value), length);
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
        chr = new Chromosome(Math.floor(Math.random() * 255) * sign, 8);
        this.individues.unshift(chr);
    }
}

GenAlg.prototype.fitness = function(chromossome){
    x = binary2decimal(chromossome.chrom);
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
        chr1 = new Chromosome(binary2decimal(this.individues[index1].chrom), 8);
        index2 = Math.floor(Math.random() * this.individues.length);
        chr2 = new Chromosome(binary2decimal(this.individues[index2].chrom), 8);
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
