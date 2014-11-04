var loader = {
	init: function(){

		window.addEventListener( 'scroll', loader.noscroll );

		this.button = document.querySelector('#landing button.enter');
		this.logo = document.querySelector('#landing div.logo');


		var xhr = new XMLHttpRequest();

		xhr.open('GET', '/', true);
		xhr.onprogress = function(pe) {
		    if(pe.lengthComputable) {
		    	console.log(pe.total);
		    	console.log(pe.loaded);
		    }
		}
		xhr.onloadend = function(pe) {
		    console.log(pe.loaded);
			loader.logo.classList.add('loaded');
			loader.button.addEventListener('click', loader.showContent);
		}

		xhr.send();


	},

	showContent: function(){
		window.removeEventListener( 'scroll', loader.noscroll );
		document.getElementById('landing').classList.add('loaded');
		document.getElementById('container').classList.add('loaded');
	},

	noscroll: function(){
		window.scrollTo(0,0);
	}
};

loader.init();