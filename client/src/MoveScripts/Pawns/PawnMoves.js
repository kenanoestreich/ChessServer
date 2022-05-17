import Enums from "../../Enums";
import movePiece from "../MovePiece";
import isKingCurrentlyInCheck from "../../CheckScripts/IsKingCurrentlyInCheck";

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
          if (Enums.blackPieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
            miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
            squares_copy = JSON.parse(JSON.stringify(squares)); 
            newSquares = movePiece(currentPieceRow-1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
            if (isKingCurrentlyInCheck(playerColor,newSquares,playerColor)){
              miscSquares[currentPieceRow-1][currentPieceCol-1]=null; 
            }
          }
        }
        if ((currentPieceCol+1)<8){
          if (Enums.blackPieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
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
          if (Enums.whitePieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
            miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
            squares_copy = JSON.parse(JSON.stringify(squares)); 
            newSquares = movePiece(currentPieceRow+1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
            if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
              miscSquares[currentPieceRow+1][currentPieceCol]=null; 
            }
          }
        }
        if ((currentPieceCol+1)<8){
          if (Enums.whitePieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
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
          if (Enums.blackPieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
            miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
            squares_copy = JSON.parse(JSON.stringify(squares)); 
            newSquares = movePiece(currentPieceRow-1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
            if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
              miscSquares[currentPieceRow-1][currentPieceCol-1]=null; 
            }
          }
        }
        if ((currentPieceCol+1)<8){
          if (Enums.blackPieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
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
          if (Enums.whitePieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
            miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
            squares_copy = JSON.parse(JSON.stringify(squares)); 
            newSquares = movePiece(currentPieceRow+1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
            if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
              miscSquares[currentPieceRow+1][currentPieceCol-1]=null; 
            }
          }
        }
        if ((currentPieceCol+1)<8){
          if (Enums.whitePieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
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
          if (Enums.whitePieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
            miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
            squares_copy = JSON.parse(JSON.stringify(squares)); 
            newSquares = movePiece(currentPieceRow-1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
            if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
              miscSquares[currentPieceRow-1][currentPieceCol-1]=null; 
            }
          }
        }
        if ((currentPieceCol+1)<8){
          if (Enums.whitePieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
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
          if (Enums.blackPieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
            miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
            squares_copy = JSON.parse(JSON.stringify(squares)); 
            newSquares = movePiece(currentPieceRow+1,currentPieceCol,currentPieceRow,currentPieceCol,squares_copy)
            if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
              miscSquares[currentPieceRow+1][currentPieceCol]=null; 
            }
          }
        }
        if ((currentPieceCol+1)<8){
          if (Enums.blackPieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
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
          if (Enums.whitePieces.includes(squares[currentPieceRow-1][currentPieceCol-1])){
            miscSquares[currentPieceRow-1][currentPieceCol-1]="threatened"; 
            squares_copy = JSON.parse(JSON.stringify(squares)); 
            newSquares = movePiece(currentPieceRow-1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
            if (isKingCurrentlyInCheck("black",newSquares,playerColor)){
              miscSquares[currentPieceRow-1][currentPieceCol-1]=null; 
            }
          }
        }
        if ((currentPieceCol+1)<8){
          if (Enums.whitePieces.includes(squares[currentPieceRow-1][currentPieceCol+1])){
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
          if (Enums.blackPieces.includes(squares[currentPieceRow+1][currentPieceCol-1])){
            miscSquares[currentPieceRow+1][currentPieceCol-1]="threatened"; 
            squares_copy = JSON.parse(JSON.stringify(squares)); 
            newSquares = movePiece(currentPieceRow+1,currentPieceCol-1,currentPieceRow,currentPieceCol,squares_copy)
            if (isKingCurrentlyInCheck("white",newSquares,playerColor)){
              miscSquares[currentPieceRow+1][currentPieceCol-1]=null; 
            }
          }
        }
        if ((currentPieceCol+1)<8){
          if (Enums.blackPieces.includes(squares[currentPieceRow+1][currentPieceCol+1])){
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

export default displayPawnMoves; 
