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
		var view = angular.element(document.querySelector('.view'));
		view.css({
			width: window.innerWidth - 150 + 'px'
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

    	showHideLoginOverlay: function(){
    		loginContainer.toggleClass('show');
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
					width: window.innerWidth - 150 + 'px'
				});
				mosaic.css({
					height: window.innerHeight/2 + 'px',
					width: window.innerWidth - 150 + 'px'
				});
	    	}

	    },

    	singlepost: {

    		init:function(){

				ui.singlepost.style();
				window.addEventListener('resize', ui.singlepost.style, false);

				ui.showViewcontainer();
	    	},

	    	style: function(){

	    		var player = angular.element(document.querySelector('#player')),
		 			img = angular.element(document.querySelector('section#player>img')),
		 			arrows = [angular.element(document.querySelector('nav#prev')), angular.element(document.querySelector('nav#next'))];

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

	    	playerArrowsShowHide: function(scope){

				if(typeof scope.post.urls[scope.currentUrlId - 1] === 'undefined'){
					scope.arrows[0].css({display: 'none'});
				}else{
					scope.arrows[0].css({display: 'block'});
				}
				if(typeof scope.post.urls[scope.currentUrlId + 1] === 'undefined'){
					scope.arrows[1].css({display: 'none'});
				}else{
					scope.arrows[1].css({display: 'block'});
				}
			},
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
	    	}
	    }
    };
    return ui;
 });
