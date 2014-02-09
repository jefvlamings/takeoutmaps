var Map = function() {
	
	/*-- VARIABLES --*/
	
	/**
	 * Self
	 * 
	 * Set reference to 'this' object
	 * 
	 * @type Map
	 */
	var self = this;
	
	/**
	 * Coordinates
	 * 
	 * Stores a collection of all marker coordinates
	 * 
	 * @type Array
	 */
	self.coordinates = [];
	
	/**
	 * Markers
	 * 
	 * Stores all created markers
	 * 
	 * @type Array
	 */
	self.markers = [];
	
	
	/**
	 * Map
	 * 
	 * Stores an instance of google maps Map
	 * 
	 * @type google.maps.Map
	 */
	self.map;
	
	/**
	 * Locations
	 * 
	 * Stores all uploaded locations
	 * 
	 * @type Array
	 */
	self.locations = [];
	
	/**
	 * Iterator
	 * 
	 * Stores an iterator for creating markers
	 * 
	 * @type Number
	 */
	self.iterator = 0;
	
	/*-- FUNCTIONS --*/
	
	/**
	 * Convert E7 coordinates to Google Maps coordinate string
	 * 
	 * This function formats the E7 coordinates in such a way a dot-separated
	 * string is returned
	 * 
	 * @param {string} e7
	 * @returns {string}
	 */
	self.convertE7 = function(e7) {

		var characters = e7.split("");

		var dotPosition = 1;
		if (characters.length === 9) {
			var dotPosition = 2;
		}

		var string = "";
		for (var i = 0; i < characters.length; i++) {
			if (i === dotPosition) {
				string += ".";
			}
			string += characters[i];
		}

		return string;
	};
	
	/**
	 * Create InfoWindow By Location
	 * 
	 * This function creates a Google Maps InfoWindow based on the location
	 * information.
	 * 
	 * @param {type} location
	 * @returns {google.maps.InfoWindow}
	 */
	self.createInfoWindowByLocation = function(location) {
		
		var date = new Date(0);
		date.setUTCSeconds(location.timestampMs);
		var infoHtml = 
				"<table>" +
					"<tbody>" +
						"<tr>" +
							"<td><strong>Date</strong</td>" +
							"<td>" + date.toUTCString() + "</td>" +
						"</tr>" +
						"<tr>" +
							"<td><strong>Accuracy</strong</td>" +
							"<td>" + location.accuracy + "</td>" +
						"</tr>" +
						"<tr>" +
							"<td><strong>Altitude</strong</td>" +
							"<td>" + location.altitude + "</td>" +
						"</tr>" +
						"<tr>" +
							"<td><strong>Velocity</strong</td>" +
							"<td>" + location.velocity + "</td>" +
						"</tr>" +
					"</tbody>" +
				"</table>";
		
		return new google.maps.InfoWindow({
			content: infoHtml
		});				
		
	};
	
	/**
	 * Display Marker
	 * 
	 * This function will display the marker on the map. The information about
	 * the marker is fetched from the locations stored this object
	 * 
	 * @returns {undefined}
	 */
	self.displayMarker = function() {
		var location = self.locations[self.iterator];
		var latitude = self.convertE7(location.latitudeE7.toString());
		var longitude = self.convertE7(location.longitudeE7.toString());
		var coordinates = new google.maps.LatLng(latitude, longitude);
		self.coordinates.push(coordinates);
		
		
		var marker = new google.maps.Marker({
			position: coordinates,
			map: self.map,
			animation: google.maps.Animation.DROP,
		});	
		
		var infoWindow = self.createInfoWindowByLocation(location);
		google.maps.event.addListener(marker, 'click', function() {
		  infowindow.open(self.map,marker);
		});		
		
		if(self.markers.length > 0) {
			var lastMarker = self.markers[self.markers.length -1];
			var lineCoordinates = [lastMarker.position, marker.position];
			var line = new google.maps.Polyline({
				path: lineCoordinates,
				geodesic: false,
				strokeColor: '#333333',
				strokeOpacity: 8.0,
				strokeWeight: 5
			});
			line.setMap(self.map);		
		}
		
		self.markers.push(marker);
		
		self.map.setZoom(10);
		self.map.panTo(marker.position);		
		
		self.iterator++;
	};	
	
	/**
	 * Fit bounds
	 * 
	 * This function will scale the map in such a way, all markers will be
	 * made visible.
	 * 
	 * @returns {undefined}
	 */
	self.fitBounds = function() {
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, LtLgLen = self.coordinates.length; i < LtLgLen; i++) {
			bounds.extend(self.coordinates[i]);
		}
		self.map.fitBounds(bounds);				
	};

	/**
	 * Update with Data
	 * 
	 * Markers will be made based on the data passed on as an argument to this
	 * function. We set a delay in order to create a nice animation.
	 * 
	 * @param {type} data
	 * @returns {undefined}
	 */
	self.updateWithData = function(data) {
		self.locations = data.locations;
		for (var key in self.locations) {
			setTimeout(function() {
				self.displayMarker();
			}, key * 100);		  
		}		
	};

	/**
	 * Build
	 * 
	 * Create the map and make it accessible for other functions.
	 * 
	 * @returns {undefined}
	 */
	self.build = function() {
		
		var container = document.getElementById('map-canvas');
		var myLatLng = new google.maps.LatLng(51.40712, 4.75869);
		var mapOptions = {
			zoom: 12,
			center: myLatLng
		};	
		self.map = new google.maps.Map(container, mapOptions);
		
	};

}

// Create the map
var map = new Map();
google.maps.event.addDomListener(window, 'load', map.build);
