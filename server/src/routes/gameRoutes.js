import { Router } from 'express';
import {
  createGame,
  listGames,
  getGame,
  makeMove,
  deleteGame
} from '../controllers/gameController.js';

const router = Router();

/**
 * Game routes — the REST contract of the API.
 *   POST   /api/games            create a game
 *   GET    /api/games            list active games
 *   GET    /api/games/:id        fetch a game state
 *   POST   /api/games/:id/move   play a move {from, to, promotion?}
 *   DELETE /api/games/:id        delete a game
 */
router.post('/games', createGame);
router.get('/games', listGames);
router.get('/games/:id', getGame);
router.post('/games/:id/move', makeMove);
router.delete('/games/:id', deleteGame);

export default router;
