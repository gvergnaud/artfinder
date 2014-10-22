'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:AppctrlCtrl
 * @description
 * # AppctrlCtrl
 * Controller of the artFinderApp
 */
app.controller('appCtrl', function ($scope, $rootScope, Session, Auth, USER_ROLES) {

	$scope.currentUser = null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = Auth.isAuthorized;

	$scope.animate = '';

	setTimeout(function(){
		$scope.animate = 'animated slide';
	}, 1000);
 
	$scope.setCurrentUser = function (user) {
		$scope.currentUser = user;
	};

});
