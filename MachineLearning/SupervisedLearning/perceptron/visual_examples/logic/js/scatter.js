

// data set contains arrays of (x,y) points
//var dataset = [
//  [ 5,     20 ],
//  [ 480,   90 ],
//  [ 250,   50 ],
//  [ 100,   33 ],
//  [ 330,   95 ],
//  [ 410,   12 ],
//  [ 475,   44 ],
//  [ 25,    67 ],
//  [ 85,    21 ],
//  [ 220,   88 ]
//];


function createSVG(){
}


function updatePoints(data, out_class, weights){
    w = 400, h = 400, padding = 40;

    let dataset = [];
    // join dataset and class
    for(let i=0; i < out_class.length; i++){
        dataset[i] = data[i].slice(0);
        dataset[i].push(out_class[i]);
    }


    // Create a SVG element
    d3.select("#graphic")
        .select("svg")
        .remove();
    svg = d3.select("#graphic")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    xmin = d3.min(dataset, function(d){ return(d[0]); });
    xmax = d3.max(dataset, function(d){ return(d[0]); });
    ymin = d3.min(dataset, function(d){ return(d[1]); });
    ymax = d3.max(dataset, function(d){ return(d[1]); });

    xScale = d3.scaleLinear()
        .domain([xmin, xmax])
        .range([padding, w - padding * 2]);
    yScale = d3.scaleLinear()
        .domain([ymin, ymax])
        .range([h - padding, padding]);

    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0, "+ (h-padding) + ")")
       .call(d3.axisBottom(xScale).ticks(6));

    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate("+ padding + ", 0)")
       .call(d3.axisLeft(yScale).ticks(6));

    svg.selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle")
       .attr("cx", function(d){
           return(xScale(d[0]));
       })
       .attr("cy", function(d){
           return(yScale(d[1]));
       })
       .attr("class", function(d){
           if(d[2] == 1){
               return("point-yes");
           } else {
               return("point-no");
           }
       })
       .attr("r", 7);



    // equation y = -1 (w[1]*x + w[0]) / w[2]
    if (weights[2] > 0){
        let y_0 = -1*(weights[1]*-1 + weights[0]) / weights[2]; // y for x = -1
        let y_1 = -1*(weights[1]*1 + weights[0]) / weights[2]; // y for x = 1
        svg.append("line")
            .attr("x1", xScale(-1))
            .attr("y1", yScale(y_0))
            .attr("x2", xScale(1))
            .attr("y2", yScale(y_1))
            .attr("stroke-width", 2)
            .attr("stroke", "black");
    }
}
