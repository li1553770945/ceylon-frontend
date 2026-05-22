"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBox, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { createTextTexture } from "./utils";

const platformMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.1,
  metalness: 0.05,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
});

const hubMat = new THREE.MeshPhysicalMaterial({
  color: 0xc85c1b,
  roughness: 0.2,
  metalness: 0.2,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  emissive: 0xff4400,
  emissiveIntensity: 0.2,
});

const darkPortMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.4,
  metalness: 0.6,
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

  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.8;
      ringRef.current.position.y = 0.95 + Math.sin(t * 1.5) * 0.03;
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

      {/* === Central Hub (Cylinder) === */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.7, 32]} />
        <primitive object={hubMat} attach="material" />
      </mesh>

      {/* Rotating ring on top */}
      <group ref={ringRef} position={[0, 0.95, 0]}>
        <mesh>
          <torusGeometry args={[0.38, 0.03, 8, 32]} />
          <meshBasicMaterial color="#ffaa66" />
        </mesh>
        {/* Indicator lights on ring */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={`hub-led-${i}`}
              position={[Math.cos(angle) * 0.38, 0, Math.sin(angle) * 0.38]}
            >
              <sphereGeometry args={[0.035]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          );
        })}
      </group>

      {/* Side ports */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={`port-${i}`}
            position={[Math.cos(angle) * 0.42, 0.75, Math.sin(angle) * 0.42]}
          >
            <boxGeometry args={[0.08, 0.12, 0.06]} />
            <primitive object={darkPortMat} attach="material" />
          </mesh>
        );
      })}

      {/* Icon on front */}
      <mesh position={[0, 0.75, 0.42]}>
        <planeGeometry args={[0.45, 0.45]} />
        <meshBasicMaterial map={iconTexture} transparent />
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
