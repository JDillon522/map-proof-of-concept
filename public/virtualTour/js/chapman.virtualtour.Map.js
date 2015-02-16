/**
 * Map
 */
chapman.virtualtour.Map = (function($)
{
	var _markers = [];
	var _delayedMarkers = [];
	var _delayedMarker = undefined;
	var _mapInitialized = false;

	var _addingMarkers = false; // true when a loop is running to add markers

	var _infowindow = new InfoBox (
	{
	    alignBottom: true,
	   	pixelOffset: new google.maps.Size(28, -10),
	   	maxWidth: 350,
	   	closeBoxURL: ''
	});

	var _mapOptions =
	{
     	center: new google.maps.LatLng($('#virtualTour-mapColumn').data().startingPointLatitude,
     																 $('#virtualTour-mapColumn').data().startingPointLongitude),
     	mapTypeId: google.maps.MapTypeId.ROADMAP,
     	disableDefaultUI: true,
     	zoom: 17,
     	mapTypeControl: true,
     	mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DEFAULT,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        overviewMapControl: true,
      	streetViewControl: true,
      	styles: [
			{
				"featureType": "poi",
				"stylers": [
					{ "visibility": "simplified" }
				]
			},
			{
				"featureType": "administrative",
				"stylers": [
					{ "visibility": "off" }
				]
			},
			{
				"featureType": "transit",
				"stylers": [
					{ "visibility": "off" }
				]
			},
			{
				"featureType": "landscape",
				"elementType": "labels",
				"stylers": [
					{ "visibility": "off" }
				]
			}
		],
      	overviewMapControl: true,
      	panControl: false,
  		zoomControl: true,
  		scaleControl: true,
	};

	/**
	 * private functions
	 */
	var _init = function()
	{
		if(chapman.virtualtour.MissionControl.isDesktop() && !_mapInitialized)
		{
			_map = new google.maps.Map(document.getElementById("virtualTour-mapCanvas"), _mapOptions);

			// wait for the bounds to change and add any markers that were added on load
			google.maps.event.addListener(_map, 'bounds_changed', function()
			{
				if(!_mapInitialized)
				{
					_mapInitialized = true;
					google.maps.event.clearListeners(_map, 'bounds_changed');

					if(_delayedMarkers.length > 0)
						_addMarkers(_delayedMarkers);

					if(_delayedMarker != undefined)
						_markerClicked(_delayedMarker);

					chapman.virtualtour.MissionControl.mapReady();
				}
			});
		}
		else
		{
		}
	};

	/**
	 * Using the checkbox group name return the image name for the marker icon.
	 */
	var _getIcon = function(group)
	{
		var iconImgName;

		switch (group)
		{
			case 'library2' :
				iconImgName = 'icon_library.png';
				break;
			case 'dumbbell' :
				iconImgName = 'icon_dumbbell.png';
				break;
			case 'users' :
				iconImgName = 'icon_users.png';
				break;
			case 'food3' :
				iconImgName = 'icon_food.png';
				break;
			case 'mic3' :
				iconImgName = 'icon_mic.png';
				break;
			case 'lab' :
				iconImgName = 'icon_lab.png';
				break;
			case 'car' :
				iconImgName = 'icon_car.png';
				break;
			case 'step' :
				iconImgName = 'icon_steps.png';
				break;
			case 'camera' :
				iconImgName = 'icon_camera.png';
				break;
			case 'tree' :
				iconImgName = 'icon_tree.png';
				break;
			case 'bed' :
				iconImgName = 'icon_bed.png';
				break;
			case 'graduation' :
				iconImgName = 'icon_graduation.png';
				break;
			case 'star3' :
				iconImgName = 'icon_star.png';
				break;
			case 'bus' :
				iconImgName = 'icon_bus.png';
				break;
			case 'accessibility2' :
				iconImgName = 'icon_accessibility.png';
				break;
			case 'aid' :
				iconImgName = 'icon_aid.png';
				break;
			case 'coin' :
				iconImgName = 'icon_coin.png';
				break;
			case 'toilets_unisex' :
				iconImgName = 'icon_bathroom.png';
				break;
			default :
				iconImgName = 'icon_default.png';
		}

		return chapman.virtualtour.imgFilePath + iconImgName;
	};

	/**
	 * Finds a marker object in the markers array and returns it
	 */
	var _getMarkerIndex = function(id)
	{
		var markerIndex = -1;

		for (var i in _markers)
		{
			if(_markers[i].id == id)
				return i;
		}

		return markerIndex;
	};

	/**
	 * Finds a marker object in the markers array by id
	 */
	var _getMarkerById = function(id)
	{
		return _markers[_getMarkerIndex(id)];
	}


	var _getLayerIndexByLineId = function(id)
	{
		var layerIndex = -1;

		for (var i in _markers)
		{
			var marker = _markers[i];
			var type = marker.type;

			if(type == 'kml')
			{
				if(marker.obj.lineId == id)
					return i;
			}
		}

		return layerIndex;
	}

	/**
	 * Respond to a marker being clicked. State changes are handled with $.History.go() in addMarker()
	 */
	var _markerClicked = function(marker, e)
	{
		if(marker != undefined && marker.type != 'kml')
			_map.panTo(marker.getPosition());
		else
			_delayedMarker = marker;
	};

	/**
	 * Zoom the map to fit stuff off of the screen
	 *	status: copied and pasted, not working yet
	 */
	var _zoomToFitNewMarker = function(marker)
	{
		if(_mapInitialized)
		{
			var curBounds = _map.getBounds();
			var markerPosition = marker.position;

			if(!curBounds.contains(markerPosition))
			{
				var bounds = new google.maps.LatLngBounds();
			   	bounds.extend(markerPosition);

				_map.panToBounds(bounds);
				//_map.fitBounds(bounds);
			}
		}
	};

	/*
	var _zoomToFitBounds = function()
	{
		console.log('_zoomToFitBounds');

		if(_mapInitialized)
		{
			var bounds = new google.maps.LatLngBounds();

			_map.panToBounds(bounds);
			//_map.fitBounds(bounds);
		}
	};
	*/


	/**
	 * public functions
	 *
	 */


	/**
	 * Creates a marker, stores it in an array and adds it to the map.
	 */
	var _addMarker = function(markerObject)
	{
		var type = markerObject.type;
		var markerExists = _getMarkerIndex(markerObject.id);

		switch(type)
		{
			case 'kml' :
			{
				var kmlUrl = markerObject.url;
				var kmlOptions = {
				  	suppressInfoWindows: true,
				  	preserveViewport: false,
				};
				var kmlLayer = new google.maps.KmlLayer(kmlUrl, kmlOptions);

				_markers.push(
				{
					type: type,
					obj: markerObject,
					layer: kmlLayer,
					id: markerObject.id
				});

				kmlLayer.setMap(_map);

				google.maps.event.addListener(kmlLayer, 'click', function(event)
				{
					var lineName = event.featureData.name;
					var layer = _markers[_getLayerIndexByLineId(lineName)];
					$.History.go(layer.obj.id);
				});

				chapman.virtualtour.MissionControl.updateQueryString(_markers);

				break;
			}
			case 'marker' :
			default :
			{
				if(markerExists == -1 && _mapInitialized)
				{
					var marker;

					if(!chapman.virtualtour.MissionControl.isPrint())
					{
						marker = new google.maps.Marker(
						{
							//animation: google.maps.Animation.DROP,
							type: type,
							group: markerObject.group,
							icon: _getIcon(markerObject.group),
							shadow: chapman.virtualtour.imgFilePath + 'icon_shadow.png',
							id: markerObject.id,
							name: markerObject.title,
							position: new google.maps.LatLng(markerObject.latitude, markerObject.longitude),
							visible: true
						});
					}
					else
					{
						marker = new MarkerWithLabel(
						{
							type: type,
							icon: _getIcon(markerObject.group),
							shadow: chapman.virtualtour.imgFilePath + 'icon_shadow.png',
							labelContent: markerObject.title,
							labelAnchor: new google.maps.Point(60, -5),
							labelClass: 'label',
							labelStyle: {
								opacity: 1
							},
							name: markerObject.title,
							position: new google.maps.LatLng(markerObject.latitude, markerObject.longitude),
						});
					}

					// keep track of what markers are on the map
					_markers.push(marker);

					// add the marker to the map
					marker.setMap(_map);

					// add listeners
					google.maps.event.addListener(marker, 'mouseover', function(e)
					{
						var offset = -8;
						var markerName = marker.name;

						_infowindow = new InfoBox (
						{
						    alignBottom: false,
						   	pixelOffset: new google.maps.Size(18, -48),
						   	maxWidth: 350,
						   	closeBoxURL: ''
						});
						_infowindow.setContent('<div class="content">' + markerName + '</div>');
						_infowindow.open(_map, marker);
					});
					google.maps.event.addListener(marker, 'mouseout', function()
					{
					    _infowindow.close();
					});
					google.maps.event.addListener(marker, 'click', function(e)
					{
						_infowindow.close();
						//_markerClicked(marker, e);
						$.History.go(marker.id);
					});

					// zoom the map if the new marker is off screen
					if(!_addingMarkers)
						_zoomToFitNewMarker(marker);

					// update the deep linking
					chapman.virtualtour.MissionControl.updateQueryString(_markers);
				}
				else
				{
					_delayedMarkers.push(markerObject);
				}
				break;
			}
		}
	};

	/**
	 * Removes a marker from the map and also the markers array.
	 */
	var _removeMarker = function(markerObject)
	{
		var index = _getMarkerIndex(markerObject.id);
		var marker = _markers[index];

		if(marker)
		{
			if(marker.type != 'kml')
				marker.setMap(null);
			else
				marker.layer.setMap(null);
			google.maps.event.clearListeners(marker);
			_markers.splice(index, 1);
			marker = null;
		}

		// update the deep linking
		chapman.virtualtour.MissionControl.updateQueryString(_markers);
	};

	/**
	 * Adds more than one marker to the map
	 */
	var _addMarkers = function(markerObjects)
	{
		var bounds = new google.maps.LatLngBounds();
		var totalMarkers = markerObjects.length;
		_addingMarkers = true;

		$.each(markerObjects, function(index, value)
		{
			_addMarker(value);

			var type = value.type;

			// the map will center itself when a path is loaded
			if(type != 'kml')
				bounds.extend(new google.maps.LatLng(value.latitude, value.longitude));

			if(index >= totalMarkers - 1)
				_addingMarkers = false;
		});

		_map.fitBounds(bounds);
	};

	/**
	 * Removes more than one marker from the map
	 */
	var _removeMarkers = function(markerObjects)
	{
		for (var i in markerObjects)
		{
			_removeMarker(markerObjects[i]);
		}
	};

	/**
	 * When a sub category clicked from the category menu set the active state in the map
	 */
	var _updateMapById = function(id)
	{
		var marker = _getMarkerById(id);
		_markerClicked(marker);

		return marker;
	};


	var _clickMarkerById = function(id)
	{
		$.History.go(id);
	};

	/**
	 * returns the marker query string for the location bar
	 */
	var _getSelections = function()
	{
		return _markers;
	};


	// expose public functions

	return {
		init: _init,
		addMarker: _addMarker,
		addMarkers: _addMarkers,
		removeMarker: _removeMarker,
		removeMarkers: _removeMarkers,
		updateMapById: _updateMapById,
		getSelections: _getSelections,
		clickMarkerById: _clickMarkerById
	};

})(jQuery);