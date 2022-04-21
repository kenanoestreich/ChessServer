import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import io from 'socket.io-client';
let socket = io("http://ec2-184-73-74-122.compute-1.amazonaws.com:3456/");
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

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

let pieceClickedRow; 
let pieceClickedCol;

const container = document.getElementById("root"); 
const root = createRoot(container);

function Square(props) {
  return (
    <button className={props.squareColor} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
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
  }

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
    };
  }

  handleClick(i,j) {
    let history = JSON.parse(JSON.stringify(this.state.history));
    const current = history[this.state.stepNumber];
    let newSquares = JSON.parse(JSON.stringify(current.squares));
    let newMiscSquares = JSON.parse(JSON.stringify(this.state.miscSquares));
    let newStep = this.state.stepNumber; 
    newStep++; 
    let newTurn = this.state.whitesTurn; 
    newTurn = !newTurn; 

    if (newMiscSquares[i][j]==="threatened" || newMiscSquares[i][j]==="possible"){
      newSquares = movePiece(i,j,pieceClickedRow,pieceClickedCol,newSquares)
      history.push({squares: newSquares});
      this.setState({
        history: history,
        whitesTurn: newTurn,
        stepNumber: newStep,
        miscSquares: Array(8).fill(null).map(()=>Array(8).fill(null))
      }) 
      return; 
    }
  
    
    // TO DO: CHECK FOR CHECKMATE!!!
    // if (calculateWinner(squares)) {
    //   return;
    // }

    // show bishop moves

    if (current.squares[i][j]===blackBishop || current.squares[i][j]===whiteBishop) {
      this.setState({
        miscSquares: displayBishopMoves(i,j,this.state.whitesTurn,current.squares),
      });
      pieceClickedRow = i; 
      pieceClickedCol = j; 
    }

    // show knight moves

    if (current.squares[i][j]===blackKnight || current.squares[i][j]===whiteKnight) {
      this.setState({
        miscSquares: displayKnightMoves(i,j,this.state.whitesTurn, current.squares),
      });
      pieceClickedRow = i; 
      pieceClickedCol = j; 
    }

    // show pawn moves

    if (current.squares[i][j]===blackPawn || current.squares[i][j]===whitePawn) {
      this.setState({
        miscSquares: displayPawnMoves(i,j,this.state.whitesTurn, current.squares),
      }); 
      pieceClickedRow = i; 
      pieceClickedCol = j; 
    }

    // show rook moves

    if (current.squares[i][j]===blackRook || current.squares[i][j]===whiteRook) {
      this.setState({
        miscSquares: displayRookMoves(i,j,this.state.whitesTurn, current.squares),
      });
      pieceClickedRow = i; 
      pieceClickedCol = j; 
    }

    // show queen moves

    if (current.squares[i][j]===blackQueen || current.squares[i][j]===whiteQueen) {
      this.setState({
        miscSquares: displayQueenMoves(i,j,this.state.whitesTurn, current.squares),
      });
      pieceClickedRow = i; 
      pieceClickedCol = j; 
    }

    // show king moves

    if (current.squares[i][j]===blackKing || current.squares[i][j]===whiteKing) {
      this.setState({
        miscSquares: displayKingMoves(i,j,this.state.whitesTurn, current.squares),
      });
      pieceClickedRow = i; 
      pieceClickedCol = j; 
    }

    // reset possible moves highlights

    if (current.squares[i][j]===null){
      this.setState({
        miscSquares: Array(8).fill(null).map(()=>Array(8).fill(null)),
      }); 
      pieceClickedRow = null; 
      pieceClickedCol = null; 
    }
    
    // TO DO: ONLY PLACE A PIECE IF A PIECE HAS BEEN CLICKED AND THE NEW SQUARE IS A LEGAL MOVE!!!
    // squares[i][j] = this.state.whitesTurn ? "X" : "O"; 

    // this.setState({
    //   history: history.concat([
    //     {
    //       squares: squares
    //     }
    //   ]),
    //   stepNumber: history.length,
    //   whitesTurn: !this.state.whitesTurn
    // });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      whitesTurn: (step % 2) === 0
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
          return (
            <li id={move} key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          );
        }
        else if (move%2===0) {
          const desc = "Black's Move"
          const root = createRoot(document.getElementById(move-1));
          root.render(<span><button onClick={() => this.jumpTo(move-1)}>White's Move</button>
          <button onClick={() => this.jumpTo(move)}>{desc}</button></span>)
        }
      }
      else{
        return (
          <div></div>
        );
      }
    });

    let status;
    status = "Next player: " + (this.state.whitesTurn ? "White" : "Black");

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
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

root.render(<Game />); 

function calculateWinner(squares) {
  // Calculate if checkmate or stalemate
  return null;
}

// ALL THE "display_____Moves" FUNCTIONS DO THE FOLLOWING (ONLY DIFFERENCE IS HOW THAT PIECE MOVES):
// input current board state and piece location to move and change css for all the 
// legal move squares to highlight a new color. 

// Knights
function displayKnightMoves(currentPieceRow, currentPieceCol, whitesTurn, squares) {
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

// Pawns
function displayPawnMoves(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===blackPawn) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===whitePawn)){
    return miscSquares; 
  }

  // white pawn hasn't moved yet
  if (whitesTurn && currentPieceRow===6) {
    if (squares[currentPieceRow-1][currentPieceCol]===null){
      miscSquares[currentPieceRow-1][currentPieceCol]="possible"; 
      if (squares[currentPieceRow-2][currentPieceCol]===null){
        miscSquares[currentPieceRow-2][currentPieceCol]="possible"; 
      }
    }
    if ((currentPieceCol-1)>=0){
      if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
        miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
      }
    }
    if ((currentPieceCol+1)<8){
      if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
        miscSquares[currentPieceRow-1][currentPieceCol+1]="threatened"; 
      }
    }
  }

  // black pawn hasn't moved yet
  if (!whitesTurn && currentPieceRow===1) {
    if (squares[currentPieceRow+1][currentPieceCol]===null){
      miscSquares[currentPieceRow+1][currentPieceCol]="possible"; 
      if (squares[currentPieceRow+2][currentPieceCol]===null){
        miscSquares[currentPieceRow+2][currentPieceCol]="possible"; 
      }
    }
    if ((currentPieceCol-1)>=0){
      if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
        miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
      }
    }
    if ((currentPieceCol+1)<8){
      if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
        miscSquares[currentPieceRow+1][currentPieceCol+1]="threatened"; 
      }
    }
  }

  // white pawn has moved
  if (whitesTurn && currentPieceRow!==6) {
    if (squares[currentPieceRow-1][currentPieceCol]===null){
      miscSquares[currentPieceRow-1][currentPieceCol]="possible"; 
    }
    if ((currentPieceCol-1)>=0){
      if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
        miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
      }
    }
    if ((currentPieceCol+1)<8){
      if (blackPieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
        miscSquares[currentPieceRow-1][currentPieceCol+1]="threatened"; 
      }
    }
  }

  // black pawn has moved
  if (!whitesTurn && currentPieceRow!==1) {
    if (squares[currentPieceRow+1][currentPieceCol]===null){
      miscSquares[currentPieceRow+1][currentPieceCol]="possible"; 
    }
    if ((currentPieceCol-1)>=0){
      if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
        miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
      }
    }
    if ((currentPieceCol+1)<8){
      if (whitePieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
        miscSquares[currentPieceRow+1][currentPieceCol+1]="threatened"; 
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

// Kings
// TO DO: NEED TO NOT DISPLAY MOVES THAT WOULD PUT THE KING IN CHECK AND CASTLING
function displayKingMoves(currentPieceRow, currentPieceCol, whitesTurn, squares) {
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
  // remove any moves that would put the king in check (probably make a helper function)
  let squaresInCheck; 
  if (whitesTurn){
    squaresInCheck = checkThreatenedSquares("Black", squares);
  }
  else {
    squaresInCheck = checkThreatenedSquares("White", squares); 
  }

  for (let i=0; i<8; i++){
    for (let j=0; j<8; j++){
      if (squaresInCheck[i][j]==="threatened"){
        miscSquares[i][j]=null; 
      }
    }
  }

  // Highlight selected piece
  miscSquares[currentPieceRow][currentPieceCol]="selected";
  return miscSquares;
}

// helper function for bishops, rooks, and queens
function checkAxis(currentPieceRow, currentPieceCol, rowDelta, colDelta, squares, miscSquares, whitesTurn){
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
    i+=rowDelta
    j+=colDelta;
  }
  return miscSquares;
}

// Function for actually moving the pieces
function movePiece(endRow, endCol, startRow, startCol, squares){
  let startpiece = squares[startRow][startCol];
  let endpiece=null;
  if (squares[endRow][endCol]!==null){
    endpiece = squares[endRow][endCol];
  }
  squares[startRow][startCol]=null; 
  squares[endRow][endCol]=startpiece; 
  // logTakenPiece(endpiece) 
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
          pieceThreats=displayRookMoves(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===blackKnight){
          pieceThreats=displayKnightMoves(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===blackBishop){
          pieceThreats=displayBishopMoves(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===blackQueen){
          pieceThreats=displayQueenMoves(i,j,false,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===blackKing){
          pieceThreats=displayKingMoves(i,j,false,squares); 
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
          pieceThreats=displayRookMoves(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===whiteKnight){
          pieceThreats=displayKnightMoves(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===whiteBishop){
          pieceThreats=displayBishopMoves(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===whiteQueen){
          pieceThreats=displayQueenMoves(i,j,true,squares); 
          allThreatenedSquares=squaresCombiner(pieceThreats,allThreatenedSquares); 
        }
        else if (squares[i][j]===whiteKing){
          pieceThreats=displayKingMoves(i,j,true,squares); 
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
// Function to add a piece to the list of taken pieces
// function logTakenPiece(endpiece){

// }
