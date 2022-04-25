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

let OneMin = [];
let FiveMin = [];
let TenMin = [];
let ThirtyMin = [];


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
        connection.query(sql, [values], function(err) {
          if (err) throw err
          socket.emit("LoginSuccess"); 
        });
      }
      else {
        socket.emit("UserAlreadyExists"); 
      }
    });
  });


  

  
  socket.on("JoinLobby", function(data) {
    let gametime = data["TimeControl"];
    if(gametime == 1){
      getopponent(OneMin);
    }else if(gametime == 5){
      getopponent(FiveMin);
    }else if(gametime == 10){
      getopponent(TenMin);
    }else if(gametime == 30){
      getopponent(ThirtyMin);
    }
  });

  function getopponent(lobby){
    if(lobby[0]!=null){
      let opponent_id = lobby[0];
      let index = lobby.indexOf(opponent_id);
      lobby.splice(index,1);
      socket.join(opponent_id+socket.id); 
      let opponent_socket = io.of('/').sockets.get(opponent_id);
      opponent_socket.join(opponent_id+socket.id);
      io.to(opponent_id+socket.id).emit("StartGame", {roomname: opponent_id+socket.id}); 
      console.log("New Game Name " + opponent_id+socket.id);
    }else{
      lobby.push(socket.id);
      console.log("First Join Lobby: " + lobby);
    }
  }

  socket.on("StartGame", function(data){
    io.in(data["roomname"]).emit("RenderGame"); 
  })

  

  socket.on("FetchRecord", function(data){
    let fetch = "SELECT wins, losses FROM users WHERE username = " + mysql.escape(data["username"]);
    let ans;
    connection.query(fetch, function(err, result) {
      if (err) throw err
      console.log("Wins and Losses: " + JSON.stringify(result)); 
      console.log("Result: " + result[0].wins); 
      ans = result;
      console.log("Ans: " + ans["wins"]); 
      console.log("Wins Fetched for " + data["username"]); 
      socket.emit("ReceiveRecord", {wins: result[0].wins, losses: result[0].losses}); 
    });
  });
});


// _______________________________________________________________________________
http.listen(PORT, function(err){
  if(err){console.log(err)};
  console.log(`Server listening on ${PORT}`);
});
