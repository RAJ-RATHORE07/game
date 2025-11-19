import React, { useState } from "react";
import "./rpsstyles.css";

export default function RockPaperScissors() {
  const choices = ["Rock", "Paper", "Scissors"];

  const [player, setPlayer] = useState("");
  const [cpu, setCpu] = useState("");
  const [result, setResult] = useState("");

  function play(choice) {
    const cpuChoice = choices[Math.floor(Math.random() * 3)];

    setPlayer(choice);
    setCpu(cpuChoice);

    if (choice === cpuChoice) setResult("It's a Draw!");
    else if (
      (choice === "Rock" && cpuChoice === "Scissors") ||
      (choice === "Paper" && cpuChoice === "Rock") ||
      (choice === "Scissors" && cpuChoice === "Paper")
    ) {
      setResult("You Win!");
    } else {
      setResult("CPU Wins!");
    }
  }

  return (
    <div className="rps-container">
      <h2>Rock Paper Scissors</h2>

      <div className="choices">
        {choices.map((c) => (
          <button key={c} onClick={() => play(c)} className="btn">
            {c}
          </button>
        ))}
      </div>

      <div className="output">
        <p>You: {player}</p>
        <p>CPU: {cpu}</p>
        <h3>{result}</h3>
      </div>
    </div>
  );
}
