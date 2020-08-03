function makeResponsive() {
    // Define dimensions svg area
    const width = 600;
    const height = 1200;

    // SVG Appends
    let svg = d3
        .select("#scatterplz")
        .append("svg")
        .attr("height", height)
        .attr("width", width);


    //Read the data
    var link = "static/data/June_July_Earthquake.json";

    d3.json(link).then(function(data) {
        var mags = []
        var depths = []
        var quakeData = data.features
        console.log(data.features);

        quakeData.forEach(function(d) {
            // d.geometry.coordinates[1] = +d.geometry.coordinates[1];
            // d.geometry.coordinates[0] = +d.geometry.coordinates[0];
            depths.push(+d.geometry.coordinates[2]); //Depth
            mags.push(+d.properties.mag); //Magnitude
            //d.properties.time = +d.properties.time;
            // d.properties.url = +d.properties.url;
        });


        // Parse date-time
        var parseTime = d3.timeParse("%B");



        // Set xScale 
        var xScale = d3
            .scaleLinear()
            .domain(d3.extent(mags))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));
        //Set yScale
        var yScale = d3
            .scaleLinear()
            .range([height - 50, 50])
            .domain(d3.extent(mags))
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisLeft(yScale));
        let size = 1.5

        svg
            .selectAll(".circ")
            .data(quakeData)
            .enter()
            .append("circle")
            .attr("class", "circ")
            .attr("stroke", "black")
            .attr("fill", "red")
            .attr("r", size)
            .attr("cx", (width / 2))
            .attr("cy", (d) => yScale(d.properties.mag));


    }).catch(function(error) {
        console.log(error);



    });


}





makeResponsive();