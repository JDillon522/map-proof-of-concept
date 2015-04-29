
function MapGen(params) {
  var mapContainer = this.mapContainer = $('#map').get(0);
  var mapOptions = this.mapOptions = {
    center: {
      lat: null,
      lng: null
    },
    zoom: 17
  };
  var map = this.map;
  var firstMap = $('img.streetViewImg').first().data('query-string');
  var firstLocation;

  if (firstMap) {
    firstLocation = this.get_location(firstMap);
    mapOptions.center.lat = firstLocation[0];
    mapOptions.center.lng = firstLocation[1];

    map = this.map = new google.maps.Map(mapContainer, mapOptions);

    this.add_marker(mapOptions.center.lat, mapOptions.center.lng, firstMap);
    this.register_listeners();
  }
}

MapGen.prototype.add_marker = function (lat, lng, data) {
  var stringData = JSON.stringify(data);
  var map = this.map;
  var marker = this.marker || null;
  var infoWindow = new google.maps.InfoWindow({
    content: '<h3><a class="make-street-view" data-query-string=' + stringData +
                    '>Street View</a>' +
              '</h3>'
  });
  var center = new google.maps.LatLng(lat, lng);

  if (marker) { marker.setMap(null); }

  map.setCenter(center);

  marker = new google.maps.Marker({
    position: center,
    map: map,
    animation: google.maps.Animation.DROP
  });

  google.maps.event.addListener(marker, 'click', function (event) {
    infoWindow.open(map, marker);
  });

  this.marker = marker;
};


MapGen.prototype.register_listeners = function () {
  var $self = this;

  $('.streetViewImg').click(function() {


    var data = $(this).data('query-string');
    var id = $(this).data('id');
    var latLng = $self.get_location(data);
    var newLocation = new google.maps.LatLng(latLng[0], latLng[1]);
    var newMapOptions = {
      center: newLocation,
      zoom: 17
    };

    $self.map = new google.maps.Map($self.mapContainer, newMapOptions);
    $self.add_marker(latLng[0], latLng[1], data);
  });

  $('body').on('click', 'a.make-street-view', function() {
    var mapContainer = this.mapContainer = $('#map').get(0);
    var data = $(this).data('query-string');
    var heading = parseFloat(data.heading);
    var pitch = parseFloat(data.pitch);
    var location = $self.get_location(data);
    var thisStreet = new google.maps.LatLng(location[0], location[1]);
    var streetOptions = {
      position: thisStreet,
      pov: {
        heading: heading,
        pitch: pitch
      },
      pano: data.pano
    };





    var streetViewMap = new google.maps.StreetViewPanorama(mapContainer, streetOptions);

    $self.map.setStreetView(streetViewMap);

  })
};

MapGen.prototype.get_location = function (data) {
  if (!data) {
    return false;
  }

  var latLng;
  var lat;
  var lng;

  latLng = data.location || data;
  latLng = latLng.split(',');
  lat = parseFloat(latLng[0]);
  lng = parseFloat(latLng[1]);

  return [lat, lng];
};
