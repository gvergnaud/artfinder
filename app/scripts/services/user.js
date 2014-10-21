'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.User
 * @description
 * # User
 * factory in the artFinderApp.
 */
app.factory('User', function User($http, $q) {

	var factory = {

		login: function(user){

			var deferred = $q.defer();

			$http({
                    url: 'user.php',
                    method: 'post',
                    data: {mail: user.mail, pwd: user.pwd}
                })
        		.success(function (data, status){
        			if(data === 'success'){
        				console.log('connecté !');
        				deferred.resolve();
        			}else{
        				console.log(data);
        				deferred.reject();
        			}
        		})
        		.error(function (data, status){
    				deferred.reject('Impossible de récupérer les posts. ' + status);
        		});

        	return deferred.promise;
			
		}

	}

	return factory;
});
