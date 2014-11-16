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
        
        
        postsChanged: function(){
            socket.emit('postsChanged');
        },
        
        refreshPosts: function(){
            $rootScope.$emit('refreshPosts');
        }
        
    };
    
    var socket = io.connect('http://localhost:3000');
    
    socket.on('refreshPosts', factory.refreshPosts);

    return factory;

});
