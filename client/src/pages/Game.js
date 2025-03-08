import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../components/Board";
import { toast } from "react-toastify";

const Game = ({ players }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!players?.player1 || !players?.player2) {
      navigate("/"); // Redirect to home if players are missing
    }
  }, [players, navigate]);

  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(players?.player1);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [winningSquares, setWinningSquares] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false); //Prevents multiple moves at once

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsDraw(false);
    setWinningSquares([]);
    setCurrentPlayer(players?.player1);
    setIsProcessing(false);
  };

  const checkWinner = (squares) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winnerSymbol: squares[a], winningCombo: combination };
      }
    }
    return null;
  };

  //Prevents multiple moves at once
  const handleSquareClick = useCallback(
    (index, isAI = false) => {
      if (board[index]) {
        if (!isAI) toast.error("Invalid move! This spot is already taken.");
        return;
      }
      if (winner || isDraw || isProcessing) {
        if (!isAI) toast.error("Invalid move! The game is already over.");
        return;
      }

      setIsProcessing(true);

      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[index] = currentPlayer.symbol;

        setTimeout(() => {
          const gameWinner = checkWinner(newBoard);
          if (gameWinner) {
            setWinner(currentPlayer.name);
            setWinningSquares(gameWinner.winningCombo);
            toast.success(`${currentPlayer.name} Wins! 🎉`); //Show toast for AI and human wins
          } else if (!newBoard.includes(null)) {
            setIsDraw(true);
            toast.success("Match Draw! 🤝"); //Show toast for draw
          } else {
            setCurrentPlayer(
              currentPlayer === players.player1
                ? players.player2
                : players.player1
            );
          }
          setIsProcessing(false);
        }, 200);

        return newBoard;
      });
    },
    [board, winner, isDraw, currentPlayer, players, isProcessing]
  );

  //AI Logic: Ensures Only One Move Per Turn
  const handleComputerMove = useCallback(() => {
    if (isProcessing || winner || isDraw) return;

    let availableMoves = board
      .map((val, index) => (val === null ? index : null))
      .filter((val) => val !== null);

    if (availableMoves.length === 0) return;

    let selectedMove = null;

    //Step 1: Check if AI can win
    for (let move of availableMoves) {
      let tempBoard = [...board];
      tempBoard[move] = currentPlayer.symbol;
      if (checkWinner(tempBoard)?.winnerSymbol === currentPlayer.symbol) {
        selectedMove = move;
        break;
      }
    }

    // Step 2: Block opponent if needed
    if (!selectedMove) {
      const opponent =
        currentPlayer === players.player1 ? players.player2 : players.player1;
      for (let move of availableMoves) {
        let tempBoard = [...board];
        tempBoard[move] = opponent.symbol;
        if (checkWinner(tempBoard)?.winnerSymbol === opponent.symbol) {
          selectedMove = move;
          break;
        }
      }
    }

    //Step 3: Take center square if available
    if (!selectedMove && availableMoves.includes(4)) {
      selectedMove = 4;
    }

    //Step 4: Take a corner if available
    if (!selectedMove) {
      const corners = [0, 2, 6, 8].filter((move) =>
        availableMoves.includes(move)
      );
      if (corners.length > 0) {
        selectedMove = corners[Math.floor(Math.random() * corners.length)];
      }
    }

    //Step 5: Pick any available move
    if (!selectedMove) {
      selectedMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    setTimeout(() => {
      handleSquareClick(selectedMove, true); //Pass `true` to prevent duplicate toast
    }, 500);
  }, [
    board,
    currentPlayer,
    players,
    winner,
    isDraw,
    handleSquareClick,
    isProcessing,
  ]);

  useEffect(() => {
    if (!winner && !isDraw && currentPlayer?.isComputer) {
      setTimeout(() => handleComputerMove(), 500); //Ensures AI only moves once per turn
    }
  }, [currentPlayer, winner, isDraw, handleComputerMove]);

  return (
    <>
      {!players?.player1 || !players?.player2 ? (
        navigate("/")
      ) : (
        <div className="game-container">
          <h2>Tic-Tac-Toe</h2>
          {winner ? (
            <h3>Winner: {winner} 🎉</h3>
          ) : isDraw ? (
            <h3>Match Draw 🤝</h3>
          ) : (
            <h3>Turn: {currentPlayer?.name}</h3>
          )}
          <Board
            squares={board}
            winningSquares={winningSquares}
            onSquareClick={handleSquareClick}
          />
          <div className="restart-container">
            <button className="btn btn-danger restart-btn" onClick={resetGame}>
              Restart
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Game;
