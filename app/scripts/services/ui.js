'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.UI
 * @description
 * # UI
 * Service in the artFinderApp.
 */
app.factory('UI', function UI() {
	//tout ce qui est pareil pour toutes les pages
	var loginContainer = angular.element(document.querySelector('#login')),
		viewcontainer = angular.element(document.querySelector('#viewcontainer'));	      	

	function mainStyle(){
		loginContainer.css({
			width: window.innerWidth + 'px',
			height: window.innerHeight + 'px'
		});
		//on redefini lelement vu car il change a chaque chagement de page
		viewcontainer.css({
			width: window.innerWidth - 200 + 'px'
		});
	}

	mainStyle();
	window.addEventListener('resize', mainStyle, false);


	//Public fonctions
    var ui = {

    	showViewcontainer: function(){
			viewcontainer.removeClass('hidden');
    	},

    	hideViewcontainer: function(){
			viewcontainer.addClass('hidden');
    	},

    	toggleLoginOverlay: function(){
    		loginContainer.toggleClass('show');
    	},

    	notification: function(type, msg){

    		if(!ui.notifying){
    			ui.notifying = true;
	    		var notifContainer = angular.element(document.querySelector('aside#notifications'));
	    		var newNotif = document.createElement('p');
	    		
	    		newNotif.innerHTML = msg;
	    		
	    		newNotif.classList.add('notification');
	    		if(type){
	    			newNotif.classList.add(type);
	    		}
	    		
	    		notifContainer[0].innerHTML = '';
	    		notifContainer[0].style.display = 'block';
	    		notifContainer.prepend(newNotif);
	    		
	    		setTimeout(function(){	
	    			newNotif.classList.add('show');
	    		}, 100);
	    		
	    		setTimeout(function(){	
	    			newNotif.classList.remove('show');
	    			setTimeout(function(){
	    				notifContainer[0].style.display = 'none';
	    				angular.element(newNotif).remove();
    					ui.notifying = false;
	    			}, 650);
	    		}, 4000);
	    		
	    		newNotif.addEventListener('click', function(){
	    			this.style.display = 'none';
	    		});
    		}
    	},
    	
    	home: {

    		init: function(){

				ui.home.style();
				window.addEventListener('resize', ui.home.style, false);
				ui.showViewcontainer();
	    	},

	    	style: function(){

	    		var mosaic = angular.element(document.querySelector('#mosaic')),
    				map = angular.element(document.querySelector('#map'));

	    		map.css({
					height: window.innerHeight/2 + 'px',
					width: window.innerWidth - 200 + 'px'
				});
				mosaic.css({
					height: window.innerHeight/2 + 'px',
					width: window.innerWidth - 200 + 'px'
				});
	    	}

	    },

    	singlepost: {

    		selection: false,

    		init:function(){

				ui.singlepost.style();
				window.addEventListener('resize', ui.singlepost.style, false);
				window.addEventListener('resize', ui.singlepost.tagStyles, false);

				ui.showViewcontainer();
	    	},

	    	style: function(){

	    		var player = angular.element(document.querySelectorAll('#player')),
		 			img = angular.element(document.querySelectorAll('section#player img')),
		 			arrows = [angular.element(document.querySelectorAll('nav#prev')), angular.element(document.querySelectorAll('nav#next'))];
		 			
		    	player.css({
		 			height: window.innerHeight - 100 + 'px'
		 		});

		 		img.css({
		 			height: window.innerHeight - 100 + 'px',
		 		});

		 		angular.forEach(arrows, function(value, key) {
		 			value.css({
						top: (window.innerHeight - 100)/2 + 'px',
					});
				});
	    	},

	    	tagStyles: function(){
	    		var tagWrapper = angular.element(document.querySelectorAll('.tagWrapper')),
	    			img = document.querySelectorAll('section#player img');
		    	
		    	if(!!img){
			    	tagWrapper.css({
			    		height: img[img.length-1].clientHeight + 'px',
			    		width:  img[img.length-1].clientWidth + 'px'
			    	});	
		    	}
	    	},

	    	startIdentification: function(){
	    		var tagWrapper = angular.element(document.querySelector('.tagWrapper'));
	    		var tagBoxs = document.querySelectorAll('.tagBox');

	    		tagWrapper.css({
	    			background: 'url(images/tag_wrapper_bg.png)',
  					backgroundSize: '100% 100%',
	    			cursor: 'crosshair'
	    		});
	    		for(var i = 0 ; i < tagBoxs.length ; i++){
	    			tagBoxs[i].classList.add('selection');
	    		}
	    	},
	    	
	    	stopIdentification: function(){
	    		ui.singlepost.tagWrapper = angular.element(document.querySelector('.tagWrapper'));
	    		var tagBoxs = document.querySelectorAll('.tagBox');

	    		ui.singlepost.tagWrapper.css({
	    			background: '',
	    			cursor: ''
	    		});
	    		
	    		for(var i = 0 ; i < tagBoxs.length ; i++){
	    			tagBoxs[i].classList.remove('selection');
	    		}  		

	    		if(!!document.getElementById('newArtistId')){
	    			angular.element(document.getElementById('newArtistId')).remove();
	    		} 


	    	},

	    	startSelection: function(left, top){
	    		ui.singlepost.newTag = angular.element('<div />');
	    		ui.singlepost.tagWrapper = angular.element(document.querySelector('.tagWrapper'));

	    		if(!!document.getElementById('newArtistId')){
	    			angular.element(document.getElementById('newArtistId')).remove();
	    		}

	    		ui.singlepost.newTag.addClass('tagBox');
	    		ui.singlepost.newTag.addClass('selection');
	    		ui.singlepost.newTag.attr('id', 'newArtistId');
	    		ui.singlepost.newTag.css({
	    			top: top + '%',
	    			left: left + '%'
	    		});

	    		ui.singlepost.tagWrapper.append(ui.singlepost.newTag);

	    		console.log('startselection');

	    		ui.singlepost.selection = true;
	    	},

	    	doSelection: function(width, height){
	    		if(ui.singlepost.selection){
		    		ui.singlepost.newTag.css({
		    			width: width -1 + '%',
		    			height: height -1 + '%'
		    		});	
	    		}
	    	},

	    	stopSelection: function(callback){
	    		ui.singlepost.selection = false;

	    		var artistNameInput = angular.element('<input />');
	    		artistNameInput
	    			.attr('type', 'text')
	    			.attr('autofocus', '')
	    			.attr('placeholder', 'nom de l\'artiste')
	    			.addClass('tagName')
	    			.css({
	    				background: '#fff',
	    				color: '#000',
	    				textAlign: 'center'
	    			})
	    			.on('mousedown', function(e){
	    				e.stopPropagation();
	    			})
	    			.on('mouseup', function(e){
	    				e.stopPropagation();
	    			})
	    			.on('click', function(e){
	    				e.stopPropagation();
	    			})
	    			.on('change', function(){
	    				callback.call(this, this);
	    			});

				ui.singlepost.newTag.append(artistNameInput);

	    		console.log('stopselection');
	    	},

	    	toggleMap: function(callback){
	    		var map = angular.element(document.querySelector('section.map'));
	    		var player = angular.element(document.querySelector('section#player'));
	    		var below = angular.element(document.querySelector('#below'));
	    		map.toggleClass('show');
	    		player.toggleClass('up');
	    		below.toggleClass('up');
	    		setTimeout(function(){
	    			callback.call(this);
	    		}, 650);
	    	},

	    	togglePlayerArrows: function(scope){

				if(typeof scope.post.photos[scope.currentPhotoId - 1] === 'undefined'){
					scope.arrows[0].css({display: 'none'});
				}else{
					scope.arrows[0].css({display: 'block'});
				}
				if(typeof scope.post.photos[scope.currentPhotoId + 1] === 'undefined'){
					scope.arrows[1].css({display: 'none'});
				}else{
					scope.arrows[1].css({display: 'block'});
				}
			}
	    },


    	addpost: {
    		init: function(){

	    		window.ondragover = window.ondrop = function(e){ e.preventDefault(); }; // evite le comportement par default du drag and drop

				var el = document.querySelector('#drop');

				el.ondragover = function(){
					this.className = 'hover';
					this.innerHTML = 'Drop This !';
					return false;
				};

				el.ondragleave = function(){
					this.className = '';
					this.innerHTML = 'Drag a file here';
					return false;
				};

				el.ondrop = function(e) {
				    e.preventDefault();
				    
				   	this.className = '';
					this.innerHTML = 'Drag a file here';
				};

				ui.showViewcontainer();
	    	},

	    	selectedPost: function(post){
				var addPhotoForm = angular.element(document.querySelector('form#addPhotoForm'));
				var addPostForm = angular.element(document.querySelector('form#addPostForm'));
				
				addPhotoForm.css({
					display: 'block'
				});
				
				addPostForm.css({
					display: 'none'
				});
	    	}
	    }
    };
    return ui;
 });
