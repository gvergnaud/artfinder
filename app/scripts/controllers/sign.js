'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:AddpostCtrl
 * @description
 * # AddpostCtrl
 * Controller of the artFinderApp
 */
app.controller('signCtrl', function ($scope, $rootScope, UI, AUTH_EVENTS, Auth, Session) {
	$scope.userInfos = {};

	var showlogin = angular.element(document.querySelector('a#showlogin')),
		loginContainer = angular.element(document.querySelector('#login')),
		loginForm = angular.element(document.querySelector('#loginForm'));

	showlogin.on('click', function(e){
		console.log(e);
		e.stopPropagation();
		UI.showHideLoginOverlay();
	});

	loginContainer.on('click', function(e){
		e.stopPropagation();
		UI.showHideLoginOverlay();
	});

	loginForm.on('click', function(e){
		e.stopPropagation();
	});

	$scope.login = function(){

		Auth.login($scope.userInfos).then(
			function (user) {
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				$scope.setCurrentUser(user);

			}, function () {
				$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
			}
		);
	};
});