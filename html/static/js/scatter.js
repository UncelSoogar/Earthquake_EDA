$(document).ready(function() {
    let svgWidth = 1260;
    let svgHeight = 500;
    let margin = {
        top: 20,
        right: 10,
        bottom: 60,
        left: 100
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
            .range([0, 1250]);
        let yLinearScale = d3.scaleLinear()
            .domain(d3.extent(depths))
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
        d3.select("button")
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
            .attr("r", "5")
            .attr("opacity", 8)
            .attr("stroke", "black")
            .attr("fill", "lavender")

        //  Add Legend Possibly 
        //==============================

        // let legendGroup = svg.append('g')
        //     .attr('class', 'legend')
        //     .attr('transform', /* translate as appropriate */ );

        // let legendEntry = legendGroup.selectAll('g')
        //     .data(data);
        // //create one legend entry for each series in the dataset array
        // //if that's not what you want, create an array that has one 
        // //value for every entry you want in the legend

        // legendEntry.enter().append("g")
        //     .attr("class", "legend-entry")
        //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        // //shift each entry down by approx 1 line (20px)

        // legendEntry.append("rect") //add a square to each entry
        //     /* and so on */




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
                    .attr("r", 5)
                    .attr("fill", "lavender");
            });

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("font", "14px")
            .attr("class", "axisText")
            .text("Depth from Center (KM)");
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Magnitude (1-8)");
    }).catch(function(error) {
        console.log(error);
    });

})