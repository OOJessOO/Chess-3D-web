import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Board from './Board.jsx';

const GROUND = '#2c4a3b';

function Environment() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[6, 12, 6]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-6, 8, -6]} intensity={0.35} />
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color={GROUND} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color="#2a1f16" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.1, 8.1]} />
        <meshStandardMaterial color="#caa06a" roughness={0.7} />
      </mesh>
    </>
  );
}

/**
 * Full 3D scene. Wraps the R3F canvas with lighting, camera and the board.
 */
export default function Scene(props) {
  return (
    <Canvas
      camera={{ position: [0, 8.5, 7.5], fov: 45 }}
      shadows
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Environment />
        <Board {...props} />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 0.5, 0]}
        />
      </Suspense>
    </Canvas>
  );
}
