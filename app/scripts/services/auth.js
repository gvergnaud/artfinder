'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.User
 * @description
 * # User
 * factory in the artFinderApp.
 */
app.factory('Auth', function Auth($http, $q, Session) {

	var auth = {

		login: function(loginInfos){

			var deferred = $q.defer();

			$http({
                    url: 'login.php',
                    method: 'post',
                    data: loginInfos
                })
        		.success(function (user, status){
        			if(user.statut === 'success'){

                        console.log('auth reussit');
                        Session.create(user.id, user.username, user.role, user.avatar);
                        deferred.resolve(user);

                    }else if(user.statut === 'error'){

                        console.log(user.desc);
                        deferred.reject(user.desc);
                    }
        		})
        		.error(function (data, status){
    				deferred.reject('Impossible de récupérer lutilisateur. ' + status);
        		});

        	return deferred.promise;
			
		},

        signUp: function(signUpInfos){
            var deferred = $q.defer();

            $http({
                    url: 'signup.php',
                    method: 'post',
                    data: signUpInfos
                })
                .success(function (user, status){
                    console.log(user);
                    if(user.statut === 'success'){

                        console.log('inscription reussit');
                        Session.create(user.id, user.username, user.role, user.avatar);
                        deferred.resolve(user);

                    }else if(user.statut === 'error'){

                        console.log(user.desc);
                        deferred.reject(user.desc);
                    }
                })
                .error(function (data, status){
                    deferred.reject('Impossible dinscrire lutilisateur. ' + status);
                });

            return deferred.promise;
        },

        //renvoi false si session.userId == 'undefined', sinon true
        isAuthenticated:  function () {
            return !!Session.userId;
        },

        isNotAuthenticated: function(){
            return !(!!Session.userId);
        },

        //renvoi un boulean : si true, l'utisateur est autorisé.
        isAuthorized: function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
                authorizedRoles.indexOf(Session.userRole) !== -1);
        }

	};

	return auth;
})

.service('Session', function () {
  this.create = function (userId, username, userRole, userAvatar) {
    this.userId = userId;
    this.username = username;
    this.userRole = userRole;
    this.userAvatar = userAvatar;
  };
  this.destroy = function () {
    this.userId = null;
    this.userName = null;
    this.userRole = null;
    this.userAvatar = null;
  };
  return this;
})

.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
});
