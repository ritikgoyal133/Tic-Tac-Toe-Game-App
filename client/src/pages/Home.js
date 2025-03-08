import React from "react";
import { useNavigate } from "react-router-dom";
import PlayerSetup from "../components/PlayerSetup";

const Home = ({ onSetup }) => {
  const navigate = useNavigate();

  const handleSetup = (player1, player2) => {
    const players = { player1, player2 };
    localStorage.setItem("players", JSON.stringify(players)); //Save players in localStorage
    onSetup(players);
    navigate("/game");
  };

  return <PlayerSetup onSetup={handleSetup} />;
};

export default Home;
