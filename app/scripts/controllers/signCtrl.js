'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:AddpostCtrl
 * @description
 * # AddpostCtrl
 * Controller of the artFinderApp
 */
app.controller('signCtrl', function ($scope, $rootScope, UI, AUTH_EVENTS, Auth, Session, Facebook) {
	$scope.loginInfos = {};
	$scope.signUpInfos = {};

	var loginForm = angular.element(document.querySelector('#signForms'));

	loginForm.on('click', function(e){
		e.stopPropagation();
	});

	//si le localStorage existe, on recupère le user
	if(!!localStorage.getItem('ArtFinderUser')){

		var user = JSON.parse(localStorage.getItem('ArtFinderUser'));

		Session.create(user.id, user.username, user.role, user.avatar);

		$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

		$scope.setCurrentUser(user);

		setTimeout(function(){
			UI.notification('success', 'Heureux de vous revoir ' + Session.username);
		},500);
	}

	// Login
	$rootScope.login = function(){
		
		if(!Auth.isAuthenticated()){ //si l'utilisateur n'est pas identifé

			if(!!$scope.loginInfos.mail && !!$scope.loginInfos.pwd){

				Auth.login($scope.loginInfos).then(
					function (user) {
						$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
						$scope.setCurrentUser(user);
						$scope.toggleLoginOverlay();
						UI.notification('success', 'Heureux de vous revoir ' + Session.username);

						//si l'utilisateur le veut on met ses données en localStorage
						if($scope.loginInfos.remember){
							localStorage.setItem('ArtFinderUser', angular.toJson(user));
						}

					}, function (msg) {
						$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
						if(msg === 'user unknown'){
							UI.notification('error', 'adresse email inconnue.');
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

	$rootScope.signUp = function(){

		if(!Auth.isAuthenticated()){ //si l'utilisateur n'est pas identifé

			if(!!$scope.signUpInfos.username && !!$scope.signUpInfos.mail && !!$scope.signUpInfos.pwd && !!$scope.signUpInfos.repeatpwd){
				console.log($scope.signUpInfos.pwd.length);
				if($scope.signUpInfos.pwd === $scope.signUpInfos.repeatpwd && $scope.signUpInfos.pwd.length >= 6){
					
					Auth.signUp($scope.signUpInfos).then(
						function (user) {
							$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
							$scope.setCurrentUser(user);
							$scope.toggleLoginOverlay();
							UI.notification('success', 'Bienvenue sur ArtFinder ' + Session.username);

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
					UI.notification('error', 'votre mot de passe doit faire au moins 6 caractères.');
				}
			}else{
				UI.notification('error','tous les champs ne sont pas remplis');
			}
		}
		
	};

	$rootScope.logout = function() {

		if ($scope.loggedWithFB === true){
			Facebook.logout();
			$scope.loggedWithFB = false;
		}

		if(!!localStorage.getItem('ArtFinderUser')){
			localStorage.removeItem('ArtFinderUser');
		}

		$scope.userDisconnect();
		UI.notification(false, 'À bientôt !');

		console.log('logout');
	};

	//FACEBOOK
	// This is called with the results from from FB.getLoginStatus().

	$scope.loggedWithFB = false;

	$scope.$watch(
    	function() {
    		return Facebook.isReady();
		},
		function(newVal) {
			if (newVal){
				$scope.facebookReady = true;
			}
		}
	);

	$scope.loginWithFacebook = function() {
    // From now on you can use the Facebook service just as Facebook api says
    	if(!$scope.loggedWithFB){
			Facebook.login(function(response) {
				// Do something with response.
				$scope.loggedWithFB = true;
				$scope.me();
		    }, {scope: 'email'});
    	}
    };

    $scope.getLoginStatus = function() {
    	Facebook.getLoginStatus(function(response) {
			if(response.status === 'connected') {
				$scope.loggedWithFB = true;
				$scope.me();
        	} else {
				$scope.loggedWithFB = false;
        	}
    	});
    };

    $scope.me = function() {
    	Facebook.api('/me', function(response) {
        	//$scope.user = response;
        	console.log(response);

        	var facebookLoginInfos = {
        		facebook_id: response.id,
        		mail: response.email,
        		username: response.name,
        		avatar: 'https://graph.facebook.com/' + response.id + '/picture'
        	};

        	if(!Auth.isAuthenticated()){ //si l'utilisateur n'est pas identifé


				Auth.loginWithFacebook(facebookLoginInfos).then(
					function (user) {
						$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
						$scope.setCurrentUser(user);
						UI.closeLoginOverlay();
						UI.notification('success', 'Heureux de vous revoir ' + Session.username);

					}, function (msg) {				
						$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
						if(msg ==='no data'){
							UI.notification('error', 'Aucune donnée reçue.');
						}
					}
				);
			}else{
				UI.notification('error', 'Vous êtes déjà identifié.');
			}
   		});
    };

    $scope.getLoginStatus();

});