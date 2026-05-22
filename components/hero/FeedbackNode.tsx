"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { createTextTexture, createSymbolTexture, createPatternTexture } from "./utils";

const silverMat = new THREE.MeshStandardMaterial({
  color: "#c8cdd5",
  roughness: 0.2,
  metalness: 0.7,
});

const darkMat = new THREE.MeshStandardMaterial({
  color: "#252a32",
  roughness: 0.45,
  metalness: 0.35,
});

const whiteMat = new THREE.MeshPhysicalMaterial({
  color: 0xf0f0f5,
  roughness: 0.15,
  metalness: 0.05,
  clearcoat: 0.5,
  clearcoatRoughness: 0.2,
});

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
  const patternTex = useMemo(
    () => createPatternTexture({ size: 256, color: "#a0a8b8", rings: 5 }),
    []
  );

  return (
    <group position={[3.5, 0, 0]}>
      {/* === Bottom tier: Silver base === */}
      <RoundedBox args={[2.2, 0.15, 1.6]} radius={0.08} smoothness={3} position={[0, 0.075, 0]} castShadow receiveShadow>
        <primitive object={silverMat} attach="material" />
      </RoundedBox>

      {/* Bottom pattern decoration */}
      <mesh position={[0, 0.151, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.4, 1.0]} />
        <meshBasicMaterial map={patternTex} transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* === Middle tier: Dark platform === */}
      <RoundedBox args={[1.7, 0.5, 1.3]} radius={0.06} smoothness={3} position={[0, 0.4, 0]} castShadow receiveShadow>
        <primitive object={darkMat} attach="material" />
      </RoundedBox>

      {/* === Top tier: Main device === */}
      <RoundedBox
        args={[1.1, 0.95, 1.1]}
        radius={0.1}
        smoothness={3}
        position={[0, 1.125, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={whiteMat} attach="material" />
      </RoundedBox>

      {/* ... symbol */}
      <mesh position={[0, 1.125, 0.56]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial map={dotsTexture} transparent />
      </mesh>

      {/* Label */}
      <mesh position={[0, 1.75, 0]}>
        <planeGeometry args={[1.7, 0.4]} />
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>
    </group>
  );
}
