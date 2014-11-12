//Fullscreen javascript plugin
//Author : Gabriel Vergnaud

var fullScreen = {
	
	//initialisation
	init: function(selector){
		var element = document.querySelector(selector),
			body = document.getElementsByTagName('body')[0];

		body.style.padding = '0';
		body.style.margin = '0';

		container.style.overflow = 'hidden';
		container.style.position = 'fixed';
		container.style.backgroundColor = "#000";
		container.style.zIndex = '-1000';
		container.style.width = window.innerWidth + 'px';
		container.style.height = window.innerHeight + 'px';

		element.style.position ='absolute';
		fullScreenBg.fullScreen(element, elementWidth, elementHeight);

		window.onresize = function(){
			fullScreenBg.fullScreen(element, elementWidth, elementHeight);
			container.style.width = window.innerWidth + 'px';
			container.style.height = window.innerHeight + 'px';
		}
	},

	fullScreen: function(element, elementWidth, elementHeight){
		if(window.innerWidth*parseInt(elementHeight) >= window.innerHeight*parseInt(elementWidth)){
			element.style.width = window.innerWidth + 'px';
			element.style.height = (window.innerWidth*parseInt(elementHeight))/(parseInt(elementWidth)) +'px';
		}else{
			element.style.height = window.innerHeight + 'px';
			element.style.width = (window.innerHeight*parseInt(elementWidth))/(parseInt(elementHeight)) +'px';
		}
		element.style.top = -(parseInt(element.style.height) - window.innerHeight)/2 + 'px';
		element.style.left = -(parseInt(element.style.width) - window.innerWidth)/2 + 'px';
	}
}