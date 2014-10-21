'use strict';

/**
 * @ngdoc directive
 * @name artFinderApp.directive:changePage
 * @description
 * # changePage
 */
app.directive('ngChangePage', function (UI) {
    return function (scope, element, attrs) {
            
        element.on('click', function(e){

            e.preventDefault();
            
            var url = window.location.origin + window.location.pathname + angular.element(this).attr('href');


    		if(window.location.href !== url){

                UI.hideViewcontainer();
                
	    		setTimeout(function(){

					window.location.href = url;

	    		}, 350);
    		}
    	});    
    };
});
