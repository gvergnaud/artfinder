'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:showPostLocation
 * @description
 * # showPostLocation
 */

app.directive('ngShowpostlocation', function (UI) {
	return function (scope, element, attrs) {
		element[0].addEventListener('click', function(e){
			e.stopPropagation();
			scope.$parent.geoloc.showPostLocation(scope.post);
		},false);
	};
});