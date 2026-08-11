import { nanoid } from 'nanoid';
import Game from './Game.js';
import config from '../config/index.js';

/**
 * GameStore model (M) — in-memory persistence for active games.
 */
class GameStore {
  constructor() {
    this.games = new Map();
  }

  create({ whiteName, blackName, startFen } = {}) {
    const id = nanoid(10);
    const game = new Game(id, whiteName, blackName, startFen);
    this.games.set(id, game);
    return game;
  }

  get(id) {
    return this.games.get(id) || null;
  }

  delete(id) {
    return this.games.delete(id);
  }

  exists(id) {
    return this.games.has(id);
  }

  list() {
    return Array.from(this.games.values());
  }

  /** Remove games that have been idle longer than the configured TTL. */
  cleanup() {
    const now = Date.now();
    for (const game of this.games.values()) {
      if (now - game.updatedAt > config.games.ttlMs) {
        this.games.delete(game.id);
      }
    }
  }
}

export default new GameStore();
