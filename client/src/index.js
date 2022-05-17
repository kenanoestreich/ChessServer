// Largely serving as my "main" for now until I decide how best to organize all this code

// STARTING POINT FOR ALL THIS CODE WAS THE FOLLOWING TUTORIAL CODE: 
// https://reactjs.org/tutorial/tutorial.html

// Import all-encompassing requirements
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import io from 'socket.io-client';

// Import necessary scripts from MoveScripts/
import displayKnightMoves from './MoveScripts/Knight'
import displayBishopMoves from './MoveScripts/Bishop'

// Import Timer scripts
import Timer from './Timer.js'

// Import Enums
import Enums from './Enums.js'

// Set up Socket.io 
let socket = io("http://ec2-184-73-74-122.compute-1.amazonaws.com:3456/");

// Client's color for online game
let your_color;

// array of roots so we don't get a warning for calling createRoot() multiple times on the same element.
let roots=Array(8848).fill(null); // maximum possible number of moves

// Location of piece clicked for the sake of moving pieces
let pieceClickedRow; 
let pieceClickedCol;

// Define root where Game will be rendered 
const container = document.getElementById("root"); 
const root = createRoot(container);

// Define Square Object and its props
// squareColor is used to track where pieces can move legally
// onClick eventually refers back to handleClick()
// value is the unicode of a piece or null
function Square(props) {
  return (
    <button className={props.squareColor} onClick={props.onClick} id={props.name}>
      {props.value}
    </button>
  );
}

// Board Class 
// 64 Squares of chess board 
class Board extends React.Component {

  // renderSquare() generates the square objects and assigns props based on inputs
  renderSquare(i,j,misc,squares,name) {
    if (misc==null){
      if (((i+j)%2)===1){
        return (
          <Square
            value={squares[i][j]}
            onClick={() => this.props.onClick(i,j,name)}
            squareColor="darksquare"
            name={name}
          />
        );
      }
      else {
        return (
          <Square
            value={squares[i][j]}
            onClick={() => this.props.onClick(i,j,name)}
            squareColor="lightsquare"
            name={name}
          />
        );
      }
    }
    else if (misc==="selected"){
      return (
        <Square
          value={this.props.squares[i][j]}
          onClick={() => this.props.onClick(i,j,name)}
          squareColor="selectedsquare"
          name={name}
        />
      );
    }
    else if (misc==="possible"){
      return (
        <Square
          value={this.props.squares[i][j]}
          onClick={() => this.props.onClick(i,j,name)}
          squareColor="possiblesquare"
          name={name}
        />
      );
    }
    else if (misc==="threatened"){
      return (
        <Square
          value={this.props.squares[i][j]}
          onClick={() => this.props.onClick(i,j,name)}
          squareColor="threatenedsquare"
          name={name}
        />
      );
    }
    else if (misc==="incheck"){
      return (
        <Square
          value={this.props.squares[i][j]}
          onClick={() => this.props.onClick(i,j,name)}
          squareColor="inchecksquare"
          name={name}
        />
      );
    }
  }

  // render function for the board itself
  // renders all 64 squares with their correct options ("threatened", "possible", etc...)
  render() {
    const miscSquares = JSON.parse(JSON.stringify(this.props.miscSquares)); 
    const squares = JSON.parse(JSON.stringify(this.props.squares));
    if (this.props.color==="black"){
      return (
        <div>
          <div className="board-row"> 
            {this.renderSquare(0,0,miscSquares[0][0],squares,"h1")}
            {this.renderSquare(0,1,miscSquares[0][1],squares,"g1")}
            {this.renderSquare(0,2,miscSquares[0][2],squares,"f1")}
            {this.renderSquare(0,3,miscSquares[0][3],squares,"e1")}
            {this.renderSquare(0,4,miscSquares[0][4],squares,"d1")}
            {this.renderSquare(0,5,miscSquares[0][5],squares,"c1")}
            {this.renderSquare(0,6,miscSquares[0][6],squares,"b1")}
            {this.renderSquare(0,7,miscSquares[0][7],squares,"a1")}
          </div>
          <div className="board-row">
            {this.renderSquare(1,0,miscSquares[1][0],squares,"h2")}
            {this.renderSquare(1,1,miscSquares[1][1],squares,"g2")}
            {this.renderSquare(1,2,miscSquares[1][2],squares,"f2")}
            {this.renderSquare(1,3,miscSquares[1][3],squares,"e2")}
            {this.renderSquare(1,4,miscSquares[1][4],squares,"d2")}
            {this.renderSquare(1,5,miscSquares[1][5],squares,"c2")}
            {this.renderSquare(1,6,miscSquares[1][6],squares,"b2")}
            {this.renderSquare(1,7,miscSquares[1][7],squares,"a2")}
          </div>
          <div className="board-row">
            {this.renderSquare(2,0,miscSquares[2][0],squares,"h3")}
            {this.renderSquare(2,1,miscSquares[2][1],squares,"g3")}
            {this.renderSquare(2,2,miscSquares[2][2],squares,"f3")}
            {this.renderSquare(2,3,miscSquares[2][3],squares,"e3")}
            {this.renderSquare(2,4,miscSquares[2][4],squares,"d3")}
            {this.renderSquare(2,5,miscSquares[2][5],squares,"c3")}
            {this.renderSquare(2,6,miscSquares[2][6],squares,"b3")}
            {this.renderSquare(2,7,miscSquares[2][7],squares,"a3")}
          </div>
          <div className="board-row">
            {this.renderSquare(3,0,miscSquares[3][0],squares,"h4")}
            {this.renderSquare(3,1,miscSquares[3][1],squares,"g4")}
            {this.renderSquare(3,2,miscSquares[3][2],squares,"f4")}
            {this.renderSquare(3,3,miscSquares[3][3],squares,"e4")}
            {this.renderSquare(3,4,miscSquares[3][4],squares,"d4")}
            {this.renderSquare(3,5,miscSquares[3][5],squares,"c4")}
            {this.renderSquare(3,6,miscSquares[3][6],squares,"b4")}
            {this.renderSquare(3,7,miscSquares[3][7],squares,"a4")}
          </div>
          <div className="board-row">
            {this.renderSquare(4,0,miscSquares[4][0],squares,"h5")}
            {this.renderSquare(4,1,miscSquares[4][1],squares,"g5")}
            {this.renderSquare(4,2,miscSquares[4][2],squares,"f5")}
            {this.renderSquare(4,3,miscSquares[4][3],squares,"e5")}
            {this.renderSquare(4,4,miscSquares[4][4],squares,"d5")}
            {this.renderSquare(4,5,miscSquares[4][5],squares,"c5")}
            {this.renderSquare(4,6,miscSquares[4][6],squares,"b5")}
            {this.renderSquare(4,7,miscSquares[4][7],squares,"a5")}
          </div>
          <div className="board-row">
            {this.renderSquare(5,0,miscSquares[5][0],squares,"h6")}
            {this.renderSquare(5,1,miscSquares[5][1],squares,"g6")}
            {this.renderSquare(5,2,miscSquares[5][2],squares,"f6")}
            {this.renderSquare(5,3,miscSquares[5][3],squares,"e6")}
            {this.renderSquare(5,4,miscSquares[5][4],squares,"d6")}
            {this.renderSquare(5,5,miscSquares[5][5],squares,"c6")}
            {this.renderSquare(5,6,miscSquares[5][6],squares,"b6")}
            {this.renderSquare(5,7,miscSquares[5][7],squares,"a6")}
          </div>
          <div className="board-row">
            {this.renderSquare(6,0,miscSquares[6][0],squares,"h7")}
            {this.renderSquare(6,1,miscSquares[6][1],squares,"g7")}
            {this.renderSquare(6,2,miscSquares[6][2],squares,"f7")}
            {this.renderSquare(6,3,miscSquares[6][3],squares,"e7")}
            {this.renderSquare(6,4,miscSquares[6][4],squares,"d7")}
            {this.renderSquare(6,5,miscSquares[6][5],squares,"c7")}
            {this.renderSquare(6,6,miscSquares[6][6],squares,"b7")}
            {this.renderSquare(6,7,miscSquares[6][7],squares,"a7")}
          </div>
          <div className="board-row">
            {this.renderSquare(7,0,miscSquares[7][0],squares,"h8")}
            {this.renderSquare(7,1,miscSquares[7][1],squares,"g8")}
            {this.renderSquare(7,2,miscSquares[7][2],squares,"f8")}
            {this.renderSquare(7,3,miscSquares[7][3],squares,"e8")}
            {this.renderSquare(7,4,miscSquares[7][4],squares,"d8")}
            {this.renderSquare(7,5,miscSquares[7][5],squares,"c8")}
            {this.renderSquare(7,6,miscSquares[7][6],squares,"b8")}
            {this.renderSquare(7,7,miscSquares[7][7],squares,"a8")}
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0,0,miscSquares[0][0],squares,"a8")}
            {this.renderSquare(0,1,miscSquares[0][1],squares,"b8")}
            {this.renderSquare(0,2,miscSquares[0][2],squares,"c8")}
            {this.renderSquare(0,3,miscSquares[0][3],squares,"d8")}
            {this.renderSquare(0,4,miscSquares[0][4],squares,"e8")}
            {this.renderSquare(0,5,miscSquares[0][5],squares,"f8")}
            {this.renderSquare(0,6,miscSquares[0][6],squares,"g8")}
            {this.renderSquare(0,7,miscSquares[0][7],squares,"h8")}
          </div>
          <div className="board-row">
            {this.renderSquare(1,0,miscSquares[1][0],squares,"a7")}
            {this.renderSquare(1,1,miscSquares[1][1],squares,"b7")}
            {this.renderSquare(1,2,miscSquares[1][2],squares,"c7")}
            {this.renderSquare(1,3,miscSquares[1][3],squares,"d7")}
            {this.renderSquare(1,4,miscSquares[1][4],squares,"e7")}
            {this.renderSquare(1,5,miscSquares[1][5],squares,"f7")}
            {this.renderSquare(1,6,miscSquares[1][6],squares,"g7")}
            {this.renderSquare(1,7,miscSquares[1][7],squares,"h7")}
          </div>
          <div className="board-row">
            {this.renderSquare(2,0,miscSquares[2][0],squares,"a6")}
            {this.renderSquare(2,1,miscSquares[2][1],squares,"b6")}
            {this.renderSquare(2,2,miscSquares[2][2],squares,"c6")}
            {this.renderSquare(2,3,miscSquares[2][3],squares,"d6")}
            {this.renderSquare(2,4,miscSquares[2][4],squares,"e6")}
            {this.renderSquare(2,5,miscSquares[2][5],squares,"f6")}
            {this.renderSquare(2,6,miscSquares[2][6],squares,"g6")}
            {this.renderSquare(2,7,miscSquares[2][7],squares,"h6")}
          </div>
          <div className="board-row">
            {this.renderSquare(3,0,miscSquares[3][0],squares,"a5")}
            {this.renderSquare(3,1,miscSquares[3][1],squares,"b5")}
            {this.renderSquare(3,2,miscSquares[3][2],squares,"c5")}
            {this.renderSquare(3,3,miscSquares[3][3],squares,"d5")}
            {this.renderSquare(3,4,miscSquares[3][4],squares,"e5")}
            {this.renderSquare(3,5,miscSquares[3][5],squares,"f5")}
            {this.renderSquare(3,6,miscSquares[3][6],squares,"g5")}
            {this.renderSquare(3,7,miscSquares[3][7],squares,"h5")}
          </div>
          <div className="board-row">
            {this.renderSquare(4,0,miscSquares[4][0],squares,"a4")}
            {this.renderSquare(4,1,miscSquares[4][1],squares,"b4")}
            {this.renderSquare(4,2,miscSquares[4][2],squares,"c4")}
            {this.renderSquare(4,3,miscSquares[4][3],squares,"d4")}
            {this.renderSquare(4,4,miscSquares[4][4],squares,"e4")}
            {this.renderSquare(4,5,miscSquares[4][5],squares,"f4")}
            {this.renderSquare(4,6,miscSquares[4][6],squares,"g4")}
            {this.renderSquare(4,7,miscSquares[4][7],squares,"h4")}
          </div>
          <div className="board-row">
            {this.renderSquare(5,0,miscSquares[5][0],squares,"a3")}
            {this.renderSquare(5,1,miscSquares[5][1],squares,"b3")}
            {this.renderSquare(5,2,miscSquares[5][2],squares,"c3")}
            {this.renderSquare(5,3,miscSquares[5][3],squares,"d3")}
            {this.renderSquare(5,4,miscSquares[5][4],squares,"e3")}
            {this.renderSquare(5,5,miscSquares[5][5],squares,"f3")}
            {this.renderSquare(5,6,miscSquares[5][6],squares,"g3")}
            {this.renderSquare(5,7,miscSquares[5][7],squares,"h3")}
          </div>
          <div className="board-row">
            {this.renderSquare(6,0,miscSquares[6][0],squares,"a2")}
            {this.renderSquare(6,1,miscSquares[6][1],squares,"b2")}
            {this.renderSquare(6,2,miscSquares[6][2],squares,"c2")}
            {this.renderSquare(6,3,miscSquares[6][3],squares,"d2")}
            {this.renderSquare(6,4,miscSquares[6][4],squares,"e2")}
            {this.renderSquare(6,5,miscSquares[6][5],squares,"f2")}
            {this.renderSquare(6,6,miscSquares[6][6],squares,"g2")}
            {this.renderSquare(6,7,miscSquares[6][7],squares,"h2")}
          </div>
          <div className="board-row">
            {this.renderSquare(7,0,miscSquares[7][0],squares,"a1")}
            {this.renderSquare(7,1,miscSquares[7][1],squares,"b1")}
            {this.renderSquare(7,2,miscSquares[7][2],squares,"c1")}
            {this.renderSquare(7,3,miscSquares[7][3],squares,"d1")}
            {this.renderSquare(7,4,miscSquares[7][4],squares,"e1")}
            {this.renderSquare(7,5,miscSquares[7][5],squares,"f1")}
            {this.renderSquare(7,6,miscSquares[7][6],squares,"g1")}
            {this.renderSquare(7,7,miscSquares[7][7],squares,"h1")}
          </div>
        </div>
      );
    }
  }
}

// Game Class; Contains state variables for history, stepNumber (move #), 
// miscSquares (strings of "threatened", "possible", etc...), whitesTurn (is it White's turn?), 
// list of black's and white's lost pieces
class Game extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.color==="black"){
      this.state = {
        history: [
          {
            // make starting board; no longer okay to hardcode this
            squares: [[Enums.whiteRook,Enums.whiteKnight,Enums.whiteBishop,Enums.whiteKing,Enums.whiteQueen,Enums.whiteBishop,Enums.whiteKnight,Enums.whiteRook],
            [Enums.whitePawn,Enums.whitePawn,Enums.whitePawn,Enums.whitePawn,Enums.whitePawn,Enums.whitePawn,Enums.whitePawn,Enums.whitePawn],
            [null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],
            [Enums.blackPawn,Enums.blackPawn,Enums.blackPawn,Enums.blackPawn,Enums.blackPawn,Enums.blackPawn,Enums.blackPawn,Enums.blackPawn],
            [Enums.blackRook,Enums.blackKnight,Enums.blackBishop,Enums.blackKing,Enums.blackQueen,Enums.blackBishop,Enums.blackKnight,Enums.blackRook]],

            move: "Game Start"
          }
        ],
        squareNames: [["h1","g1","f1","e1","d1","c1","b1","a1"],
        ["h2","g2","f2","e2","d2","c2","b2","a2"],["h3","g3","f3","e3","d3","c3","b3","a3"],
        ["h4","g4","f4","e4","d4","c4","b4","a4"],["h5","g5","f5","e5","d5","c5","b5","a5"],
        ["h6","g6","f6","e6","d6","c6","b6","a6"],["h7","g7","f7","e7","d7","c7","b7","a7"],
        ["h8","g8","f8","e8","d8","c8","b8","a8"]],
        miscSquares: Array(8).fill(null).map(()=>Array(8).fill(null)),
        stepNumber: 0,
        whitesTurn: true,
        takenPieces: {black: Array(0), white: Array(0)},
        color: this.props.color,
        myTurn: false, 
        myTime: this.props.startTime,
        theirTime: this.props.startTime
      }
    }
    else {
      this.state = {
        history: [
          {
            // make starting board; no longer okay to hardcode this
            squares: [[Enums.blackRook,Enums.blackKnight,Enums.blackBishop,Enums.blackQueen,Enums.blackKing,Enums.blackBishop,Enums.blackKnight,Enums.blackRook],
            [Enums.blackPawn,Enums.blackPawn,Enums.blackPawn,Enums.blackPawn,Enums.blackPawn,Enums.blackPawn,Enums.blackPawn,Enums.blackPawn],
            [null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],
            [Enums.whitePawn,Enums.whitePawn,Enums.whitePawn,Enums.whitePawn,Enums.whitePawn,Enums.whitePawn,Enums.whitePawn,Enums.whitePawn],
            [Enums.whiteRook,Enums.whiteKnight,Enums.whiteBishop,Enums.whiteQueen,Enums.whiteKing,Enums.whiteBishop,Enums.whiteKnight,Enums.whiteRook]],

            move: "Game Start"
          }
        ],
        squareNames: [["a8","b8","c8","d8","e8","f8","g8","h8"],
        ["a7","b7","c7","d7","e7","f7","g7","h7"],["a6","b6","c6","d6","e6","f6","g6","h6"],
        ["a5","b5","c5","d5","e5","f5","g5","h5"],["a4","b4","c4","d4","e4","f4","g4","h4"],
        ["a3","b3","c3","d3","e3","f3","g3","h3"],["a2","b2","c2","d2","e2","f2","g2","h2"],
        ["a1","b1","c1","d1","e1","f1","g1","h1"]],
        miscSquares: Array(8).fill(null).map(()=>Array(8).fill(null)),
        stepNumber: 0,
        whitesTurn: true,
        takenPieces: {black: Array(0), white: Array(0)},
        color: this.props.color,
        myTurn: true, 
        myTime: this.props.startTime,
        theirTime: this.props.startTime
      };
    }
  }

  componentDidMount(){
    socket.on("OpponentMoved", (data) => this.opponentMoved(data["startSquare"],data["endSquare"]));
  }

  finishGame(result){
    socket.emit(result,{username: sessionStorage.getItem("currentUser")}); // either "WonGame" or "LostGame"
    setTimeout((function(){
      socket.emit("FetchRecord", {username: sessionStorage.getItem("currentUser")});
      socket.on("ReceiveRecord", function(data){
        console.log(JSON.stringify(data));  
        root.render(
          <div>
            <LobbyPage 
              wins={data["wins"]} 
              losses={data["losses"]}
            />
            <br></br>
            <h2>Practice While You Wait</h2> 
            <Game color="both"/>
          </div>
        );
      });
    }),300);
  }

  // Only used for multiplayer games
  opponentMoved(startSquare, endSquare){
    let history=JSON.parse(JSON.stringify(this.state.history)); 
    let squareNames=JSON.parse(JSON.stringify(this.state.squareNames));
    let squares=JSON.parse(JSON.stringify(history[history.length-1].squares)); 
    let playerColor=this.state.color; 
    let newTakenPieces=JSON.parse(JSON.stringify(this.state.takenPieces)); 
    let endpiece;
    let startpiece; 
    let endname;
    let startname; 
    let movename; 
    let endrow; 
    let endcol;
    let startrow;
    let startcol; 
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if (squareNames[i][j]===endSquare){
          endpiece=squares[i][j]; 
          endname=squareNames[i][j];
          endrow=i;
          endcol=j; 
        }
        if (squareNames[i][j]===startSquare){
          startpiece=squares[i][j]; 
          startname=squareNames[i][j];
          startrow=i;
          startcol=j;
        }
      }
    }
    // a piece was taken
    if (endpiece!==null){
      if (blackPieces.includes(endpiece)){
        newTakenPieces.black.push(endpiece);
      }
      else if (whitePieces.includes(endpiece)){
        newTakenPieces.white.push(endpiece);
      }
      // find out which piece was clicked for naming the move
      if ((startpiece===Enums.blackKing)||(startpiece===Enums.whiteKing)){
        movename="Kx"+endname; 
      }
      else if ((startpiece===Enums.blackBishop)||(startpiece===Enums.whiteBishop)){
        movename="Bx"+endname; 
      }
      else if ((startpiece===Enums.blackKnight)||(startpiece===Enums.whiteKnight)){
        movename="Nx"+endname; 
      }
      else if ((startpiece===Enums.blackQueen)||(startpiece===Enums.whiteQueen)){
        movename="Qx"+endname; 
      }
      else if ((startpiece===Enums.blackRook)||(startpiece===Enums.whiteRook)){
        movename="Rx"+endname; 
      }
      else if ((startpiece===Enums.blackPawn)||(startpiece===Enums.whitePawn)){
        movename=startname;
        movename=movename.charAt(0)+"x"+endname; 
      }
    }
    // no piece was taken
    else {
      // find out which piece was clicked for naming the move
      if ((startpiece===Enums.blackKing)||(startpiece===Enums.whiteKing)){
        movename="K"+endname;
      }
      else if ((startpiece===Enums.blackBishop)||(startpiece===Enums.whiteBishop)){
        movename="B"+endname;
      }
      else if ((startpiece===Enums.blackKnight)||(startpiece===Enums.whiteKnight)){
        movename="N"+endname;
      }
      else if ((startpiece===Enums.blackQueen)||(startpiece===Enums.whiteQueen)){
        movename="Q"+endname;
      }
      else if ((startpiece===Enums.blackRook)||(startpiece===Enums.whiteRook)){
        movename="R"+endname;
      }
      else if ((startpiece===Enums.blackPawn)||(startpiece===Enums.whitePawn)){
        movename=endname;
      }
    }
    // generate a new board with the piece moved 
    let newSquares = movePiece(endrow,endcol,startrow,startcol,squares)

    // if our king is in check, display that on the board
    if (isKingCurrentlyInCheck(playerColor,newSquares,playerColor)){ 
      
      movename=movename+"+";
      // add the new board state to history
      history.push({squares: newSquares, move: movename});

      // reset square color labels
      let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null))

      for (let i=0; i<8; i++){
        for (let j=0; j<8; j++){
          if (((playerColor==="white") && newSquares[i][j]===Enums.whiteKing) ||
              ((playerColor==="black") && newSquares[i][j]===Enums.blackKing)){
            miscSquares[i][j]="incheck";
          }
        }
      }
      let newTurn = !this.state.whitesTurn;
      let newStep = this.state.stepNumber;
      newStep++;
      this.setState({
        history: history,
        whitesTurn: newTurn,
        stepNumber: newStep,
        miscSquares: miscSquares,
        takenPieces: newTakenPieces
      }); 
      return; 
    }
    else {
      // add the new board state to history
      history.push({squares: newSquares, move: movename});

      // reset square color labels
      let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
      let newTurn=!this.state.whitesTurn; 
      let newStep=this.state.stepNumber;
      newStep++;
      this.setState({
        history: history,
        whitesTurn: newTurn,
        stepNumber: newStep,
        miscSquares: miscSquares,
        takenPieces: newTakenPieces
      }) 
      return; 
    }
  }

  // Function to respond to clicking a square element
  handleClick(i,j,name) {
    let history = JSON.parse(JSON.stringify(this.state.history));
    const current = history[this.state.stepNumber];
    let newSquares = JSON.parse(JSON.stringify(current.squares));
    let newMiscSquares = JSON.parse(JSON.stringify(this.state.miscSquares));
    let newStep = this.state.stepNumber; 
    newStep++; 
    let newTurn = this.state.whitesTurn; 
    newTurn = !newTurn; 
    let newTakenPieces = JSON.parse(JSON.stringify(this.state.takenPieces)); 
    let whitesTurn = this.state.whitesTurn; 
    let playerColor = this.state.color; 
    let squareNames = JSON.parse(JSON.stringify(this.state.squareNames)); 
    console.log(name); 
    let movename; 

    // If not at the most recent move, move to the most recent move
    if (this.state.stepNumber!==history.length-1){
      this.jumpTo(history.length-1);
      return;
    }

    if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
      let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null)); 
      for (let i=0; i<8; i++){
        for (let j=0; j<8; j++){
          if (newSquares[i][j]===Enums.whiteKing){
            miscSquares[i][j]="incheck"
          }
        }
      }
      this.setState({
        miscSquares: miscSquares
      });
    }
    else if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
      let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null)); 
      for (let i=0; i<8; i++){
        for (let j=0; j<8; j++){
          if (newSquares[i][j]===Enums.blackKing){
            miscSquares[i][j]="incheck"
          }
        }
      }
      this.setState({
        miscSquares: miscSquares
      });
    }
   
    // If the game is Drawn By Insufficient Material, don't respond to clicks. 
    if (document.getElementById("status").innerHTML==="Game Drawn By Insufficient Material"){
      console.log("Drawn By Insufficient Material")
      return;
    }

    let pawnColor = (this.state.color !== "both") ? this.state.color : "white"; 
    // If the game is Drawn by Stalemate or done by Checkmate, don't respond to clicks. 
    if (isCheckmate("white",newSquares,pawnColor)||isStalemate("white", newSquares,pawnColor)||(isCheckmate("black",newSquares,pawnColor)||isStalemate("black",newSquares,pawnColor))){
      console.log("Checkmate or Stalemate")
      return; 
    }
    
    // if the piece is taking another piece, we need to update the list of taken pieces
    if (newMiscSquares[i][j]==="threatened"){
      let takenPiece = newSquares[i][j];
      if (playerColor==="white"){
        newTakenPieces.black.push(takenPiece);
        this.setState({
          takenPieces: newTakenPieces
        })
      }
      else if (playerColor==="black"){
        newTakenPieces.white.push(takenPiece);
        this.setState({
          takenPieces: newTakenPieces
        })
      }
    }

    // Everything below here should only occur if it's the current player's turn (or single player):
    if ((playerColor==="white" && whitesTurn) ||
        (playerColor==="black" && !whitesTurn) || 
        (playerColor==="both")){
      
        // If the clicked square was highlighted as "threatened" (light red) or "possible" (light yellow),
        // then we know the last piece we clicked can move there. The square wouldn't be highlighted if it 
        // resulted in check, or if a blank square has been clicked since.

        // We need to send the move to the socket in this case. 
      if (newMiscSquares[i][j]==="threatened" || newMiscSquares[i][j]==="possible"){
 
        if (newMiscSquares[i][j]==="threatened"){
          // find out which piece was clicked for naming the move
          if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackKing)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whiteKing)){
            movename="Kx"+this.state.squareNames[i][j];
          }
          else if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackBishop)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whiteBishop)){
            movename="Bx"+this.state.squareNames[i][j];
          }
          else if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackKnight)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whiteKnight)){
            movename="Nx"+this.state.squareNames[i][j];
          }
          else if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackQueen)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whiteQueen)){
            movename="Qx"+this.state.squareNames[i][j];
          }
          else if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackRook)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whiteRook)){
            movename="Rx"+this.state.squareNames[i][j];
          }
          else if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackPawn)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whitePawn)){
            movename=this.state.squareNames[pieceClickedRow][pieceClickedCol];
            movename=movename.charAt(0)+"x"+this.state.squareNames[i][j];
          }
        }

        if (newMiscSquares[i][j]==="possible"){
          // find out which piece was clicked for naming the move
          if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackKing)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whiteKing)){
            movename="K"+this.state.squareNames[i][j];
          }
          else if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackBishop)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whiteBishop)){
            movename="B"+this.state.squareNames[i][j];
          }
          else if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackKnight)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whiteKnight)){
            movename="N"+this.state.squareNames[i][j];
          }
          else if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackQueen)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whiteQueen)){
            movename="Q"+this.state.squareNames[i][j];
          }
          else if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackRook)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whiteRook)){
            movename="R"+this.state.squareNames[i][j];
          }
          else if ((newSquares[pieceClickedRow][pieceClickedCol]===Enums.blackPawn)||(newSquares[pieceClickedRow][pieceClickedCol]===Enums.whitePawn)){
            movename=this.state.squareNames[i][j];
          }
        }

        // generate a new board with the piece moved 
        newSquares = movePiece(i,j,pieceClickedRow,pieceClickedCol,newSquares)
        let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
        let opponentColor = (playerColor==="white" || ((playerColor==="both")&&whitesTurn)) ? "black" : "white"; 
        // if the opponent's king is in check, display that on the board
        if (isKingCurrentlyInCheck(opponentColor,newSquares,playerColor)){ 
          
          movename=movename+"+";
          // add the new board state to history
          history.push({squares: newSquares, move: movename});

          // reset square color labels
          miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null))

          for (let i=0; i<8; i++){
            for (let j=0; j<8; j++){
              if ((whitesTurn && newSquares[i][j]===Enums.blackKing) ||
                  (!whitesTurn && newSquares[i][j]===Enums.whiteKing)){
                miscSquares[i][j]="incheck"
              }
            }
          }
        }
        else {
          miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null)); 
          history.push({squares: newSquares, move: movename});
        }
        if (playerColor!=="both"){
          console.log("Player " + playerColor + " played " + movename);
          socket.emit("MadeAMove", {username: sessionStorage.getItem("currentUser"), startSquare: squareNames[pieceClickedRow][pieceClickedCol], endSquare: squareNames[i][j]});
          // document.getElementById("timers").firstChild.switch();
          // document.getElementById("timers").children[1].switch();
        }
        this.setState({
          history: history,
          whitesTurn: newTurn,
          stepNumber: newStep,
          miscSquares: miscSquares,
        })

        return; 
      }

      else if ((blackPieces.includes(newSquares[i][j])&&((playerColor==="black")||(playerColor==="both"&&!whitesTurn)))||
        (whitePieces.includes(newSquares[i][j])&&((playerColor==="white")||(playerColor==="both"&&whitesTurn)))){
        // All the following sections refer to clicking one of the current player's pieces on their turn. 
        // The square labels should be updated in this case, but nothing should be moved. 
        let tempColor = (this.state.color!=="both") ? this.state.color : "white"; 
        let miscSquares = findPieceAndDisplay(i,j,whitesTurn,tempColor,newSquares); 
        if (miscSquares!==null){
          this.setState({
            miscSquares: miscSquares
          }); 

          // remember this piece's location in case they take a piece with it. 
          pieceClickedRow = i; 
          pieceClickedCol = j; 
          return; 
        }
      }
      
    
      // reset possible moves highlights if the square clicked is labeled null
      else if (newSquares[i][j]===null){ 
        if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
          let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null)); 
          for (let i=0; i<8; i++){
            for (let j=0; j<8; j++){
              if (newSquares[i][j]===Enums.whiteKing){
                miscSquares[i][j]="incheck"
              }
            }
          }
          this.setState({
            miscSquares: miscSquares
          });
        }
        else if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
          let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null)); 
          for (let i=0; i<8; i++){
            for (let j=0; j<8; j++){
              if (newSquares[i][j]===Enums.blackKing){
                miscSquares[i][j]="incheck"
              }
            }
          }
          this.setState({
            miscSquares: miscSquares
          });
        }
        else{
          let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null)); 
          this.setState({
            miscSquares: miscSquares
          });
        }
        
        pieceClickedRow = null; 
        pieceClickedCol = null; 
        return; 
      }
    }
  }

  // function bound to history buttons
  jumpTo(step) {
    let history = JSON.parse(JSON.stringify(this.state.history));
    const current = history[step];
    let newSquares = JSON.parse(JSON.stringify(current.squares));
    let color;
    color = (color!=="both") ? this.state.color : "white";
    let opponentColor = (color==="white") ? "black" : "white";
    //check if either king is in check and highlight if so 
    if (step===this.state.history.length-1){
      if (isKingCurrentlyInCheck(color,newSquares,color)){
        let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null)); 
        for (let i=0; i<8; i++){
          for (let j=0; j<8; j++){
            if (((color==="both"||color==="white") && newSquares[i][j]===Enums.whiteKing) ||
                ((color==="both"||color==="black") && newSquares[i][j]===Enums.blackKing)){
              miscSquares[i][j]="incheck"
            }
          }
        }
        this.setState({
          stepNumber: step,
          whitesTurn: (step % 2) === 0,
          miscSquares: miscSquares
        });
      }
      else if (isKingCurrentlyInCheck(opponentColor,newSquares,color)){
        let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
        for (let i=0; i<8; i++){
          for (let j=0; j<8; j++){
            if (((color==="both"||color==="white") && newSquares[i][j]===Enums.blackKing) ||
                ((color==="both"||color==="black") && newSquares[i][j]===Enums.whiteKing)){
              miscSquares[i][j]="incheck"
            }
          }
        }
        this.setState({
          stepNumber: step,
          whitesTurn: (step % 2) === 0,
          miscSquares: miscSquares
        });
      }
    }
    else {
      let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
      this.setState({
        stepNumber: step,
        whitesTurn: (step % 2) === 0,
        miscSquares: miscSquares
      });
    }
  }

  render() {
    const history = JSON.parse(JSON.stringify(this.state.history));
    const current = history[this.state.stepNumber];
    const newMiscSquares = JSON.parse(JSON.stringify(this.state.miscSquares));
    const newSquares = current.squares;
    const moves = history.map((step, move) => {
      if (move!==0){
        if (move%2===1) { //white's move most recent
          const desc = history[move].move;
          if (document.getElementById({move})===null){
            return (
              <li id={move} key={move}>
                <span><button onClick={() => this.jumpTo(move)}>{desc}</button></span>
              </li>
            );
          }
        }
        // If I have time, fix this warning. Don't call render() within render()
        else if (move%2===0) {
          const desc = history[move].move;
          if (roots[move]===null){
            roots[move] = createRoot(document.getElementById(move-1));
          }
          roots[move].render(<span><button onClick={() => this.jumpTo(move-1)}>{history[move-1].move}</button>
          <button onClick={() => this.jumpTo(move)}>{desc}</button></span>)
        }
      }
      else{
        return (
          <div id="start" key="start">
            <button onClick={() => this.jumpTo(move)}>{history[move].move}</button>
          </div>
        );
      }
    });


    let blackTakenPieces=this.state.takenPieces.black;
    let whiteTakenPieces=this.state.takenPieces.white;
    // define counts for insufficient material check
    let whiteCount = 0;
    let blackCount = 0; 
    whiteTakenPieces.forEach(element => {
      if (element===Enums.whiteQueen || element===Enums.whiteRook || element===Enums.whitePawn){
        whiteCount++; 
      }
    }); 
    blackTakenPieces.forEach(element => {
      if (element===Enums.blackQueen || element===Enums.blackRook || element===Enums.blackPawn){
        blackCount++; 
      }
    }); 

    let finishButton;  
    let status; 
    let myColor = (this.state.color!=="both") ? this.state.color : "white";
    let opponentColor = (myColor==="white") ? "black" : "white"; 
    if (isCheckmate(myColor,current.squares,myColor)){
      status = ((myColor==="white") ? "Black" : "White") + " Won By Checkmate!";
      finishButton = ["LostGame"].map(()=>{
        return(
          <button onClick={()=>this.finishGame("LostGame")}>Return To Lobby</button>
        );
      }); 
    }
    else if (isCheckmate(opponentColor, current.squares,myColor)){
      status = ((myColor==="white") ? "White" : "Black") + " Won By Checkmate!";
      finishButton = ["WonGame"].map(()=>{
        return(
          <button onClick={()=>this.finishGame("WonGame")}>Return To Lobby</button>
        );
      }); 
    }
    else if (isStalemate(myColor, current.squares,myColor)){
      status = "Game Drawn By Stalemate";
    }
    else if (isStalemate(opponentColor, current.squares, myColor)){
      status = "Game Drawn By Stalemate"; 
    }
    else if (whiteTakenPieces.length>=14 && blackTakenPieces.length>=14){
      if (blackCount===11 && whiteCount===11){
        status = "Game Drawn By Insufficient Material"; 
      }
    }
    else {
      status = (this.state.whitesTurn ? "White's Turn" : "Black's Turn");
    }
    
    if (this.state.color!=="both"){
      return (
        <div className="game">
          <div id="timers">
            Your Time
            <Timer id="myTimer" time={this.state.myTime} isActive={this.state.myTurn} />
            Opponent's Time
            <Timer id="theirTimer" time={this.state.theirTime} isActive={!this.state.myTurn}/>
          </div>
          <div className="game-board">
            <Board
              squares={newSquares}
              onClick={(i,j,name) => this.handleClick(i,j,name)}
              miscSquares={newMiscSquares}
              color={this.state.color}
            />
          </div>
          <div className="game-info">
            <div id="login">{sessionStorage.getItem("currentUser")}</div>
            <div id="status">{status}</div>
            <div>{finishButton}</div>
            <br></br>
            <div>Taken White Pieces: {whiteTakenPieces}</div>
            <div>Taken Black Pieces: {blackTakenPieces}</div>
            <br></br>
            <ol>{moves}</ol>
  
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={newSquares}
              onClick={(i,j,name) => this.handleClick(i,j,name)}
              miscSquares={newMiscSquares}
              color={this.state.color}
            />
          </div>
          <div className="game-info">
            <div id="login">{sessionStorage.getItem("currentUser")}</div>
            <div id="status">{status}</div>
            <div>{finishButton}</div>
            <br></br>
            <div>Taken White Pieces: {whiteTakenPieces}</div>
            <div>Taken Black Pieces: {blackTakenPieces}</div>
            <br></br>
            <ol>{moves}</ol>
  
          </div>
        </div>
      );
    }
    
  }
}

class LobbyPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      status : null,
    }
  }
  componentDidMount(){
    socket.on("StartGame", function(data){
      console.log("Joined Room: " + data["roomname"]);
      console.log(data["players"]);
      let iStart; 
      if(data["players"].indexOf(sessionStorage.getItem("currentUser"))===0){
        your_color = "white";
        iStart = true;
      }else{
        your_color = "black";
        iStart = false; 
      }
      console.log(your_color);
      let time = data["time"];
      console.log("Time Control: " + data["time"]);  
      if (time===1){
        root.render(
          <div>
            <Game 
              color={your_color} startTime={time*60}
            />
          </div>
        );
      }
      else if (time===5){
        root.render(
          <div>
            <Game 
              color={your_color} startTime={time*60}
            />
          </div>
        );
      }
      else if (time===10){
        root.render(
          <div>
            <Game 
              color={your_color} startTime={time*60}
            />
          </div>
        );
      }
      else if (time===30){
        root.render(
          <div>
            <Game 
              color={your_color} startTime={time*60}
            />
          </div>
        );
      }
    });

  }
  

  joinLobby(time){
    socket.emit("JoinLobby", {TimeControl: time, username: sessionStorage.getItem("currentUser")});
    this.setState({
      status : "Waiting..."
    })
  }

  render(){
    let wins = this.props.wins;
    let losses = this.props.losses; 
    let percentage; 
    let status = this.state.status; 
    if (losses===0){
      if (wins>0){
        percentage = 100 + "%"; 
      }
      else{
        percentage = "No Games Played";
      }
    }
    else {
      percentage = Math.round((wins/(wins+losses))*100) + "%";
    }
    return (
      <div>
        <h1>Welcome {sessionStorage.getItem("currentUser")}!</h1>
        <span>All Time Wins: {wins}</span>
        <br></br>
        <span>All Time Losses: {losses}</span>
        <br></br>
        <span>Win Percentage: {percentage}</span>
        <br></br>
        <br></br>
        <h1>Join a Lobby</h1>
        <span><button id = "1Min" onClick={()=>this.joinLobby(1)}>1 Minute ⁍</button>
        <button id="5Min" onClick={()=>this.joinLobby(5)}>5 Minute 🗲</button>
        <button id="10Min" onClick={()=>this.joinLobby(10)}>10 Minute 👤</button>
        <button id="30Min" onClick={()=>this.joinLobby(30)}>30 Minute 🐢</button>
        </span>
        <h3>{status}</h3>  
      </div>
    )
  }
}

class LoginForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    LoginError: ""
    }
  }

  componentDidMount(){
    socket.on("LoginSuccess", () => this.loggedIn());
    socket.on("LoginFailure", () => this.loginFailure());
    socket.on("UserAlreadyExists", ()=>this.usernameTaken());
  }

  loggedIn() {
    let tryusername = document.getElementById("username").value; 
    sessionStorage.setItem("currentUser",tryusername);
    console.log(tryusername + " Successfully Logged In!")
    this.render(); 
  }

  loginFailure(){
    console.log("Log in attempt FAILED!!!")
    this.setState({
      LoginError: "Incorrect Username/Password"
    })
  }
  attemptLogin(){
    let tryusername = document.getElementById("username").value; 
    let trypassword = document.getElementById("password").value; 
    socket.emit("LoginAttempt", {username: tryusername, password: trypassword});
    
  }

  register(){
    let tryusername = document.getElementById("username").value; 
    let trypassword = document.getElementById("password").value; 
    socket.emit("RegisterUser", {username: tryusername, password: trypassword});
  }

  usernameTaken(){
    this.setState({
      LoginError: "Username Taken"
    })
  }

  render(){
    if(sessionStorage.getItem("currentUser")===null){
        return(
          <div>
            <h1>Login</h1>
              <h2>
                Enter Username: <br></br><input type = "text" id = "username"></input> <br></br><br></br>
                Enter Password: <br></br><input type = "password" id = "password"></input>
              </h2>
                <div id="LogInError"><br></br>{this.state.LoginError}</div><br></br>
                <button id = "login_btn" onClick={()=>this.attemptLogin()}>Log In</button>
                <br></br><br></br>Don't have an account? <button id="signup_btn" onClick={() =>this.register()}>Sign Up!</button>
          </div>
      );
    }else{
      socket.emit("FetchRecord", {username: sessionStorage.getItem("currentUser")});
      socket.on("ReceiveRecord", function(data){
        console.log(JSON.stringify(data));  
        root.render(
          <div>
            <LobbyPage 
              wins={data["wins"]} 
              losses={data["losses"]}
            />
            <br></br>
            <h2>Practice While You Wait</h2> 
            <Game color="both"/>
          </div>
        );
      });
    }
  }
}

// ========================================

// If they refresh
if(sessionStorage.getItem("currentUser") !== null){
  socket.emit("FetchRecord", {username: sessionStorage.getItem("currentUser")});
  socket.on("ReceiveRecord", function(data){
    console.log(JSON.stringify(data));  
    root.render(
      <div>
        <LobbyPage 
          wins={data["wins"]} 
          losses={data["losses"]}
        />
        <br></br>
        <h2>Practice While You Wait</h2> 
        <Game color="both"/>
      </div>
    ); 
  });
}else{
  root.render(<LoginForm />);
} 

// Pawns
function displayPawnMoves(currentPieceRow, currentPieceCol, whitesTurn, playerColor, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  let newSquares;
  let squares_copy;
  playerColor = (playerColor==="both" || playerColor==="white") ? "white" : "black"; 
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.blackPawn) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.whitePawn)){
    return miscSquares; 
  }

  // if the board orientation has white on bottom, we can reuse everything. Needs to be flipped otherwise. 
  if (playerColor==="white"){
    // white pawn hasn't moved yet
    if (whitesTurn && currentPieceRow===6) {
      if (squares[currentPieceRow-1][currentPieceCol]===null){
        miscSquares[currentPieceRow-1][currentPieceCol]="possible";
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow-1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(playerColor,newSquares,playerColor)){
          miscSquares[currentPieceRow-1][currentPieceCol]=null; 
        } 
        if (squares[currentPieceRow-2][currentPieceCol]===null){
          miscSquares[currentPieceRow-2][currentPieceCol]="possible"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow-2,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck(playerColor,newSquares,playerColor)){
            miscSquares[currentPieceRow-2][currentPieceCol]=null; 
          }
        }
      }
      if ((currentPieceCol-1)>=0){
        if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
          miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow-1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck(playerColor,newSquares,playerColor)){
            miscSquares[currentPieceRow-1][currentPieceCol-1]=null; 
          }
        }
      }
      if ((currentPieceCol+1)<8){
        if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
          miscSquares[currentPieceRow-1][currentPieceCol+1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow-1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck(playerColor,newSquares,playerColor)){
            miscSquares[currentPieceRow-1][currentPieceCol+1]=null; 
          }
        }
      } 
    }

    // black pawn hasn't moved yet
    if (!whitesTurn && currentPieceRow===1) {
      if (squares[currentPieceRow+1][currentPieceCol]===null){
        miscSquares[currentPieceRow+1][currentPieceCol]="possible"
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow+1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
          miscSquares[currentPieceRow+1][currentPieceCol]=null; 
        } 
        if (squares[currentPieceRow+2][currentPieceCol]===null){
          miscSquares[currentPieceRow+2][currentPieceCol]="possible"; 
          let squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow+2,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
            miscSquares[currentPieceRow+2][currentPieceCol]=null; 
          }
        }
      }
      if ((currentPieceCol-1)>=0){
        if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
          miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow+1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
            miscSquares[currentPieceRow+1][currentPieceCol]=null; 
          }
        }
      }
      if ((currentPieceCol+1)<8){
        if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
          miscSquares[currentPieceRow+1][currentPieceCol+1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow+1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
            miscSquares[currentPieceRow+1][currentPieceCol+1]=null; 
          }
        }
      }
    }

    // white pawn has moved
    if (whitesTurn && currentPieceRow!==6) {
      if (squares[currentPieceRow-1][currentPieceCol]===null){
        miscSquares[currentPieceRow-1][currentPieceCol]="possible"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow-1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
          miscSquares[currentPieceRow-1][currentPieceCol]=null; 
        }
      }
      if ((currentPieceCol-1)>=0){
        if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
          miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow-1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
            miscSquares[currentPieceRow-1][currentPieceCol-1]=null; 
          }
        }
      }
      if ((currentPieceCol+1)<8){
        if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
          miscSquares[currentPieceRow-1][currentPieceCol+1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow-1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
            miscSquares[currentPieceRow-1][currentPieceCol+1]=null; 
          }
        }
      }
    }

    // black pawn has moved
    if (!whitesTurn && currentPieceRow!==1) {
      if (squares[currentPieceRow+1][currentPieceCol]===null){
        miscSquares[currentPieceRow+1][currentPieceCol]="possible"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow+1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
          miscSquares[currentPieceRow+1][currentPieceCol]=null; 
        }
      }
      if ((currentPieceCol-1)>=0){
        if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
          miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow+1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
            miscSquares[currentPieceRow+1][currentPieceCol-1]=null; 
          }
        }
      }
      if ((currentPieceCol+1)<8){
        if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
          miscSquares[currentPieceRow+1][currentPieceCol+1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow+1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
            miscSquares[currentPieceRow+1][currentPieceCol+1]=null; 
          }
        }
      }
    }
    miscSquares[currentPieceRow][currentPieceCol]="selected";
    return miscSquares; 
  }
  else if (playerColor==="black"){
    // black pawn hasn't moved yet
    if (!whitesTurn && currentPieceRow===6) {
      if (squares[currentPieceRow-1][currentPieceCol]===null){
        miscSquares[currentPieceRow-1][currentPieceCol]="possible";
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow-1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
          miscSquares[currentPieceRow-1][currentPieceCol]=null; 
        } 
        if (squares[currentPieceRow-2][currentPieceCol]===null){
          miscSquares[currentPieceRow-2][currentPieceCol]="possible"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow-2,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
            miscSquares[currentPieceRow-2][currentPieceCol]=null; 
          }
        }
      }
      if ((currentPieceCol-1)>=0){
        if (whitePieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
          miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow-1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
            miscSquares[currentPieceRow-1][currentPieceCol-1]=null; 
          }
        }
      }
      if ((currentPieceCol+1)<8){
        if (whitePieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
          miscSquares[currentPieceRow-1][currentPieceCol+1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow-1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
            miscSquares[currentPieceRow-1][currentPieceCol+1]=null; 
          }
        }
      } 
    }

    // white pawn hasn't moved yet
    if (whitesTurn && currentPieceRow===1) {
      if (squares[currentPieceRow+1][currentPieceCol]===null){
        miscSquares[currentPieceRow+1][currentPieceCol]="possible"
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow+1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
          miscSquares[currentPieceRow+1][currentPieceCol]=null; 
        } 
        if (squares[currentPieceRow+2][currentPieceCol]===null){
          miscSquares[currentPieceRow+2][currentPieceCol]="possible"; 
          let squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow+2,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
            miscSquares[currentPieceRow+2][currentPieceCol]=null; 
          }
        }
      }
      if ((currentPieceCol-1)>=0){
        if (blackPieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
          miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow+1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
            miscSquares[currentPieceRow+1][currentPieceCol]=null; 
          }
        }
      }
      if ((currentPieceCol+1)<8){
        if (blackPieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
          miscSquares[currentPieceRow+1][currentPieceCol+1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow+1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
            miscSquares[currentPieceRow+1][currentPieceCol+1]=null; 
          }
        }
      }
    }

    // black pawn has moved
    if (!whitesTurn && currentPieceRow!==6) {
      if (squares[currentPieceRow-1][currentPieceCol]===null){
        miscSquares[currentPieceRow-1][currentPieceCol]="possible"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow-1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
          miscSquares[currentPieceRow-1][currentPieceCol]=null; 
        }
      }
      if ((currentPieceCol-1)>=0){
        if (whitePieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
          miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow-1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
            miscSquares[currentPieceRow-1][currentPieceCol-1]=null; 
          }
        }
      }
      if ((currentPieceCol+1)<8){
        if (whitePieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
          miscSquares[currentPieceRow-1][currentPieceCol+1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow-1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
            miscSquares[currentPieceRow-1][currentPieceCol+1]=null; 
          }
        }
      }
    }

    // white pawn has moved
    if (whitesTurn && currentPieceRow!==1) {
      if (squares[currentPieceRow+1][currentPieceCol]===null){
        miscSquares[currentPieceRow+1][currentPieceCol]="possible"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow+1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
          miscSquares[currentPieceRow+1][currentPieceCol]=null; 
        }
      }
      if ((currentPieceCol-1)>=0){
        if (blackPieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
          miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow+1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
            miscSquares[currentPieceRow+1][currentPieceCol-1]=null; 
          }
        }
      }
      if ((currentPieceCol+1)<8){
        if (blackPieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
          miscSquares[currentPieceRow+1][currentPieceCol+1]="threatened"; 
          squares_copy = JSON.parse(JSON.stringify(squares)); 
          newSquares = movePiece(currentPieceRow+1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
          if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
            miscSquares[currentPieceRow+1][currentPieceCol+1]=null; 
          }
        }
      }
    }
    miscSquares[currentPieceRow][currentPieceCol]="selected";
    return miscSquares; 
  }
}

// Helper function for showing pawn threats for checkThreatenedSquares()
function displayPawnThreats(currentPieceRow, currentPieceCol, whitesTurn, playerColor, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && (squares[currentPieceRow][currentPieceCol]===Enums.blackPawn)) 
      || (!whitesTurn && (squares[currentPieceRow][currentPieceCol]===Enums.whitePawn))){
    return miscSquares; 
  }

  if ((playerColor==="both")||(playerColor==="white")){
    // white pawn
    if (whitesTurn){
      if ((currentPieceCol-1)>=0){
        miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
      }
      if ((currentPieceCol+1)<8){
        miscSquares[currentPieceRow-1][currentPieceCol+1]="threatened"; 
      }
    }

    // black pawn
    if (!whitesTurn){
      if ((currentPieceCol-1)>=0){
        miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
      }
      if ((currentPieceCol+1)<8){
        miscSquares[currentPieceRow+1][currentPieceCol+1]="threatened"; 
      }
    }
    return miscSquares; 
  }
  else {
    // black pawn
    if (!whitesTurn){
      if ((currentPieceCol-1)>=0){
        miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
      }
      if ((currentPieceCol+1)<8){
        miscSquares[currentPieceRow-1][currentPieceCol+1]="threatened"; 
      }
    }

    // white pawn
    if (whitesTurn){
      if ((currentPieceCol-1)>=0){
        miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
      }
      if ((currentPieceCol+1)<8){
        miscSquares[currentPieceRow+1][currentPieceCol+1]="threatened"; 
      }
    }
    return miscSquares; 
  }
  
}

// Rooks 
function displayRookMoves(currentPieceRow, currentPieceCol, whitesTurn, squares, playerColor) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.blackRook) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.whiteRook)){
    return miscSquares; 
  }
  // up "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,0,-1,squares,miscSquares,whitesTurn,playerColor);
  // down "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,0,+1,squares,miscSquares,whitesTurn,playerColor)
  // left "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,-1,0,squares,miscSquares,whitesTurn,playerColor)
  // right "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,+1,0,squares,miscSquares,whitesTurn,playerColor)
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares; 
}

function displayRookThreats(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.blackRook) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.whiteRook)){
    return miscSquares; 
  }
  // up "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,0,-1,squares,miscSquares,whitesTurn);
  // down "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,0,+1,squares,miscSquares,whitesTurn)
  // left "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,-1,0,squares,miscSquares,whitesTurn)
  // right "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,+1,0,squares,miscSquares,whitesTurn)
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares; 
}

// Queens
function displayQueenMoves(currentPieceRow, currentPieceCol, whitesTurn, squares, playerColor) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.blackQueen) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.whiteQueen)){
    return miscSquares; 
  }
  // up "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,0,-1,squares,miscSquares,whitesTurn,playerColor)
  // down "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,0,+1,squares,miscSquares,whitesTurn,playerColor)
  // left "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,-1,0,squares,miscSquares,whitesTurn,playerColor)
  // right "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,+1,0,squares,miscSquares,whitesTurn,playerColor)
  // up and left "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,-1,-1,squares,miscSquares,whitesTurn,playerColor)
  // up and right "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,+1,-1,squares,miscSquares,whitesTurn,playerColor)
  // down and left "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,-1,+1,squares,miscSquares,whitesTurn,playerColor)
  // down and right "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,+1,+1,squares,miscSquares,whitesTurn,playerColor)
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares; 
}

function displayQueenThreats(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.blackQueen) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.whiteQueen)){
    return miscSquares; 
  }
  // up "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,0,-1,squares,miscSquares,whitesTurn)
  // down "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,0,+1,squares,miscSquares,whitesTurn)
  // left "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,-1,0,squares,miscSquares,whitesTurn)
  // right "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,+1,0,squares,miscSquares,whitesTurn)
  // up and left "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,-1,-1,squares,miscSquares,whitesTurn)
  // up and right "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,+1,-1,squares,miscSquares,whitesTurn)
  // down and left "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,-1,+1,squares,miscSquares,whitesTurn)
  // down and right "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,+1,+1,squares,miscSquares,whitesTurn)
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares; 
}

// Kings
// TO DO: NEED TO NOT DISPLAY MOVES THAT WOULD PUT THE KING IN CHECK AND CASTLING
function displayKingMoves(currentPieceRow, currentPieceCol, whitesTurn, squares, playerColor) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  let newSquares; 
  let color = (whitesTurn) ? "white" : "black"; 
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.blackKing) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.whiteKing)){
    return miscSquares; 
  }
  let possibleSquares = [];
  possibleSquares.push([currentPieceRow-1, currentPieceCol-1]);
  possibleSquares.push([currentPieceRow-1, currentPieceCol]);
  possibleSquares.push([currentPieceRow-1, currentPieceCol+1]);
  possibleSquares.push([currentPieceRow, currentPieceCol-1]);
  possibleSquares.push([currentPieceRow, currentPieceCol+1]);
  possibleSquares.push([currentPieceRow+1, currentPieceCol-1]);
  possibleSquares.push([currentPieceRow+1, currentPieceCol]); 
  possibleSquares.push([currentPieceRow+1, currentPieceCol+1]); 
  for (let i=0; i<possibleSquares.length; i++) {
    if (possibleSquares[i][0] >= 0 && possibleSquares[i][0] < 8 && 
        possibleSquares[i][1] >= 0 && possibleSquares[i][1] < 8) {  
      if ((whitesTurn && blackPieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]])) 
          || (!whitesTurn && whitePieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]]))){
        miscSquares[possibleSquares[i][0]][possibleSquares[i][1]]="threatened";
        let squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(possibleSquares[i][0],possibleSquares[i][1],currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(color,newSquares,playerColor)){
          miscSquares[possibleSquares[i][0]][possibleSquares[i][1]]=null; 
        }
      }
      else if ((!whitesTurn && blackPieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]])) 
          || (whitesTurn && whitePieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]]))){
      }
      else {
        miscSquares[possibleSquares[i][0]][possibleSquares[i][1]]="possible";
        let squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(possibleSquares[i][0],possibleSquares[i][1],currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(color,newSquares,playerColor)){
          miscSquares[possibleSquares[i][0]][possibleSquares[i][1]]=null; 
        }
      }
    } 
  }

  // Highlight selected piece
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares;
}

// Slightly altered version of displayKingMoves() only to be called by checkThreatenedSquares(). 
// Otherwise code gets stuck in infinite loop checking to make sure each king is not threatening the other. 
function displayKingThreats(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.blackKing) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.whiteKing)){
    return miscSquares; 
  }
  let possibleSquares = [];
  possibleSquares.push([currentPieceRow-1, currentPieceCol-1]);
  possibleSquares.push([currentPieceRow-1, currentPieceCol]);
  possibleSquares.push([currentPieceRow-1, currentPieceCol+1]);
  possibleSquares.push([currentPieceRow, currentPieceCol-1]);
  possibleSquares.push([currentPieceRow, currentPieceCol]);
  possibleSquares.push([currentPieceRow, currentPieceCol+1]);
  possibleSquares.push([currentPieceRow+1, currentPieceCol-1]);
  possibleSquares.push([currentPieceRow+1, currentPieceCol]); 
  possibleSquares.push([currentPieceRow+1, currentPieceCol+1]); 
  for (let i=0; i<possibleSquares.length; i++) {
    if (possibleSquares[i][0] >= 0 && possibleSquares[i][0] < 8 && 
        possibleSquares[i][1] >= 0 && possibleSquares[i][1] < 8) {  
      if ((whitesTurn && blackPieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]])) 
          || (!whitesTurn && whitePieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]]))){
        miscSquares[possibleSquares[i][0]][possibleSquares[i][1]]="threatened";
      }
      else if ((!whitesTurn && blackPieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]])) 
          || (whitesTurn && whitePieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]]))){
      }
      else {
        miscSquares[possibleSquares[i][0]][possibleSquares[i][1]]="possible";
      }
    }
  }
  return miscSquares;
}

// alternate CheckAxis that doesn't care about putting the king in check. 
function checkAxisAlternate(currentPieceRow, currentPieceCol, rowDelta, colDelta, squares, miscSquares, whitesTurn){
  let i=currentPieceRow+rowDelta;
  let j=currentPieceCol+colDelta; 
  while (i < 8 && i >=0 && j < 8 && j >=0) {
    if (squares[i][j]===null){
      miscSquares[i][j]="possible"; 
    }
    else if ((whitesTurn && whitePieces.includes(squares[i][j]))
      || (!whitesTurn && blackPieces.includes(squares[i][j]))){
      break; 
    }
    else if ((whitesTurn && blackPieces.includes(squares[i][j]))
      || (!whitesTurn && whitePieces.includes(squares[i][j]))){
      miscSquares[i][j]="threatened";
      break; 
    }
    i+=rowDelta;
    j+=colDelta;
  }
  return miscSquares;
}

// Function for actually moving the pieces
function movePiece(endRow, endCol, startRow, startCol, squares){
  let startpiece = squares[startRow][startCol];
  squares[startRow][startCol]=null; 
  squares[endRow][endCol]=startpiece;
  return squares; 
}

// Function for compiling all squares the opponent threatens
function checkThreatenedSquares(opponentColor, squares, playerColor){
  let pieceThreats;
  let allThreatenedSquares = Array(8).fill(null).map(()=>Array(8).fill(null));

  // current player is white: List all squares black is threatening
  if (opponentColor==="Black"){
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if (squares[i][j]===Enums.blackPawn){
          pieceThreats=displayPawnThreats(i,j,false,playerColor,squares);
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===Enums.blackRook){
          pieceThreats=displayRookThreats(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===Enums.blackKnight){
          pieceThreats=displayKnightThreats(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===Enums.blackBishop){
          pieceThreats=displayBishopThreats(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===Enums.blackQueen){
          pieceThreats=displayQueenThreats(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===Enums.blackKing){
          pieceThreats=displayKingThreats(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
      }
    }
  }

  // current player is black: List all squares white is threatening
  else if (opponentColor==="White"){
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if (squares[i][j]===Enums.whitePawn){
          pieceThreats=displayPawnThreats(i,j,true,playerColor,squares); // for some reason piecethreats is undefined after this line
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===Enums.whiteRook){
          pieceThreats=displayRookThreats(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===Enums.whiteKnight){
          pieceThreats=displayKnightThreats(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===Enums.whiteBishop){
          pieceThreats=displayBishopThreats(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===Enums.whiteQueen){
          pieceThreats=displayQueenThreats(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===Enums.whiteKing){
          pieceThreats=displayKingThreats(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
      }
    }
  }
  return allThreatenedSquares; 
}

// Helper function to add pieceThreats to allThreatenedSquares in checkThreatenedSquares()
function squaresCombiner(pieceThreats, allThreatenedSquares){
  for (let i=0; i<8; i++){
    for (let j=0; j<8; j++){
      if (pieceThreats[i][j]==="threatened" || pieceThreats[i][j]==="possible"){
        allThreatenedSquares[i][j]="threatened"; 
      }
    }
  }
  return allThreatenedSquares; 
}

// Function to detect if King is CURRENTLY in check. 
// Will be called recursively after prospective moves to see if the move gets the king out of check. 
function isKingCurrentlyInCheck(kingColor, squares, playerColor){
  let allThreatenedSquares; 
  if (kingColor==="white") {
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if (squares[i][j]===Enums.whiteKing){
          allThreatenedSquares = checkThreatenedSquares("Black",squares,playerColor); 
          if (allThreatenedSquares[i][j]==="threatened"){
            return true; 
          }
        }
      }
    }
  }
  else if (kingColor==="black"){
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if (squares[i][j]===Enums.blackKing){
          allThreatenedSquares = checkThreatenedSquares("White",squares,playerColor); 
          if (allThreatenedSquares[i][j]==="threatened"){
            return true; 
          }
        }
      }
    }
  }
  return false; 
}

function isCheckmate(kingColor,squares, pawnColor){
  let legalMoves = Array(8).fill(null).map(()=>Array(8).fill(null));
  let pieceMoves;   
  let whitesTurn = (kingColor==="white") ? true : false; 
  if (isKingCurrentlyInCheck(kingColor, squares,pawnColor)){
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if (((kingColor==="both" || kingColor==="white") && whitePieces.includes(squares[i][j])) ||
          ((kingColor==="both" || kingColor==="black") && blackPieces.includes(squares[i][j]))) {
          if (((kingColor==="both" || kingColor==="white") && squares[i][j]===Enums.whiteKnight) || ((kingColor==="both" || kingColor==="black") && squares[i][j]===Enums.blackKnight)){
            pieceMoves = displayKnightMoves(i,j,whitesTurn,squares,pawnColor);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if (((kingColor==="both" || kingColor==="white") && squares[i][j]===Enums.whitePawn) || ((kingColor==="both" || kingColor==="black") && squares[i][j]===Enums.blackPawn)){
            pieceMoves = displayPawnMoves(i,j,whitesTurn,pawnColor,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if (((kingColor==="both" || kingColor==="white") && squares[i][j]===Enums.whiteBishop) || ((kingColor==="both" || kingColor==="black") && squares[i][j]===Enums.blackBishop)){
            pieceMoves = displayBishopMoves(i,j,whitesTurn,squares,pawnColor);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if (((kingColor==="both" || kingColor==="white") && squares[i][j]===Enums.whiteQueen) || ((kingColor==="both" || kingColor==="black") && squares[i][j]===Enums.blackQueen)){
            pieceMoves = displayQueenMoves(i,j,whitesTurn,squares,pawnColor);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if (((kingColor==="both" || kingColor==="white") && squares[i][j]===Enums.whiteKing) || ((kingColor==="both" || kingColor==="black") && squares[i][j]===Enums.blackKing)){
            pieceMoves = displayKingMoves(i,j,whitesTurn,squares,pawnColor);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if (((kingColor==="both" || kingColor==="white") && squares[i][j]===Enums.whiteRook) || ((kingColor==="both" || kingColor==="black") && squares[i][j]===Enums.blackRook)){
            pieceMoves = displayRookMoves(i,j,whitesTurn,squares,pawnColor);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }

        }
        for (let k=0; k<8; k++){
          if (legalMoves[k].includes("threatened")){
            return false; 
          }
        }
      }
    }
    return true; 
  }
  else{
    return false; 
  }
}

function isStalemate(kingColor, squares, pawnColor){
  let legalMoves = Array(8).fill(null).map(()=>Array(8).fill(null));
  let pieceMoves; 
  let whitesTurn = (kingColor==="white") ? true : false; 
  if (!isKingCurrentlyInCheck(kingColor, squares, pawnColor)){
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if ((whitesTurn && whitePieces.includes(squares[i][j])) ||
          (!whitesTurn && blackPieces.includes(squares[i][j]))) {
          if ((whitesTurn && squares[i][j]===Enums.whiteKnight) || (!whitesTurn && squares[i][j]===Enums.blackKnight)){
            pieceMoves = displayKnightMoves(i,j,whitesTurn,squares,pawnColor);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===Enums.whitePawn) || (!whitesTurn && squares[i][j]===Enums.blackPawn)){
            pieceMoves = displayPawnMoves(i,j,whitesTurn,pawnColor,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===Enums.whiteBishop) || (!whitesTurn && squares[i][j]===Enums.blackBishop)){
            pieceMoves = displayBishopMoves(i,j,whitesTurn,squares,pawnColor);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===Enums.whiteQueen) || (!whitesTurn && squares[i][j]===Enums.blackQueen)){
            pieceMoves = displayQueenMoves(i,j,whitesTurn,squares,pawnColor);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===Enums.whiteKing) || (!whitesTurn && squares[i][j]===Enums.blackKing)){
            pieceMoves = displayKingMoves(i,j,whitesTurn,squares,pawnColor);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===Enums.whiteRook) || (!whitesTurn && squares[i][j]===Enums.blackRook)){
            pieceMoves = displayRookMoves(i,j,whitesTurn,squares,pawnColor);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
        }
        for (let k=0; k<8; k++){
          if (legalMoves[k].includes("threatened")){
            return false; 
          }
        }
      }
    }
    return true; 
  }
  else{
    return false; 
  }
}

// function to determine clicked piece and call the correct display function

// King, Queen, Rook, Bishop, Knight, Pawn
function findPieceAndDisplay(pieceRow, pieceCol, whitesTurn, playerColor, squares) {
  for (let i=0; i<6; i++){
    if (squares[pieceRow][pieceCol]===whitePieces[i] || squares[pieceRow][pieceCol]===blackPieces[i]) {
      if (isKingCurrentlyInCheck("white",squares, playerColor)){
        let miscSquares;
        if (i===0){
          miscSquares = displayKingMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor); 
        }
        if (i===1){
          miscSquares = displayQueenMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor); 
        }
        if (i===2){
          miscSquares = displayRookMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor); 
        }
        if (i===3){
          miscSquares = displayBishopMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor); 
        }
        if (i===4){
          miscSquares = displayKnightMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor); 
        }
        if (i===5){
          miscSquares = displayPawnMoves(pieceRow,pieceCol,whitesTurn,playerColor,squares); 
        }
        // Find the checked king's location and highlight it as "incheck" (bright red)
        for (let i=0; i<8; i++){
          for (let j=0; j<8; j++){
            if (squares[i][j]===Enums.whiteKing){
              miscSquares[i][j]="incheck"
            }
          }
        }
        return miscSquares; 
      }
      else if (isKingCurrentlyInCheck("black",squares,playerColor)){
        let miscSquares;
        if (i===0){
          miscSquares = displayKingMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor); 
        }
        if (i===1){
          miscSquares = displayQueenMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor); 
        }
        if (i===2){
          miscSquares = displayRookMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor); 
        }
        if (i===3){
          miscSquares = displayBishopMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor); 
        }
        if (i===4){
          miscSquares = displayKnightMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor); 
        }
        if (i===5){
          miscSquares = displayPawnMoves(pieceRow,pieceCol,whitesTurn,playerColor,squares); 
        }
        // Find the checked king's location and highlight it as "incheck" (bright red)
        for (let i=0; i<8; i++){
          for (let j=0; j<8; j++){
            if (squares[i][j]===Enums.blackKing){
              miscSquares[i][j]="incheck"
            }
          }
        }
        return miscSquares; 
      }
      else {
        if (i===0){
          return displayKingMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor);
        }
        if (i===1){
          return displayQueenMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor);
        }
        if (i===2){
          return displayRookMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor);
        }
        if (i===3){
          return displayBishopMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor);
        }
        if (i===4){
          return displayKnightMoves(pieceRow,pieceCol,whitesTurn,squares,playerColor);
        }
        if (i===5){
          return displayPawnMoves(pieceRow,pieceCol,whitesTurn,playerColor,squares);
        }
      }
    }
  }
  return null; 
}
