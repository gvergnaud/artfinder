'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:whenScrolled
 * @description
 * # whenScrolled
 */

app.directive('ngLoader', function(Post, $rootScope) {
	return {

		restrict: 'A',
		link: function($scope, $element, $attrs) {

			function showContent(){
				window.removeEventListener( 'scroll', noscroll );
				document.getElementById('landing').classList.add('loaded');
				document.getElementById('container').classList.add('loaded');
			}

			function showLanding(){
				setTimeout(function(){
					logo.classList.add('loaded');
					setTimeout(function(){
						button.classList.add('width');
						setTimeout(function(){
							button.classList.add('height');
							button.addEventListener('click', showContent);
							setTimeout(function(){
								button.querySelector('.enterText').classList.add('loaded');
							}, 500);
						}, 500);
					}, 800);
				}, 500);
			}

			function noscroll(){
				window.scrollTo(0,0);
			}


			window.addEventListener( 'scroll', noscroll);

			var button = document.querySelector('#landing button.enter'),
				logo = document.querySelector('#landing div.logo'),
				loading = true; //l'utilisateur est encore sur le landing

			//WTMA			
			//On observe les changement de Post.posts
			$scope.$watch(function(){
				//Si posts vaut quelque chose, on affiche la landing
				if(Post.posts && loading || $rootScope.loaded){
					loading = false; // l'utilisateur à chargé les posts
					showLanding();
				}
			});

		}
	};
});