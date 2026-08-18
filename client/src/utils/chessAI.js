/**
 * Chess AI — minimax with alpha-beta pruning.
 * Uses piece-square tables for positional evaluation.
 * No external dependencies — runs entirely client-side.
 */

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const PST_PAWN = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const PST_KNIGHT = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const PST_BISHOP = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const PST_ROOK = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [5, 10, 10, 10, 10, 10, 10,  5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [0,  0,  0,  5,  5,  0,  0,  0]
];

const PST_QUEEN = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [-5,  0,  5,  5,  5,  5,  0, -5],
  [0,  0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  0,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20]
];

const PST_KING_MID = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20, 20,  0,  0,  0,  0, 20, 20],
  [20, 30, 10,  0,  0, 10, 30, 20]
];

const PST = { p: PST_PAWN, n: PST_KNIGHT, b: PST_BISHOP, r: PST_ROOK, q: PST_QUEEN, k: PST_KING_MID };

/**
 * Parse a FEN string and return a board array (8x8) of {type, color} or null.
 */
function parseFEN(fen) {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const rows = fen.split(' ')[0].split('/');
  for (let r = 0; r < 8; r++) {
    let c = 0;
    for (const ch of rows[r]) {
      if (ch >= '1' && ch <= '8') {
        c += parseInt(ch);
      } else {
        const color = ch === ch.toUpperCase() ? 'w' : 'b';
        board[r][c] = { type: ch.toLowerCase(), color };
        c++;
      }
    }
  }
  return board;
}

/**
 * Get all pseudo-legal moves for a piece at (row, col).
 * Does NOT filter out moves that leave the king in check.
 */
function pseudoMoves(board, row, col) {
  const piece = board[row][col];
  if (!piece) return [];
  const moves = [];
  const { type, color } = piece;
  const dir = color === 'w' ? -1 : 1;

  const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const isEmpty = (r, c) => inBounds(r, c) && !board[r][c];
  const isEnemy = (r, c) => inBounds(r, c) && board[r][c] && board[r][c].color !== color;

  if (type === 'p') {
    const startRow = color === 'w' ? 6 : 1;
    const promoRow = color === 'w' ? 0 : 7;
    const nextRow = row + dir;
    if (isEmpty(nextRow, col)) {
      moves.push({ from: [row, col], to: [nextRow, col], promotion: nextRow === promoRow });
      if (row === startRow && isEmpty(row + 2 * dir, col)) {
        moves.push({ from: [row, col], to: [row + 2 * dir, col], enPassant: true });
      }
    }
    for (const dc of [-1, 1]) {
      const nc = col + dc;
      if (isEnemy(nextRow, nc)) {
        moves.push({ from: [row, col], to: [nextRow, nc], promotion: nextRow === promoRow });
      }
    }
  } else if (type === 'n') {
    const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (const [dr, dc] of offsets) {
      const nr = row + dr, nc = col + dc;
      if (inBounds(nr, nc) && (!board[nr][nc] || board[nr][nc].color !== color)) {
        moves.push({ from: [row, col], to: [nr, nc] });
      }
    }
  } else if (type === 'b' || type === 'r' || type === 'q') {
    const dirs = [];
    if (type === 'b' || type === 'q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
    if (type === 'r' || type === 'q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
    for (const [dr, dc] of dirs) {
      let nr = row + dr, nc = col + dc;
      while (inBounds(nr, nc)) {
        if (board[nr][nc]) {
          if (board[nr][nc].color !== color) moves.push({ from: [row, col], to: [nr, nc] });
          break;
        }
        moves.push({ from: [row, col], to: [nr, nc] });
        nr += dr;
        nc += dc;
      }
    }
  } else if (type === 'k') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr, nc = col + dc;
        if (inBounds(nr, nc) && (!board[nr][nc] || board[nr][nc].color !== color)) {
          moves.push({ from: [row, col], to: [nr, nc] });
        }
      }
    }
  }
  return moves;
}

/**
 * Make a move on a cloned board.
 */
function makeMove(board, move) {
  const newBoard = board.map(r => r.map(c => c ? { ...c } : null));
  const piece = { ...newBoard[move.from[0]][move.from[1]] };
  newBoard[move.from[0]][move.from[1]] = null;
  if (move.promotion) {
    newBoard[move.to[0]][move.to[1]] = { type: 'q', color: piece.color };
  } else {
    newBoard[move.to[0]][move.to[1]] = piece;
  }
  return newBoard;
}

/**
 * Find the king position for a given color.
 */
function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] && board[r][c].type === 'k' && board[r][c].color === color) {
        return [r, c];
      }
    }
  }
  return null;
}

/**
 * Check if a square is attacked by the opponent.
 */
function isAttacked(board, row, col, byColor) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] && board[r][c].color === byColor) {
        const moves = pseudoMoves(board, r, c);
        for (const m of moves) {
          if (m.to[0] === row && m.to[1] === col) return true;
        }
      }
    }
  }
  return false;
}

/**
 * Generate all legal moves for a color.
 */
function allLegalMoves(board, color) {
  const moves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] && board[r][c].color === color) {
        for (const move of pseudoMoves(board, r, c)) {
          const newBoard = makeMove(board, move);
          const king = findKing(newBoard, color);
          const opp = color === 'w' ? 'b' : 'w';
          if (king && !isAttacked(newBoard, king[0], king[1], opp)) {
            moves.push(move);
          }
        }
      }
    }
  }
  return moves;
}

/**
 * Convert board position to FEN-like square notation for the API.
 */
function toSquare(row, col) {
  return String.fromCharCode(97 + col) + (8 - row);
}

/**
 * Evaluate the board from white's perspective.
 */
function evaluate(board) {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const sign = piece.color === 'w' ? 1 : -1;
        score += sign * (PIECE_VALUES[piece.type] + (PST[piece.type]?.[piece.color === 'w' ? r : 7 - r]?.[piece.color === 'w' ? c : 7 - c] || 0));
      }
    }
  }
  return score;
}

/**
 * Minimax with alpha-beta pruning.
 */
function minimax(board, depth, alpha, beta, isMaximizing, aiColor) {
  const opp = aiColor === 'w' ? 'b' : 'w';
  const currentColor = isMaximizing ? aiColor : opp;
  const moves = allLegalMoves(board, currentColor);

  if (depth === 0 || moves.length === 0) {
    if (moves.length === 0) {
      const king = findKing(board, currentColor);
      if (king && isAttacked(board, king[0], king[1], opp)) {
        return isMaximizing ? -99999 + (3 - depth) : 99999 - (3 - depth);
      }
      return 0; // stalemate
    }
    return evaluate(board);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move);
      const val = minimax(newBoard, depth - 1, alpha, beta, false, aiColor);
      maxEval = Math.max(maxEval, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move);
      const val = minimax(newBoard, depth - 1, alpha, beta, true, aiColor);
      minEval = Math.min(minEval, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Pick the best move for the AI.
 * @param {string} fen - Current FEN
 * @param {string} aiColor - 'w' or 'b'
 * @param {number} depth - Search depth (1=easy, 2=medium, 3=hard)
 * @returns {{ from: string, to: string, promotion?: string } | null}
 */
export function getBestMove(fen, aiColor, depth = 2) {
  const board = parseFEN(fen);
  const moves = allLegalMoves(board, aiColor);
  if (moves.length === 0) return null;

  let bestMove = null;
  let bestEval = aiColor === 'w' ? -Infinity : Infinity;

  for (const move of moves) {
    const newBoard = makeMove(board, move);
    const val = minimax(newBoard, depth - 1, -Infinity, Infinity, aiColor !== 'w', aiColor);

    if (aiColor === 'w') {
      if (val > bestEval) { bestEval = val; bestMove = move; }
    } else {
      if (val < bestEval) { bestEval = val; bestMove = move; }
    }
  }

  if (!bestMove) return null;

  const from = toSquare(bestMove.from[0], bestMove.from[1]);
  const to = toSquare(bestMove.to[0], bestMove.to[1]);
  const result = { from, to };
  if (bestMove.promotion) result.promotion = 'q';
  return result;
}
