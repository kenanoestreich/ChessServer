import Enums from '../../Enums.js'
import checkAxis from '../CheckAxis.js';

// ALL THE "display_____Moves" FUNCTIONS DO THE FOLLOWING (ONLY DIFFERENCE IS HOW THAT PIECE MOVES):
// input current board state and piece location to move and change css for all the 
// legal move squares to highlight a new color. 

// Bishops 

function displayBishopMoves(currentPieceRow, currentPieceCol, whitesTurn, squares) {
  let miscSquares = Array(8).fill(null).map(()=>Array(8).fill(null));
  if ((whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.blackBishop) 
      || (!whitesTurn && squares[currentPieceRow][currentPieceCol]===Enums.whiteBishop)){
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

export default displayBishopMoves; 