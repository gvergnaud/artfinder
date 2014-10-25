'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.post
 * @description
 * # post
 * Service in the artFinderApp.
 */
app.factory('Post', function Post($http, $q, Session) {
    
    var factory = {

    	posts: false,

    	get: function(reload){ //récuper tous les posts de posts.json

            if(typeof reload === 'undefined'){
                reload = false;
            }

    		var deferred = $q.defer();

            //Si factory.posts contient déja les posts et que l'on ne veut pas recharger les données
            if(!reload && factory.posts !== false){

                deferred.resolve(factory.posts);
                console.log('pas dappel ajax');

            }else{
                console.log('appel ajax a posts.json');
        		$http.get('server/posts.json?' + new Date().getTime())
        			.success(function (data, status){
        				factory.posts = data;
        				deferred.resolve(factory.posts);
        			})
        			.error(function (data, status){
    					deferred.reject('Impossible de récupérer les posts. ' + status);
        			});
            }

    		return deferred.promise;
    	},

    	find: function(id, reload){ //recupere le post qui a l'id spécifié
    		
            if(typeof reload === 'undefined'){
                reload = false;
            }

    		var deferred = $q.defer();

    		factory.get(reload).then(
    			function (posts){

    				angular.forEach(posts, function (post, key){
						if(post.id === parseInt(id)){	
							deferred.resolve(post);
						}
					});
    			},
    			function (msg){
    				deferred.reject(msg);
    			}
    		);

    		return deferred.promise;
    	},

        add: function(newPost){
            var deferred = $q.defer();

            //on récupere tous les posts au cas ou il y aurait eu une modification du fichier sur le server
            factory.get(true).then(
                function (posts){

                    //on ajoute l'id a notre post
                    newPost.id = posts[posts.length-1].id + 1;

                    //on ajoute notre newPost a la liste de commentaire de notre post
                    posts.push(newPost);
                    
                    //on sauvegarde notre nouvel objet posts
                    factory.posts = posts;
                    factory.save(posts).then(
                        function(data){
                            deferred.resolve(newPost.id);
                        },
                        function(msg){
                            deferred.reject(msg);
                            console.log(msg);
                        }
                    );

                },
                function (msg){
                    deferred.reject(msg);
                }
            );

            return deferred.promise;
        },

    	save: function(posts){ //Envoi le json posts au fichier save.php, qui remplace l'ancien avec le nouveau sur le server.

            var deferred = $q.defer();

            $http({
                    url: 'save.php',
                    method: 'post',
                    data: {posts: angular.toJson(posts)}
                })
                .success(function (data, status){
                    deferred.resolve(data);
                })
                .error(function (data, status){
                    deferred.reject('Impossible de sauvegarder les posts' + status);
                    console.log(data);
                });  

            return deferred.promise;
    	},

        saveComment: function(postId, newComment){

            var deferred = $q.defer();

            //on récupere tous les posts au cas ou il y aurait eu une modification du fichier sur le server
            factory.get(true).then(
                function (posts){

                    //on ajoute notre newComment a la liste de commentaire de notre post
                    posts[postId].comments.push(newComment);
                    
                    //on sauvegarde notre nouvel objet posts
                    factory.posts = posts;
                    factory.save(posts).then(
                        function(data){
                            deferred.resolve(data);
                        },
                        function(msg){
                            deferred.reject(msg);
                            console.log(msg);
                        }
                    );

                },
                function (msg){
                    deferred.reject(msg);
                }
            );

            return deferred.promise;
        },

        addLike: function (post){

            var deferred = $q.defer();

            //on récupere tous les posts au cas ou il y aurait eu une modification du fichier sur le server
            factory.get(true).then(
                function (posts){

                    //si le username n'est pas deja dans le tab des likes
                    if(posts[post.id].likes.indexOf(Session.username) === -1){
                        posts[post.id].likes.push(Session.username);
                    
                    }
                    //sinon on le supprime
                    else{
                        posts[post.id].likes.splice(posts[post.id].likes.indexOf(Session.username), 1);
                    }
                    
                    //on sauvegarde notre nouvel objet posts
                    
                    factory.posts = posts;
                    factory.save(posts).then(
                        function(data){
                            deferred.resolve(data);
                        },
                        function(msg){
                            deferred.reject(msg);
                            console.log(msg);
                        }
                    );

                },
                function (msg){
                    deferred.reject(msg);
                }
            );

            return deferred.promise;
        }
    };

    return factory;

  });
