import React from 'react';
import { useTranslation } from 'react-i18next';

const OPTIONS = [
  { piece: 'q', glyph: '♛' },
  { piece: 'r', glyph: '♜' },
  { piece: 'b', glyph: '♝' },
  { piece: 'n', glyph: '♞' }
];

/**
 * Modal to choose the piece when a pawn reaches the last rank.
 */
export default function PromotionDialog({ color, onSelect, onCancel }) {
  const { t } = useTranslation();
  const tone = color === 'w' ? 'white' : 'black';

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t('promotion.title')}</h2>
        <div className="promotion-options">
          {OPTIONS.map(({ piece, glyph }) => (
            <button key={piece} className="promo-btn" onClick={() => onSelect(piece)}>
              <span className={`promo-glyph ${tone}`}>{glyph}</span>
              <small>{t(`promotion.${piece}`)}</small>
            </button>
          ))}
        </div>
        <button className="btn ghost" onClick={onCancel}>
          {t('actions.close')}
        </button>
      </div>
    </div>
  );
}
