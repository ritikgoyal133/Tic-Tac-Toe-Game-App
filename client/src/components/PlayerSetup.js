import React, { useState } from "react";
import "../styles/PlayerSetup.css";

const PlayerSetup = ({ onSetup }) => {
  const [player1, setPlayer1] = useState({ name: "", symbol: "O" });
  const [player2, setPlayer2] = useState({
    name: "",
    symbol: "X",
    isComputer: false,
  });

  const handleSubmit = () => {
    if (!player1.name.trim()) {
      alert("Player 1 must enter a name!");
      return;
    }
    if (!player2.name.trim() && !player2.isComputer) {
      alert("Player 2 must enter a name!");
      return;
    }
    onSetup(player1, player2);
  };

  return (
    <div className="player-setup-container">
      <div className="player-setup-card">
        <h2>Player Setup</h2>

        <div className="player-input">
          <label>Player 1 Name:</label>
          <input
            type="text"
            placeholder="Enter Player 1 name"
            value={player1.name}
            onChange={(e) => setPlayer1({ ...player1, name: e.target.value })}
          />
        </div>

        <div className="player-checkbox">
          <label>
            <input
              type="checkbox"
              checked={player2.isComputer}
              onChange={(e) =>
                setPlayer2({
                  ...player2,
                  isComputer: e.target.checked,
                  name: e.target.checked ? "Computer" : "",
                })
              }
            />
            Is Player 2 a Computer?
          </label>
        </div>

        {!player2.isComputer && (
          <div className="player-input">
            <label>Player 2 Name:</label>
            <input
              type="text"
              placeholder="Enter Player 2 name"
              value={player2.name}
              onChange={(e) => setPlayer2({ ...player2, name: e.target.value })}
            />
          </div>
        )}

        <button className="start-game-btn" onClick={handleSubmit}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;
