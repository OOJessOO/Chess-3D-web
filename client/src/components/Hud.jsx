import React from 'react';
import { useTranslation } from 'react-i18next';

const PIECE_LABEL = { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' };

/**
 * Overlay UI: title, turn/check/result, language toggle, new-game + reset buttons.
 */
export default function Hud({ status, turn, inCheck, onNewGame, onResetView }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const next = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('chess3d-lang', next);
  };

  const gameOver = status !== 'in-progress';
  const resultText = t(`game.status.${status}`);

  return (
    <div className="hud">
      <header className="hud-header">
        <h1>{t('app.title')}</h1>
        <span className="tagline">{t('app.tagline')}</span>
      </header>

      <div className="status-card">
        {!gameOver ? (
          <>
            <span className={`turn-dot ${turn}`} />
            <strong>{turn === 'w' ? t('game.whiteToMove') : t('game.blackToMove')}</strong>
            {inCheck && <span className="check-badge">{t('game.inCheck')}</span>}
          </>
        ) : (
          <strong className="result">{resultText}</strong>
        )}
      </div>

      <div className="hud-actions">
        <button className="btn" onClick={onNewGame}>
          {t('actions.newGame')}
        </button>
        <button className="btn ghost" onClick={onResetView}>
          {t('actions.resetView')}
        </button>
        <button className="btn ghost" onClick={changeLanguage}>
          {i18n.language === 'en' ? 'FR' : 'EN'}
        </button>
      </div>
    </div>
  );
}
