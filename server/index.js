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
  /* FOR RICO:
  user: 'root',
  password: 'Rock2001',
  */
  user: 'wustl_inst',
  password: 'wustl_pass',
  database: 'Chess'
}); 

const io = require("socket.io")(http,{
  cors:{
   //FOR RICO: origin: 'http://ec2-44-202-148-202.compute-1.amazonaws.com:3000',
    origin: 'http://ec2-184-73-74-122.compute-1.amazonaws.com:3000',
    methods: ["GET", "POST"]
  }
})

let OneMin = [];
let FiveMin = [];
let TenMin = [];
let ThirtyMin = [];
let roomPairs = [{}];//store opponent_ids for each client
let roomPairsNames = [{}]; // store player usernames;
let numRooms=0;  


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
  console.log('A client connected'); 
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function(){
     connected = false;
     console.log('A client disconnected');
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
    let username = data["username"];
    if(gametime == 1){
      console.log(`${username} joined One Min Lobby`);
      getopponent(OneMin,username,gametime);
    }else if(gametime == 5){
      console.log(`${username} joined Five Min Lobby`);
      getopponent(FiveMin,username,gametime);
    }else if(gametime == 10){
      console.log(`${username} joined Ten Min Lobby`);
      getopponent(TenMin,username,gametime);
    }else if(gametime == 30){
      console.log(`${username} joined Thirty Min Lobby`);
      getopponent(ThirtyMin,username,gametime);
    }
  });

  function getopponent(lobby,username,time){
    if(lobby[0]!=null){
      let opponent_id = lobby[0][0];
      let opponent_name = lobby[0][1];
      let player_name = username;
      let index = lobby.indexOf(opponent_id);
      lobby.splice(index,1);
      let opponent_socket = io.sockets.sockets.get(opponent_id);
      console.log("First Joined's Name: " + opponent_name + " First Joined's Socket Id: " + opponent_id); 
      let players;
      (Math.random() < 0.5) ? players = [opponent_name,player_name] : players = [player_name, opponent_name];
      let newRoom;
      (players[0]===opponent_name) ? newRoom = [opponent_id,socket.id] : newRoom = [socket.id,opponent_id];
      roomPairs[numRooms]={room: newRoom}; 
      roomPairsNames[numRooms]={room: players};
      console.log("roomPairs: " + JSON.stringify(roomPairs)); 
      console.log("roomPairsNames: " + JSON.stringify(roomPairsNames)); 
      console.log("roomPairs[numRooms].room: " + roomPairs[numRooms].room); 
      console.log("roomPairsNames[numRooms].room: " + roomPairsNames[numRooms].room); 
      numRooms++; 
      let roomname = player_name+"_"+opponent_name;
      socket.join(roomname);
      opponent_socket.join(roomname);  
      
      io.in(roomname).emit("StartGame", {time: time, roomname: roomname, players: players}); 
      console.log("players: " + players); 
      console.log("roomname: " + roomname);
      
    }else{
      lobby.push([socket.id,username]);
    }
  }

  socket.on("MadeAMove", function(data){
    for (let i=0; i<roomPairsNames.length; i++){
      if (roomPairsNames[i].room.includes(data["username"])){
        for (let j=0; j<2; j++){
          if (roomPairsNames[i].room[j]!==data["username"]){
            console.log(roomPairs[i].room[j] + " Received a move!")
            console.log(roomPairsNames[i].room[j] + " Received a move!");
            io.to(roomPairs[i].room[j]).emit("OpponentMoved", {startSquare: data["startSquare"], endSquare: data["endSquare"]});
            break; 
          }
        }
      }
    }
  });
  

  socket.on("FetchRecord", function(data){
    let fetch = "SELECT wins, losses FROM users WHERE username = " + mysql.escape(data["username"]);
    connection.query(fetch, function(err, result) {
      if (err) throw err
      console.log("Wins and Losses: " + JSON.stringify(result));  
      socket.emit("ReceiveRecord", {wins: result[0].wins, losses: result[0].losses}); 
    });
  });
});


// _______________________________________________________________________________
http.listen(PORT, function(err){
  if(err){console.log(err)};
  console.log(`Server listening on ${PORT}`);
});
