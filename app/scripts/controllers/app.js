'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:AppctrlCtrl
 * @description
 * # AppctrlCtrl
 * Controller of the artFinderApp
 */
app.controller('appCtrl', function ($scope, $rootScope, Session, Auth, UI, USER_ROLES) {
	$scope.loading = true;
	window.onload = function(){
		$scope.loading = false;
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
		location.hash = '#/' + page + '/'+ param;
	};

	$scope.areNear = function(coords1, coords2, distance){
		if(!coords1 || !coords2 || !distance){return;}
		function coordRound(val){
			return Math.ceil(val * 10000);
		}
		if(Math.abs(coordRound(coords1.latitude) - coordRound(coords2.latitude)) <= distance && Math.abs(coordRound(coords1.longitude) - coordRound(coords2.longitude)) <= distance){
			return true;
		}else{
			return false;
		}
	};
});
