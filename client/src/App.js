import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
  //Load players from localStorage on first render
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem("players");
    return savedPlayers ? JSON.parse(savedPlayers) : null;
  });

  //Store players in localStorage whenever they change
  useEffect(() => {
    if (players) {
      localStorage.setItem("players", JSON.stringify(players));
    }
  }, [players]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onSetup={setPlayers} />} />
        <Route path="/game" element={<Game players={players} />} />
      </Routes>
    </Router>
  );
}

export default App;
