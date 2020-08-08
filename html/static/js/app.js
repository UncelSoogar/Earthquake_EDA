////
//// Scatter plot by Christion
////

$(document).ready(function() {
    let svgWidth = 500;
    let svgHeight = 400;
    let margin = {
        top: 20,
        right: 10,
        bottom: 45,
        left: 50
    };
    let width = svgWidth - margin.left - margin.right; //1150
    let height = svgHeight - margin.top - margin.bottom; // 420
    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    let svg = d3.select("#scatterplz")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    let chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    //     //Read the data
    let link = "static/data/June_July_Earthquake.json";
    d3.json(link).then(function(data) {
        let mags = []
        let depths = []
        let titles = []
        let quakedata = data.features
            //console.log(quakedata[0].properties.title);
        quakedata.forEach(function(d) {
            titles.push(+d.properties.title);
            // d.geometry.coordinates[1] = +d.geometry.coordinates[1];
            // d.geometry.coordinates[0] = +d.geometry.coordinates[0];
            depths.push(+d.geometry.coordinates[2]); //Depth
            mags.push(+d.properties.mag); //Magnitude
            //d.properties.time = +d.properties.time;
            // d.properties.url = +d.properties.url;
        });



        // Step 2: Create scale functions
        // ==============================
        let xLinearScale = d3.scaleLinear()
            .domain(d3.extent(mags))
            .range([0, width]);
        let yLinearScale = d3.scaleLinear()
            .domain([-50, d3.max(depths)])
            .range([height, 0]);
        // Step 3: Create axis functions
        // ==============================
        let bottomAxis = d3

            .axisBottom(xLinearScale)
            .ticks((width + 2) / (height + 2) * 5)
            .tickSize(-height - 6)
            .tickPadding(5);


        let leftAxis = d3
            .axisLeft(yLinearScale)
            .ticks(10)
            .tickSize(-width - 6)
            .tickPadding(10);
        // Step 4: Append Axes to the chart
        // ==============================



        let gX = chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        let gY = chartGroup.append("g")
            .call(leftAxis);


        // Add Zoom (Comment this out if Zoom is messing up)
        let zoom = d3.zoom()
            .scaleExtent([1, 40])
            .translateExtent([
                [-100, -100],
                [width + 90, height + 100]
            ])
            .on("zoom", zoomed);
        d3.select("#reset")
            .on("click", resetted);

        svg.call(zoom);

        function zoomed() {
            circlesGroup.attr("transform", d3.event.transform);
            gX.call(bottomAxis.scale(d3.event.transform.rescaleX(xLinearScale)));
            gY.call(leftAxis.scale(d3.event.transform.rescaleY(yLinearScale)));
        }

        function resetted() {
            svg.transition()
                .duration(10)
                .call(zoom.transform, d3.zoomIdentity);
        }

        // Step 5: Create Circles
        // ==============================
        let circlesGroup = chartGroup.selectAll("circle")
            .data(quakedata)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.properties.mag))
            .attr("cy", d => yLinearScale(d.geometry.coordinates[2]))
            .attr("r", "4")
            .attr("opacity", 8)
            .attr("stroke", "black")
            .attr("fill", "#580505")


        // Step 6: Initialize tool tip
        // ==============================
        let toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`<strong>${d.properties.title}
                `);
            });
        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);
        // Step 8: Create event listeners to display and hide the tooltip

        circlesGroup.on("mouseover", function(data) {
                toolTip.show(data, this)
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("r", 10)
                    .attr("fill", "black");
            })
            .on("mouseout", function(data, index) {
                toolTip.hide(data)
                d3.select(this)

                .transition()
                    .duration(100)
                    .attr("r", 4)
                    .attr("fill", "#580505");
            });

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("font", "14px")
            .attr("class", "axis-text")
            .text("Depth from Center (KM)");
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + 25})`)
            .attr("class", "axis-text")
            .text("Magnitude (1-8)");
    }).catch(function(error) {
        console.log(error);
    });

})

////
////  HISTOGRAM By Chris Lichliter
////
//Source code https://www.d3-graph-gallery.com/graph/histogram_binSize.html

$(document).ready(function() {

    // set the dimensions and margins of the graph
    let margin = {
            top: 10,
            right: 45,
            bottom: 60,
            left: 50
        },
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select("#histogram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Load in data
    var url = "static/data/June_July_Earthquake.json";

    d3.json(url).then(function(response) {

        let quakedata = response.features;
        let mags = []
        let depths = []
        quakedata.forEach(function(d) {
            mags.push(+d.properties.mag);
            depths.push(d.geometry.coordinates[2]);
        })

        // X axis: scale and draw:
        var x = d3.scaleLinear()
            .domain(d3.extent(mags))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.top + 20)
            .classed("axis-text", true)
            .text("Magnitude");


        // Y axis: initialization
        var y = d3.scaleLinear()
            .range([height, 0]);
        var yAxis = svg.append("g")

        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 10)
            .attr("x", 0 - (height / 2))
            .classed("axis-text", true)
            .text("Frequency")

        // Update graph with selected number of bins
        function update(nBin) {

            // set the parameters for the histogram
            var histogram = d3.histogram()
                .value(function(mags) { return mags; })
                .domain(x.domain())
                .thresholds(x.ticks(nBin));

            // And apply this function to data to get the bins
            var bins = histogram(mags);

            // Y axis: update so domain includes largest bin
            y.domain([0, d3.max(bins, function(d) { return d.length; })]);
            yAxis
                .transition()
                .duration(1000)
                .call(d3.axisLeft(y));

            // Join the rect with the bins data
            var bars = svg.selectAll("rect")
                .data(bins)

            // Manage add new bars to existing bars:
            bars
                .enter()
                .append("rect")
                .merge(bars)
                .transition()
                .duration(1000)
                .attr("class", "histo-bars")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0); })
                .attr("height", function(d) { return height - y(d.length); })



            // If less bar in the new histogram, I delete the ones not in use anymore
            bars
                .exit()
                .remove()
        }
        // Initialize with 20 bins
        update(25)


        // Listen to the button -> update if user change it
        d3.select("#nBin").on("input", function() {
            update(+this.value);
        });

    });
})

////
////  Bar plot for type of measurement by Ana Gill
////

$(document).ready(function() {
    // Set the dimensions for the bar chart
    let svgWidth = 500;
    let svgHeight = 400;

    // Define the chart's margins as an object

    let chartMargin = {
        top: 40,
        right: 10,
        bottom: 40,
        left: 50
    };
    // Define dimensions of the chart area           
    let chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    let chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

    // Select body, append SVG area to it, and set the dimensions

    let svg = d3.select("#barchart")
        .append("svg")
        .attr("viewBox", "0 0 " + svgWidth + " " + svgHeight)

    // Append a group to the SVG area and shift ('translate') it to the right and down to adhere      
    // to the margins set in the "chartMargin" object.

    let chartGroup = svg.append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

    //Load in data       
    let url = "static/data/June_July_Earthquake.json";


    d3.json(url).then((data) => {
        let quakedata = data.features;

        //Format the Data

        quakedata.forEach(function(d) {
            d.magType = d.properties.magType;
            console.log(d.magType);
        });


        let magCount = []

        magCount = d3.nest()
            .key(function(d) {
                return d.magType;
            })
            .rollup(function(leaves) {
                return leaves.length;
            })
            .entries(quakedata);
        magc2 = []
        magCount.forEach(function(d) {
            if (d.key !== "null") {
                magc2.push(d)
            }
        })
        magCount = magc2
        console.log(magCount)

        console.log(magCount);

        //Create Scales for the chart
        let yBandScale = d3.scaleLinear()
            .domain([0, d3.max(magCount.map(m => m.value))])
            .range([chartHeight, 0]);

        let xBandScale = d3.scaleBand()
            .domain(magCount.map(m => m.key))
            .range([0, chartWidth])
            .padding(0.1);


        let bottomAxis = d3.axisBottom(xBandScale);
        let leftAxis = d3.axisLeft(yBandScale).ticks(10);


        //Append the axes to the ChartGroup
        //Add y-axis
        chartGroup.append("g")
            .call(leftAxis);

        // Y axis label:               
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -chartMargin.left + 60)
            .attr("x", 0 - (chartHeight / 2))
            .classed("axis-text", true)
            .text("Number of Magnitude Types")

        //Add x-axis
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);

        // Add X axis label:              
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", chartWidth / 2)
            .attr("y", chartHeight + chartMargin.top + 35)
            .classed("axis-text", true)
            .text("Magnitude Types");

        barGroups = chartGroup.selectAll()
            .data(magCount)
            .enter()


        chartGroup.selectAll(".bar")
            .data(magCount)
            .enter()
            .append("rect")
            .classed("bar", true)
            .attr("x", d => xBandScale(d.key))
            .attr("y", d => yBandScale(d.value))
            .attr("width", xBandScale.bandwidth())
            .attr("height", d => chartHeight - yBandScale(d.value))
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
                    .attr('fill', "#839496")
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
            .attr("x", (a) => xBandScale(a.key) + xBandScale.bandwidth() / 2)
            .attr("y", (a) => yBandScale(a.value) - 10)
            .attr('text-anchor', 'middle')
            .style("fill", "#839496")
            .text((a) => `${a.value}`);



        // Add legend - select the svg area
        //    var Svg = d3.select("#my_dataviz2")

        // create a list of keys
        svg.append("circle").attr("cx", 280).attr("cy", 30).attr("r", 6).style("fill", "#580505")
        svg.append("circle").attr("cx", 280).attr("cy", 60).attr("r", 6).style("fill", "#580505")
        svg.append("text").attr("x", 290).attr("y", 30).text("(ml) Magnitude Local ").style("font-size", "16px").attr("alignment-baseline", "middle").style("fill", "#839496")
        svg.append("text").attr("x", 290).attr("y", 60).text("(md) Magnitude Duration").style("font-size", "16px").attr("alignment-baseline", "middle").style("fill", "#839496")
        svg.append("circle").attr("cx", 280).attr("cy", 90).attr("r", 6).style("fill", "#580505")
        svg.append("circle").attr("cx", 280).attr("cy", 120).attr("r", 6).style("fill", "#580505")
        svg.append("text").attr("x", 290).attr("y", 90).text("(mb) Short Period Body Wave").style("font-size", "16px").attr("alignment-baseline", "middle").style("fill", "#839496")
        svg.append("text").attr("x", 290).attr("y", 120).text("(mb_lg) Surface Wave ").style("font-size", "16px").attr("alignment-baseline", "middle").style("fill", "#839496")
        svg.append("circle").attr("cx", 280).attr("cy", 150).attr("r", 6).style("fill", "#580505")
        svg.append("circle").attr("cx", 280).attr("cy", 180).attr("r", 6).style("fill", "#580505")
        svg.append("text").attr("x", 290).attr("y", 150).text("(mww) Moment W-Phase").style("font-size", "16px").attr("alignment-baseline", "middle").style("fill", "#839496")
        svg.append("text").attr("x", 290).attr("y", 180).text("(mw) Moment Magnitude").style("font-size", "16px").attr("alignment-baseline", "middle").style("fill", "#839496")
        svg.append("circle").attr("cx", 280).attr("cy", 210).attr("r", 6).style("fill", "#580505")
        svg.append("circle").attr("cx", 280).attr("cy", 240).attr("r", 6).style("fill", "#580505")
        svg.append("text").attr("x", 290).attr("y", 210).text("(mwr) Regional").style("font-size", "16px").attr("alignment-baseline", "middle").style("fill", "#839496")
        svg.append("text").attr("x", 290).attr("y", 240).text("(mh) Determine by Hand").style("font-size", "16px").attr("alignment-baseline", "middle").style("fill", "#839496")
        svg.append("circle").attr("cx", 280).attr("cy", 270).attr("r", 6).style("fill", "#580505")
        svg.append("circle").attr("cx", 280).attr("cy", 300).attr("r", 6).style("fill", "#580505")
        svg.append("text").attr("x", 290).attr("y", 270).text("(mlv)Vertical Displacement").style("font-size", "16px").attr("alignment-baseline", "middle").style("fill", "#839496")
        svg.append("text").attr("x", 290).attr("y", 300).text("(mwp)Integrated P-Wave").style("font-size", "16px").attr("alignment-baseline", "middle").style("fill", "#839496")

    }).catch(function(error) {
        console.log(error);
    });
})