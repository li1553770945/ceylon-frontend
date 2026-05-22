"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const BELT_WIDTH = 0.38;
const BELT_HEIGHT = 0.03;
const BELT_LENGTH = 0.9;
const BELT_Y = 0.42;
const BELT_COLOR = "#c85c1b";
const BELT_DARK = "#a0400e";

const Z_OFFSETS = [-0.42, 0, 0.42];

function createBeltTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  // Base color
  ctx.fillStyle = BELT_COLOR;
  ctx.fillRect(0, 0, 256, 64);

  // Stripes
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? BELT_DARK : "#d4682a";
    ctx.fillRect(i * 32, 0, 32, 64);
  }

  // Border lines
  ctx.strokeStyle = "#7a2e08";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const inletMat = new THREE.MeshStandardMaterial({
  color: 0x2a2a2a,
  roughness: 0.4,
  metalness: 0.3,
});

export default function FlowBridge() {
  const beltTexture = useMemo(() => createBeltTexture(), []);
  const beltRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    beltRefs.current.forEach((mesh) => {
      if (mesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.map) {
          mat.map.offset.x = -t * 0.8;
        }
      }
    });
  });

  return (
    <>
      {/* Left → Center belts */}
      {Z_OFFSETS.map((z, i) => (
        <group key={`lc-${i}`}>
          {/* Belt */}
          <mesh
            ref={(el) => {
              if (el) beltRefs.current[i] = el;
            }}
            position={[-1.325, BELT_Y, z]}
          >
            <boxGeometry args={[BELT_LENGTH, BELT_HEIGHT, BELT_WIDTH]} />
            <meshPhysicalMaterial
              map={beltTexture.clone()}
              color="#c85c1b"
              roughness={0.15}
              metalness={0.1}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              transmission={0.35}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Inlet at left platform */}
          <mesh position={[-1.78, BELT_Y, z]}>
            <boxGeometry args={[0.14, 0.14, BELT_WIDTH + 0.02]} />
            <primitive object={inletMat} attach="material" />
          </mesh>
          {/* Inlet at center platform */}
          <mesh position={[-0.87, BELT_Y, z]}>
            <boxGeometry args={[0.14, 0.14, BELT_WIDTH + 0.02]} />
            <primitive object={inletMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Center → Right belts */}
      {Z_OFFSETS.map((z, i) => (
        <group key={`cr-${i}`}>
          {/* Belt */}
          <mesh
            ref={(el) => {
              if (el) beltRefs.current[i + 3] = el;
            }}
            position={[1.325, BELT_Y, z]}
          >
            <boxGeometry args={[BELT_LENGTH, BELT_HEIGHT, BELT_WIDTH]} />
            <meshStandardMaterial
              map={beltTexture.clone()}
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>
          {/* Inlet at center platform */}
          <mesh position={[0.87, BELT_Y, z]}>
            <boxGeometry args={[0.14, 0.14, BELT_WIDTH + 0.02]} />
            <primitive object={inletMat} attach="material" />
          </mesh>
          {/* Inlet at right platform */}
          <mesh position={[1.78, BELT_Y, z]}>
            <boxGeometry args={[0.14, 0.14, BELT_WIDTH + 0.02]} />
            <primitive object={inletMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Bottom dashed arc */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 30 }, (_, i) => {
                  const t = i / 29;
                  const x = -2.2 + t * 4.4;
                  const y = -0.25 - Math.sin(t * Math.PI) * 0.45;
                  const z = 0.6 + Math.sin(t * Math.PI) * 0.3;
                  return [x, y, z];
                }).flat()
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial color="#c85c1b" size={0.07} transparent opacity={0.5} />
      </points>
    </>
  );
}
