import React from "react";
import Square from "./Square";

const Board = ({ squares, winningSquares, onSquareClick }) => {
  return (
    <div className="board">
      {squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          isWinning={winningSquares.includes(index)}
          onClick={() => onSquareClick(index)}
        />
      ))}
    </div>
  );
};

export default Board;
