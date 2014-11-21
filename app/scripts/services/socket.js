'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.post
 * @description
 * # post
 * Service in the artFinderApp.
 */
app.factory('Socket', function Socket($rootScope, SERVER) {
    
    var factory = {

        init: function(){
            if(!io){ return; }

            this.socket = io.connect(SERVER.nodeServerUrl);  //  https://artfindersocket.herokuapp.com/
            this.socket.on('refreshPosts', factory.refreshPosts);
        },
        
        postsChanged: function(postId){
            if(!io){ return; }
        
            this.socket.emit('postsChanged', {postId: postId});
            
        },
        
        refreshPosts: function(info){
            if(!io){ return; }

            $rootScope.$emit('refreshPosts', info);
        }
        
    };
    
    factory.init();

    return factory;

});
