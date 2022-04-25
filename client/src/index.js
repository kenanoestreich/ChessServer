import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import io from 'socket.io-client';
let socket = io("http://ec2-184-73-74-122.compute-1.amazonaws.com:3456/");

// enumerations for unicodes to make code readable
const whiteKing = '♔'; 
const whiteQueen = '♕';
const whiteRook = '♖';
const whiteBishop = '♗';
const whiteKnight = '♘';
const whitePawn = '♙';
const blackKing = '♚'; 
const blackQueen = '♛';
const blackRook = '♜';
const blackBishop = '♝';
const blackKnight = '♞';
const blackPawn = '♟';
const whitePieces = [whiteKing,whiteQueen,whiteRook,whiteBishop,whiteKnight,whitePawn];
const blackPieces = [blackKing,blackQueen,blackRook,blackBishop,blackKnight,blackPawn];

// array of roots so we don't get a warning for calling createRoot() multiple times on the same element.
let roots=Array(8848).fill(null); // maximum possible number of moves

// Is the user logged in?
let loggedIn=false; 

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
    <button className={props.squareColor} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function ListItem(props) {
  return (
    <button onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// Board Class 
// 64 Squares of chess board 
class Board extends React.Component {

  // renderSquare() generates the square objects and assigns props based on inputs
  renderSquare(i,j,misc,squares) {
    if (misc==null){
      if (((i+j)%2)===1){
        return (
          <Square
            value={squares[i][j]}
            onClick={() => this.props.onClick(i,j)}
            squareColor="darksquare"
          />
        );
      }
      else {
        return (
          <Square
            value={squares[i][j]}
            onClick={() => this.props.onClick(i,j)}
            squareColor="lightsquare"
          />
        );
      }
    }
    else if (misc==="selected"){
      return (
        <Square
          value={this.props.squares[i][j]}
          onClick={() => this.props.onClick(i,j)}
          squareColor="selectedsquare"
        />
      );
    }
    else if (misc==="possible"){
      return (
        <Square
          value={this.props.squares[i][j]}
          onClick={() => this.props.onClick(i,j)}
          squareColor="possiblesquare"
        />
      );
    }
    else if (misc==="threatened"){
      return (
        <Square
          value={this.props.squares[i][j]}
          onClick={() => this.props.onClick(i,j)}
          squareColor="threatenedsquare"
        />
      );
    }
    else if (misc==="incheck"){
      return (
        <Square
          value={this.props.squares[i][j]}
          onClick={() => this.props.onClick(i,j)}
          squareColor="inchecksquare"
        />
      );
    }
  }

  // render function for the board itself
  // renders all 64 squares with their correct options ("threatened", "possible", etc...)
  render() {
    const miscSquares = JSON.parse(JSON.stringify(this.props.miscSquares)); 
    const squares = JSON.parse(JSON.stringify(this.props.squares));
    return (
      <div>
        <div className="board-row"> 
          {this.renderSquare(0,0,miscSquares[0][0],squares)}
          {this.renderSquare(0,1,miscSquares[0][1],squares)}
          {this.renderSquare(0,2,miscSquares[0][2],squares)}
          {this.renderSquare(0,3,miscSquares[0][3],squares)}
          {this.renderSquare(0,4,miscSquares[0][4],squares)}
          {this.renderSquare(0,5,miscSquares[0][5],squares)}
          {this.renderSquare(0,6,miscSquares[0][6],squares)}
          {this.renderSquare(0,7,miscSquares[0][7],squares)}
        </div>
        <div className="board-row">
          {this.renderSquare(1,0,miscSquares[1][0],squares)}
          {this.renderSquare(1,1,miscSquares[1][1],squares)}
          {this.renderSquare(1,2,miscSquares[1][2],squares)}
          {this.renderSquare(1,3,miscSquares[1][3],squares)}
          {this.renderSquare(1,4,miscSquares[1][4],squares)}
          {this.renderSquare(1,5,miscSquares[1][5],squares)}
          {this.renderSquare(1,6,miscSquares[1][6],squares)}
          {this.renderSquare(1,7,miscSquares[1][7],squares)}
        </div>
        <div className="board-row">
          {this.renderSquare(2,0,miscSquares[2][0],squares)}
          {this.renderSquare(2,1,miscSquares[2][1],squares)}
          {this.renderSquare(2,2,miscSquares[2][2],squares)}
          {this.renderSquare(2,3,miscSquares[2][3],squares)}
          {this.renderSquare(2,4,miscSquares[2][4],squares)}
          {this.renderSquare(2,5,miscSquares[2][5],squares)}
          {this.renderSquare(2,6,miscSquares[2][6],squares)}
          {this.renderSquare(2,7,miscSquares[2][7],squares)}
        </div>
        <div className="board-row">
          {this.renderSquare(3,0,miscSquares[3][0],squares)}
          {this.renderSquare(3,1,miscSquares[3][1],squares)}
          {this.renderSquare(3,2,miscSquares[3][2],squares)}
          {this.renderSquare(3,3,miscSquares[3][3],squares)}
          {this.renderSquare(3,4,miscSquares[3][4],squares)}
          {this.renderSquare(3,5,miscSquares[3][5],squares)}
          {this.renderSquare(3,6,miscSquares[3][6],squares)}
          {this.renderSquare(3,7,miscSquares[3][7],squares)}
        </div>
        <div className="board-row">
          {this.renderSquare(4,0,miscSquares[4][0],squares)}
          {this.renderSquare(4,1,miscSquares[4][1],squares)}
          {this.renderSquare(4,2,miscSquares[4][2],squares)}
          {this.renderSquare(4,3,miscSquares[4][3],squares)}
          {this.renderSquare(4,4,miscSquares[4][4],squares)}
          {this.renderSquare(4,5,miscSquares[4][5],squares)}
          {this.renderSquare(4,6,miscSquares[4][6],squares)}
          {this.renderSquare(4,7,miscSquares[4][7],squares)}
        </div>
        <div className="board-row">
          {this.renderSquare(5,0,miscSquares[5][0],squares)}
          {this.renderSquare(5,1,miscSquares[5][1],squares)}
          {this.renderSquare(5,2,miscSquares[5][2],squares)}
          {this.renderSquare(5,3,miscSquares[5][3],squares)}
          {this.renderSquare(5,4,miscSquares[5][4],squares)}
          {this.renderSquare(5,5,miscSquares[5][5],squares)}
          {this.renderSquare(5,6,miscSquares[5][6],squares)}
          {this.renderSquare(5,7,miscSquares[5][7],squares)}
        </div>
        <div className="board-row">
          {this.renderSquare(6,0,miscSquares[6][0],squares)}
          {this.renderSquare(6,1,miscSquares[6][1],squares)}
          {this.renderSquare(6,2,miscSquares[6][2],squares)}
          {this.renderSquare(6,3,miscSquares[6][3],squares)}
          {this.renderSquare(6,4,miscSquares[6][4],squares)}
          {this.renderSquare(6,5,miscSquares[6][5],squares)}
          {this.renderSquare(6,6,miscSquares[6][6],squares)}
          {this.renderSquare(6,7,miscSquares[6][7],squares)}
        </div>
        <div className="board-row">
          {this.renderSquare(7,0,miscSquares[7][0],squares)}
          {this.renderSquare(7,1,miscSquares[7][1],squares)}
          {this.renderSquare(7,2,miscSquares[7][2],squares)}
          {this.renderSquare(7,3,miscSquares[7][3],squares)}
          {this.renderSquare(7,4,miscSquares[7][4],squares)}
          {this.renderSquare(7,5,miscSquares[7][5],squares)}
          {this.renderSquare(7,6,miscSquares[7][6],squares)}
          {this.renderSquare(7,7,miscSquares[7][7],squares)}
        </div>
      </div>
    );
  }
}

// Game Class; Contains state variables for history, stepNumber (move #), 
// miscSquares (strings of "threatened", "possible", etc...), whitesTurn (is it White's turn?), 
// list of black's and white's lost pieces
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          // make starting board; okay to hardcode this
          squares: [[blackRook,blackKnight,blackBishop,blackQueen,blackKing,blackBishop,blackKnight,blackRook],
          [blackPawn,blackPawn,blackPawn,blackPawn,blackPawn,blackPawn,blackPawn,blackPawn],
          [null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],
          [whitePawn,whitePawn,whitePawn,whitePawn,whitePawn,whitePawn,whitePawn,whitePawn],
          [whiteRook,whiteKnight,whiteBishop,whiteQueen,whiteKing,whiteBishop,whiteKnight,whiteRook]]
        }
      ],
      miscSquares: Array(8).fill(null).map(()=>Array(8).fill(null)),
      stepNumber: 0,
      whitesTurn: true,
      takenPieces: {black: Array(0), white: Array(0)}
    };
  }

  // Function to respond to clicking a square element
  handleClick(i,j) {
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

    // If not at the most recent move, move to the most recent move
    if (this.state.stepNumber!==history.length-1){
      this.jumpTo(history.length-1);
      return;
    }

    // If the clicked square was highlighted as "threatened" (light red) or "possible" (light yellow),
    // then we know the last piece we clicked can move there. The square wouldn't be highlighted if it 
    // resulted in check, or if a blank square has been clicked since.
    if (newMiscSquares[i][j]==="threatened" || newMiscSquares[i][j]==="possible"){

      // if the piece is taking another piece, we need to update the list of taken pieces
      if (newMiscSquares[i][j]==="threatened"){
        let takenPiece = newSquares[i][j];
        if (whitesTurn){
          newTakenPieces.black.push(takenPiece);
          this.setState({
            takenPieces: newTakenPieces
          })
        }
        else{
          newTakenPieces.white.push(takenPiece);
          this.setState({
            takenPieces: newTakenPieces
          })
        }
      }
      
      // generate a new board with the piece moved 
      newSquares = movePiece(i,j,pieceClickedRow,pieceClickedCol,newSquares)
      
      // if the opponent's king is in check, display that on the board
      if (isKingCurrentlyInCheck(!whitesTurn,newSquares)){ 

        // add the new board state to history
        history.push({squares: newSquares});

        // reset square color labels
        let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null))

        for (let i=0; i<8; i++){
          for (let j=0; j<8; j++){
            if ((whitesTurn && newSquares[i][j]===blackKing) ||
                (!whitesTurn && newSquares[i][j]===whiteKing)){
              miscSquares[i][j]="incheck"
            }
          }
        }

        this.setState({
          history: history,
          whitesTurn: newTurn,
          stepNumber: newStep,
          miscSquares: miscSquares,
        }) 
      }
      else {
        history.push({squares: newSquares});
        this.setState({
          history: history,
          whitesTurn: newTurn,
          stepNumber: newStep,
          miscSquares: Array(8).fill(null).map(()=>Array(8).fill(null))
        }) 
      }
      return; 
    }

    // If the game is Drawn By Insufficient Material, don't respond to clicks. 
    if (document.getElementById("status").innerHTML==="Game Drawn By Insufficient Material"){
      return;
    }

    // If the game is Drawn by Stalemate or done by Checkmate, don't respond to clicks. 
    if (isCheckmate(whitesTurn, newSquares)||isStalemate(whitesTurn, newSquares)){
      return; 
    }
    
    // All the following sections refer to clicking one of the current player's pieces on their turn. 
    // The square labels should be updated in this case, but nothing should be moved. 

    let miscSquares = findPieceAndDisplay(i,j,whitesTurn,newSquares); 
    if (miscSquares!==null){
      this.setState({
        miscSquares: miscSquares
      }); 

      // remember this piece's location in case they take a piece with it. 
      pieceClickedRow = i; 
      pieceClickedCol = j; 
      return; 
    }
  
    // reset possible moves highlights if the square clicked is labeled null
    else {
      if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
        let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null)); 
        for (let i=0; i<8; i++){
          for (let j=0; j<8; j++){
            if ((whitesTurn && newSquares[i][j]===whiteKing) ||
                (!whitesTurn && newSquares[i][j]===blackKing)){
              miscSquares[i][j]="incheck"
            }
          }
        }
        this.setState({
          miscSquares: miscSquares
        });
      }
      else {
        this.setState({
          miscSquares: Array(8).fill(null).map(()=>Array(8).fill(null)),
        });
      } 
      pieceClickedRow = null; 
      pieceClickedCol = null; 
      return; 
    }
  }

  // function bound to history buttons
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      whitesTurn: (step % 2) === 0,
      miscSquares: Array(8).fill(null).map(()=>Array(8).fill(null))
    });
  }

  render() {
    const history = JSON.parse(JSON.stringify(this.state.history));
    const current = history[this.state.stepNumber];
    const newMiscSquares = JSON.parse(JSON.stringify(this.state.miscSquares));
    const newSquares = current.squares;
    
    const moves = history.map((step, move) => {
      if (move!==0){
        if (move%2===1) { //white's move most recent
          const desc = "White's Move"
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
          const desc = "Black's Move"
          if (roots[move]===null){
            roots[move] = createRoot(document.getElementById(move-1));
          }
          roots[move].render(<span><button onClick={() => this.jumpTo(move-1)}>White's Move</button>
          <button onClick={() => this.jumpTo(move)}>{desc}</button></span>)
        }
      }
      else{
        return (
          <div id="start" key="start">
            <button onClick={() => this.jumpTo(move)}>Game Start</button>
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
      if (element===whiteQueen || element===whiteRook || element===whitePawn){
        whiteCount++; 
      }
    }); 
    blackTakenPieces.forEach(element => {
      if (element===blackQueen || element===blackRook || element===blackPawn){
        blackCount++; 
      }
    }); 

    let status;
    if (isCheckmate(this.state.whitesTurn,current.squares)){
      status = (this.state.whitesTurn ? "Black" : "White") + " Won By Checkmate!";
    }
    else if (isStalemate(this.state.whitesTurn, current.squares)){
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
    

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={newSquares}
            onClick={(i,j) => this.handleClick(i,j)}
            miscSquares={newMiscSquares}
          />
        </div>
        <div className="game-info">
          <div id="login">{sessionStorage.getItem("currentUser")}</div>
          <div id="status">{status}</div>
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

class LoginForm extends React.Component{
  constructor(props){
  super(props);
  this.state = {
    LoginError: ""
  }

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
    socket.on("LoginSuccess", () => this.loggedIn());
    socket.on("LoginFailure", () => this.loginFailure());
  }

  register(){
    let tryusername = document.getElementById("username").value; 
    let trypassword = document.getElementById("password").value; 
    socket.emit("RegisterUser", {username: tryusername, password: trypassword});
    socket.on("UserAlreadyExists", ()=>this.usernameTaken());
    socket.on("LoginSuccess", () => this.loggedIn());
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
      root.render(<Game/>);
    }
  }
}

// ========================================

if(loggedIn === true){
  root.render(<Game />); 
}else{
  root.render(<LoginForm />);
} 


// ALL THE "display_____Moves" FUNCTIONS DO THE FOLLOWING (ONLY DIFFERENCE IS HOW THAT PIECE MOVES):
// input current board state and piece location to move and change css for all the 
// legal move squares to highlight a new color. 

// ALL THE "display______Threats" FUNCTIONS EXIST TO AVOID INFINITE LOOPS. 

// Knights
function displayKnightMoves(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  let newSquares;
  let squares_copy;
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackKnight) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whiteKnight)){
    return miscSquares; 
  }
  let possibleSquares = [];
  possibleSquares.push([currentPieceRow-2, currentPieceCol-1]);
  possibleSquares.push([currentPieceRow-2, currentPieceCol+1]);
  possibleSquares.push([currentPieceRow-1, currentPieceCol-2]);
  possibleSquares.push([currentPieceRow-1, currentPieceCol+2]);
  possibleSquares.push([currentPieceRow+1, currentPieceCol-2]);
  possibleSquares.push([currentPieceRow+1, currentPieceCol+2]);
  possibleSquares.push([currentPieceRow+2, currentPieceCol-1]);
  possibleSquares.push([currentPieceRow+2, currentPieceCol+1]); 
  for (let i=0; i<possibleSquares.length; i++) {
    if (possibleSquares[i][0] >= 0 && possibleSquares[i][0] < 8 && 
        possibleSquares[i][1] >= 0 && possibleSquares[i][1] < 8) {  
      if ((whitesTurn && blackPieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]])) 
          || (!whitesTurn && whitePieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]]))){
        miscSquares[possibleSquares[i][0]][possibleSquares[i][1]]="threatened";
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(possibleSquares[i][0],possibleSquares[i][1],currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
          miscSquares[possibleSquares[i][0]][possibleSquares[i][1]]=null; 
        }
      }
      else if ((!whitesTurn && blackPieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]])) 
          || (whitesTurn && whitePieces.includes(squares[possibleSquares[i][0]][possibleSquares[i][1]]))){
      }
      else {
        miscSquares[possibleSquares[i][0]][possibleSquares[i][1]]="possible";
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(possibleSquares[i][0],possibleSquares[i][1],currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
          miscSquares[possibleSquares[i][0]][possibleSquares[i][1]]=null; 
        }
      }
    }
  }
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares;
}

// To be used in isKingCurrentlyInCheck()
function displayKnightThreats(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackKnight) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whiteKnight)){
    return miscSquares; 
  }
  let possibleSquares = [];
  possibleSquares.push([currentPieceRow-2, currentPieceCol-1]);
  possibleSquares.push([currentPieceRow-2, currentPieceCol+1]);
  possibleSquares.push([currentPieceRow-1, currentPieceCol-2]);
  possibleSquares.push([currentPieceRow-1, currentPieceCol+2]);
  possibleSquares.push([currentPieceRow+1, currentPieceCol-2]);
  possibleSquares.push([currentPieceRow+1, currentPieceCol+2]);
  possibleSquares.push([currentPieceRow+2, currentPieceCol-1]);
  possibleSquares.push([currentPieceRow+2, currentPieceCol+1]); 
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
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares;
}

// Bishops 
function displayBishopMoves(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackBishop) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whiteBishop)){
    return miscSquares; 
  }
  // up and left "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,-1,-1,squares,miscSquares,whitesTurn);
  // up and right "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,+1,-1,squares,miscSquares,whitesTurn)
  // down and left "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,-1,+1,squares,miscSquares,whitesTurn)
  // down and right "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,+1,+1,squares,miscSquares,whitesTurn)
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares; 
}

function displayBishopThreats(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackBishop) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whiteBishop)){
    return miscSquares; 
  }
  // up and left "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,-1,-1,squares,miscSquares,whitesTurn);
  // up and right "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,+1,-1,squares,miscSquares,whitesTurn)
  // down and left "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,-1,+1,squares,miscSquares,whitesTurn)
  // down and right "line of sight"
  miscSquares=checkAxisAlternate(currentPieceRow,currentPieceCol,+1,+1,squares,miscSquares,whitesTurn)
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares; 
}

// Pawns
function displayPawnMoves(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  let newSquares;
  let squares_copy;
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackPawn) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whitePawn)){
    return miscSquares; 
  }

  // white pawn hasn't moved yet
  if (whitesTurn && currentPieceRow===6) {
    if (squares[currentPieceRow-1][currentPieceCol]===null){
      miscSquares[currentPieceRow-1][currentPieceCol]="possible";
      squares_copy = JSON.parse(JSON.stringify(squares)); 
      newSquares = movePiece(currentPieceRow-1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
      if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
        miscSquares[currentPieceRow-1][currentPieceCol]=null; 
      } 
      if (squares[currentPieceRow-2][currentPieceCol]===null){
        miscSquares[currentPieceRow-2][currentPieceCol]="possible"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow-2,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
          miscSquares[currentPieceRow-2][currentPieceCol]=null; 
        }
      }
    }
    if ((currentPieceCol-1)>=0){
      if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
        miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow-1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
          miscSquares[currentPieceRow-1][currentPieceCol-1]=null; 
        }
      }
    }
    if ((currentPieceCol+1)<8){
      if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
        miscSquares[currentPieceRow-1][currentPieceCol+1]="threatened"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow-1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
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
      if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
        miscSquares[currentPieceRow+1][currentPieceCol]=null; 
      } 
      if (squares[currentPieceRow+2][currentPieceCol]===null){
        miscSquares[currentPieceRow+2][currentPieceCol]="possible"; 
        let squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow+2,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
          miscSquares[currentPieceRow+2][currentPieceCol]=null; 
        }
      }
    }
    if ((currentPieceCol-1)>=0){
      if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
        miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow+1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
          miscSquares[currentPieceRow+1][currentPieceCol]=null; 
        }
      }
    }
    if ((currentPieceCol+1)<8){
      if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
        miscSquares[currentPieceRow+1][currentPieceCol+1]="threatened"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow+1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
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
      if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
        miscSquares[currentPieceRow-1][currentPieceCol]=null; 
      }
    }
    if ((currentPieceCol-1)>=0){
      if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
        miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow-1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
          miscSquares[currentPieceRow-1][currentPieceCol-1]=null; 
        }
      }
    }
    if ((currentPieceCol+1)<8){
      if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
        miscSquares[currentPieceRow-1][currentPieceCol+1]="threatened"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow-1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
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
      if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
        miscSquares[currentPieceRow+1][currentPieceCol]=null; 
      }
    }
    if ((currentPieceCol-1)>=0){
      if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
        miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow+1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
          miscSquares[currentPieceRow+1][currentPieceCol-1]=null; 
        }
      }
    }
    if ((currentPieceCol+1)<8){
      if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
        miscSquares[currentPieceRow+1][currentPieceCol+1]="threatened"; 
        squares_copy = JSON.parse(JSON.stringify(squares)); 
        newSquares = movePiece(currentPieceRow+1,currentPieceCol+1,currentPieceRow,currentPieceCol,squares_copy)
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
          miscSquares[currentPieceRow+1][currentPieceCol+1]=null; 
        }
      }
    }
  }
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares; 
}

// Helper function for showing pawn threats for checkThreatenedSquares()
function displayPawnThreats(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && (squares[currentPieceRow][currentPieceCol]===blackPawn)) 
      || (!whitesTurn && (squares[currentPieceRow][currentPieceCol]===whitePawn))){
    return miscSquares; 
  }

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

// Rooks 
function displayRookMoves(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackRook) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whiteRook)){
    return miscSquares; 
  }
  // up "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,0,-1,squares,miscSquares,whitesTurn);
  // down "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,0,+1,squares,miscSquares,whitesTurn)
  // left "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,-1,0,squares,miscSquares,whitesTurn)
  // right "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,+1,0,squares,miscSquares,whitesTurn)
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares; 
}

function displayRookThreats(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackRook) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whiteRook)){
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
function displayQueenMoves(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackQueen) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whiteQueen)){
    return miscSquares; 
  }
  // up "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,0,-1,squares,miscSquares,whitesTurn)
  // down "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,0,+1,squares,miscSquares,whitesTurn)
  // left "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,-1,0,squares,miscSquares,whitesTurn)
  // right "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,+1,0,squares,miscSquares,whitesTurn)
  // up and left "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,-1,-1,squares,miscSquares,whitesTurn)
  // up and right "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,+1,-1,squares,miscSquares,whitesTurn)
  // down and left "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,-1,+1,squares,miscSquares,whitesTurn)
  // down and right "line of sight"
  miscSquares=checkAxis(currentPieceRow,currentPieceCol,+1,+1,squares,miscSquares,whitesTurn)
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares; 
}

function displayQueenThreats(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackQueen) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whiteQueen)){
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
function displayKingMoves(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  let newSquares; 
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackKing) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whiteKing)){
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
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
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
        if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
          miscSquares[possibleSquares[i][0]][possibleSquares[i][1]]=null; 
        }
      }
    } 
  }

  // This is obsolete now

  // // remove any moves that end with the king in check (probably make a helper function)
  // let squaresInCheck; 
  // if (whitesTurn){
  //   for (let i=0; i<8; i++){
  //     for (let j=0; j<8; j++){
  //       if (squaresInCheck[i][j]==="threatened"){
  //         miscSquares[i][j]=null; 
  //       }
  //     }
  //   }
  //   squaresInCheck = checkThreatenedSquares("Black", squares);
  // }
  // else {
  //   squaresInCheck = checkThreatenedSquares("White", squares); 
  // }

  // for (let i=0; i<8; i++){
  //   for (let j=0; j<8; j++){
  //     if (squaresInCheck[i][j]==="threatened"){
  //       miscSquares[i][j]=null; 
  //     }
  //   }
  // }

  // Highlight selected piece
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares;
}

// Slightly altered version of displayKingMoves() only to be called by checkThreatenedSquares(). 
// Otherwise code gets stuck in infinite loop checking to make sure each king is not threatening the other. 
function displayKingThreats(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackKing) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whiteKing)){
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

// helper function for bishops, rooks, and queens
function checkAxis(currentPieceRow, currentPieceCol, rowDelta, colDelta, squares, miscSquares, whitesTurn){
  let i=currentPieceRow+rowDelta;
  let j=currentPieceCol+colDelta; 
  let squares_copy;
  let newSquares;
  while (i < 8 && i >=0 && j < 8 && j >=0) {
    if (squares[i][j]===null){
      miscSquares[i][j]="possible"; 
      squares_copy = JSON.parse(JSON.stringify(squares)); 
      newSquares = movePiece(i,j,currentPieceRow,currentPieceCol,squares_copy)
      if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
        miscSquares[i][j]=null; 
      }
    }
    else if ((whitesTurn && whitePieces.includes(squares[i][j]))
      || (!whitesTurn && blackPieces.includes(squares[i][j]))){
      break; 
    }
    else if ((whitesTurn && blackPieces.includes(squares[i][j]))
      || (!whitesTurn && whitePieces.includes(squares[i][j]))){
      miscSquares[i][j]="threatened";
      squares_copy = JSON.parse(JSON.stringify(squares)); 
      newSquares = movePiece(i,j,currentPieceRow,currentPieceCol,squares_copy)
      if (isKingCurrentlyInCheck(whitesTurn,newSquares)){
        miscSquares[i][j]=null; 
      }
      break; 
    }
    i+=rowDelta
    j+=colDelta;
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
function checkThreatenedSquares(opponentColor, squares){
  let pieceThreats;
  let allThreatenedSquares = Array(8).fill(null).map(()=>Array(8).fill(null));

  // current player is white: List all squares black is threatening
  if (opponentColor==="Black"){
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if (squares[i][j]===blackPawn){
          pieceThreats=displayPawnThreats(i,j,false,squares);
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===blackRook){
          pieceThreats=displayRookThreats(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===blackKnight){
          pieceThreats=displayKnightThreats(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===blackBishop){
          pieceThreats=displayBishopThreats(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===blackQueen){
          pieceThreats=displayQueenThreats(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===blackKing){
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
        if (squares[i][j]===whitePawn){
          pieceThreats=displayPawnThreats(i,j,true,squares); // for some reason piecethreats is undefined after this line
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===whiteRook){
          pieceThreats=displayRookThreats(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===whiteKnight){
          pieceThreats=displayKnightThreats(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===whiteBishop){
          pieceThreats=displayBishopThreats(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===whiteQueen){
          pieceThreats=displayQueenThreats(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===whiteKing){
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
function isKingCurrentlyInCheck(whitesTurn, squares){
  let allThreatenedSquares; 
  if (whitesTurn) {
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if (squares[i][j]===whiteKing){
          allThreatenedSquares = checkThreatenedSquares("Black",squares); 
          if (allThreatenedSquares[i][j]==="threatened"){
            return true; 
          }
        }
      }
    }
  }
  else{
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if (squares[i][j]===blackKing){
          allThreatenedSquares = checkThreatenedSquares("White",squares); 
          if (allThreatenedSquares[i][j]==="threatened"){
            return true; 
          }
        }
      }
    }
  }
  return false; 
}

function isCheckmate(whitesTurn, squares){
  let legalMoves = Array(8).fill(null).map(()=>Array(8).fill(null));
  let pieceMoves; 
  if (isKingCurrentlyInCheck(whitesTurn, squares)){
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if ((whitesTurn && whitePieces.includes(squares[i][j])) ||
          (!whitesTurn && blackPieces.includes(squares[i][j]))) {
          if ((whitesTurn && squares[i][j]===whiteKnight) || (!whitesTurn && squares[i][j]===blackKnight)){
            pieceMoves = displayKnightMoves(i,j,whitesTurn,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===whitePawn) || (!whitesTurn && squares[i][j]===blackPawn)){
            pieceMoves = displayPawnMoves(i,j,whitesTurn,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===whiteBishop) || (!whitesTurn && squares[i][j]===blackBishop)){
            pieceMoves = displayBishopMoves(i,j,whitesTurn,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===whiteQueen) || (!whitesTurn && squares[i][j]===blackQueen)){
            pieceMoves = displayQueenMoves(i,j,whitesTurn,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===whiteKing) || (!whitesTurn && squares[i][j]===blackKing)){
            pieceMoves = displayKingMoves(i,j,whitesTurn,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===whiteRook) || (!whitesTurn && squares[i][j]===blackRook)){
            pieceMoves = displayRookMoves(i,j,whitesTurn,squares);
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

function isStalemate(whitesTurn, squares){
  let legalMoves = Array(8).fill(null).map(()=>Array(8).fill(null));
  let pieceMoves; 
  if (!isKingCurrentlyInCheck(whitesTurn, squares)){
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if ((whitesTurn && whitePieces.includes(squares[i][j])) ||
          (!whitesTurn && blackPieces.includes(squares[i][j]))) {
          if ((whitesTurn && squares[i][j]===whiteKnight) || (!whitesTurn && squares[i][j]===blackKnight)){
            pieceMoves = displayKnightMoves(i,j,whitesTurn,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===whitePawn) || (!whitesTurn && squares[i][j]===blackPawn)){
            pieceMoves = displayPawnMoves(i,j,whitesTurn,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===whiteBishop) || (!whitesTurn && squares[i][j]===blackBishop)){
            pieceMoves = displayBishopMoves(i,j,whitesTurn,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===whiteQueen) || (!whitesTurn && squares[i][j]===blackQueen)){
            pieceMoves = displayQueenMoves(i,j,whitesTurn,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===whiteKing) || (!whitesTurn && squares[i][j]===blackKing)){
            pieceMoves = displayKingMoves(i,j,whitesTurn,squares);
            legalMoves = squaresCombiner(pieceMoves, legalMoves); 
          }
          if ((whitesTurn && squares[i][j]===whiteRook) || (!whitesTurn && squares[i][j]===blackRook)){
            pieceMoves = displayRookMoves(i,j,whitesTurn,squares);
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
function findPieceAndDisplay(pieceRow, pieceCol, whitesTurn, squares) {
  for (let i=0; i<6; i++){
    if (squares[pieceRow][pieceCol]===whitePieces[i] || squares[pieceRow][pieceCol]===blackPieces[i]) {
      if (isKingCurrentlyInCheck(whitesTurn,squares)){
        let miscSquares;
        if (i===0){
          miscSquares = displayKingMoves(pieceRow,pieceCol,whitesTurn,squares); 
        }
        if (i===1){
          miscSquares = displayQueenMoves(pieceRow,pieceCol,whitesTurn,squares); 
        }
        if (i===2){
          miscSquares = displayRookMoves(pieceRow,pieceCol,whitesTurn,squares); 
        }
        if (i===3){
          miscSquares = displayBishopMoves(pieceRow,pieceCol,whitesTurn,squares); 
        }
        if (i===4){
          miscSquares = displayKnightMoves(pieceRow,pieceCol,whitesTurn,squares); 
        }
        if (i===5){
          miscSquares = displayPawnMoves(pieceRow,pieceCol,whitesTurn,squares); 
        }
        // Find the checked king's location and highlight it as "incheck" (bright red)
        for (let i=0; i<8; i++){
          for (let j=0; j<8; j++){
            if ((whitesTurn && squares[i][j]===whiteKing) ||
                (!whitesTurn && squares[i][j]===blackKing)){
              miscSquares[i][j]="incheck"
            }
          }
        }
        return miscSquares; 
      }
      else {
        if (i===0){
          return displayKingMoves(pieceRow,pieceCol,whitesTurn,squares);
        }
        if (i===1){
          return displayQueenMoves(pieceRow,pieceCol,whitesTurn,squares);
        }
        if (i===2){
          return displayRookMoves(pieceRow,pieceCol,whitesTurn,squares);
        }
        if (i===3){
          return displayBishopMoves(pieceRow,pieceCol,whitesTurn,squares);
        }
        if (i===4){
          return displayKnightMoves(pieceRow,pieceCol,whitesTurn,squares);
        }
        if (i===5){
          return displayPawnMoves(pieceRow,pieceCol,whitesTurn,squares);
        }
      }
    }
  }
  return null; 
}
