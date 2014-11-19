'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:AppctrlCtrl
 * @description
 * # AppctrlCtrl
 * Controller of the artFinderApp
 */
app.controller('appCtrl', function ($scope, $rootScope, Session, Auth, UI, AUTH_EVENTS, USER_ROLES, Geoloc, Socket) {

    //LOADER 
    //
    $scope.loaded = false;

    window.onload = function(){
        $scope.loaded = true;
    };

    // USER SETS
    // get user lOCATION
    var geoloc = new Geoloc();

    geoloc.getUserLocation().then(
        function(latLng){
            Session.addUserLocation(latLng);
            $rootScope.$broadcast(AUTH_EVENTS.userLocationChanged);
        }, 
        function(msg){
            console.log(msg);
        }
    );

    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = Auth.isAuthorized;
    $scope.isAuthenticated = Auth.isAuthenticated;
    $scope.isNotAuthenticated = Auth.isNotAuthenticated;

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };

    $scope.userDisconnect = function(){
        Session.destroy();
        $scope.currentUser = null;
        UI.notification(false, 'Vous etes maintenant déconnecté.');
    };

    $scope.isLiked = function(post){
        if(!!post){
            if(post.likes.indexOf(Session.username) !== -1){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    };

    // UI 
    // animation de la VIEW
    $scope.animation = '';

    setTimeout(function(){
        $scope.setSlideAnimation();
    }, 1000);

    $scope.setSlideAnimation = function(){
        $scope.animation = "slide";
    };

    $scope.setBackAnimation = function(){
        $scope.animation = "back";
    };

    // ANIMATION MENU 
    angular.element(document.querySelector('header.menu')).on('mouseenter mouseleave', function(){
        UI.toggleMenu();
    });

    $scope.toggleLoginOverlay = function(){
        UI.toggleLoginOverlay();
    };
    
    $scope.noScroll = function(){ 
        window.scrollTo(0, 0);
    };

    //Animation du Scroll
    $scope.smoothScrollTo = function(selector, callback){
        var speed = 200;
        var movingFrequency = 15; // Affects performance !

        var element = document.querySelector(selector);
        var getScrollTopElement =  function (elmt)
        {
            var top = 0;

            while (elmt.offsetParent != undefined && elmt.offsetParent != null)
            {
                top += elmt.offsetTop + (elmt.clientTop != null ? elmt.clientTop : 0);
                elmt = elmt.offsetParent;
            }

            return top;
        };

        var getScrollTopDocument = function()
        {
            return document.documentElement.scrollTop + document.body.scrollTop;
        };

        var hopCount = speed/movingFrequency;
        var getScrollTopDocumentAtBegin = getScrollTopDocument();
        var gap = (getScrollTopElement(element) - getScrollTopDocumentAtBegin) / hopCount;

        for(var i = 1; i <= hopCount; i++)
        {
            (function()
             {
                var hopTopPosition = gap*i;
                setTimeout(function(){  window.scrollTo(0, hopTopPosition + getScrollTopDocumentAtBegin); }, movingFrequency*i);
            })();
        }

        if(!!callback){	
            setTimeout(function(){
                callback.call(this);
            }, speed);
        }
    };
    
    //Redirection 
    //
    $scope.redirectTo = function(page, param){
        var hashtab = window.location.hash.split('/'),
            currentPage = hashtab[1];


        if(currentPage === 'singlepost' && (!page || page === 'search')){
            $scope.setBackAnimation();
        }else{
            $scope.setSlideAnimation();
        }

        $scope.smoothScrollTo('#container', function(){

            if(!page){

                if(window.location.hash === '#/'){return;}

                window.location.hash = '';

            }else if(typeof param !== 'undefined'){

                if(window.location.hash === '#/' + page + '/'+ param){return;}

                window.location.hash = '#/' + page + '/'+ param;

            }else{

                if(window.location.hash === '#/' + page){return;}

                window.location.hash = '#/' + page;

            }

        });
    };

    //Sockets send
    $scope.socket = function(postId){
        console.log('socket send');
        Socket.postsChanged(postId);
    };
});
