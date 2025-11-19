import React, { useState, useEffect } from "react";
import TicTacToe from "./components/TicTacToe";
import RockPaperScissors from "./components/RockPaperScissors";
import Snake from "./components/Snake";
import Memory from "./components/Memory";

export default function App() {
  const [game, setGame] = useState("tictactoe");

  // keyboard shortcuts: 1 - TicTacToe, 2 - RPS, 3 - Snake, 4 - Memory
  useEffect(() => {
    function onKey(e) {
      if (e.key === "1") setGame("tictactoe");
      if (e.key === "2") setGame("rps");
      if (e.key === "3") setGame("snake");
      if (e.key === "4") setGame("memory");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app-root">
      <h1>Games Project</h1>

      <div
        style={{
          marginTop: 15,
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
        role="tablist"
        aria-label="Game selector"
      >
        <button
          className={game === "tictactoe" ? "btn primary" : "btn"}
          onClick={() => setGame("tictactoe")}
          aria-pressed={game === "tictactoe"}
          title="1 — Tic Tac Toe"
        >
          Tic Tac Toe
        </button>

        <button
          className={game === "rps" ? "btn primary" : "btn"}
          onClick={() => setGame("rps")}
          aria-pressed={game === "rps"}
          title="2 — Rock Paper Scissors"
        >
          Rock Paper Scissors
        </button>

        <button
          className={game === "snake" ? "btn primary" : "btn"}
          onClick={() => setGame("snake")}
          aria-pressed={game === "snake"}
          title="3 — Snake"
        >
          Snake
        </button>

        <button
          className={game === "memory" ? "btn primary" : "btn"}
          onClick={() => setGame("memory")}
          aria-pressed={game === "memory"}
          title="4 — Memory"
        >
          Memory
        </button>
      </div>

      <div style={{ marginTop: 18, minHeight: 420 }}>
        {game === "tictactoe" && <TicTacToe />}
        {game === "rps" && <RockPaperScissors />}
        {game === "snake" && <Snake />}
        {game === "memory" && <Memory />}
      </div>

      <div className="footer" style={{ marginTop: 18 }}>
        Built using React + Vite — shortcuts: <strong>1</strong>=TicTacToe, <strong>2</strong>=RPS, <strong>3</strong>=Snake, <strong>4</strong>=Memory
      </div>
    </div>
  );
}
