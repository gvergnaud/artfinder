'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:whenScrolled
 * @description
 * # whenScrolled
 */

app.directive('ngMousewheel', function() {
    return {
        
        
        restrict: 'A',
        link: function($scope, $element, $attrs) {
            var raw = $element[0];
			
			function onMousewheel() {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 100) {
                    $scope.$apply($attrs.ngMousewheel);
                }
            }
			
			$element.on('scroll wheel', onMousewheel);
        }
    };
});