import React, { useState } from "react";
import "./ticstyles.css";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board);

  function handleClick(i) {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  function resetBoard() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="tic-container">
      <h2>Tic Tac Toe</h2>

      <div className="status">
        {winner ? `Winner: ${winner}` : `Turn: ${xIsNext ? "X" : "O"}`}
      </div>

      <div className="board">
        {board.map((value, index) => (
          <button key={index} onClick={() => handleClick(index)} className="square">
            {value}
          </button>
        ))}
      </div>

      <button className="btn primary" onClick={resetBoard}>
        Reset
      </button>
    </div>
  );
}

function calculateWinner(s) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let [a,b,c] of lines) {
    if (s[a] && s[a] === s[b] && s[a] === s[c]) return s[a];
  }
  return null;
}
