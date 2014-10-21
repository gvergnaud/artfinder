var http = require('http'); 
var mysql = require('mysql');

httpServer = http.createServer(function(req, res){
	res.end('hello world');
});

httpServer.listen(1337);


var io = require('socket.io').listen(httpServer);


io.sockets.on('connection', function(socket){

	console.log('un utilisateur onlie');
	// Connect bdd MYSQL

	var bdd = mysql.createConnection({
		host		: "db405508102.db.1and1.com",
		user 		: "dbo405508102",
		password	: "Dbnight",
		database	: "db405508102"
	});

	bdd.query('SELECT * FROM chat_users', function (error, results, fields) {
		if (error) {
			console.log(error);
			return false;
			bdd.end();
		}

		console.log(results);
		bdd.end();
	});

});