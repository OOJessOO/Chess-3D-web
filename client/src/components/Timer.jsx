import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Chess clock / timer component.
 * Manages two countdowns (white and black).
 *
 * Props:
 *  - initialTime: time in seconds per player
 *  - activeTurn: 'w' or 'b' — whose clock is running
 *  - gameOver: boolean — pauses both clocks
 *  - onTimeUp: (color) => void — called when a player's time hits 0
 *  - paused: boolean — external pause (e.g. during AI thinking)
 */
export default function Timer({ initialTime = 600, activeTurn, gameOver, onTimeUp, paused }) {
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);
  const whiteRef = useRef(initialTime);
  const blackRef = useRef(initialTime);
  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();
    whiteRef.current = initialTime;
    blackRef.current = initialTime;
    setWhiteTime(initialTime);
    setBlackTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (gameOver || paused) {
      clearTimer();
      return;
    }

    clearTimer();
    intervalRef.current = setInterval(() => {
      if (activeTurn === 'w') {
        whiteRef.current -= 1;
        setWhiteTime(whiteRef.current);
        if (whiteRef.current <= 0) {
          clearTimer();
          onTimeUp?.('w');
        }
      } else if (activeTurn === 'b') {
        blackRef.current -= 1;
        setBlackTime(blackRef.current);
        if (blackRef.current <= 0) {
          clearTimer();
          onTimeUp?.('b');
        }
      }
    }, 1000);

    return clearTimer;
  }, [activeTurn, gameOver, paused, onTimeUp, clearTimer]);

  const format = (secs) => {
    if (secs < 0) secs = 0;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isLow = (secs) => secs <= 30;

  return (
    <div className="timer-row">
      <div className={`timer-card ${activeTurn === 'b' ? 'active' : ''}`}>
        <span className="turn-dot b" />
        <span className={`timer-value ${isLow(blackTime) ? 'low' : ''}`}>
          {format(blackTime)}
        </span>
      </div>
      <div className={`timer-card ${activeTurn === 'w' ? 'active' : ''}`}>
        <span className="turn-dot w" />
        <span className={`timer-value ${isLow(whiteTime) ? 'low' : ''}`}>
          {format(whiteTime)}
        </span>
      </div>
    </div>
  );
}
