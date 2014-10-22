'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.User
 * @description
 * # User
 * factory in the artFinderApp.
 */
app.factory('Auth', function Auth($http, $q, Session) {

	var factory = {

		login: function(userInfos){

			var deferred = $q.defer();

			$http({
                    url: 'user.php',
                    method: 'post',
                    data: userInfos
                })
        		.success(function (user, status){
        			if(user.statut === 'success'){

                        console.log('auth reussit');
                        Session.create(user.id, user.username, user.role);
                        deferred.resolve(user);

                    }else if(user.statut === 'error'){

                        console.log(user.desc);
                        deferred.reject(user.desc)
                    }
        		})
        		.error(function (data, status){
    				deferred.reject('Impossible de récupérer lutilisateur. ' + status);
        		});

        	return deferred.promise;
			
		},

        //renvoi false si session.userId == 'undefined', sinon true
        isAuthenticated:  function () {
            return !!Session.userId;
        },

        //renvoi un boulean : si true, l'utisateur est autorisé.
        isAuthorized: function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
                authorizedRoles.indexOf(Session.userRole) !== -1);
        }

	}

	return factory;
})

.service('Session', function () {
  this.create = function (userId, userName, userRole) {
    this.userId = userId;
    this.userName = userName;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.userId = null;
    this.userName = null;
    this.userRole = null;
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
