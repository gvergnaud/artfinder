var server={
    init : function(){

        this.io = require('socket.io').listen(3000);
        this.io.on('connection',this.listen);
    },

    listen : function(socket){

        socket.on('postsChanged', function(){
            console.log('postsChanged');
            socket.broadcast.emit('refreshPosts');
        });
    }
};
server.init();