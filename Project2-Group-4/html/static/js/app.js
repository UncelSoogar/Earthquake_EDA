// Set the dimensions for the bar chart
let  svgWidth  =  960;            
let  svgHeight  =  660;            

// Define the chart's margins as an object
            
let chartMargin = {
    top: 40,
    right: 60,
    bottom: 60,
    left: 90,
};       
// Define dimensions of the chart area           
let chartWidth = svgWidth - chartMargin.left - chartMargin.right;
let chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;            

// Select body, append SVG area to it, and set the dimensions
            
let svg = d3.select("div")
    .append("svg")           
    .attr("viewBox", "0 0 " + svgWidth + " " + svgHeight)

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere      
// to the margins set in the "chartMargin" object.
            
let chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

//Load in data       
let  url  =  "static/data/June_July_Earthquake.json";

            
d3.json(url).then((data)  =>  {                
    let  quakedata  =  data.features;                

    //Format the Data
                    
    quakedata.forEach(function(d)  {                                      
        d.magType = d.properties.magType;                
    });  

                  
    let  magCount  =   []

      magCount  =  d3.nest()                    
        .key(function(d)  {                        
            return  d.magType;                    
        })                       
        .rollup(function(leaves)  {                        
            return  leaves.length;
        })                   
        .entries(quakedata);                

    console.log(magCount);

    //Create Scales for the chart
    let yBandScale = d3.scaleLinear()
        .domain([0, d3.max(magCount.map(m => m.value))])
        .range([chartHeight, 0]);

    let xBandScale = d3.scaleBand()
        .domain(magCount.map(m => m.key))
        .range([0, chartWidth])
        .padding(0.1);

                    
    let  bottomAxis  =  d3.axisBottom(xBandScale);                
    let  leftAxis  =  d3.axisLeft(yBandScale).ticks(10);

                    
    //Append the axes to the ChartGroup
    //Add y-axis
    chartGroup.append("g")
        .call(leftAxis);               

    // Y axis label:               
    svg.append("text")                    
        .attr("text-anchor",  "middle")                    
        .attr("transform",  "rotate(-90)")                    
        .attr("y",  -chartMargin.left  +  120)                    
        .attr("x",  0  -  (chartHeight  /  2))                    
        .classed("axis-text",  true)                    
        .text("Number of Magnitude Types")                

    //Add x-axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);               

    // Add X axis label:              
    svg.append("text")                    
        .attr("text-anchor",  "middle")                    
        .attr("x",  chartWidth  /  2)                    
        .attr("y",  chartHeight  +  chartMargin.top  +  50)                    
        .classed("axis-text",  true)                    
        .text("Magnitude Types");              

    barGroups = chartGroup.selectAll()
        .data(magCount)                    
        .enter()  


    chartGroup.selectAll(".bar")                    
        .data(magCount)                    
        .enter()                    
        .append("rect")                                       
        .classed("bar",  true)                    
        .attr("x",  d  =>  xBandScale(d.key))                    
        .attr("y",  d  =>  yBandScale(d.value))                    
        .attr("width",  xBandScale.bandwidth())                    
        .attr("height",  d  =>  chartHeight  -  yBandScale(d.value))
        .attr('width', xBandScale.bandwidth())
        .on('mouseover', function(actual, i) {
            d3.selectAll('.value ')
                .attr('opacity', 0)

            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 0.6)
                .attr('x', (a) => xBandScale(a.key) - 5)
                .attr('width', xBandScale.bandwidth() + 10)

            y = yBandScale(actual.value)

            line = chartGroup.append('line')
                .attr('id', 'limit')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', chartWidth)
                .attr('y2', y)  

            barGroups.append('text')
                .attr('class', 'divergence')
                .attr('x', (a) => xBandScale(a.key) + xBandScale.bandwidth() / 2)
                .attr('y', (a) => yBandScale(a.value))
                .attr('fill', 'white')
                .attr('text-anchor', 'middle')
                .text((a, idx) => {
                    divergence = (a.value - actual.value)

                    let text = ''
                    if (divergence > 0) text += '+'
                    text += `${divergence}`

                    return idx !== i ? text : '';
                })

        })
        .on('mouseout', function() {
            d3.selectAll('.value')
                .attr('opacity', 1)

            d3.select(this)
                .transition()
                .duration(2000)
                .attr('opacity', 1)
                .attr('x', (a) => xBandScale(a.key))
                .attr('width', xBandScale.bandwidth())

            chartGroup.selectAll('#limit').remove()
            chartGroup.selectAll('.divergence').remove()
        })


    barGroups.append('text')
        .attr('class', 'value')
        .attr("x",   (a)  =>  xBandScale(a.key) + xBandScale.bandwidth() / 2) 
        .attr("y",   (a)  =>  yBandScale(a.value) - 10) 
        .attr('text-anchor', 'middle')
        .text((a) => `${a.value}`);

              

    // Add legend - select the svg area
    var Svg = d3.select("#my_dataviz2")

    // create a list of keys
    svg.append("circle").attr("cx", 750).attr("cy", 130).attr("r", 6).style("fill", "#839496")
    svg.append("circle").attr("cx", 750).attr("cy", 160).attr("r", 6).style("fill", "#839496")
    svg.append("text").attr("x", 760).attr("y", 130).text("(ml) Magnitude Local ").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 760).attr("y", 160).text("(md) Magnitude Duration").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("circle").attr("cx", 750).attr("cy", 190).attr("r", 6).style("fill", "#839496")
    svg.append("circle").attr("cx", 750).attr("cy", 220).attr("r", 6).style("fill", "#839496")
    svg.append("text").attr("x", 760).attr("y", 190).text("(mb) Short Period Body Wave").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 760).attr("y", 220).text("(mb_lg) Surface Wave ").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("circle").attr("cx", 750).attr("cy", 250).attr("r", 6).style("fill", "#839496")
    svg.append("circle").attr("cx", 750).attr("cy", 280).attr("r", 6).style("fill", "#839496")
    svg.append("text").attr("x", 760).attr("y", 250).text("(mww) Moment W-Phase").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 760).attr("y", 280).text("(mw) Moment Magnitude").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("circle").attr("cx", 750).attr("cy", 310).attr("r", 6).style("fill", "#839496")
    svg.append("circle").attr("cx", 750).attr("cy", 340).attr("r", 6).style("fill", "#839496")
    svg.append("text").attr("x", 760).attr("y", 310).text("(mwr) Regional").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 760).attr("y", 340).text("(mh) Determine by Hand").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("circle").attr("cx", 750).attr("cy", 360).attr("r", 6).style("fill", "#839496")
    svg.append("circle").attr("cx", 750).attr("cy", 390).attr("r", 6).style("fill", "#839496")
    svg.append("text").attr("x", 760).attr("y", 360).text("(mlv)Vertical Displacement").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 760).attr("y", 390).text("(mwp)Integrated P-Wave").style("font-size", "15px").attr("alignment-baseline", "middle")

}).catch(function(error)  {                
    console.log(error); 
});        
