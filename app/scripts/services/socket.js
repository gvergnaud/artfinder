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
            this.socket.on('refreshPost', factory.refreshPost);
            this.socket.on('loadNewPost', factory.loadNewPost);
        },
        
        postsChanged: function(postId){
            if(!io){ return; }
        
            this.socket.emit('postsChanged', {postId: postId});
            
        },

        newPost: function(){
            if(!io){ return; }
        
            this.socket.emit('newPost');
        },
        
        refreshPost: function(info){
            if(!io){ return; }

            $rootScope.$emit('refreshPost', info);
        },

        loadNewPost: function(){
            if(!io){ return; }

            $rootScope.$emit('loadNewPost');
        }
        
    };
    
    factory.init();

    return factory;

});
