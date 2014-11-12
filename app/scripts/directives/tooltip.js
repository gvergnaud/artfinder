'use strict';
/**
 * @ngdoc directive
 * @name artFinderApp.directive:whenScrolled
 * @description
 * # whenScrolled
 */

app.directive('ngTooltip', function(Post) {
	return {

		restrict: 'A',
		link: function($scope, $element, $attrs) {

			var hidden = true,
				msg = $attrs.ngTooltip,
				tooltip = angular.element('<div />').addClass('tooltip');


			$element.on('mouseenter mouseleave', function(e){
				if(hidden){
					hidden = false;
										
					tooltip.css({
						left: e.clientX + 'px', //left corrigé par un translate -50% en css
						top: $element[0].offsetTop - 40 + 'px'
					});
					
					$element.on('mousemove', function(e){
						tooltip.css({
							left: e.clientX + 'px', //left corrigé par un translate -50% en css
							top: $element[0].offsetTop - 50 + 'px'
						});
					});

					tooltip.html(msg);

					angular.element(document.querySelector('body')).append(tooltip);

				}else{
					hidden = true;
					angular.element(document.querySelector('.tooltip')).remove();
				}
			});

		}
	};
});