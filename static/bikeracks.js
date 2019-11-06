var map = L.map('map').fitWorld();

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(map);

function attachPopup(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.streetname) {
    layer.bindPopup(feature.properties.streetname);
  }
}

function onLocationFound(e) {
  var radius = e.accuracy / 2;

  L.marker(e.latlng).addTo(map)
    .bindPopup("You are within " + radius + " meters from this point").openPopup();

  L.circle(e.latlng, radius).addTo(map);

  $.ajax({
    url: "/test?lat=" + e.latlng.lat + "&lng=" + e.latlng.lng
  }).done(function(data) {

    L.geoJSON(data, {
      onEachFeature: attachPopup
    }).addTo(map);

  });
}

function onLocationError(e) {
  alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.on('click', function(e) {
  $.ajax({
    url: "/test?lat=" + e.latlng.lat + "&lng=" + e.latlng.lng
  }).done(function(data) {

    L.geoJSON(data, {
      onEachFeature: attachPopup
    }).addTo(map);

  });
})

map.locate({
  setView: true,
  maxZoom: 16
});




function makeSPARQLQuery(endpointUrl, sparqlQuery, doneCallback) {
  var settings = {
    headers: {
      Accept: 'application/sparql-results+json'
    },
    data: {
      query: sparqlQuery
    }
  };
  return $.ajax(endpointUrl, settings).then(doneCallback);
}

var endpointUrl = 'https://query.wikidata.org/sparql',
  sparqlQuery = "#Map of hospitals\n" +
  "#added 2017-08\n" +
  "#defaultView:Map\n" +
  "SELECT * WHERE {\n" +
  "  ?item wdt:P31*/wdt:P279* wd:Q16917;\n" +
  "        wdt:P625 ?geo .\n" +
  "}LIMIT 100";

makeSPARQLQuery(endpointUrl, sparqlQuery, function(data) {
  //console.log( data );
  data.results.bindings.forEach(function(result) {
    cs = result.geo.value
    url = result.item.value

    coords = cs.split(" ")
    console.log(coords)

    lat = coords[1].split(")")[0]
    lng = coords[0].split("(")[1]

    L.marker([lat, lng]).on("click", function() {
      window.open(url)
    }).addTo(map);

  })
});
