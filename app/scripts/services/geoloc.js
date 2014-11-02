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

        that.mapElement = document.querySelector(selector);
        that.map = {};
        that.defaultLatLng = new google.maps.LatLng(48.857487002645485, 2.3515677452087402); // Paris hotel de ville
        that.markers = [];
        that.geocoder = new google.maps.Geocoder();
        
        that.createMap = function(){

          var optionsGmaps = {
            center: that.defaultLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP, // types possibles: ROADMAP, SATELLITE, HYBRID ou TERRAIN
            zoom: 12,
            maxZoom: 19,
            minZoom: 3,
            disableDefaultUI: true
          };

          var styles = [{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#5c5c5c"},{"saturation":-100},{"lightness":-82}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"lightness":11}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"simplified"},{"color":"#ffffff"},{"hue":"#ffa200"}]},{"featureType":"road","elementType":"all","stylers":[{"color":"#808080"},{"saturation":-42},{"lightness":-53}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#c5d5fc"},{"saturation":-100},{"lightness":100}]},{"featureType":"water","elementType":"labels.text","stylers":[{"color":"#000000"},{"weight":8}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#141414"},{"lightness":-78}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"color":"#c7b69b"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"color":"#f5eab6"},{"saturation":-23}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"color":"#c7b69b"}]},{"featureType":"all","elementType":"all","stylers":[{"lightness":-81},{"gamma":3.71}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"color":"#999896"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#1a1a1a"}]}];

          that.map = new google.maps.Map(that.mapElement, optionsGmaps);

          that.map.setOptions({styles: styles});
          
          //Pour corriger le probleme de la carte au rechargement avec bootstrap
          google.maps.event.addListenerOnce(that.map, 'idle', function() {
             google.maps.event.trigger(that.map, 'resize');
             that.map.setCenter(that.defaultLatLng);
          });
        };

        that.setMapOptions = function(options){
          that.map.setOptions(options);
        };

        that.getLatLng = function(address) {

          var deferred = $q.defer();

          that.clearMarkers();
          
          that.geocoder.geocode( { 'address': address}, function(results, status) {
            if(status == google.maps.GeocoderStatus.OK) {

              that.map.setOptions({
                center: results[0].geometry.location,
                zoom: 15
              });

              var marker = new google.maps.Marker({
                  map: that.map,
                  position: results[0].geometry.location
              });

              that.markers.push(marker);
              //envoi le latLng
              deferred.resolve(results[0].geometry.location);
            }else{
              deferred.reject("Geocode was not successful for the following reason: " + status);
            }
          });
          return deferred.promise;
        };

        that.getAddress = function(lat, lng) {

          var deferred = $q.defer();
          
          var latlng = new google.maps.LatLng(lat, lng);
          var address;

          that.clearMarkers();

          that.geocoder.geocode({'latLng': latlng}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  var marker = new google.maps.Marker({
                      position: latlng,
                      map: that.map
                  });

                  that.markers.push(marker);

                  deferred.resolve(results[0].formatted_address);
                }
              }else{
                deferred.reject("Geocoder failed due to: " + status);
              }
          });
          return deferred.promise;
        };

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

        that.showPostLocation = function(post){

          that.smoothZoom(that.map, 11, that.map.getZoom(), false);


          setTimeout(function(){ 
            that.map.panTo({lat: post.coords.latitude, lng: post.coords.longitude});
          },500);

          setTimeout(function(){ 
            that.smoothZoom(that.map, 17, that.map.getZoom(), true);
          }, 750);


        };

        that.addMarker = function(post){
          
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

          that.markers.push(marker);

        };

        that.addMyLocationMarker = function(){
          
          if(navigator.geolocation){
            // passe à ses fonctions l'objet position: Geoposition{timestamp, coords{latitude, longitude}}
            var survId = navigator.geolocation.getCurrentPosition(
              function (position){

                var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var marker = new google.maps.Marker({
                  position: LatLng,
                  map: that.map,
                  title: 'Vous êtes ici !'
                  //icon: "fleche.png"
                });

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
                console.log(info);
              },
              
              {enableHighAccuracy: true, timeout: 20000}
            ); 
          }
        };

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
        };

      };

  });
