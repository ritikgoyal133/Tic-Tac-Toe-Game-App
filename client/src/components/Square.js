import React from "react";

const Square = ({ value, isWinning, onClick }) => {
  return (
    <button
      className={`square ${isWinning ? "winning" : ""}`} //Add animation class
      onClick={onClick}
      disabled={value !== null}
    >
      {value}
    </button>
  );
};

export default Square;
