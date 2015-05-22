//Setup web server and socket
var twitter = require('ntwitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

var twit = new twitter({
  consumer_key: 'xxx',
  consumer_secret: 'xxx',
  access_token_key: 'xxx',
  access_token_secret: 'xxx'
});

twit.verifyCredentials(function (err, data) {
    if(err !== null){
        console.log(err);
    }else{
      console.log("Login Realizado!");  
    }
    
});


var connectCounter = 0;

io.on('connect', function() { 
  connectCounter++; 
  console.log(connectCounter);
});
io.on('disconnect', function() { 
  connectCounter--; 
  console.log(connectCounter);
});

twit.stream('statuses/filter', { track: ['neymar', 'messi', 'cr7', 'barcelona', 'real madrid'] }, function(stream) {
  stream.on('data', function (data) {
     io.sockets.emit('tweet', {
      user: data.user.screen_name,
      text: data.text
    });
  });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(2000);


