'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:showPostIcons
 * @description
 * # showPostIcons
 */

app.directive('showPostIcons', function() {
    return {


        restrict: 'A',
        link: function($scope, $element, $attrs) {
            
        	$element.on('mouseenter mouseleave', function(){
        		$element[0].querySelector('.over').classList.toggle('up');
        	});
        }
    };
});