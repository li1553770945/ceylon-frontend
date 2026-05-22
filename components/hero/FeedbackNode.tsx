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

const iconSymbols = ["!", "?", "+", "~"];
const iconPos = [
  { x: 0.3, z: 1.4 },
  { x: 1.1, z: 1.6 },
  { x: 1.9, z: 1.4 },
  { x: 2.5, z: 1.6 },
];

export default function FeedbackNode() {
  const dotsTexture = useMemo(
    () => createSymbolTexture("...", { size: 128, symbolColor: "#c85c1b" }),
    []
  );
  const labelTexture = useMemo(
    () =>
      createTextTexture("USER FEEDBACK", {
        bgColor: "#c85c1b",
        textColor: "#ffffff",
        fontSize: 14,
        padding: 6,
        borderRadius: 3,
      }),
    []
  );

  const iconTextures = useMemo(
    () =>
      iconSymbols.map((sym) =>
        createSymbolTexture(sym, {
          size: 64,
          bgColor: "#f5f5f7",
          symbolColor: "#c85c1b",
          borderRadius: 6,
        })
      ),
    []
  );

  const iconRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    iconRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.position.y = 0.45 + Math.sin(t * (0.6 + i * 0.15) + i * 1.5) * 0.08;
    });
  });

  return (
    <group position={[3.5, 0, 0]}>
      {/* Base */}
      <RoundedBox args={[3.5, 0.4, 2.4]} radius={0.12} smoothness={4} castShadow receiveShadow>
        <primitive object={platformMat} attach="material" />
      </RoundedBox>

      {/* Chat bubble cube */}
      <RoundedBox
        args={[1.1, 0.95, 1.1]}
        radius={0.1}
        smoothness={4}
        position={[0, 0.9, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={acrylicMat} attach="material" />
      </RoundedBox>

      {/* ... symbol */}
      <mesh position={[0, 0.9, 0.56]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial map={dotsTexture} transparent />
      </mesh>

      {/* Label */}
      <mesh position={[0, 1.7, 0]}>
        <planeGeometry args={[1.7, 0.4]} />
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>

      {/* Icon cubes */}
      {iconPos.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) iconRefs.current[i] = el;
          }}
          position={[pos.x, 0.45, pos.z]}
          castShadow
        >
          <boxGeometry args={[0.38, 0.38, 0.38]} />
          <meshPhysicalMaterial
            map={iconTextures[i]}
            roughness={0.2}
            metalness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
