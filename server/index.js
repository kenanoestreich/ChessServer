const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const express = require("express");
const socketio = require("socket.io")(http,{
  wsEngine: 'ws'
});

const PORT = process.env.PORT || 3456;

// from https://medium.com/@raj_36650/integrate-socket-io-with-node-js-express-2292ca13d891

//Whenever someone connects this gets executed 
socketio.on('connection', function(socket) {
  console.log('A user connected'); 
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
     console.log('A user disconnected');
  });
});

// ________________________________________________________________________________________
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
