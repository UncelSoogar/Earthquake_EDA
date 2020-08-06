$(document).ready(function() {
    var state = "All"
    makeMap(state, -2);
    //event listener on dropdown change
    $("#geoFilter, #magFilter").change(function() {
        let state = $('#geoFilter').val();
        let minMag = $('#magFilter').val();
        let stateText = $("#geoFilter option:selected").text();
        $('#vizTitle').text(`${minMag} Magnitude Earthquakes in ${stateText}`);
        console.log(vizTitle);
        makeMap(state, minMag);
    });
});




function makeMap(state, minMag) {
    //clear map
    $('#mapParent').empty();
    $('#mapParent').append('<div style="height:700px" id="map"></div>');

    // Adding tile layer to the map
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-streets-v11",
        accessToken: API_KEY
    });




    d3.json("June_July_Earthquake.json").then(function(incomingData) {
        // console.log(incomingData.features[0]);

        d3.csv("geo.csv").then(function(geoData) {
            console.log(geoData)

            function featureColor(depth) {
                //https://colorbrewer2.org/?type=sequential&scheme=OrRd&n=9#type=sequential&scheme=OrRd&n=9
                if (depth > 300) return "#fed976"; //yellow
                else if (depth > 80 && depth <= 300) return "#feb24c"; //orange
                else if (depth > 40 && depth <= 80) return "#fd8d3c"; //orange
                else if (depth > 20 && depth <= 40) return "#fc4e2a"; //red
                else if (depth > 10 && depth <= 20) return "#e31a1c"; //red
                else if (depth > 5 && depth <= 10) return "#bd0026"; //red
                else return "#800026"; //cranberry
            }

            // Create legends
            var legend = L.control({ position: 'bottomright' });
            legend.onAdd = function() {
                var div = L.DomUtil.create("div", "info legend");

                //create HTML for legend (has to be i tags)
                div.innerHTML += "<h4>Depths</h4>";
                div.innerHTML += '<i style="background: #800026"></i><span>0-5km</span><br>';
                div.innerHTML += '<i style="background: #bd0026"></i><span>5-10km</span><br>';
                div.innerHTML += '<i style="background: #e31a1c"></i><span>10-20km</span><br>';
                div.innerHTML += '<i style="background: #fc4e2a"></i><span>20-40km</span><br>';
                div.innerHTML += '<i style="background: #fd8d3c"></i><span>40-80km</span><br>';
                div.innerHTML += '<i style="background: #feb24c"></i><span>80-300km</span><br>';
                div.innerHTML += '<i style="background: #fed976"></i><span>300+km</span>';

                return div
            }

            var legend2 = L.control({ position: 'bottomleft' });
            legend2.onAdd = function() {
                var div = L.DomUtil.create("div", "info legend2");

                //create HTML for legend (has to be i tags)
                div.innerHTML += "<h4>Magnitudes</h4>";
                div.innerHTML += '<i style="width: 26px; height: 26px">1</i>';
                div.innerHTML += '<i style="width: 35px; height: 35px">2</i>';
                div.innerHTML += '<i style="width: 39px; height: 39px">3</i>';
                div.innerHTML += '<i style="width: 45px; height: 45px">4</i>';
                div.innerHTML += '<i style="width: 52px; height: 52px">5</i>';
                div.innerHTML += '<i style="width: 65px; height: 65px">6</i>';
                div.innerHTML += '<i style="width: 74px; height: 74px">7</i>';
                div.innerHTML += '<i style="width: 84px; height: 84px">8</i>';

                return div
            }


            function info(feature) {
                return {
                    radius: ((feature.properties.mag + 2) * 4),
                    fillOpacity: .8,
                    fillColor: featureColor(feature.geometry.coordinates[2]),
                    weight: 0.5
                }
            }

            let filteredData = incomingData.features.filter(x => x.properties.mag >= minMag)
            var circle = L.geoJson(filteredData, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng)
                },
                style: info,
                onEachFeature: function(feature, layer) {
                    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><h5>Magnitude: ${feature.properties.mag}</h5><h5>Depth: ${feature.geometry.coordinates[2]} km</h5>`)
                }
            });

            var markers = L.markerClusterGroup();
            var heatArray = [];

            incomingData.features.forEach(function(d) {
                if ((d.geometry.coordinates[1]) && (d.geometry.coordinates[0])) {
                    if (d.properties.mag >= minMag) {
                        let temp = L.marker([+d.geometry.coordinates[1], d.geometry.coordinates[0]]).bindPopup(`<h3>${d.properties.place}</h3><hr><h5>Magnitude: ${d.properties.mag}</h5>`);
                        markers.addLayer(temp);

                        heatArray.push([+d.geometry.coordinates[1], d.geometry.coordinates[0]]);
                    }
                }
            });


            var heat = L.heatLayer(heatArray, {
                radius: 60,
                blur: 40
            });

            var baseMaps = {
                "Street": streetmap,
                "Dark": darkmap,
                "Light": lightmap,
                "Satellite": satellitemap
            };

            var overlayMaps = {
                "Circles": circle,
                "Heatmap": heat,
                "Markers": markers,
            };

            let myState = geoData.filter(x => x.Display === state)[0];
            console.log(geoData);
            var myMap = L.map("map", {
                center: [+myState.Lat, +myState.Long],
                zoom: +myState.Zoom,
                layers: [streetmap, circle]
            });

            // for markers upon start
            // myMap.addLayer(markers);
            L.control.layers(baseMaps, overlayMaps).addTo(myMap);
            legend.addTo(myMap);
            legend2.addTo(myMap);

        });
    });
};



d3.json("June_July_Earthquake.json").then(function(response) {
    quake = response.features
    mags = []
    depths = []
    response.features.forEach(getStats);

    function getStats(d) {

        // //Latitude
        d.geometry.coordinates[1];
        // //Longitude
        d.geometry.coordinates[0];
        // // Depth
        depths.push(d.geometry.coordinates[2]);
        // //Mag
        mags.push(d.properties.mag);
        // // Significance
        d.properties.sig;
        // // Time, need to convert from iso
        d.properties.time;
        // //USGS url
        d.properties.url;
    }
    // console.log(d3.median(depths));
});