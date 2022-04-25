const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const mysql = require('mysql');
//const io = require('socket.io')(http);
//const server = http.createServer(app)
const PORT = process.env.PORT || 3456;

/*const socketio = require("socket.io")(http,{
  wsEngine: 'ws'
});*/

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'wustl_inst',
  password: 'wustl_pass',
  database: 'Chess'
}); 

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
connection.connect((err)=> {
  if (err) throw err; 
  console.log('Connected to Chess Database'); 
});

io.on('connection', function(socket){
  connected = true;
  console.log('A user connected'); 
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function(){
     connected = false;
     console.log('A user disconnected');
  });


  socket.on('LoginAttempt', function(data){
    

    let newUserInfo; 
    let sql = "SELECT * FROM users WHERE username = ?";
    let username = [
      [data["username"]]
    ];
    connection.query(sql, [username], function(err, result) {
      if (err) throw err
      newUserInfo = result;
      console.log("Matching User: " + JSON.stringify(newUserInfo)); 
      if (newUserInfo.length == 1){
        if (newUserInfo[0].password===data["password"] && newUserInfo[0].username===data["username"]){
          socket.emit("LoginSuccess"); 
        }
        else {
          socket.emit("LoginFailure"); 
        }
      }
      else{
        socket.emit("LoginFailure"); 
      }
    }); 
  }); 

  socket.on("RegisterUser", function(data){
    /*connection.connect((err)=> {
      if (err) throw err; 
      console.log('Connected to Chess Database for Register'); 
    });*/

    let count; 
    let search = "SELECT username FROM users WHERE username = " + mysql.escape(data["username"]);
    connection.query(search, function(err, result) {
      if (err) {
        return console.error(error.message); 
      }
      console.log("Count: " + result); 
      count = result;
      if (count.length == 0){
        let sql = "INSERT INTO users (username, password) VALUES ?";
        let values = [
          [data["username"], data["password"]]
        ]; 
        connection.query(sql, [values], function(err, result) {
          if (err) throw err
          socket.emit("LoginSuccess"); 
        });
      }
      else {
        socket.emit("UserAlreadyExists"); 
      }
    });
  });
});

// _______________________________________________________________________________
http.listen(PORT, function(err){
  if(err){console.log(err)};
  console.log(`Server listening on ${PORT}`);
});
