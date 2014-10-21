var http = require('http');
var mysql = require('mysql');

httpServer = http.createServer(function(req, res){
	res.end('hello world');
});

httpServer.listen(1337);

// SOCKET.IO

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function(socket){
	console.log('un utilisateur s\'est connecté !');
});