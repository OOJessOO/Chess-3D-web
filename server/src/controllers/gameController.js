import { createError } from '../utils/errors.js';
import store from '../models/GameStore.js';
import gameView, { createdView, movedView, deletedView } from '../views/gameView.js';

/**
 * Controllers (C) — receive HTTP requests, orchestrate models, return views.
 */
export const createGame = (req, res, next) => {
  try {
    const { whiteName, blackName, startFen } = req.body || {};
    const game = store.create({ whiteName, blackName, startFen });
    res.status(201).json(createdView(game));
  } catch (err) {
    next(err);
  }
};

export const listGames = (_req, res, next) => {
  try {
    store.cleanup();
    res.json({ games: store.list().map(gameView) });
  } catch (err) {
    next(err);
  }
};

export const getGame = (req, res, next) => {
  const game = store.get(req.params.id);
  if (!game) return next(createError(404, 'GAME_NOT_FOUND'));
  res.json(gameView(game));
};

export const makeMove = (req, res, next) => {
  const game = store.get(req.params.id);
  if (!game) return next(createError(404, 'GAME_NOT_FOUND'));

  const { from, to, promotion } = req.body || {};
  if (!from || !to) return next(createError(400, 'MOVE_REQUIRES_FROM_TO'));

  try {
    const move = game.move(from, to, promotion);
    res.json(movedView(game, move));
  } catch (err) {
    next(createError(400, 'ILLEGAL_MOVE', { detail: err.message }));
  }
};

export const deleteGame = (req, res, next) => {
  const game = store.get(req.params.id);
  if (!game) return next(createError(404, 'GAME_NOT_FOUND'));
  store.delete(req.params.id);
  res.json(deletedView(req.params.id));
};
