'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:AddpostCtrl
 * @description
 * # AddpostCtrl
 * Controller of the artFinderApp
 */
app.controller('loginCtrl', function ($scope, $rootScope, UI, User) {
	$scope.user = {};

	var showlogin = angular.element(document.querySelector('a#showlogin')),
		loginContainer = angular.element(document.querySelector('#login')),
		loginForm = angular.element(document.querySelector('#loginForm'));

	showlogin.on('click', function(){
		UI.showHideLoginOverlay();
	});

	loginContainer.on('click', function(){
		UI.showHideLoginOverlay();
	});

	loginForm.on('click', function(e){
		e.stopPropagation();
	});


	$scope.login = function(){

		User.login($scope.user).then(
			function (data){//success

			},
			function (msg){ //error
				console.log(msg);
			}
		);
	}
});
