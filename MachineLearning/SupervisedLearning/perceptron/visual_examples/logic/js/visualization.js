

requirejs(["perceptron/visual_examples/logic/logic"], function(a){


    function get_alg(){
        let gate = $('#logic').val();
        let activation = $('#activation').val();
        alg = a.start_alg(activation, gate);
		count = 0;
        updatePoints(alg.data, alg.out, alg.algorithm.weights);
		$("#iteration").text(count);
    }
    $('#start').click(function(){ get_alg(); return false; });




    let run = false;

    let timeout = 50;
    function run_alg(){
        timer = setInterval(function() {
            alg.algorithm.train_one_epoch(alg.data, alg.out);
            count++;
            updatePoints(alg.data, alg.out, alg.algorithm.weights);
            $("#iteration").text(count);
            if(!run){
                clearInterval(timer);
            }
        }, timeout);
    }

    $('#pause').click(function(){ run = false; return false; });
    $('#next').click(function(){ run_alg(); return false; });
    $('#run').click(function(){ run = true; run_alg(); return false; });

})
