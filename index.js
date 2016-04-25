var express = require('express')
var app = express()
var path = require('path')
var http = require('http').Server(app)
var io = require('socket.io')(http)

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
		console.log(notification)
		io.emit('notification', notification)
	})
	
	socket.on('disconnect', function(){
		usersOn -= 1
		io.emit('usersOn', usersOn)
		io.emit('notification', socket.username + " has disconnected.")
	})
})

http.listen(4000, function(){
	console.log('listening on *:4000')
})
