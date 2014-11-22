'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:postAutoSizing
 * @description
 * # postAutoSizing
 */

app.directive('postAutoSizing', function(Post) {
    return {

        restrict: 'A',
        link: function($scope, $element, $attrs) {

        	var img = $element[0].querySelector('img'),
        		$img = angular.element(img);

        	function setSize(){
        		console.log('setSize');
        		var imgRatio = img.naturalWidth / img.naturalHeight,
	        		elementRatio = $element[0].clientWidth / $element[0].clientHeight;

	        	if(imgRatio > elementRatio){
	        		$img.css({
	        			height: '100%',
	        			width: 'auto'
	        		});
	        	}else{
	        		$img.css({
	        			width: '100%',
	        			height: 'auto'
	        		});
	        	}
        	}

        	img.onload = setSize;
        	window.onresize = setSize;
        	$scope.$watch($element, setSize);
        }
    };
});