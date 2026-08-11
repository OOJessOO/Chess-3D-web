import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PIECE_3D } from '../utils/pieceInfo.js';

/**
 * Small caption showing what's captured by each side + the move list.
 */
export default function Sidebar({ captured, moves }) {
  const { t } = useTranslation();
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [moves.length]);

  const capturedRow = (color) => {
    const list = captured?.[color] || [];
    const icons = list.map((code) => PIECE_3D[code[1]]).join(' ');
    return icons || '—';
  };

  return (
    <aside className="sidebar">
      <section className="panel">
        <h2>{t('game.captured')}</h2>
        <div className="capture-row">
          <span className="turn-dot w" />
          <span>{capturedRow('b')}</span>
        </div>
        <div className="capture-row">
          <span className="turn-dot b" />
          <span>{capturedRow('w')}</span>
        </div>
      </section>
      <section className="panel moves-panel">
        <h2>{t('game.moves')}</h2>
        <ol ref={listRef} className="move-list">
          {moves.length === 0 && <li className="muted">{t('loading')}</li>}
          {moves.map((m, i) => (
            <li key={i}>
              {i % 2 === 0 ? <span className="move-no">{i / 2 + 1}.</span> : <span className="move-no" />}
              <span className="san">{m.san}</span>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
