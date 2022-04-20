const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
//const io = require('socket.io')(http);
//const server = http.createServer(app)
const PORT = process.env.PORT || 3456;

/*const socketio = require("socket.io")(http,{
  wsEngine: 'ws'
});*/



const io = require("socket.io")(http,{
  cors:{
    origin: 'http://ec2-184-73-74-122.compute-1.amazonaws.com:3000',
    methods: ["GET", "POST"]
  }
})




/*app.get('/', function(req, res) {
  res.sendfile('index.html'); 
});*/

// from https://medium.com/@raj_36650/integrate-socket-io-with-node-js-express-2292ca13d891

//Whenever someone connects this gets executed 
let connected; 

io.on('connection', function(socket){
  connected = true;
  console.log('A user connected'); 
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function(){
     connected = false;
     console.log('A user disconnected');
  });
});

// _______________________________________________________________________________
http.listen(PORT, function(err){
  if(err){console.log(err)};
  console.log(`Server listening on ${PORT}`);
});
