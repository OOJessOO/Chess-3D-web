import React, { useMemo } from 'react';

const WHITE = '#f2ead8';
const BLACK = '#26211c';

const COLOR = { w: WHITE, b: BLACK };

function Base({ color, y = 0 }) {
  return (
    <group position={[0, y, 0]}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.34, 0.1, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.08, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.35} />
      </mesh>
    </group>
  );
}

function PawnBody({ color, y = 0 }) {
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
    </group>
  );
}

function RookBody({ color, y = 0 }) {
  const merlons = [
    [-0.13, 0],
    [0.13, 0],
    [0, -0.13],
    [0, 0.13]
  ];
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.42, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.23, 0.21, 0.06, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      {merlons.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.58, z]}>
          <boxGeometry args={[0.09, 0.09, 0.09]} />
          <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function KnightBody({ color, y = 0, direction = 1 }) {
  return (
    <group position={[0, y, 0]} rotation={[0, direction > 0 ? 0 : Math.PI, 0]}>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.4, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <group position={[0, 0.42, 0]}>
        <mesh position={[0, 0.06, 0.05]} rotation={[0.45, 0, 0]}>
          <boxGeometry args={[0.24, 0.22, 0.28]} />
          <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.14, -0.08]} rotation={[-0.5, 0, 0]}>
          <coneGeometry args={[0.09, 0.22, 16]} />
          <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function BishopBody({ color, y = 0 }) {
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.36, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.11, 0.2, 16]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.63, 0]}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
    </group>
  );
}

function QueenBody({ color, y = 0 }) {
  const orbs = [
    [-0.1, 0],
    [0.1, 0],
    [0, -0.1],
    [0, 0.1],
    [-0.07, -0.07],
    [0.07, 0.07]
  ];
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.17, 0.21, 0.38, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <coneGeometry args={[0.12, 0.16, 16]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      {orbs.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.6, z]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function KingBody({ color, y = 0 }) {
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.17, 0.21, 0.38, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <sphereGeometry args={[0.17, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[0.1, 0.12, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[0.06, 0.24, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[0.06, 0.06, 0.14]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.3} />
      </mesh>
    </group>
  );
}

const BODY = {
  p: PawnBody,
  r: RookBody,
  n: KnightBody,
  b: BishopBody,
  q: QueenBody,
  k: KingBody
};

/**
 * A single 3D chess piece. `code` is like "wP" / "bN" as sent by the API.
 */
export default function Piece({ code, position }) {
  const color = COLOR[code[0]];
  const type = code[1];
  const Body = BODY[type];
  const direction = code[0] === 'w' ? 1 : -1;

  return useMemo(
    () => (
      <group position={position} scale={1}>
        <Base color={color} />
        <Body color={color} direction={direction} />
      </group>
    ),
    [color, type, position]
  );
}
