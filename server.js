var twitter = require('ntwitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

var twit = new twitter({
  consumer_key: '### CONSUMER_KEY ###',
  consumer_secret: '### CONSUMER_SECRET ###',
  access_token_key: '### ACCESS_TOKEN_KEY ###',
  access_token_secret: '### ACCESS_TOKEN_SECRET ###'
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

twit.stream('statuses/filter', { track: ['nfl', 'espn', 'ei'] }, function(stream) {
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


