import { Chess } from 'chess.js';

/**
 * Game model (M) — encapsulates all chess game rules & state.
 * Wraps chess.js and exposes a clean API used by the controller.
 */
class Game {
  constructor(id, whiteName, blackName, startFen) {
    this.id = id;
    this.whiteName = whiteName;
    this.blackName = blackName;
    this.chess = new Chess(startFen || undefined);
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.history = [];
  }

  /**
   * Play a move in long algebraic notation, e.g. "e2e4" or "e7e8q".
   * Throws if the move is illegal.
   */
  move(from, to, promotion) {
    const move = this.chess.move({ from, to, promotion });
    this.updatedAt = Date.now();
    this.history.push({
      ...move,
      playedAt: Date.now()
    });
    return move;
  }

  get fen() {
    return this.chess.fen();
  }

  get turn() {
    return this.chess.turn();
  }

  get isOver() {
    return this.chess.isGameOver();
  }

  get winner() {
    if (this.chess.isCheckmate()) return this.chess.turn() === 'w' ? 'b' : 'w';
    return null;
  }

  get result() {
    if (this.chess.isCheckmate()) return this.winner === 'w' ? 'white' : 'black';
    if (this.chess.isStalemate()) return 'stalemate';
    if (this.chess.isThreefoldRepetition()) return 'threefold-repetition';
    if (this.chess.isInsufficientMaterial()) return 'insufficient-material';
    if (this.chess.isDraw()) return 'draw';
    return 'in-progress';
  }

  /**
   * The 8x8 grid serialized for the 3D renderer.
   * grid[row][col], row 0 = rank 8, col 0 = file a.
   * Values are "wK", "bQ", ... or null.
   */
  get boardGrid() {
    const grid = Array.from({ length: 8 }, () => Array(8).fill(null));
    const board = this.chess.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          grid[row][col] = `${piece.color}${piece.type}`;
        }
      }
    }
    return grid;
  }

  /** Map of square -> legal destination squares, used to highlight moves. */
  get legalMovesBySquare() {
    const map = {};
    for (const move of this.chess.moves({ verbose: true })) {
      (map[move.from] ||= []).push({
        to: move.to,
        flags: move.flags,
        piece: move.piece,
        promotion: move.promotion || null,
        captured: move.captured || null
      });
    }
    return map;
  }

  /** All legal target squares for the piece on `square` (e.g. "e2"). */
  legalTargets(square) {
    return (this.legalMovesBySquare[square] || []).map((m) => m.to);
  }

  get capturedPieces() {
    const captured = { w: [], b: [] };
    for (const move of this.history) {
      if (move.captured) captured[move.color].push(`${move.color}${move.captured}`);
    }
    return captured;
  }

  get pgn() {
    return this.chess.pgn();
  }
}

export default Game;
