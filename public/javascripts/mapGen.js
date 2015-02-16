function MapGen(params) {
  console.log("gen working")

  var mapContainer = this.mapContainer = $('#map').get(0);
  var mapOptions = this.mapOptions = {
    center: {
      lat: 40.457628, lng: -79.976295
      },
    zoom: 17
  };

  var map = this.map = new google.maps.Map(mapContainer, mapOptions);
  this.add_map();
  this.register_listeners();

  new google.maps.Marker({
    position: mapOptions.center,
    map: map,
    animation: google.maps.Animation.DROP
  })
}

MapGen.prototype.add_map = function () {
  // google.maps.event.addDomListener(window, 'load', initialize);
};


MapGen.prototype.register_listeners = function () {
  var map = this.map;
  $('.streetViewImg').click(function() {
    var data = $(this).data('query-string');
    var latLng;
    var lat;
    var lng;
    var center;

    latLng = data.location;
    latLng = latLng.split(',');
    lat = parseFloat(latLng[0]);
    lng = parseFloat(latLng[1]);

    center = new google.maps.LatLng(lat, lng);
    map.setCenter(center);
    new google.maps.Marker({
      position: center,
      map: map,
      animation: google.maps.Animation.DROP
    })
  })
};
