const width = 600;
const height = 1200;

let svg = d3
    .select("#notTheBees")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

var url = "static/data/June_July_Earthquake.json";

d3.json(url).then((data) => {

    // the rest of our d3 code will go here

    let quakedata = data.features;
    let mags = []
    let depths = []
    quakedata.forEach(function(d) {
        mags.push(+d.properties.mag);
        depths.push(d.geometry.coordinates[2]);
    })

    let xScale = d3.scaleOrdinal().domain("Magnitude").range([0, 100]);

    let yScale = d3
        .scaleLinear()
        .domain(d3.extent(mags))
        .range([height - 50, 50]);

    // let color = d3.scaleOrdinal().domain(sectors).range(d3.schemePaired);

    //let marketcapDomain = d3.extent(data.map((d) => d["Market Cap"]));
    // marketcapDomain = marketcapDomain.map((d) => Math.sqrt(d));
    let size = 1.5 //d3.scaleLinear().domain(marketcapDomain).range([5, 30]);

    svg
        .selectAll(".circ")
        .data(quakedata)
        .enter()
        .append("circle")
        .attr("class", "circ")
        .attr("stroke", "black")
        .attr("fill", "red")
        .attr("r", size)
        .attr("cx", (width / 2))
        .attr("cy", (d) => yScale(d.properties.mag));

    let simulation = d3
        .forceSimulation(quakedata)
        .force(
            "x",
            d3
            .forceX((width / 2))
            .strength(0.1)
        )
        .force(
            "y",
            d3
            .forceY(function(d) {
                return yScale(d.properties.mag);
            })
            .strength(1)
        )
        .force(
            "collide",
            d3.forceCollide((d) => {
                return;
            })
        )
        .alphaDecay(0)
        .alpha(1)
        .on("tick", tick);

    function tick() {
        d3.selectAll(".circ")
            .attr("cx", (d) => {
                return +d.x;
            })
            .attr("cy", (d) => d.y);
    }

    let init_decay = setTimeout(function() {
        console.log("start alpha decay");
        simulation.alphaDecay(0.5);
    }, 10000);
});