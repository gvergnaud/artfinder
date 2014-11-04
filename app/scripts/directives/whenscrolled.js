'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:whenScrolled
 * @description
 * # whenScrolled
 */

app.directive('whenScrolled', function() {
    return {
        
        
        restrict: 'A',
        link: function(scope, elm, attr) {
            var raw = elm[0];
            
            elm.bind('scroll', function() {
            	console.log('lol');
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attr.whenScrolled);
                 }
            });
        }
    };
});