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

map.on('click', function(e){
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
