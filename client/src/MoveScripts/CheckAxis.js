// helper function for bishops, rooks, and queens

function checkAxis(currentPieceRow, currentPieceCol, rowDelta, colDelta, squares, miscSquares, whitesTurn){
    let i=currentPieceRow+rowDelta;
    let j=currentPieceCol+colDelta; 
    while (i < 8 && i >=0 && j < 8 && j >=0) {
      if (squares[i][j]==null){
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