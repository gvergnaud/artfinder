'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the artFinderApp
 */
	app.controller('HomeCtrl',['$scope', '$rootScope', 'Post', 'Geoloc', 'UI', '$filter', function ($scope, $rootScope, Post, Geoloc, UI, $filter) {
	

	//Récuperation des posts
		Post.get().then(
			function (posts){ // les posts sont récupérés !
				$scope.posts =  posts;
				for( var post in $scope.posts ){
					post = $scope.posts[post];
					$scope.geoloc.addMarker(post);
				}
			},
			function (msg){ // erreur lors de la récupération des posts
				console.log(msg);
				$scope.posts = false;
			}
		);

	//initialisation de l'ui
		UI.home.init();
		
	//Création de la carte

		$scope.geoloc = new Geoloc('#map');

		$scope.geoloc.createMap();

		//$scope.geoloc.addMyLocationMarker();

		//applique les filtres sur la map
		$scope.filters = {};
		
		$scope.$watchCollection('filters', function (newValue, oldValue){
	        $scope.geoloc.clearMarkers();

	        var filteredPosts = $filter('filter')($scope.posts, newValue.search);
	        filteredPosts = $filter('filter')(filteredPosts, newValue.technique);

	        for( var post in filteredPosts ){
				post = filteredPosts[post];
				$scope.geoloc.addMarker(post);
			}
		});
	}]);
