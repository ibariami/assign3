import { useState } from 'react';

//added isSelected prop to Square
function Square({ value, onSquareClick, isSelected }) {
  return (
    <button 
      className="square" 
      onClick={onSquareClick}
      //apply yellow background if this square is selected
      style={isSelected ? { backgroundColor: '#ffeb3b' } : null}
    >
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  
  //state to track which piece the user wants to move (index 0-8)
  const [selected, setSelected] = useState(null);

  function handleClick(i) {
    if (calculateWinner(squares)) {
      return;
    }

    //determine whose turn it is and count how many pieces they have on the board
    const currentPlayer = xIsNext ? 'X' : 'O';
    const pieceCount = squares.filter((s) => s === currentPlayer).length;

    //phase detection: if player has 3 pieces they are in the movement phase
    if (pieceCount >= 3) {
      //if no piece is selected select the clicked piece if it belongs to the current player
      if (selected === null) {
        if (squares[i] === currentPlayer) {
          setSelected(i);
        }
      } else {
        //second click: if destination is occupied clear selection to revert the invalid move
        if (squares[i]) {
          setSelected(null);
          return;
        }
        
        //second click: if destination is empty move the piece
        const nextSquares = squares.slice();
        nextSquares[selected] = null; //clear old square
        nextSquares[i] = currentPlayer; //fill new square
        
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
        setSelected(null); //reset selection for the next player
      }
      return; 
    }

    //og placement phase logic for first 3 moves per player
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = currentPlayer;
    
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {/* passed isSelected prop to every square comparing its index to selected */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isSelected={selected === 0} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isSelected={selected === 1} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isSelected={selected === 2} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isSelected={selected === 3} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isSelected={selected === 4} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isSelected={selected === 5} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isSelected={selected === 6} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isSelected={selected === 7} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isSelected={selected === 8} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}