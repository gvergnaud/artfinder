'use strict';

/**
 * @ngdoc function
 * @name artFinderApp.controller:AddpostCtrl
 * @description
 * # AddpostCtrl
 * Controller of the artFinderApp
 */
app.controller('AddpostCtrl', function ($scope, $rootScope, UI, Auth) {
	
	UI.addpost.init();

	if(!Auth.isAuthenticated()){
		UI.toggleLoginOverlay();
	}
	
	var postImageUrl = window.location.origin + window.location.pathname + 'upload.php';
        
	// Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
	var previewNode = document.querySelector('#template');
	previewNode.id = '';
	var previewTemplate = previewNode.parentNode.innerHTML;
	previewNode.parentNode.removeChild(previewNode);

	var myDropzone = new Dropzone('div#drop', { // div#drop devient dropzone
		url: postImageUrl, // Set the url
		paramName: 'file', //param name
		thumbnailWidth: 80,
		thumbnailHeight: 80,
		parallelUploads: 20,
		previewTemplate: previewTemplate,
		autoQueue: false, // Make sure the files aren't queued until manually added
		previewsContainer: '#previews', // Define the container to display the previews
		clickable: '#drop' // Define the element that should be used as click trigger to select files.
	});

	/*

	myDropzone.on("addedfile", function(file) {
	  	// Hookup the start button
	  	file.previewElement.querySelector(".start").onclick = function() { myDropzone.enqueueFile(file); };
	});

	// Update the total progress bar
	myDropzone.on("totaluploadprogress", function(progress) {
		document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
	});

	myDropzone.on("sending", function(file) {
		// Show the total progress bar when upload starts
		document.querySelector("#total-progress").style.opacity = "1";
		// And disable the start button
		file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
	});

	// Hide the total progress bar when nothing's uploading anymore
	myDropzone.on("queuecomplete", function(progress) {
		document.querySelector("#total-progress").style.opacity = "0";
	});

	myDropzone.on("success", function(response) {
	});

	myDropzone.on("error", function(errormsg) {
		document.getElementById('reponseserver').innerHTML = errormsg;
	});

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

});
