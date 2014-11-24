'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:whenScrolled
 * @description
 * # whenScrolled
 */

app.directive('ngTooltip', function(Post) {
    return {

        restrict: 'A',
        link: function($scope, $element, $attrs) {

           var tooltip = angular.element('<div />').addClass('tooltip');

            function removeTooltip(){
                angular.element(document.querySelector('.tooltip')).remove();
            }


            $element.on('mouseenter', function(e){

                tooltip.css({
                    left: e.clientX + 'px', //left corrigé par un translate -50% en css
                    top: e.clientY - 40 + 'px'
                });

                $element.on('mousemove', function(e){
                    tooltip.css({
                        left: e.clientX + 'px', //left corrigé par un translate -50% en css
                        top: e.clientY - 40 + 'px'
                    });
                });

                var msg = $attrs.ngTooltip;

                tooltip.html(msg);

                angular.element(document.querySelector('body')).append(tooltip);

                $element.on('click', removeTooltip);

            });

            $element.on('mouseleave', function(e){

                removeTooltip();
                
                $element.off('click', removeTooltip);

            });

        }
    };
});