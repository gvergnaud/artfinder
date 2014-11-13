'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:sectionscroll
 * @description
 * # sectionscroll
 */

app.directive('sectionScroll', function() {
    return {


        restrict: 'A',
        link: function($scope, $element, $attrs) {
            
            function noscroll(){
                window.scrollTo(0,0);
            }


            window.addEventListener( 'scroll', noscroll);
        }
    };
});