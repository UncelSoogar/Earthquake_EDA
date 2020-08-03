//Source code https://www.d3-graph-gallery.com/graph/histogram_binSize.html

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 50, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#histogram")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// get the data
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
        .attr("y", -margin.left + 20)
        .attr("x", 0 - (height / 2))
        .classed("axis-text", true)
        .text("Frequency")

    // A function that builds the graph for a specific value of bin
    function update(nBin) {

        // set the parameters for the histogram
        var histogram = d3.histogram()
            .value(function(mags) { return mags; }) // I need to give the vector of value
            .domain(x.domain()) // then the domain of the graphic
            .thresholds(x.ticks(nBin)); // then the numbers of bins

        // And apply this function to data to get the bins
        var bins = histogram(mags);

        // Y axis: update now that we know the domain
        y.domain([0, d3.max(bins, function(d) { return d.length; })]); // d3.hist has to be called before the Y axis obviously
        yAxis
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y));

        // Join the rect with the bins data
        var u = svg.selectAll("rect")
            .data(bins)

        // Manage the existing bars and eventually the new ones:
        u
            .enter()
            .append("rect") // Add a new rect for each new elements
            .merge(u) // get the already existing elements as well
            .transition() // and apply changes to all of them
            .duration(1000)
            .attr("class", "histo-bars")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("height", function(d) { return height - y(d.length); })



        // If less bar in the new histogram, I delete the ones not in use anymore
        u
            .exit()
            .remove()
    }
    // Initialize with 20 bins
    update(20)


    // Listen to the button -> update if user change it
    d3.select("#nBin").on("input", function() {
        update(+this.value);
    });

});