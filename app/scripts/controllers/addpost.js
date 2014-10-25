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
		UI.notification('', 'Identiez vous pour ajouter un mur !');
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



	myDropzone.on("addedfile", function(file) {
	  	// Hookup the start button
	  	file.previewElement.querySelector(".start").onclick = function(){
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
	myDropzone.on("success", function(file){
		var imagePath = window.location.origin + window.location.pathname + 'images/uploads/' + file.name;
		document.getElementById('photorender').setAttribute('src', imagePath);
		if(file.type === 'image/jpeg' || file.type === 'image/png'){
			$scope.newPost.urls = [];
			$scope.newPost.urls.push(imagePath);
		}
	});

	myDropzone.on("error", function(file){
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

	var addPostForm = angular.element(document.querySelector('#addPost'));
	$scope.newPost = {};
	$scope.newPost.stillExist = new Boolean();
	$scope.newPost.stillExist = false;
	$scope.newPost.artist = [];
	$scope.newPost.coords = {};

	var geoloc = new Geoloc('formMap');

	geoloc.createMap();

	google.maps.event.addListener(geoloc.map, 'click', function( event ){

		geoloc.getAddress(event.latLng.lat(), event.latLng.lng()).then(
			function(address){
				$scope.newPost.address = address;
			},
			function(msg){
				UI.notification('error', msg);
			}
		);

		$scope.newPost.coords.latitude = event.latLng.lat();
		$scope.newPost.coords.longitude = event.latLng.lng();

	});

	$scope.addressChange = function(){
		console.log('trigger');
		geoloc.getLatLng($scope.newPost.address).then(
			function(latLng){
				$scope.newPost.coords.latitude = latLng.k;
				$scope.newPost.coords.longitude = latLng.B;
				console.log($scope.newPost.coords);
			},
			function(msg){
				UI.notification('error', msg);
			}
		);
	}

	$scope.addPost = function(){
		
		if(Auth.isAuthenticated()){
			if(!!$scope.newPost.urls){

				if(!!$scope.newPost.coords.latitude || !!$scope.newPost.coords.longitude){
					//on formate l'adresse à la bien (dans le cas ou l'utilisateur l'a entré manuellement)
					geoloc.getAddress($scope.newPost.coords.latitude, $scope.newPost.coords.longitude).then(
						function(address){
							$scope.newPost.address = address;

							if(!!$scope.newPost.technic && !!$scope.newPost.description){

								$scope.newPost.userId = Session.userId;
								$scope.newPost.comments = [];
								$scope.newPost.likes = [];
								$scope.newPost.date = new Date().getTime();

								Post.add($scope.newPost).then(
									function(newPostId){
										UI.notification('success', 'Votre mur à bien été ajouté !');
										$scope.redirectTo('singlepost', newPostId);
									},
									function(msg){
										UI.notification('error', msg);
									}
								);
							}else{
							UI.notification('error', 'Tous les champs ne sont pas remplis.');
							}
						},
						function(msg){
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
			UI.notification('error', 'Identifiez vous pour ajouter un mur.');
		}
	}
});
