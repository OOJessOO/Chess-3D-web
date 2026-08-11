import React from 'react';
import { Text } from '@react-three/drei';
import Piece from './Piece.jsx';

export const LIGHT_TILE = '#efe8cf';
export const DARK_TILE = '#a56a3f';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const gridToWorld = (row, col) => [col - 3.5, 0, row - 3.5];

function Tile({ row, col, onSelect, isSelected, hasMove, isCapture, isLast }) {
  const [x, , z] = gridToWorld(row, col);
  const dark = (row + col) % 2 === 1;
  return (
    <group>
      <mesh
        position={[x, 0, z]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect({ row, col });
        }}
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={dark ? DARK_TILE : LIGHT_TILE}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>
      {isLast && (
        <mesh position={[x, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#e8c34b" transparent opacity={0.45} />
        </mesh>
      )}
      {isSelected && (
        <mesh position={[x, 0.006, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#4b9be8" transparent opacity={0.5} />
        </mesh>
      )}
      {hasMove && (
        <mesh position={[x, isCapture ? 0.012 : 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[isCapture ? 0.16 : 0.12, 32]} />
          <meshStandardMaterial
            color={isCapture ? '#e04b4b' : '#4b9be8'}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}
    </group>
  );
}

function CoordLabel({ text, position }) {
  return (
    <Text
      position={position}
      fontSize={0.18}
      color="#3a3026"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}

/**
 * The 3D chessboard. Props:
 *  - board: 8x8 grid of piece codes ("wP", null, ...)
 *  - moves: { fromSquare: {to, ...}[] } (from the API `legalMoves`)
 *  - selected: "e2"-style square or null
 *  - lastMove: { from, to }
 *  - onSquareClick(square): selection / move callback
 */
export default function Board({ board, moves = {}, selected, lastMove, onSquareClick }) {
  const squares = new Set(Object.keys(moves));
  const lastSquares = lastMove ? new Set([lastMove.from, lastMove.to]) : new Set();
  const selectedSquare = selected;
  const targets = selected ? (moves[selected] || []).map((m) => m.to) : [];
  const targetSet = new Set(targets);

  const pieces = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const code = board[row]?.[col];
      if (code) {
        const square = `${FILES[col]}${8 - row}`;
        const [x, , z] = gridToWorld(row, col);
        pieces.push(<Piece key={square} code={code} position={[x, 0.36, z]} />);
      }
    }
  }

  return (
    <group>
      {board.map((rowArr, row) =>
        rowArr.map((_, col) => {
          const square = `${FILES[col]}${8 - row}`;
          const target = targetSet.has(square);
          return (
            <Tile
              key={square}
              row={row}
              col={col}
              onSelect={() => onSquareClick(square)}
              isSelected={selectedSquare === square}
              hasMove={target}
              isCapture={target && !!board[row][col]}
              isLast={lastSquares.has(square)}
            />
          );
        })
      )}
      {pieces}
      {FILES.map((f, i) => (
        <CoordLabel key={f} text={f} position={[-3.5 + i, 0.01, -3.9]} />
      ))}
      {FILES.map((f, i) => (
        <CoordLabel key={`${f}-2`} text={f} position={[-3.5 + i, 0.01, 3.9]} />
      ))}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((r) => (
        <CoordLabel key={r} text={String(r)} position={[-3.9, 0.01, -3.5 + (8 - r)]} />
      ))}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((r) => (
        <CoordLabel key={`${r}-2`} text={String(r)} position={[3.9, 0.01, -3.5 + (8 - r)]} />
      ))}
    </group>
  );
}
