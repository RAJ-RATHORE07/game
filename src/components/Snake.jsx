import React, { useRef, useEffect, useState } from "react";
import "./snake.css";

const CELL_SIZE = 20;
const WIDTH = 400;
const HEIGHT = 400;
const COLS = WIDTH / CELL_SIZE;
const ROWS = HEIGHT / CELL_SIZE;

function randomPosition() {
  return {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS),
  };
}

export default function Snake() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([
    { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
  ]);
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState(randomPosition());
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(6);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    function handleKey(e) {
      if (e.code === "Space") {
        setRunning((r) => !r);
        return;
      }

      if (e.key === "ArrowUp" && dir.y !== 1) setDir({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && dir.y !== -1) setDir({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && dir.x !== 1) setDir({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && dir.x !== -1) setDir({ x: 1, y: 0 });
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dir]);

  function placeFood(snakeArr) {
    let pos = randomPosition();
    if (snakeArr.some((p) => p.x === pos.x && p.y === pos.y)) {
      return placeFood(snakeArr);
    }
    return pos;
  }

  useEffect(() => {
    function loop(timestamp) {
      if (!lastFrameRef.current) lastFrameRef.current = timestamp;
      const delta = (timestamp - lastFrameRef.current) / 1000;
      const interval = 1 / speed;

      if (running && delta >= interval) {
        update();
        lastFrameRef.current = timestamp;
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, dir, snake, food, speed]);

  function update() {
    setSnake((prev) => {
      const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };

      if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) {
        setRunning(false);
        return prev;
      }

      if (prev.some((p) => p.x === head.x && p.y === head.y)) {
        setRunning(false);
        return prev;
      }

      const newSnake = [head, ...prev];

      if (head.x === food.x && head.y === food.y) {
        setScore((s) => {
          const newScore = s + 1;
          if (newScore % 5 === 0) setSpeed((sp) => Math.min(20, sp + 1));
          return newScore;
        });

        setFood(placeFood(newSnake));
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    ctx.fillStyle = "#16a34a";
    snake.forEach((p, i) => {
      ctx.fillRect(p.x * CELL_SIZE, p.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
  }, [snake, food]);

  function reset() {
    setSnake([{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }]);
    setDir({ x: 1, y: 0 });
    setFood(randomPosition());
    setRunning(true);
    setScore(0);
    setSpeed(6);
  }

  return (
    <div className="snake-root">
      <h2>Snake</h2>

      <div className="snake-meta">
        <div>Score: <strong>{score}</strong></div>
        <div>Speed: <strong>{speed}</strong></div>
        <div>Status: <strong>{running ? "Running" : "Paused/Game Over"}</strong></div>
      </div>

      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="snake-canvas"
      />

      <div className="snake-controls">
        <button className="btn" onClick={() => setRunning((r) => !r)}>
          {running ? "Pause" : "Resume"}
        </button>

        <button className="btn primary" onClick={reset}>Restart</button>
      </div>

      <p className="hint">Use Arrow Keys • Space = Pause</p>
    </div>
  );
}
