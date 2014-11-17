'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.post
 * @description
 * # post
 * Service in the artFinderApp.
 */
app.factory('Socket', function Socket($rootScope) {
    
    var factory = {

        init: function(){
            if(!io){ return; }

            var socket = io.connect('https://artfindersocket.herokuapp.com/');
            socket.on('refreshPosts', factory.refreshPosts);
        },
        
        postsChanged: function(){
            if(!io){ return; }
        
            socket.emit('postsChanged');
            
        },
        
        refreshPosts: function(){
            if(!io){ return; }

            $rootScope.$emit('refreshPosts');
        }
        
    };
    
    factory.init();

    return factory;

});
