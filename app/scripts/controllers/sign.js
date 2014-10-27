'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:AddpostCtrl
 * @description
 * # AddpostCtrl
 * Controller of the artFinderApp
 */
app.controller('signCtrl', function ($scope, $rootScope, UI, AUTH_EVENTS, Auth, Session) {
	$scope.loginInfos = {};
	$scope.signUpInfos = {};

	var loginForm = angular.element(document.querySelector('#signForms'));

	loginForm.on('click', function(e){
		e.stopPropagation();
	});

	//si le localStorage existe, on recupère le user
	if(!!localStorage.getItem('ArtFinderUser')){
		var user = JSON.parse(localStorage.getItem('ArtFinderUser'));
		Session.create(user.id, user.username, user.role);
		$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
		$scope.setCurrentUser(user);
		UI.notification('success', 'Connection réussit !');
	}

	$scope.login = function(){
		
		if(!Auth.isAuthenticated()){ //si l'utilisateur n'est pas identifé

			if(!!$scope.loginInfos.mail && !!$scope.loginInfos.pwd){

				Auth.login($scope.loginInfos).then(
					function (user) {
						$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
						$scope.setCurrentUser(user);
						$scope.toggleLoginOverlay();
						UI.notification('success', 'Connection réussit !');

						//si l'utilisateur le veut on met ses données en localStorage
						if($scope.loginInfos.remember){
							localStorage.setItem('ArtFinderUser', angular.toJson(user));
						}

					}, function (msg) {
						$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
						if(msg === 'user unknown'){
							UI.notification('error', 'utilisateur inconnu.');
						}
						else if(msg === 'pwd error'){
							UI.notification('error', 'mot de passe éronné.');
						}
						else if(msg ==='no data'){
							UI.notification('error', 'Aucune donnée reçue.');
						}
					}
				);
			}else{
				UI.notification('error', 'tous les champs ne sont pas remplis');
			}
		}else{
			UI.notification('error', 'Vous êtes déjà identifié.');
		}
	};

	$scope.signUp = function(){

		if(!Auth.isAuthenticated()){ //si l'utilisateur n'est pas identifé

			if(!!$scope.signUpInfos.username && !!$scope.signUpInfos.mail && !!$scope.signUpInfos.pwd && !!$scope.signUpInfos.repeatpwd){
				console.log($scope.signUpInfos.pwd.length);
				if($scope.signUpInfos.pwd == $scope.signUpInfos.repeatpwd && $scope.signUpInfos.pwd.length >= 6){
					
					Auth.signUp($scope.signUpInfos).then(
						function (user) {
							$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
							$scope.setCurrentUser(user);
							$scope.toggleLoginOverlay();

						}, function (msg) {
							$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
							if(msg === 'email taken'){
								UI.notification('error', 'cette adresse email est déjà utilisée.');
							}
							else if(msg === 'username taken'){
								UI.notification('error', 'ce nom d\'utilisateur est déjà utilisé.');
							}
							else if(msg ==='no data'){
								UI.notification('error', 'Aucune donnée reçue.');
							}
						}
					);
				}else{
					UI.notification('error', 'votre mot de passe doit faire au moins 6 caractères.')
				}
			}else{
				UI.notification('error','tous les champs ne sont pas remplis');
			}
		}
		
	};

});