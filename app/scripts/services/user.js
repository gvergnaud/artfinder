'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.User
 * @description
 * # User
 * factory in the artFinderApp.
 */
app.factory('User', function User() {

	var factory = {

		login: function(){
			console.log('login'); 
		}

	}

	return factory;
});
