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
            
            function postExist(id){
                for(var i in Post.posts){
                    
                    var post = Post.posts[i];
                   
                    if(post.id === id){
                        return true;
                    }
                }

                return false;
            }

            var nextPostId = parseInt($routeParams.id) - 1;
            var prevPostId = parseInt($routeParams.id) + 1;

            if($attrs.id === 'next'){    

                if(postExist(nextPostId)){
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

                if(postExist(prevPostId)){
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