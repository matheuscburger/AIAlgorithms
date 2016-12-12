
var genalg;
var run = false;

function startAlg(){
    genalg = new GenAlg(parseInt($('#nind').val()),
                    parseFloat($('#probmut').val()),
                    parseFloat($('#probcross').val()),
                    parseFloat($('#propsel').val()),
                    $('#fun').val());
    updateInfo();
}
$('#start').click(function(){ startAlg(); return false; });

function run_genalg(){
    do {
        genalg.nextgen();
        updateInfo();
    } while(run);
}

$('#pause').click(function(){ run = false; return false; });
$('#next').click(function(){ run_genalg(); return false; });
$('#run').click(function(){ run = true; run_genalg(); return false; });

function chromosome2divs(chr){
    res = "<div class='individual'>";
    res += "<div class='binary'>" + chr.chrom.join(" ") + "</div>";
    res += "<div class='decimal'>" + binary2decimal(chr.chrom) + "</div>";
    res += "</div>";
    return(res);
}

function allchromosomes(){
    ind = genalg.individues;
    res = "";
    for(var i=0; i < ind.length; i++){
        res += chromosome2divs(ind[i]);
    }
    return(res);
}

function updateInfo(){
    $('#generation').text(genalg.generation);
    $('#chromosomes').html(allchromosomes());
    
}
