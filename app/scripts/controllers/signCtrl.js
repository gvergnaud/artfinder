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
		Session.create(user.id, user.username, user.role, user.avatar);
		$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
		$scope.setCurrentUser(user);
		setTimeout(function(){
			UI.notification('success', 'Heureux de vous revoir ' + Session.username);
		},500);
	}

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

	$rootScope.logOut = function() {

		if ($scope.facebook.logged === true){
			$scope.facebook.logOut();
		}

		if(!!localStorage.getItem('ArtFinderUser')){
			localStorage.removeItem('ArtFinderUser');
		}

		$scope.userDisconnect();
		UI.notification(false, 'À bientôt !');

		console.log('logout');
	}

	//FACEBOOK
	// This is called with the results from from FB.getLoginStatus().
	$rootScope.facebook = {

		logged: false,
		
		init: function(){
			window.fbAsyncInit = function() {
				FB.init({
					appId: '306208576247087',
					cookie     : true,  // enable cookies to allow the server to access 
					// the session
					xfbml      : true,  // parse social plugins on this page
					version    : 'v2.1' // use version 2.1
				});

				// Now that we've initialized the JavaScript SDK, we call 
				// FB.getLoginStatus().  This function gets the state of the
				// person visiting this page and can return one of three states to
				// the callback you provide.  They can be:
				//
				// 1. Logged into your app ('connected')
				// 2. Logged into Facebook, but not your app ('not_authorized')
				// 3. Not logged into Facebook and can't tell if they are logged into
				//    your app or not.
				//
				// These three cases are handled in the callback function.

				FB.getLoginStatus(function(response) {
					$rootScope.facebook.statusChangeCallback(response);
				});

			};

			// Load the SDK asynchronously
			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "//connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		},

		statusChangeCallback: function(response) {
			console.log('statusChangeCallback');
			console.log(response);
			// The response object is returned with a status field that lets the
			// app know the current login status of the person.
			// Full docs on the response object can be found in the documentation
			// for FB.getLoginStatus().
			if (response.status === 'connected') {
			// Logged into your app and Facebook.
			$rootScope.facebook.logged = true;
			$rootScope.facebook.getUserInfos();

			} else if (response.status === 'not_authorized') {
				// The person is logged into Facebook, but not your app.
				UI.notification('Please log into this app.');
			} else {
				// The person is not logged into Facebook, so we're not sure if
				// they are logged into this app or not.
				UI.notification('Please log into Facebook.');
			}
		},

		// This function is called when someone finishes with the Login
		// Button.  See the onlogin handler attached to it in the sample
		// code below.
		checkLoginState: function() {
			console.log('checkLoginState');
			FB.getLoginStatus(function(response) {
				console.log(response);
				$rootScope.facebook.statusChangeCallback(response);
			});
		},
		
		// Here we run a very simple test of the Graph API after login is
		// successful.  See statusChangeCallback() for when this call is made.
		
		getUserInfos: function () {

			console.log('Welcome!  Fetching your information.... ');

			FB.api('/me', function(response) {
				console.log(response);
				console.log('oui');
			});
		},

		logOut: function () {
			FB.logout(function(response) {
		        console.log(response);
		    });
		}
			
	};

	$rootScope.facebook.init();
});