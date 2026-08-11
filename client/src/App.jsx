import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from './utils/api.js';
import Scene from './components/Scene.jsx';
import Hud from './components/Hud.jsx';
import Sidebar from './components/Sidebar.jsx';
import PromotionDialog from './components/PromotionDialog.jsx';

const EMPTY_BOARD = Array.from({ length: 8 }, () => Array(8).fill(null));

export default function App() {
  const { t } = useTranslation();

  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [turn, setTurn] = useState('w');
  const [status, setStatus] = useState('in-progress');
  const [inCheck, setInCheck] = useState(false);
  const [legalMoves, setLegalMoves] = useState({});
  const [captured, setCaptured] = useState({ w: [], b: [] });
  const [moves, setMoves] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const applyState = useCallback((data) => {
    setBoard(data.board || EMPTY_BOARD);
    setTurn(data.turn);
    setStatus(data.status);
    setInCheck(data.check);
    setLegalMoves(data.legalMoves || {});
    setCaptured(data.captured || { w: [], b: [] });
    setMoves(data.moves || []);
    setLastMove(data.moves?.[data.moves.length - 1] || null);
    setSelected(null);
    setPromotion(null);
  }, []);

  const startGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBoard(EMPTY_BOARD);
    try {
      const data = await api.createGame();
      setGameId(data.id);
      applyState(data);
    } catch (err) {
      setError(t('errors.loadGame'));
    } finally {
      setLoading(false);
    }
  }, [applyState, t]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const sendMove = useCallback(
    async (from, to, promotion) => {
      try {
        const data = await api.makeMove(gameId, { from, to, promotion });
        applyState(data);
      } catch (err) {
        setError(t('errors.move'));
      }
    },
    [gameId, applyState, t]
  );

  const onSquareClick = useCallback(
    (square) => {
      if (loading || status !== 'in-progress' || promotion) return;

      const targets = legalMoves[square] || [];
      const isTarget = selected && legalMoves[selected]?.some((m) => m.to === square);

      if (isTarget) {
        const move = legalMoves[selected].find((m) => m.to === square);
        if (move.promotion) {
          setPromotion({ from: selected, to: square });
        } else {
          sendMove(selected, square);
        }
        return;
      }

      if (selected === square) {
        setSelected(null);
      } else if (targets.length > 0) {
        setSelected(square);
      } else {
        setSelected(null);
      }
    },
    [loading, status, promotion, legalMoves, selected, sendMove]
  );

  const onPromotionSelect = (piece) => {
    if (!promotion) return;
    sendMove(promotion.from, promotion.to, piece);
  };

  const resetView = () => setResetKey((k) => k + 1);

  return (
    <div className="app">
      <Hud
        status={status}
        turn={turn}
        inCheck={inCheck}
        onNewGame={startGame}
        onResetView={resetView}
      />

      <Sidebar captured={captured} moves={moves} />

      <div className="scene-wrap">
        <Scene
          key={resetKey}
          board={board}
          moves={legalMoves}
          selected={selected}
          lastMove={lastMove}
          onSquareClick={onSquareClick}
        />
        {loading && (
          <div className="overlay">
            <div className="spinner" />
            <span>{t('loading')}</span>
          </div>
        )}
        {error && (
          <div className="overlay">
            <span className="error">{error}</span>
          </div>
        )}
      </div>

      {promotion && (
        <PromotionDialog
          color={turn}
          onSelect={onPromotionSelect}
          onCancel={() => setPromotion(null)}
        />
      )}
    </div>
  );
}
