"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { createTextTexture, createSymbolTexture } from "./utils";

const platformMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.1,
  metalness: 0.05,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
});

const acrylicMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.15,
  metalness: 0.05,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
});

const darkMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.3,
  metalness: 0.5,
});

const ledMat = new THREE.MeshBasicMaterial({ color: 0xff6600 });

const floatPositions = [
  { x: -1.8, y: 1.8, z: -0.7 },
  { x: -1.4, y: 2.2, z: 0.6 },
  { x: -2.1, y: 1.5, z: 0.4 },
];

export default function SourceNode() {
  const codeTexture = useMemo(
    () => createSymbolTexture("</>", { size: 128, symbolColor: "#c85c1b" }),
    []
  );
  const labelTexture = useMemo(
    () =>
      createTextTexture("SOURCE CODE", {
        bgColor: "#c85c1b",
        textColor: "#ffffff",
        fontSize: 16,
        padding: 7,
        borderRadius: 4,
      }),
    []
  );

  const floatingRefs = useRef<THREE.Mesh[]>([]);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    floatingRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pos = floatPositions[i];
      mesh.position.y = pos.y + Math.sin(t * (0.8 + i * 0.2) + i) * 0.1;
      mesh.rotation.y = t * 0.3 + i;
    });
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group position={[-3.5, 0, 0]}>
      {/* Base */}
      <RoundedBox args={[3.5, 0.4, 2.4]} radius={0.12} smoothness={4} castShadow receiveShadow>
        <primitive object={platformMat} attach="material" />
      </RoundedBox>

      {/* === Industrial Terminal === */}
      {/* Main body - tall rounded box */}
      <RoundedBox
        args={[0.9, 1.4, 0.9]}
        radius={0.08}
        smoothness={4}
        position={[0, 1.0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={acrylicMat} attach="material" />
      </RoundedBox>

      {/* Screen area */}
      <mesh position={[0, 1.05, 0.46]}>
        <planeGeometry args={[0.65, 0.65]} />
        <meshBasicMaterial map={codeTexture} transparent />
      </mesh>

      {/* Antenna on top */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#ff6600" />
      </mesh>

      {/* Side vents */}
      {[-1, 1].map((side) =>
        [0.5, 0.7, 0.9, 1.1, 1.3].map((y, i) => (
          <mesh key={`vent-${side}-${i}`} position={[side * 0.46, y, 0]}>
            <boxGeometry args={[0.02, 0.08, 0.5]} />
            <primitive object={darkMat} attach="material" />
          </mesh>
        ))
      )}

      {/* LED indicator ring at bottom */}
      <group ref={ringRef} position={[0, 0.5, 0]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={`led-${i}`}
              position={[Math.cos(angle) * 0.55, 0, Math.sin(angle) * 0.55]}
            >
              <sphereGeometry args={[0.04]} />
              <primitive object={ledMat} attach="material" />
            </mesh>
          );
        })}
      </group>

      {/* Label */}
      <mesh position={[0, 2.2, 0]}>
        <planeGeometry args={[1.8, 0.45]} />
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>

      {/* Floating cubes */}
      {floatPositions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) floatingRefs.current[i] = el;
          }}
          position={[pos.x, pos.y, pos.z]}
          castShadow
        >
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <primitive object={acrylicMat} attach="material" />
        </mesh>
      ))}
    </group>
  );
}
