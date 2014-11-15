'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.Geoloc
 * @description
 * # Geoloc
 * Factory in the artFinderApp.
 */
app.factory('Geoloc', function (UI, $q) {

	return function (selector){

		var that = this;
        
        if(selector){ // pour pouvoir se servir du service sans créer de map
            that.mapElement = document.querySelectorAll(selector);
            that.mapElement = that.mapElement[that.mapElement.length - 1];
        }
        
		that.map = {};
		that.defaultLatLng = new google.maps.LatLng(48.857487002645485, 2.3515677452087402); // Paris hotel de ville
		that.markers = [];
		that.geocoder = new google.maps.Geocoder();
		
		that.markerTooltip = angular.element('<div />').addClass('marker_tooltip');
		
		angular.element(that.mapElement).parent().append(that.markerTooltip);

		
	//CREATE
		that.createMap = function(options){          

			var optionsGmaps = {
				center: that.defaultLatLng,
				mapTypeId: google.maps.MapTypeId.ROADMAP, // types possibles: ROADMAP, SATELLITE, HYBRID ou TERRAIN
				zoom: 4,
				maxZoom: 19,
				minZoom: 3,
				disableDefaultUI: true,
				animationEnabled: true
			};

			if(!!options){
				if(!!options.center){ optionsGmaps.center = options.center; }
				if(!!options.mapTypeId){ optionsGmaps.mapTypeId = options.mapTypeId; }
				if(!!options.zoom){ optionsGmaps.zoom = options.zoom; }
				if(!!options.maxZoom){ optionsGmaps.maxZoom = options.maxZoom; }
				if(!!options.minZoom){ optionsGmaps.minZoom = options.minZoom; }
				if(!!options.disableDefaultUI){ optionsGmaps.disableDefaultUI = options.disableDefaultUI; }
			}


			var styles = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-100}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#706f70"},{"lightness":-22}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#292929"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"color":"#e8e8e8"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"color":"#1c1c1c"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#8a8a8a"},{"lightness":-26}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#878587"},{"lightness":-17}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#949494"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]}];

			that.map = new google.maps.Map(that.mapElement, optionsGmaps);

			that.map.setOptions({styles: styles});

			//resize la map quand le conteneur est resizé
			google.maps.event.addListenerOnce(that.map, 'idle', function() {
				google.maps.event.trigger(that.map, 'resize');
				that.map.panTo(optionsGmaps.center);
			});
			
			//resize la map quand le conteneur est resizé
			google.maps.event.addListener(that.map, 'bounds_changed', function() {
				 google.maps.event.trigger(that.map, 'resize');
			});
		};
		
		
		that.addPostMarker = function(post){

			var LatLng = new google.maps.LatLng(post.coords.latitude, post.coords.longitude);

			var marker = new google.maps.Marker({
				position: LatLng,
				map: that.map,
				icon: 'images/pin.png'
				//title: post.artists
				//animation: google.maps.Animation.DROP
				//id: post.id,
				//slug: ... ,
			});
			
			

			google.maps.event.addListener(marker, 'click', (function(marker, post) {
				return function() {

					location.hash = '#/singlepost/' + post.id;

				};
			})(marker, post));
			
			google.maps.event.addListener(marker, 'mouseover', (function(marker, post) {
				return function() {
					
					var point = that.pointFromLatLng(marker.getPosition(), marker.map);
                   
					that.markerTooltip.html('<img class="tooltipImage" src="'+ post.photos[0].url + '" />').css({
                        left: that.mapElement.offsetLeft + point.x - 75 + 'px',
                        top: that.mapElement.offsetTop + point.y  - 190 + 'px',
						display: 'block'
					});

				};
			})(marker, post));
			
			google.maps.event.addListener(marker, 'mouseout', (function(marker, post) {
				return function() {
					
					that.markerTooltip.css({
						display: 'none'
					});

				};
			})(marker, post));

			that.markers.push(marker);

		};
        
        that.addMarker = function(latLng){
            var marker = new google.maps.Marker({
                position: latLng,
                map: that.map,
                icon: 'images/pin.png'
            });
            
            that.markers.push(marker);
        };
		
	//REMOVE
		
		that.cleared = false;
		// Removes the markers from the map, but keeps them in the array.
		that.clearAddMarkers = function () {
			var i;
			if(that.cleared){ // si les markers sont éffacés

				for (i = 0; i < that.markers.length; i++) {
					that.markers[i].setMap(that.map);
				}
				that.cleared = false;

			}else{ 

				for (i = 0; i < that.markers.length; i++) {
					that.markers[i].setMap();
				}
				that.cleared = true;

			}

		};

		that.clearMarkers = function(){
			for (var i = 0; i < that.markers.length; i++){
				that.markers[i].setMap();
			}

			that.markers = [];
		};
		
		
	//SET OPTIONS

		that.setMapOptions = function(options){
			that.map.setOptions(options);
		};

	//GET INFOS
		
		that.getLatLng = function(lat, lng){

			var latlng = new google.maps.LatLng(lat, lng);
			return latlng;
		};

		that.latLngFromAddress = function(address) {

			var deferred = $q.defer();

			that.clearMarkers();

			that.geocoder.geocode( { 'address': address}, function(results, status) {
				if(status == google.maps.GeocoderStatus.OK) {

					that.map.setOptions({
						center: results[0].geometry.location,
						zoom: 15
					});

                    that.addMarker(results[0].geometry.location);
                    
					//envoi le latLng
					deferred.resolve(results[0].geometry.location);
				}else{
					deferred.reject("Geocode was not successful for the following reason: " + status);
				}
			});
			return deferred.promise;
		};

		that.addressFromLatLng = function(lat, lng) {

			var deferred = $q.defer();

			var latlng = new google.maps.LatLng(lat, lng);
			var address;

			that.clearMarkers();

			that.geocoder.geocode({'latLng': latlng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
                        
                        that.addMarker(latlng);

						deferred.resolve(results[0].formatted_address);
					}
				}else{
					deferred.reject("Geocoder failed due to: " + status);
				}
			});
			return deferred.promise;
		};
		
		that.pointFromLatLng = function (latLng, map) {
			var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
			var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
			var scale = Math.pow(2, map.getZoom());
			var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
			return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
		};
        
        that.getUserLocation = function(){

            var deferred = $q.defer();

            if(navigator.geolocation){
                // passe à ses fonctions l'objet position: Geoposition{timestamp, coords{latitude, longitude}}
                var survId = navigator.geolocation.getCurrentPosition(
                    function (position){

                        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                        deferred.resolve(latLng);

                    }, 

                    function (error){
                        var info = "Erreur lors de la géolocalisation : ";
                        switch(error.code) {
                            case error.TIMEOUT:
                                info += "Timeout !";
                                break;

                            case error.PERMISSION_DENIED:
                                info += "Vous n’avez pas donné la permission";
                                break;

                            case error.POSITION_UNAVAILABLE:
                                info += "La position n’a pu être déterminée";
                                break;

                            case error.UNKNOWN_ERROR:
                                info += "Erreur inconnue";
                                break;
                        }

                        deferred.reject(info);
                    },

                    {enableHighAccuracy: true}
                ); 
            }else{
                deferred.reject('no geolocation');
            }

            return deferred.promise;
        };

	//MOVE
		
		that.smoothZoom = function (map, level, cnt, mode) {
			//fonction qui zoom doucement la carte gmap
			var z;
			// If mode is zoom in
			if(mode === true) {

				if (cnt >= level) {
					return;
				}else {

					z = google.maps.event.addListener(map, 'zoom_changed', function(){
						google.maps.event.removeListener(z);
						that.smoothZoom(map, level, cnt + 1, true);
					});

					setTimeout(function(){map.setZoom(cnt);}, 50);
				}
			}else{

				if (cnt <= level) {
					return;
				}else {
					z = google.maps.event.addListener(map, 'zoom_changed', function() {
						google.maps.event.removeListener(z);
						that.smoothZoom(map, level, cnt - 1, false);
					});
					setTimeout(function(){map.setZoom(cnt);}, 50);
				}
			}
		};
		
		that.panTo = function(lat, lng){
			if(!!that.map){
				google.maps.event.trigger(that.map, 'resize');
				that.map.panTo({lat: lat, lng: lng});
			}
		};

		that.showPostLocation = function(post){
			
			google.maps.event.trigger(that.map, 'resize');

			that.smoothZoom(that.map, 11, that.map.getZoom(), false);

			setTimeout(function(){ 
				that.map.panTo({lat: post.coords.latitude, lng: post.coords.longitude});
			},500);

			setTimeout(function(){ 
				that.smoothZoom(that.map, 17, that.map.getZoom(), true);
			}, 750);


		};



	};

});
