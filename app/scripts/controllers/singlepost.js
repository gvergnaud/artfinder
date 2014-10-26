'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:SinglepostCtrl
 * @description
 * # SinglepostCtrl
 * Controller of the artFinderApp
 */
app.controller('SinglepostCtrl',['$scope', '$rootScope', '$routeParams', 'Post', 'UI', 'Auth', 'Session', function ($scope, $rootScope, $routeParams, Post, UI, Auth, Session) {
	
	//Récuperation des posts
	Post.find($routeParams.id).then(
		function (post){ // les posts sont récupérés !
			$scope.post =  post;
			UI.singlepost.playerArrowsShowHide($scope);
		},
		function (msg){ // erreur lors de la récupération des posts
			console.log(msg);
			$scope.post = false;
		}
	);

	//Initialisationde l'ui
 	UI.singlepost.init();

 	// PREV NEXT player 
	$scope.currentPhotoId = 0;
 	$scope.img = angular.element(document.querySelector('section#player>img'));
 	$scope.arrows = [angular.element(document.querySelector('nav#prev')), angular.element(document.querySelector('nav#next'))];

	//Changer l'image avec prev
	document.getElementById('prev').addEventListener('click', function(){
		
		$scope.currentPhotoId -= 1;
		$scope.img.attr('src', $scope.post.photos[$scope.currentPhotoId].url);
		UI.singlepost.playerArrowsShowHide($scope);
	});

 	//Changer l'image avec next
 	document.getElementById('next').addEventListener('click', function(){
 		
 		$scope.currentPhotoId += 1;
 		$scope.img.attr('src', $scope.post.photos[$scope.currentPhotoId].url);
 		UI.singlepost.playerArrowsShowHide($scope);
 	});


 	$scope.newComment = {}

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
			UI.notification('', 'vous devez etre identifier !');
		}
 	};

 	$scope.likePost = function(){

		if(Auth.isAuthenticated()){ //si l'utilisateur est identifé

	 		Post.addLike($scope.post).then(
	 			function(posts){ //success
	 				Post.find($routeParams.id).then(
						function (post){ // les posts sont récupérés !
							$scope.post =  post;
							UI.singlepost.playerArrowsShowHide($scope);
						},
						function (msg){ // erreur lors de la récupération des posts
							console.log(msg);
							$scope.post = false;
						}
					);
	 			},
	 			function(msg){} //error
	 		);
		}else{
			UI.notification('', 'vous devez etre identifier !');
		}
 	};
	
}]);
