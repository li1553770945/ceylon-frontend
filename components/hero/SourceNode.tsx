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

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    floatingRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pos = floatPositions[i];
      mesh.position.y = pos.y + Math.sin(t * (0.8 + i * 0.2) + i) * 0.1;
      mesh.rotation.y = t * 0.3 + i;
    });
  });

  return (
    <group position={[-3.5, 0, 0]}>
      {/* Base */}
      <RoundedBox args={[3.5, 0.4, 2.4]} radius={0.12} smoothness={4} castShadow receiveShadow>
        <primitive object={platformMat} attach="material" />
      </RoundedBox>

      {/* Main cube */}
      <RoundedBox
        args={[1.2, 1.2, 1.2]}
        radius={0.1}
        smoothness={4}
        position={[0, 0.9, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={acrylicMat} attach="material" />
      </RoundedBox>

      {/* </> symbol */}
      <mesh position={[0, 0.9, 0.61]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial map={codeTexture} transparent />
      </mesh>

      {/* Label */}
      <mesh position={[0, 1.75, 0]}>
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
