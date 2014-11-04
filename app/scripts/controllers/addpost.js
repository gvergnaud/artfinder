'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:AddpostCtrl
 * @description
 * # AddpostCtrl
 * Controller of the artFinderApp
 */
app.controller('AddpostCtrl', function ($scope, $rootScope, UI, Auth, Geoloc, Session, Post) {
	
	UI.addpost.init();

	if(!Auth.isAuthenticated()){
		UI.toggleLoginOverlay();
		UI.notification('', 'Connectez vous pour ajouter un mur !');
	}
	
	var postImageUrl = window.location.origin + window.location.pathname + 'upload.php';
    
	// Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
	var previewNode = document.querySelector('#template');
	previewNode.id = '';
	var previewTemplate = previewNode.parentNode.innerHTML;
	previewNode.parentNode.removeChild(previewNode);

	var myDropzone = new Dropzone('#drop', { // div#drop devient dropzone
		url: postImageUrl, // Set the url
		paramName: 'file', //param name
		thumbnailWidth: 80,
		thumbnailHeight: 80,
		parallelUploads: 1,
		previewTemplate: previewTemplate,
		autoQueue: false, // Make sure the files aren't queued until manually added
		previewsContainer: '#previews', // Define the container to display the previews
		clickable: '#drop' // Define the element that should be used as click trigger to select files.
	});



	myDropzone.on('addedfile', function(file) {
	  	// Hookup the start button
	  	file.previewElement.querySelector('.start').onclick = function(){
	  		myDropzone.enqueueFile(file);
	  	};
	});
	/*
	myDropzone.on("totaluploadprogress", function(progress) {
		document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
	});

	myDropzone.on("sending", function(file){
		console.log(file);
	});

	// Hide the total progress bar when nothing's uploading anymore
	myDropzone.on("queuecomplete", function(progress) {
		document.querySelector("#total-progress").style.opacity = "0";
	});
*/
	myDropzone.on('success', function(file, response){
		if(response !== 'nofiles'){
			var imagePath = window.location.origin + window.location.pathname + 'images/uploads/' + response;
			document.getElementById('photorender').setAttribute('src', imagePath);
			if(file.type === 'image/jpeg' || file.type === 'image/png'){

				$scope.newPost.photos[0].url = imagePath;
				$scope.newPost.photos[0].artists = [];
			}
		}else{
			UI.notification('error', 'le serveur n\'a reçu aucune image.');
		}
	});

	myDropzone.on('error', function(file){
	});
/*
	// Setup the buttons for all transfers
	// The "add files" button doesn't need to be setup because the config
	// `clickable` has already been specified.
	document.querySelector("#actions .start").onclick = function() {
		myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
	};
	document.querySelector("#actions .cancel").onclick = function() {
		myDropzone.removeAllFiles(true);
	}; 

	*/

	$scope.newPost = {};
	$scope.newPost.photos = [];
	$scope.newPost.photos[0] = {};
	$scope.newPost.photos[0].stillExist = new Boolean();
	$scope.newPost.photos[0].stillExist = false;
	$scope.newPost.photos[0].description = '';
	$scope.newPost.coords = {};

	var geoloc = new Geoloc('#formMap');

	geoloc.createMap();

	//click sur la carte pour récuperer les coordonnées
	google.maps.event.addListener(geoloc.map, 'click', function( event ){

		geoloc.addressFromLatLng(event.latLng.lat(), event.latLng.lng()).then(
			function (address) {
				$scope.newPost.address = address;
			},
			function (msg) {
				UI.notification('error', msg);
			}
		);

		$scope.newPost.coords.latitude = event.latLng.lat();
		$scope.newPost.coords.longitude = event.latLng.lng();
		$scope.proposePosts();

	});

	//entrer l'adresse pour recupérer les coordonnées
	$scope.addressChange = function(){
		if(!!$scope.newPost.address){
			geoloc.latLngFromAddress($scope.newPost.address).then(
				function (latLng){
					$scope.newPost.coords.latitude = latLng.k;
					$scope.newPost.coords.longitude = latLng.B;
					$scope.proposePosts();
				},
				function (msg){
					UI.notification('error', msg);
				}
			);
		}
	};

	$scope.closePosts = [];

	$scope.proposePosts = function(){

		Post.get().then(
			function (posts){
				for(var i in posts){
					var post = posts[i];
					//si le nouveau post est près d'un ancien post
					if(Post.areNear(post, $scope.newPost, 3)){
						//si le post n'est pas déja dans le tableau closeposts
						if($scope.closePosts.indexOf(post) === -1){
							$scope.closePosts.push(post);
							geoloc.addMarker(post);
						}
					//sinon, si le post etait dans le tableau, on l'enleve
					}else if($scope.closePosts.indexOf(post) !== -1){
						
						$scope.closePosts.splice($scope.closePosts.indexOf(post), 1);
						
					}
				}
			},
			function (msg){
				UI.notification('error', msg);
			}
		);
	};

	$scope.selectClosePost = function(post){

		UI.addpost.selectedPost(post); //dois effacer les autres champs ainsi que les autres closePosts proposés et faire apparaitre un bouton submit spécial qui déclenche la function Post.addPhoto.
		var addPhotoForm = angular.element(document.querySelector('form#addPhotoForm'));
		
		//ajoute la photo au post existant
		addPhotoForm.on('submit', function(e){
			
			e.preventDefault();
			
			if(Auth.isAuthenticated()){ //si l'utilisateur est bien authentifié

				if(!!$scope.newPost.photos[0].url){ //si l'utilisateur a bien envoyé son image

					if(!!$scope.newPost.photos[0].technique){

						//on ajoute le username de l'hoster a l'image
						$scope.newPost.photos[0].username = Session.username;
						$scope.newPost.photos[0].userId = parseInt(Session.userId);
						$scope.newPost.photos[0].date = new Date().getTime();

						Post.addPhoto(post.id, $scope.newPost.photos[0]).then(
							function(data){ //success
								$scope.redirectTo('singlepost', post.id);
							},
							function(msg){ //error
								UI.notification('error', msg);
							}
						);
					}else{
						UI.notification('error', 'Ajoutez la technique utilisée');
					}
				}else{
					UI.notification('error', 'Envoyer votre image avant d\'envoyer le formulaire !');
				}
			}else{
				UI.notification('error', 'Connectez vous pour ajouter un mur.');
			}
		});

	};

	$scope.addPost = function(){
		
		if(Auth.isAuthenticated()){
			if(!!$scope.newPost.photos[0].url){ //si l'image a bien été upload

				if(!!$scope.newPost.coords.latitude || !!$scope.newPost.coords.longitude){ //si le post est bien géolocalisé
					//on formate l'adresse à la bien (dans le cas ou l'utilisateur l'a entré manuellement)
					geoloc.getAddress($scope.newPost.coords.latitude, $scope.newPost.coords.longitude).then(
						function(address){
							$scope.newPost.address = address;

							if(!!$scope.newPost.photos[0].technique){

								$scope.newPost.comments = [];
								$scope.newPost.likes = [];
								$scope.newPost.photos[0].username = Session.username;
								$scope.newPost.photos[0].userId = parseInt(Session.userId);
								$scope.newPost.photos[0].date = new Date().getTime();

								console.log($scope.newPost);
								
								Post.add($scope.newPost).then(
									function (newPostId){
										UI.notification('success', 'Votre mur à bien été ajouté !');
										$scope.redirectTo('singlepost', newPostId);
									},
									function (msg){
										UI.notification('error', msg);
									}
								);
							}else{
							UI.notification('error', 'Ajoutez la technique utilisée');
							}
						},
						function (msg){
							UI.notification('error', msg);
						}
					);

				}else{
					UI.notification('error', 'Géolocalisé votre image en cliquant sur la carte, ou en tapant son adresse.');
				}
			}else{
				UI.notification('error', 'Envoyer votre image avant d\'envoyer le formulaire !');
			}
		}else{
			UI.notification('error', 'Connectez vous pour ajouter un mur.');
		}
	};
});