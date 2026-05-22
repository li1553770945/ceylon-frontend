"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox, useTexture } from "@react-three/drei";
import { createTextTexture } from "./utils";

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

const chipBodyMat = new THREE.MeshPhysicalMaterial({
  color: 0x2d2d3a,
  roughness: 0.25,
  metalness: 0.3,
  clearcoat: 0.3,
  clearcoatRoughness: 0.2,
});

const pinMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.3,
  metalness: 0.9,
});

export default function FloatingLogo() {
  const iconTexture = useTexture("/icons/icon-512x512.png");

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

  // Generate pin positions around the chip
  const pins = useMemo(() => {
    const arr: { x: number; z: number; rot: number }[] = [];
    const sides = 4;
    const pinsPerSide = 3;
    const offset = 0.48;
    for (let s = 0; s < sides; s++) {
      for (let p = 0; p < pinsPerSide; p++) {
        const t = (p - (pinsPerSide - 1) / 2) * 0.22;
        if (s === 0) arr.push({ x: t, z: offset, rot: 0 });
        else if (s === 1) arr.push({ x: offset, z: t, rot: Math.PI / 2 });
        else if (s === 2) arr.push({ x: t, z: -offset, rot: Math.PI });
        else arr.push({ x: -offset, z: t, rot: -Math.PI / 2 });
      }
    }
    return arr;
  }, []);

  return (
    <group position={[0, -0.05, 0]}>
      {/* === Bottom tier: Silver base === */}
      <RoundedBox args={[1.8, 0.15, 1.8]} radius={0.08} smoothness={3} position={[0, 0.075, 0]} castShadow receiveShadow>
        <primitive object={silverMat} attach="material" />
      </RoundedBox>

      {/* === Middle tier: Dark platform === */}
      <RoundedBox args={[1.4, 0.5, 1.4]} radius={0.06} smoothness={3} position={[0, 0.4, 0]} castShadow receiveShadow>
        <primitive object={darkMat} attach="material" />
      </RoundedBox>

      {/* === Top tier: Chip device === */}
      {/* Chip body */}
      <RoundedBox
        args={[0.85, 0.1, 0.85]}
        radius={0.06}
        smoothness={3}
        position={[0, 0.7, 0]}
        castShadow
      >
        <primitive object={chipBodyMat} attach="material" />
      </RoundedBox>

      {/* Icon on top */}
      <mesh position={[0, 0.76, 0]}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshBasicMaterial map={iconTexture} transparent />
      </mesh>

      {/* Gold pins around chip */}
      {pins.map((pin, i) => (
        <mesh key={i} position={[pin.x, 0.65, pin.z]} rotation={[0, pin.rot, 0]}>
          <boxGeometry args={[0.06, 0.04, 0.14]} />
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}

      {/* BRIDGE label */}
      <mesh position={[0, 1.55, 0]}>
        <planeGeometry args={[1.1, 0.36]} />
        <meshBasicMaterial map={bridgeLabelTex} transparent />
      </mesh>
    </group>
  );
}
