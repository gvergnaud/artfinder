'use strict';

/**
 * @ngdoc directive
 * @name artFinderApp.directive:hideAllMarkers
 * @description
 * # hideAllMarkers
 */
app.directive('ngHideallmarkers', function () {
    return {
    	template: '',
      	restrict: 'A',
      	link: function postLink(scope, element, attrs) {
	        element[0].addEventListener('change', function(){
	        	console.log(scope);
	        	scope.geoloc.clearAddMarkers();
	        });
      	}
    };
});
