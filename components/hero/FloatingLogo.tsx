"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { createTextTexture, createSymbolTexture } from "./utils";

const platformMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.25,
  metalness: 0.02,
});

const orangeMat = new THREE.MeshStandardMaterial({
  color: 0xc85c1b,
  roughness: 0.3,
  metalness: 0.1,
  emissive: 0xff6600,
  emissiveIntensity: 0.2,
});

export default function FloatingLogo() {
  const dTexture = useMemo(
    () =>
      createSymbolTexture("D", {
        size: 128,
        bgColor: "#c85c1b",
        symbolColor: "#ffffff",
      }),
    []
  );
  const bridgeLabelTex = useMemo(
    () =>
      createTextTexture("BRIDGE", {
        bgColor: "#c85c1b",
        textColor: "#ffffff",
        fontSize: 14,
        padding: 6,
        borderRadius: 3,
      }),
    []
  );
  const subLabelTex = useMemo(
    () =>
      createTextTexture("Connect Code to Feedback", {
        bgColor: "rgba(255,255,255,0.92)",
        textColor: "#444444",
        fontSize: 12,
        padding: 5,
        borderRadius: 3,
      }),
    []
  );

  const logoRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (logoRef.current) {
      const s = 1 + Math.sin(t * 1.5) * 0.015;
      logoRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, -0.05, 0]}>
      {/* Platform */}
      <RoundedBox
        args={[1.8, 0.35, 1.8]}
        radius={0.1}
        smoothness={4}
        position={[0, 0.175, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={platformMat} attach="material" />
      </RoundedBox>

      {/* Logo square */}
      <RoundedBox
        ref={logoRef}
        args={[0.75, 0.75, 0.14]}
        radius={0.06}
        smoothness={4}
        position={[0, 0.85, 0]}
        castShadow
      >
        <primitive object={orangeMat} attach="material" />
      </RoundedBox>

      {/* D symbol */}
      <mesh position={[0, 0.85, 0.08]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial map={dTexture} transparent />
      </mesh>

      {/* BRIDGE label */}
      <mesh position={[0, 1.55, 0]}>
        <planeGeometry args={[1.1, 0.36]} />
        <meshBasicMaterial map={bridgeLabelTex} transparent />
      </mesh>

      {/* Subtitle */}
      <mesh position={[0, 1.15, 0]}>
        <planeGeometry args={[2.1, 0.32]} />
        <meshBasicMaterial map={subLabelTex} transparent />
      </mesh>

      {/* Pillars */}
      <mesh position={[-0.65, -0.4, 0]} castShadow>
        <boxGeometry args={[0.28, 1.1, 0.28]} />
        <primitive object={platformMat} attach="material" />
      </mesh>
      <mesh position={[0.65, -0.4, 0]} castShadow>
        <boxGeometry args={[0.28, 1.1, 0.28]} />
        <primitive object={platformMat} attach="material" />
      </mesh>
    </group>
  );
}
