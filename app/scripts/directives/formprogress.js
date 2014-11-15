'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:formprogress
 * @description
 * # formprogress
 */

app.directive('formprogress', function() {
    return {


        restrict: 'ES',
        link: function($scope, $element, $attrs) {
            
            var formStep = angular.element(document.querySelector('#formStep'));

            window.addEventListener( 'scroll', function(e){
                var progress = (document.body.scrollTop + window.innerHeight) * 100 / document.body.scrollHeight;
                
                $element.css({
                    width: progress + '%'
                });
                                
                if(progress <= 34){
                    formStep.html('1/3');
                    
                }else if(progress <= 67){
                    formStep.html('2/3');
                    
                }else if(progress <= 100){
                    formStep.html('3/3');
                }
            });

        }
    };
});