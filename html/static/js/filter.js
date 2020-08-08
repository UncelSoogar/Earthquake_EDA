var geourl = "static/data/geo.csv";


d3.csv(geourl).then(function(geoData) {
    // console.log(geoData)
    var selector = d3.select("#geoFilter");
    geoData.forEach((sample) => {
        selector
            .append("option")
            .text(sample.Display)
            .property("value", sample.Name);
    });
});