'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:SinglepostCtrl
 * @description
 * # SinglepostCtrl
 * Controller of the artFinderApp
 */
app.controller('SinglepostCtrl',['$scope', '$rootScope', '$routeParams', 'Post', 'UI', 'Auth', 'Session', 'Geoloc', '$filter', 'APP_EVENTS', function ($scope, $rootScope, $routeParams, Post, UI, Auth, Session, Geoloc, $filter, APP_EVENTS) {
	

	var mainPhoto = angular.element(document.querySelectorAll('section#player img'));

	//POSTS
    function getPost(reload){
    	if(!reload) {reload = false};
        Post.find($routeParams.id, reload).then(
            function (post){ // les posts sont récupérés !
                $scope.post = post;	

                $scope

                Post.getClosePosts(post, 4).then(
                    function(closePosts){
                        $scope.closePosts = closePosts;
                    }
                );

                if($scope.userLocation){
					$scope.getDistanceFromUser();
				}
                
                mainPhoto.on('load', function(){
		            UI.singlepost.tagStyles();
				});
            },
            function (msg){ // erreur lors de la récupération des posts
                UI.notification('error', msg);
                $scope.post = false;
            }
        );
    }

    //Récuperation du post
    getPost();

    //rechargement des posts lors que l'evenement refresh post est déclenché par les sockets
    $rootScope.$on('refreshPost', function(e, info){
    	console.log(info);
    	if(info.postId == $scope.post.id){ //si le changement concerne le post sur lequel on est
    		getPost(true);
    	}
    });


 	//MAP
 	$scope.mapOpened = false;

	var geoloc = new Geoloc('section.map');
	geoloc.createMap();

 	$scope.toggleMap = function(){

 		if(!$scope.mapOpened){
	 		
	 		var mapCenter = geoloc.getLatLng($scope.post.coords.latitude, $scope.post.coords.longitude);
			
			geoloc.addPostMarker($scope.post);
			geoloc.setMapOptions({scrollwheel: false, zoom: 10, center: mapCenter});

	 		UI.singlepost.toggleMap(function(){
				geoloc.showPostLocation($scope.post);
	 		});

	 		if(Session.userLocation){
				geoloc.addUserLocationMarker(Session.userLocation);
	 		}

	 		$scope.mapOpened = true;

 		}else{
 			UI.singlepost.toggleMap();
 			$scope.mapOpened = false;
 		}
 		
 	};

    //recupère la distance en mettre a partir des coordonnées GPS
    $scope.getDistance = function(closePost){
    	var metres = Math.round( geoloc.getDistance($scope.post, closePost) );
    	if(metres > 1000){
    		return (Math.round(metres/100))/10 + 'km';
    	}else{
    		return metres + 'm';
    	}
    };

    //recupère la distance en mettre a partir des coordonnées GPS entre l'utilisateur est le post
    $scope.getDistanceFromUser = function(){
    	var userLocationObject = {
			coords: {
				latitude: Session.userLocation.k,
				longitude: Session.userLocation.B
			}
		};

	    var metres = Math.round( geoloc.getDistance(userLocationObject, $scope.post) );
	    if(metres > 1000){
	    	$scope.distanceFromUser = (Math.round(metres/100))/10 + 'km';
	    }else{
	    	$scope.distanceFromUser = metres + 'm';
	    } 
    };
    
	$scope.distanceFromUser = false;
    
 	//affiche la position de l'utilisateur à chaque refresh
	$rootScope.$on(APP_EVENTS.userLocationChanged, function(){
		if($scope.mapOpened){
			geoloc.addUserLocationMarker(Session.userLocation);
		}

		$scope.getDistanceFromUser();
	});


    
	//UI
	UI.singlepost.init();

	$scope.currentPhotoId = 0;

	//construit une date lisibile à partir d'un timestamp
    $scope.createFullDate = function(){
		if($scope.post){
	    	var date = new Date($scope.post.photos[$scope.currentPhotoId].date);
	        return 'Ajouté le ' + date.getDate() + ' / ' + date.getMonth() + ' / ' +  date.getFullYear() + '.';	
		}
    };
	
	//NAVIGATION
	$scope.nextPhoto = function(){
		$scope.$apply(function(){	
			$scope.currentPhotoId -= 1;
		});
	};

	$scope.prevPhoto = function(){
		$scope.$apply(function(){
 			$scope.currentPhotoId += 1;
 		});
	};

	$scope.setPhoto = function(photo){
		$scope.currentPhotoId = $scope.post.photos.indexOf(photo);
	}

	$scope.nextPost = function(){
		$scope.setSlideAnimation();
		$scope.redirectTo('singlepost', parseInt($routeParams.id) - 1);
	};

	$scope.prevPost = function(){
		$scope.setBackAnimation();
		$scope.redirectTo('singlepost', parseInt($routeParams.id) + 1);
	};




	//COMMENTAIRES

 	$scope.newComment = {};

 	$scope.addComment = function(){

		if(Auth.isAuthenticated()){ //si l'utilisateur est identifé

	 		if(typeof $scope.newComment.content !== 'undefined'){
	 			
	 			$scope.newComment.timestamp = new Date().getTime();
	 			$scope.newComment.user = $scope.currentUser;
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

 	$scope.deleteComment = function(comment){

		if(Auth.isAuthenticated()){ //si l'utilisateur est identifé
			if(Session.userId === comment.user.id){
				Post.deleteComment($scope.post.id, comment.id).then(
					function(posts){
						Post.find($routeParams.id).then(
							function (post){ // les posts sont récupérés !
								$scope.post =  post;
							},
							function (msg){ // erreur lors de la récupération des posts
								UI.notification('error', msg);
								$scope.post = false;
							}
						);
						UI.notification('success', 'Commentaire supprimé');
					},
					function(msg){
						UI.notification('error', msg);
					}
				);
			}else{
				UI.notification('error', 'Vous n\'êtes pas l\'auteur de ce commentaire.');
			}
 		}else{
			UI.notification('', 'Vous devez etre connecté !');
		}
 	};

 	//LIKE
 	$scope.likePost = function(){

		if(Auth.isAuthenticated()){ //si l'utilisateur est identifé

	 		Post.addLike($scope.post).then(
	 			function(posts){ //success
	 				Post.find($routeParams.id).then(
						function (post){ // les posts sont récupérés !
							$scope.post =  post;
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

 	//IDENTIFICATION
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

				$scope.newArtist.name = $filter('lowercase')($scope.newArtist.name);
				console.log($scope.newArtist.name);
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