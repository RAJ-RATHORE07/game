import React, { useEffect, useMemo, useState } from "react";
import "./memory.css";

/*
Simple Memory (Concentration) game.
- 8 pairs (16 cards) by default
- Click to flip, match pairs to remove them
- Shows moves, matched pairs, and a Reset button
- Uses a tiny shuffle helper and simple card object model
*/

const SYMBOLS = ["🍎","🍌","🍇","🍒","🍋","🍉","🥝","🍍"]; // 8 unique symbols (pair each)

function shuffle(array) {
  // Fisher-Yates
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Memory() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // indexes currently flipped
  const [matched, setMatched] = useState([]); // indexes matched
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false); // temporary lock after flipping two

  // initialize deck
  const initialDeck = useMemo(() => {
    const doubled = [...SYMBOLS, ...SYMBOLS].map((symbol, idx) => ({
      id: idx,
      symbol,
    }));
    return shuffle(doubled);
  }, []); // one-time

  useEffect(() => {
    // set deck from initial
    setCards(initialDeck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setBusy(false);
  }, [initialDeck]);

  function resetGame() {
    const newDeck = shuffle([...SYMBOLS, ...SYMBOLS].map((s, i) => ({ id: i, symbol: s })));
    setCards(newDeck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setBusy(false);
  }

  function handleClick(idx) {
    if (busy) return;
    if (flipped.includes(idx) || matched.includes(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setBusy(true);
      setMoves((m) => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].symbol === cards[b].symbol) {
        // match
        setMatched((m) => [...m, a, b]);
        setFlipped([]);
        setBusy(false);
      } else {
        // not match -> flip back after short timeout
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 700);
      }
    }
  }

  const pairsFound = matched.length / 2;
  const totalPairs = SYMBOLS.length;
  const won = pairsFound === totalPairs;

  return (
    <div className="memory-root">
      <h2>Memory — Match the Pairs</h2>

      <div className="memory-meta">
        <div>Moves: <strong>{moves}</strong></div>
        <div>Pairs: <strong>{pairsFound}/{totalPairs}</strong></div>
        <div>
          <button className="btn" onClick={resetGame}>Reset</button>
        </div>
      </div>

      <div className={`grid ${won ? "won" : ""}`} role="grid" aria-label="Memory cards">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx) || won;
          return (
            <button
              key={idx}
              className={`card ${isFlipped ? "flipped" : ""} ${matched.includes(idx) ? "matched" : ""}`}
              onClick={() => handleClick(idx)}
              aria-pressed={isFlipped}
              aria-label={`Card ${idx + 1}`}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">{card.symbol}</div>
              </div>
            </button>
          );
        })}
      </div>

      {won && (
        <div className="congrats">
          🎉 You matched all pairs in {moves} moves!
          <button className="btn primary" style={{marginLeft:12}} onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}
