'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:formprogress
 * @description
 * # formprogress
 */

app.directive('formprogress', function() {
    return {


        restrict: 'E',
        link: function($scope, $element, $attrs) {
            
            var formStep = angular.element(document.querySelector('#formStep'));
            
            window.addEventListener( 'scroll', function(e){
                var progress = (document.body.scrollTop + window.innerHeight) * 100 / document.body.scrollHeight;
                
                $element.css({
                    width: progress + '%'
                });
                                
                if(progress <= 50){
                    formStep.html('Ajoutez une photo - 1/3');
                    $scope.$apply(function(){
                        $scope.stepSelector = '.drop';
                    });

                }else if(progress <= 80){
                    formStep.html('Ou se trouve le mur ? - 2/3');
                    $scope.$apply(function(){
                        $scope.stepSelector = '#locate';
                    });
                    
                }else if(progress <= 100){
                    formStep.html('Pouvez vous nous en dire plus ? - 3/3');
                    $scope.$apply(function(){
                        $scope.stepSelector = '#newPostInfos';
                    });
                }
            });

        }
    };
});