
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


var timeout = 50;
function run_genalg(){
    timer = setInterval(function() {
        genalg.nextgen();
        updateInfo();
        if(!run){
            clearInterval(timer);
        }
    }, timeout);
}

$('#pause').click(function(){ run = false; return false; });
$('#next').click(function(){ run_genalg(); return false; });
$('#run').click(function(){ run = true; run_genalg(); return false; });

function chromosome2divs(chr){
    var signal = chr.chrom.slice(0, 1).join(" ");
    var exp = chr.chrom.slice(1,9).join(" ");
    var mantissa = chr.chrom.slice(9).join(" ");
    var float = binary2float(chr.chrom);
    if(Math.abs(float) > 10000){
        float = float.toFixed(0);
    } else {
        float = float.toFixed(5);
    } 
    res = "<div class='individual'>";
    res += "<div class='binary'>"; 
    res += "<span class='signal'>" + signal + "</span> ";
    res += "<span class='exponent'>" + exp + "</span> ";
    res += "<span class='mantissa'>" + mantissa + "</span>";
    res += "</div>";
    res += "<div class='decimal'>" + float + "</div>";
    res += "</div>";
    return(res);
}

function allchromosomes(){
    ind = genalg.individues;
    res = "<div class='individual'>";
    res += "<div class='binary' id='binary_header'>Binary (IEEE 754)</div>";
    res += "<div class='decimal' id='decimal_header'>Decimal</div>";
    res += "</div>";
    for(var i=0; i < ind.length; i++){
        res += chromosome2divs(ind[i]);
    }
    return(res);
}

function updateInfo(){
    $('#generation').text(genalg.generation);
    var chromes = allchromosomes();
    $('#chromosomes').html(chromes);
}
