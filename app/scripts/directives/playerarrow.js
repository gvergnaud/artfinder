'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:playerArrow
 * @description
 * # playerArrow
 */

app.directive('playerArrow', function (Post, $routeParams) {
    return {

        restrict: 'A',
        link: function($scope, $element, $attrs) {
            
            if($attrs.id === 'next'){    

                if(parseInt($routeParams.id) !== Post.posts[0].id){
                    $element.css({
                        display: 'block'
                    });
                }else{
                    $element.css({
                        display: 'none'
                    });
                }
            }

            else if($attrs.id === 'prev'){

                if(parseInt($routeParams.id) !== Post.posts[Post.posts.length - 1].id){
                    $element.css({
                        display: 'block'
                    });
                }else{
                    $element.css({
                        display: 'none'
                    });
                }
            }
        }
    };
});