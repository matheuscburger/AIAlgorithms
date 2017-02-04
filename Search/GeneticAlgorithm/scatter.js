

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


function updatePoints(){
    w = 500, h = 500, padding = 40;

    //Create a SVG element
    d3.select("#graphic")
        .select("svg")
        .remove();
    svg = d3.select("#graphic")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var dataset = getData();
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
       .attr("r", 7);


    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0, "+ (h-padding) + ")")
       .call(d3.axisBottom(xScale).ticks(6));

    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate("+ padding + ", 0)")
       .call(d3.axisLeft(yScale).ticks(6));
}
