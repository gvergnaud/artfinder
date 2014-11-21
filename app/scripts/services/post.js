'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.post
 * @description
 * # post
 * Service in the artFinderApp.
 */
app.factory('Post', function Post($http, $q, Session, Socket, SERVER) {
    
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

            }else if(!reload && localStorage.getItem('ArtFinderPosts')){

                console.log('localStorage');

                factory.posts = factory.getFromLocalStorage();

                deferred.resolve(factory.posts);

            }else{
                console.log('appel ajax a posts.json');
        		$http.get(SERVER.url + 'getposts.php?' + new Date().getTime())
        			.success(function (data, status){
        				factory.posts = data;

                        factory.saveInLocalStorage(data);

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

        getClosePosts: function(post, nb){ //recupère les nb posts situes les plus a proximité de post

            var deferred = $q.defer();

            factory.get().then(
                function (posts){

                    var closePosts = [];

                    angular.forEach(posts, function (value, key){
                        var latDistance = Math.abs(post.coords.latitude - value.coords.latitude);
                        var lngDistance = Math.abs(post.coords.longitude - value.coords.longitude);
                        var distance = (latDistance + lngDistance)/2;
                        
                        var closePost = {};
                        closePost.distance = distance;
                        closePost.post = value;

                        closePosts.push(closePost);
                    });

                    closePosts.sort(function(a, b) { //on trie le tableau par distance croissante
                        return a.distance - b.distance;
                    });

                    closePosts.shift(); //on supprime le 1er element du tableau car c'est le post luimeme

                    closePosts.splice(nb); //on suprime les elements dont la distance est plus grande que les nb premiers

                    angular.forEach(closePosts, function (value, key){
                        closePosts[key] = value.post;
                    });

                    deferred.resolve(closePosts);
                },
                function (msg){
                    deferred.reject(msg);
                }
            );

            return deferred.promise;

        },

        areNear: function(post1, post2, distance){
            if(!post1 || !post2 || !distance){return;}
            function coordRound(val){
                return Math.ceil(val * 10000);
            }
            if(Math.abs(coordRound(post1.coords.latitude) - coordRound(post2.coords.latitude)) <= distance && Math.abs(coordRound(post1.coords.longitude) - coordRound(post2.coords.longitude)) <= distance){
                return true;
            }else{
                return false;
            }
        },

        add: function(newPost){
            var deferred = $q.defer();

            //on récupere tous les posts au cas ou il y aurait eu une modification du fichier sur le server
            factory.get(true).then(
                function (posts){

                    //on ajoute l'id a notre post
                    if(!!posts[posts.length-1]){
                        newPost.id = posts[posts.length-1].id + 1;   
                    }else{
                        newPost.id = 0;
                    }

                    //on ajoute notre newPost a la liste de commentaire de notre post
                    posts.push(newPost);
                    
                    //on sauvegarde notre nouvel objet posts
                    factory.posts = posts;
                    factory.save(posts).then(
                        function(data){
                            Socket.postsChanged(newPost.id);
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
                    url: SERVER.url + 'save.php',
                    method: 'post',
                    data: {posts: angular.toJson(posts)}
                })
                .success(function (response, status){
                    if(response === 'no data'){
                        deferred.reject('pas de donnée reçu lors de l\'enregistrement.');
                    
                    }else if(response === 'file isnt writable'){
                        deferred.reject('le fichier n\'est pas disponible en ecriture');
                    
                    }else if(response === 'Could not open file for writting.'){
                        deferred.reject('le fichier n\'a pas pu etre ouvert');
                    
                    }else if(typeof response !== 'object'){
                        console.log(typeof response);
                        deferred.reject('problème lors de l\'enregistrment');
                    }else{

                        deferred.resolve(response);
        
                    }
                })
                .error(function (data, status){
                    deferred.reject('Impossible de sauvegarder les posts' + status);
                    console.log(data);
                });  

            return deferred.promise;
    	},

        addComment: function(postId, newComment){

            var deferred = $q.defer();

            //on récupere tous les posts au cas ou il y aurait eu une modification du fichier sur le server
            factory.get(true).then(
                function (posts){

                    //on ajoute notre newComment a la liste de commentaire de notre post
                    angular.forEach(posts, function (value, key){
                        if(value.id === postId){
                            if(value.comments.length === 0){
                                newComment.id = 0;
                            }else{
                                newComment.id = value.comments[value.comments.length-1].id + 1; //on ajoute un id a notre nouveau commentaire
                            }
                            value.comments.push(newComment);
                        }
                    });
                    
                    //on sauvegarde notre nouvel objet posts
                    factory.posts = posts;
                    factory.save(posts).then(
                        function(data){
                            Socket.postsChanged(postId);
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

        deleteComment: function(postId, commentId){
            var deferred = $q.defer();

            //on récupere tous les posts au cas ou il y aurait eu une modification du fichier sur le server
            factory.get(true).then(
                function (posts){

                    //on ajoute notre newComment a la liste de commentaire de notre post
                    angular.forEach(posts, function (value, key){
                        if(value.id === postId){
                            angular.forEach(value.comments, function (comment, key){
                                if(comment.id === commentId){
                                    value.comments.splice(value.comments.indexOf(comment), 1);
                                    return;
                                }
                            });
                        }
                    });
                    
                    //on sauvegarde notre nouvel objet posts
                    factory.posts = posts;
                    factory.save(posts).then(
                        function(data){
                            Socket.postsChanged(postId);
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

                    angular.forEach(posts, function (value, key){
                        if(value.id === post.id){

                            if(value.likes.indexOf(Session.username) === -1){
                                value.likes.push(Session.username);
                            
                            }
                            //sinon on le supprime
                            else{
                                value.likes.splice(value.likes.indexOf(Session.username), 1);
                            }
                        }
                    });
                    //si le username n'est pas deja dans le tab des likes
                    
                    //on sauvegarde notre nouvel objet posts
                    
                    factory.posts = posts;
                    factory.save(posts).then(
                        function(data){
                            Socket.postsChanged(post.id);
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

        addPhoto: function(postId, photo){
            var deferred = $q.defer();

            //on récupere tous les posts au cas ou il y aurait eu une modification du fichier sur le server
            factory.get(true).then(
                function (posts){

                    //on ajoute notre photo

                    angular.forEach(posts, function (post, key){
                        if(post.id === parseInt(postId)){   
                            post.photos.push(photo);
                        }
                    });
                    
                    //on sauvegarde notre nouvel objet posts
                    factory.save(posts).then(
                        function (data){
                            Socket.postsChanged(postId);
                            deferred.resolve(data);
                        },
                        function (msg){
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

        addArtist: function(newArtist, postId, currentPhotoId){
            var deferred = $q.defer();

            //on récupere tous les posts au cas ou il y aurait eu une modification du fichier sur le server
            factory.get(true).then(
                function (posts){

                    //on ajoute notre artist a la liste

                    angular.forEach(posts, function (post, key){
                        if(post.id === parseInt(postId)){   
                            post.photos[currentPhotoId].artists.push(newArtist);
                        }
                    });
                    
                    //on sauvegarde notre nouvel objet posts
                    factory.save(posts).then(
                        function (data){
                            Socket.postsChanged(postId);
                            deferred.resolve(data);
                        },
                        function (msg){
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

        saveInLocalStorage: function(posts){
            if(localStorage){
                localStorage.setItem('ArtFinderPosts', angular.toJson(posts));
            }else{
                return false;
            }
        },

        getFromLocalStorage: function(){
            if(localStorage){
                return angular.fromJson(localStorage.getItem('ArtFinderPosts'));
            }else{
                return false;
            }
        }
    };

    return factory;

  });
