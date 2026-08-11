/**
 * View (V) — transforms the Game model into the JSON DTO returned by the API.
 */
const serializeMove = (move) => ({
  from: move.from,
  to: move.to,
  piece: move.piece,
  color: move.color,
  captured: move.captured || null,
  promotion: move.promotion || null,
  san: move.san,
  lan: move.lan,
  flags: move.flags,
  playedAt: move.playedAt
});

const gameView = (game) => ({
  id: game.id,
  players: {
    white: game.whiteName || 'white',
    black: game.blackName || 'black'
  },
  turn: game.turn,
  fen: game.fen,
  board: game.boardGrid,
  status: game.result,
  winner: game.winner,
  check: game.chess.inCheck(),
  checkmate: game.chess.isCheckmate(),
  legalMoves: game.legalMovesBySquare,
  captured: game.capturedPieces,
  moves: game.history.map(serializeMove),
  moveCount: game.history.length,
  pgn: game.pgn,
  createdAt: game.createdAt,
  updatedAt: game.updatedAt
});

export const createdView = (game) => ({
  ...gameView(game),
  action: 'created'
});

export const movedView = (game, move) => ({
  ...gameView(game),
  action: 'moved',
  lastMove: serializeMove(move)
});

export const deletedView = (id) => ({ id, action: 'deleted' });

export default gameView;
