import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TIME_OPTIONS = [
  { label: '1 + 0', value: 60 },
  { label: '3 + 0', value: 180 },
  { label: '5 + 0', value: 300 },
  { label: '10 + 0', value: 600 },
  { label: '15 + 0', value: 900 },
  { label: '30 + 0', value: 1800 },
  { label: '∞', value: Infinity }
];

const AI_LEVELS = [
  { label: 'easy', value: 1, desc: 'ai.easy' },
  { label: 'medium', value: 2, desc: 'ai.medium' },
  { label: 'hard', value: 3, desc: 'ai.hard' }
];

/**
 * Pre-game setup dialog: choose opponent (human/AI), difficulty, and time control.
 */
export default function GameSetup({ onStart }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState('pvp'); // 'pvp' or 'ai'
  const [aiLevel, setAiLevel] = useState(2);
  const [aiColor, setAiColor] = useState('b');
  const [timeIndex, setTimeIndex] = useState(3); // default 10+0

  const handleStart = () => {
    onStart({
      mode,
      aiLevel: mode === 'ai' ? aiLevel : null,
      aiColor: mode === 'ai' ? aiColor : null,
      timeControl: TIME_OPTIONS[timeIndex].value
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal setup-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t('setup.title')}</h2>

        <div className="setup-section">
          <label className="setup-label">{t('setup.opponent')}</label>
          <div className="setup-row">
            <button
              className={`setup-option ${mode === 'pvp' ? 'selected' : ''}`}
              onClick={() => setMode('pvp')}
            >
              <span className="setup-icon">👥</span>
              <span>{t('setup.twoPlayers')}</span>
            </button>
            <button
              className={`setup-option ${mode === 'ai' ? 'selected' : ''}`}
              onClick={() => setMode('ai')}
            >
              <span className="setup-icon">🤖</span>
              <span>{t('setup.vsComputer')}</span>
            </button>
          </div>
        </div>

        {mode === 'ai' && (
          <div className="setup-section">
            <label className="setup-label">{t('setup.difficulty')}</label>
            <div className="setup-row">
              {AI_LEVELS.map(({ label, value, desc }) => (
                <button
                  key={value}
                  className={`setup-option small ${aiLevel === value ? 'selected' : ''}`}
                  onClick={() => setAiLevel(value)}
                >
                  <span>{t(`ai.${label}`)}</span>
                </button>
              ))}
            </div>

            <label className="setup-label" style={{ marginTop: '12px' }}>{t('setup.playAs')}</label>
            <div className="setup-row">
              <button
                className={`setup-option small ${aiColor === 'b' ? 'selected' : ''}`}
                onClick={() => setAiColor('b')}
              >
                <span className="turn-dot w" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }} />
                {t('game.white')}
              </button>
              <button
                className={`setup-option small ${aiColor === 'w' ? 'selected' : ''}`}
                onClick={() => setAiColor('w')}
              >
                <span className="turn-dot b" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }} />
                {t('game.black')}
              </button>
            </div>
          </div>
        )}

        <div className="setup-section">
          <label className="setup-label">{t('setup.timeControl')}</label>
          <div className="setup-row time-row">
            {TIME_OPTIONS.map(({ label, value }, i) => (
              <button
                key={value}
                className={`setup-time ${timeIndex === i ? 'selected' : ''}`}
                onClick={() => setTimeIndex(i)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button className="btn start-btn" onClick={handleStart}>
          {t('setup.start')}
        </button>
      </div>
    </div>
  );
}
