'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.Geoloc
 * @description
 * # Geoloc
 * Factory in the artFinderApp.
 */
app.factory('Geoloc', function () {
    
      return function (idMapElement){

        var that = this;

        that.mapElement = document.getElementById(idMapElement);
        that.map = {};
        that.defaultLatLng = new google.maps.LatLng(48.857487002645485, 2.3515677452087402); // Paris hotel de ville
        that.markers = [];
        
        that.createMap = function(){

          var optionsGmaps = {
            center: that.defaultLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP, // types possibles: ROADMAP, SATELLITE, HYBRID ou TERRAIN
            zoom: 12
          };

          var styles = [
            {
              stylers: [
                { hue: '#00ffe6' },
                { saturation: -20 }
              ]
            },{
              featureType: 'road',
              elementType: 'geometry',
              stylers: [
                { lightness: 100 },
                { visibility: 'simplified' }
              ]
            },{
              featureType: 'road',
              elementType: 'labels',
              stylers: [
                { visibility: 'off' }
              ]
            }
          ];

          that.map = new google.maps.Map(that.mapElement, optionsGmaps);

          that.map.setOptions({styles: styles});
          
          //Pour corriger le probleme de la carte au rechargement avec bootstrap
          google.maps.event.addListenerOnce(that.map, 'idle', function() {
             google.maps.event.trigger(that.map, 'resize');
             that.map.setCenter(that.defaultLatLng);
          });
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
            title: post.artist
            //animation: google.maps.Animation.DROP
            //icon: "fleche.png"
          });

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

      };

  });
