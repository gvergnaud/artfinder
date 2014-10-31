'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:AppctrlCtrl
 * @description
 * # AppctrlCtrl
 * Controller of the artFinderApp
 */
app.controller('appCtrl', function ($scope, $rootScope, Session, Auth, UI, USER_ROLES) {
	$scope.loaded = false;
	window.onload = function(){
		$scope.loaded = true;
	};

	$scope.currentUser = null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = Auth.isAuthorized;
	$scope.isAuthenticated = Auth.isAuthenticated;
	$scope.isNotAuthenticated = Auth.isNotAuthenticated;

	$scope.animate = '';

	setTimeout(function(){
		$scope.animate = 'animated slide';
	}, 1000);
 
	$scope.setCurrentUser = function (user) {
		$scope.currentUser = user;
	};

	$scope.toggleLoginOverlay = function(){
		UI.toggleLoginOverlay();
	};

	$scope.userDisconnect = function(){
		Session.destroy();
		$scope.currentUser = null;
		UI.notification(false, 'Vous etes maintenant déconnecté.');
	};

	$scope.redirectTo = function(page, param){
		if(!page){
			window.location.hash = '';
		}else if(param !== 'undefined'){
			window.location.hash = '#/' + page + '/'+ param;
		}else{
			window.location.hash = '#/' + page;
		}

		window.scrollTo(0,0);
	};
});
