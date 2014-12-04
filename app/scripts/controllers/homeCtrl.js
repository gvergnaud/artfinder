'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the artFinderApp
 */

app.controller('HomeCtrl',  function ($scope, $rootScope, $filter, $routeParams, Post, Geoloc, UI, APP_EVENTS, Session) {


	//POSTS
    function getPosts(){
    	console.log('getPosts');
        Post.get(true).then(
            function (posts){ // les posts sont récupérés !
                
                $scope.posts = [];
                
                //on inverse les posts
                $scope.allPosts = $filter('reverse')(posts);
                $scope.loadPosts(true, true);
                if(!!$routeParams.search){
                    $scope.posts = $scope.allPosts;
                    $scope.filters.search = decodeURI($routeParams.search);
                }
            },
            function (msg){ // erreur lors de la récupération des posts
                console.log(msg);
                $scope.posts = false;
            }
        );
    }
    
	//Récuperation des posts
    getPosts();
    
    $rootScope.$on('loadNewPost', getPosts);
    
	
	$scope.postsLimite = 8;

	// Load les posts dans la view
	$scope.loadPosts = function(force, noIncrem){
        
        if(noIncrem){
            var increm = 0;
        }else{
            var increm = 4;
        }
        
        $scope.postsLimite += increm;
        
		//si il reste des posts à charger dans allPosts
		if($scope.postsLimite <= $scope.allPosts.length + increm || force){

			//applique les filtres search et view 
			var filteredPosts = $scope.applyFilters();

			$scope.posts = $filter('limitTo')(filteredPosts, $scope.postsLimite);
			
			for( var post in $scope.posts ){
				post = $scope.posts[post];
				$scope.geoloc.addPostMarker(post);
			}

			$scope.$emit('postsLoaded');
		}

	};


	//UI UI UI
	UI.home.init();

	$scope.setSlideAnimation();

	// évite que les posts n'ai pas la class reduced
	$scope.$on('postsLoaded', function(){
		if(UI.home.view === 'map'){
			setTimeout(function(){
				UI.home.setMapView();	
			}, 300);
		}
	});


	// switch entre la map et la mosaique
	document.getElementById('switcher').addEventListener('mousewheel', function(){
		$scope.switchMozMap();
	});

	$scope.switchMozMap = function(){
		UI.home.switchMozMap();
		setTimeout(function(){
			if(Session.userLocation){
				$scope.geoloc.panTo(Session.userLocation.k, Session.userLocation.B);	
			}else{
				$scope.geoloc.panTo(48.857487002645485, 2.3515677452087402);	
			}
		}, 500);
	};




	//MAP 
	$scope.geoloc = new Geoloc('section.map');

	$scope.geoloc.createMap();
	$scope.geoloc.setMapOptions({zoom: 12});
	

	//montre la position du post sur la map
	$scope.showPostLocation = function(e, post){
		e.stopPropagation();
		UI.home.setMapView();
		setTimeout(function(){
			$scope.geoloc.smoothZoom($scope.geoloc.map, 11, $scope.geoloc.map.getZoom(), false);
			$scope.geoloc.showPostLocation(post);
		}, 800);
	};

	//affiche la position de l'utilisateur à chaque refresh
	$rootScope.$on(APP_EVENTS.userLocationChanged, function(){
		$scope.geoloc.addUserLocationMarker(Session.userLocation);
	});



	//Filtres 
	$scope.filters = {};

	$scope.setTechnique = function(technique){
		if($scope.filters.technique === technique){
			$scope.filters.technique = '';
			document.querySelector('span.technique.' + technique).classList.remove('active');
		}else{
			$scope.filters.technique = technique;
			angular.element(document.querySelectorAll('span.technique')).removeClass('active');
			document.querySelector('span.technique.' + technique).classList.add('active');
		}
	};

	//applique les filtres sur la map

	$scope.$watchCollection('filters', function (newValue, oldValue){
		$scope.geoloc.clearMarkers();

		$scope.posts = $scope.allPosts;
		
		var filteredPosts = $filter('filter')($scope.posts, newValue.search);
		filteredPosts = $filter('filter')(filteredPosts, newValue.technique);

		for( var post in filteredPosts ){
			post = filteredPosts[post];
			$scope.geoloc.addPostMarker(post);
		}
	});
	
	//applique les filtres sur $scope.allPosts
	$scope.applyFilters = function(){
		var filteredPosts = $filter('filter')($scope.allPosts, $scope.filters.search);
		filteredPosts = $filter('filter')(filteredPosts, $scope.filters.technique);
		return filteredPosts;
	};
});
