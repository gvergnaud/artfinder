'use strict';

/**
 * @ngdoc directive
 * @name artFinderApp.directive:showPostLocation
 * @description
 * # showPostLocation
 */
app.directive('ngShowpostlocation', function () {
    return function (scope, element, attrs) {
      	
        element[0].addEventListener('click', function(){
         		scope.$parent.geoloc.showPostLocation(scope.post);
        },false);
   
    };
});


