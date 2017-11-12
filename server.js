var express = require('express')
var app = express()
var path = require('path')
var http = require('http').Server(app)
var io = require('socket.io')(http)

/////////////////////////////////////////////////////////////////
//This fixed the issue with long disconnecting times in browsers
//The interval checks if player is connected every 1 seconds
//If the player is disconnected for 5 second, they get booted
/////////////////////////////////////////////////////////////////
io.set('heartbeat interval', 1000);
io.set('heartbeat timeout', 5000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket){
	
	usersOn = socket.conn.server.clientsCount
	io.emit('usersOn', usersOn)
		
	socket.on('userData', function(userData){
		socket.username = userData.username
	})
	
	socket.on('chat message', function(msg){
		io.emit('chat message', msg)
	})
	
	socket.on('notification', function(notification){
		io.emit('notification', notification)
	})
	
	socket.on('disconnect', function(){
		usersOn -= 1
		io.emit('usersOn', usersOn)
		io.emit('notification', socket.username + " has disconnected.")
	})
})

//Server configuration stuff

//Tries to find variable for openshift ip, if nothing then loads to localhost
var ipaddress = process.env.PORT || "127.0.0.1";

//Same as above, but with port
//If you want to load on localhost onto a different port, change 4000 to whatever port you please
var port = process.env.PORT || 4000;

http.listen(port, ipaddress, function(){
	console.log('Running on Openshift Server')
})

