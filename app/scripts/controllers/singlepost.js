'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:SinglepostCtrl
 * @description
 * # SinglepostCtrl
 * Controller of the artFinderApp
 */
app.controller('SinglepostCtrl',['$scope', '$rootScope', '$routeParams', 'Post', 'UI', 'Auth', 'Session', 'Geoloc', function ($scope, $rootScope, $routeParams, Post, UI, Auth, Session, Geoloc) {
	
	//Récuperation des posts
	Post.find($routeParams.id).then(
		function (post){ // les posts sont récupérés !
			$scope.post =  post;		
			
			Post.getClosePosts(post, 3).then(
				function(closePosts){
					$scope.closePosts = closePosts;
				}
			);

			UI.singlepost.togglePlayerArrows($scope);
			setTimeout(function(){
				UI.singlepost.tagStyles();
			}, 300);
		},
		function (msg){ // erreur lors de la récupération des posts
			UI.notification('error', msg);
			$scope.post = false;
		}
	);

	//Initialisationde l'ui
	UI.singlepost.init();


	$scope.currentPhotoId = 0;
 	$scope.img = angular.element(document.querySelectorAll('section#player img'));
 	$scope.arrows = [angular.element(document.querySelectorAll('nav#prev')), angular.element(document.querySelectorAll('nav#next'))];

	//Changer l'image avec prev
	$scope.arrows[0].on('click', function(){
		
		$scope.$apply(function(){	
			$scope.currentPhotoId -= 1;
		});

		UI.singlepost.togglePlayerArrows($scope);
	});

 	//Changer l'image avec next
 	$scope.arrows[1].on('click', function(){
 		
 		$scope.$apply(function(){
 			$scope.currentPhotoId += 1;
 		});

 		UI.singlepost.togglePlayerArrows($scope);
 	});

 	$scope.toggleMap = function(){
 		var geoloc = new Geoloc('section.map');
		geoloc.createMap();
		geoloc.addMarker($scope.post);
		geoloc.setMapOptions({scrollwheel: false});

 		UI.singlepost.toggleMap(function(){
			geoloc.showPostLocation($scope.post);
 		});
 	};

 	$scope.newComment = {};

 	$scope.addComment = function(){

		if(Auth.isAuthenticated()){ //si l'utilisateur est identifé

	 		if(typeof $scope.newComment.content !== 'undefined'){
	 			
	 			$scope.newComment.timestamp = new Date().getTime();
	 			$scope.newComment.username = Session.username;
		 		$scope.newComment.activePhoto = $scope.currentPhotoId + 1;	

	 			var d = new Date($scope.newComment.timestamp);
	 			$scope.newComment.date = ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();

	 			Post.addComment($scope.post.id, $scope.newComment).then(
	 				function(posts){ //success
	 					$scope.post.comments.push($scope.newComment);
						$scope.newComment = {};
	 				},
	 				function(msg){} //error
	 			);	
	 		}
 		}else{
			UI.notification('', 'vous devez etre connecté !');
		}
 	};

 	$scope.likePost = function(){

		if(Auth.isAuthenticated()){ //si l'utilisateur est identifé

	 		Post.addLike($scope.post).then(
	 			function(posts){ //success
	 				Post.find($routeParams.id).then(
						function (post){ // les posts sont récupérés !
							$scope.post =  post;
							UI.singlepost.togglePlayerArrows($scope);
						},
						function (msg){ // erreur lors de la récupération des posts
							UI.notification('error', msg);
							$scope.post = false;
						}
					);
	 			},
	 			function(msg){
					UI.notification('error', msg);
	 			} //error
	 		);
		}else{
			UI.notification('', 'vous devez etre connecté !');
		}
 	};

 	$scope.identifying = false;
 	$scope.selecting = false;

 	$scope.startIdentification = function(){

		$scope.identifying = true; //modifie des elements dans le dom
 		
 		var tagWrapper = angular.element(document.querySelector('div.tagWrapper'));
 		
 		$scope.newArtist = {}; 

 		UI.singlepost.startIdentification(); //cursor et background style

 		tagWrapper.on('mousedown', function(e){
 			e.preventDefault();

 			$scope.selecting = true; //demarre le suivit de la position du cursor
			
			var x = typeof e.offsetX === 'undefined' ? e.layerX : e.offsetX;
			var y = typeof e.offsetY === 'undefined' ? e.layerY : e.offsetY;

 			$scope.newArtist.left = (x * 100) /  this.clientWidth; //recupe left en %
 			$scope.newArtist.top = (y * 100) /  this.clientHeight; //recupe top en %

 			UI.singlepost.startSelection($scope.newArtist.left, $scope.newArtist.top); //cree le div newTag
 		});

 		tagWrapper.on('mousemove', function(e){
 			e.stopPropagation();
 			e.preventDefault();

 			if($scope.selecting){ 
	 			var x = typeof e.offsetX === 'undefined' ? e.layerX : e.offsetX;
				var y = typeof e.offsetY === 'undefined' ? e.layerY : e.offsetY;
				var currentTarget = typeof e.currentTarget === 'undefined' ? e.toElement : e.currentTarget;

	 			if(currentTarget === tagWrapper[0]){

		 			$scope.newArtist.width = x * 100 / this.clientWidth - $scope.newArtist.left;
		 			$scope.newArtist.height = y * 100 / this.clientHeight - $scope.newArtist.top;

		 			UI.singlepost.doSelection($scope.newArtist.width, $scope.newArtist.height); //resize newtag en fonction du cursor
	 			}	
 			}
 		});

 		tagWrapper.on('mouseup', function(e){
 			e.preventDefault();
 			
 			$scope.selecting = false;
 			
 			UI.singlepost.stopSelection(function(artistNameInput){
	 			$scope.newArtist.name = artistNameInput.value;
	 			artistNameInput.blur();
	 			UI.notification('', 'Clickez sur "Ajouter l\'identification !');
	 		});
 		});
 	};

 	$scope.cancelIdentification = function(){
 		UI.singlepost.stopIdentification();
 		$scope.identifying = false;

 		if($scope.selecting){
 			UI.singlepost.stopSelection();
 			$scope.selecting = false;
 		}
 		
 		$scope.newArtist = {}; 
 	};

 	$scope.addArtist = function(){
		
		if(!!$scope.newArtist.height && !!$scope.newArtist.width && !!$scope.newArtist.left && !!$scope.newArtist.top){
			if(!!$scope.newArtist.name){
				
				$scope.identifying = false;
				
				Post.addArtist($scope.newArtist, $scope.post.id, $scope.currentPhotoId).then(
					function(posts){ //success

						$scope.post.photos[$scope.currentPhotoId].artists.push($scope.newArtist);
				 		UI.singlepost.stopIdentification();				
						UI.notification('success', 'Identification ajoutée!');
					},
					function(msg){
						UI.notification('error', msg);
					}
				);
			}else{
				UI.notification('error', 'ajoutez le nom de l\'artiste !');
			}
		}else{
			UI.notification('error', 'Selectionnez une partie de l\'image et ajoutez le nom de l\'artiste !');
		}
 	};

}]);