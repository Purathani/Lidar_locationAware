// Geolocate conrol function

var GeolocateControl = function(opt_options, map ) {
  var options = opt_options || {};
    
  var button = document.createElement('button');
  button.innerHTML = '&#9737;';
    
  var this_ = this;
  var handleClick_ = function(e) {
      e.preventDefault();
      var map = this_.getMap();
      var options = this_.options;
      var geolocation = this_.geolocation;
      var positionFeature = this_.positionFeature;
      var accuracyFeature = this_.accuracyFeature;

      // Turn on geo tracking.
      geolocation.setTracking(true);

      // When the position changes...
      geolocation.on('change:position', function () {

        // Get the geolocated coordinates.
        var coordinates = geolocation.getPosition();
        doBounce(coordinates,map);
        // Center on the position.
        //map.getView().setCenter(coordinates);

        // Set the zoom based on the options.
        map.getView().setZoom(18);

        // Set the style of the position feature.
        positionFeature.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
          color: '#3399CC'
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 2
        })
      })
    }));

        // Set the geometry of the position feature.
        positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);      

        // Turn off geo tracking.
        geolocation.setTracking(false);
      });

      // When the accuracy changes...
      geolocation.on('change:accuracyGeometry', function() {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
      });
  };

  var element = document.createElement('div');
  element.className = 'ol-geolocate ol-unselectable ol-control';
  element.appendChild(button);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });

  // Create a new geolocation object.
    
  this.geolocation = new ol.Geolocation({
    projection: map.getView().getProjection()
  });

  // Create a position and accuracy feature.
  this.positionFeature = new ol.Feature();
  this.accuracyFeature = new ol.Feature();

  // Draw the position and accuracy features on the map.
  new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
      features: [this.positionFeature, this.accuracyFeature]
    })
  });

  button.addEventListener('click', handleClick_, false);
  this.options = options;
};
ol.inherits(GeolocateControl, ol.control.Control);


function doBounce(location,map) {
	// bounce by zooming out one level and back in
	var bounce = ol.animation.bounce({
	  resolution: map.getView().getResolution() * 2
	});
	// start the pan at the current center of the map
	var pan = ol.animation.pan({
	  source: map.getView().getCenter()
	});
	map.beforeRender(bounce);
	map.beforeRender(pan);
	// when we set the center to the new location, the animated move will
	// trigger the bounce and pan effects
	map.getView().setCenter(location);
}
	  
function doPan(location,map) {
	// pan from the current center
	var pan = ol.animation.pan({
	  source: map.getView().getCenter()
	});
	map.beforeRender(pan);
	// when we set the new location, the map will pan smoothly to it
	map.getView().setCenter(location);
}           

