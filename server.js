//Setup web server and socket
var twitter = require('ntwitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

var twit = new twitter({
  consumer_key: 'pqEd7Khb0PFqCUVqZ8ASWz9IJ',
  consumer_secret: 'shuE3hq8zVnjEErxS4YOGsDWthBiBaGjKI2mto6b2GPMlSTMgA',
  access_token_key: '67066867-diE9MKlzruRVIMhdt6lAJUR5pQNx7FlKMVuFA13nv',
  access_token_secret: 'MHtPmMaDu4iBJdYKVMxkAoJ7MExkCeNjIK6PHIpIAi6Cr'
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


