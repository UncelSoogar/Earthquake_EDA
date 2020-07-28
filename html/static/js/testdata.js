// Locate and read data

var url = "static/data/June_July_Earthquake.json";

d3.json(url).then(function(response) {

    console.log(response.features[0]);
    response.features.forEach(getstats);

    function getstats(d) {

        //Latitude
        d.geometry.coordinates[1];
        //Longitude
        d.geometry.coordinates[0];
        // Depth
        d.geometry.coordinates[2];
        //Mag
        d.properties.mag;
        // Significance
        d.properties.sig;
        // Time, need to convert from iso
        d.properties.time;
        //USGS url
        d.properties.url;

    }



});