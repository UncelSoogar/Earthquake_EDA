d3.csv("geo.csv").then(function(geoData) {
    // console.log(geoData)
    var selector = d3.select("#geoFilter");
    geoData.forEach((sample) => {
        selector
            .append("option")
            .text(sample.Display)
            .property("value", sample.Name);
    });
});