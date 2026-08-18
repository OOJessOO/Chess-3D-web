import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from './utils/api.js';
import { getBestMove } from './utils/chessAI.js';
import Scene from './components/Scene.jsx';
import Hud from './components/Hud.jsx';
import Sidebar from './components/Sidebar.jsx';
import Timer from './components/Timer.jsx';
import PromotionDialog from './components/PromotionDialog.jsx';
import GameSetup from './components/GameSetup.jsx';

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

  const [showSetup, setShowSetup] = useState(true);
  const [gameConfig, setGameConfig] = useState(null);
  const [aiMode, setAiMode] = useState(false);
  const [aiColor, setAiColor] = useState('b');
  const [aiLevel, setAiLevel] = useState(2);
  const [aiThinking, setAiThinking] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const aiThinkingRef = useRef(false);

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
    if (data.status !== 'in-progress') {
      setGameOver(true);
      setTimerActive(false);
    }
  }, []);

  const startGame = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    setBoard(EMPTY_BOARD);
    setGameOver(false);
    setAiThinking(false);
    aiThinkingRef.current = false;

    if (config) {
      setGameConfig(config);
      setAiMode(config.mode === 'ai');
      setAiColor(config.aiColor || 'b');
      setAiLevel(config.aiLevel || 2);
      setTimerActive(config.timeControl !== Infinity);
      setShowSetup(false);
    }

    try {
      const data = await api.createGame();
      setGameId(data.id);
      applyState(data);

      const effectiveConfig = config || gameConfig;
      if (effectiveConfig?.mode === 'ai' && effectiveConfig?.aiColor === 'w') {
        setAiThinking(true);
        aiThinkingRef.current = true;
        setTimeout(() => {
          makeAIMove(data.fen, data.id, 'w', effectiveConfig.aiLevel);
        }, 300);
      }
    } catch (err) {
      setError(t('errors.loadGame'));
    } finally {
      setLoading(false);
    }
  }, [applyState, t, gameConfig]);

  useEffect(() => {
    startGame();
  }, []);

  const makeAIMove = useCallback(async (fen, gId, color, level) => {
    try {
      const move = getBestMove(fen, color, level || 2);
      if (!move) {
        setAiThinking(false);
        aiThinkingRef.current = false;
        return;
      }
      const data = await api.makeMove(gId, move);
      applyState(data);
      setAiThinking(false);
      aiThinkingRef.current = false;
    } catch (err) {
      setAiThinking(false);
      aiThinkingRef.current = false;
    }
  }, [applyState]);

  const sendMove = useCallback(
    async (from, to, promotionPiece) => {
      try {
        const data = await api.makeMove(gameId, { from, to, promotion: promotionPiece });
        applyState(data);

        if (aiMode && data.status === 'in-progress' && data.turn === aiColor) {
          setAiThinking(true);
          aiThinkingRef.current = true;
          setTimeout(() => {
            makeAIMove(data.fen, gameId, aiColor, aiLevel);
          }, 400);
        }
      } catch (err) {
        setError(t('errors.move'));
      }
    },
    [gameId, applyState, t, aiMode, aiColor, aiLevel, makeAIMove]
  );

  const onSquareClick = useCallback(
    (square) => {
      if (loading || status !== 'in-progress' || promotion || gameOver) return;
      if (aiMode && turn === aiColor) return;
      if (aiThinkingRef.current) return;

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
    [loading, status, promotion, legalMoves, selected, sendMove, gameOver, aiMode, turn, aiColor]
  );

  const onPromotionSelect = (piece) => {
    if (!promotion) return;
    sendMove(promotion.from, promotion.to, piece);
  };

  const handleTimeUp = useCallback((color) => {
    setGameOver(true);
    setStatus(color === 'w' ? 'black' : 'white');
  }, []);

  const resetView = () => setResetKey((k) => k + 1);

  const handleSetupStart = (config) => {
    startGame(config);
  };

  return (
    <div className="app">
      {showSetup ? (
        <GameSetup onStart={handleSetupStart} />
      ) : (
        <>
          <Hud
            status={status}
            turn={turn}
            inCheck={inCheck}
            onNewGame={() => setShowSetup(true)}
            onResetView={resetView}
            aiMode={aiMode}
            aiThinking={aiThinking}
          />

          <Sidebar captured={captured} moves={moves} />

          {timerActive && gameConfig && (
            <div className="timer-container">
              <Timer
                initialTime={gameConfig.timeControl}
                activeTurn={turn}
                gameOver={gameOver}
                onTimeUp={handleTimeUp}
                paused={aiThinking}
              />
            </div>
          )}

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
        </>
      )}
    </div>
  );
}
