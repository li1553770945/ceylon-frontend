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

const domeMat = new THREE.MeshPhysicalMaterial({
  color: 0xe8e8f0,
  roughness: 0.2,
  metalness: 0.1,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  transmission: 0.2,
});

const iconSymbols = ["!", "?", "+", "~"];
const iconPos = [
  { x: 0.3, z: 1.4 },
  { x: 1.1, z: 1.6 },
  { x: 1.9, z: 1.4 },
  { x: 2.5, z: 1.6 },
];

const statusColors = [0x22cc44, 0xffcc00, 0xff4444];

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
  const antennaRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    iconRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.position.y = 0.45 + Math.sin(t * (0.6 + i * 0.15) + i * 1.5) * 0.08;
    });
    if (antennaRef.current) {
      antennaRef.current.rotation.z = Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <group position={[3.5, 0, 0]}>
      {/* Base */}
      <RoundedBox args={[3.5, 0.4, 2.4]} radius={0.12} smoothness={4} castShadow receiveShadow>
        <primitive object={platformMat} attach="material" />
      </RoundedBox>

      {/* === Feedback Dome (Radar Station) === */}
      {/* Dome */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={domeMat} attach="material" />
      </mesh>

      {/* Base ring of dome */}
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[0.58, 0.04, 8, 32]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Screen on front */}
      <mesh position={[0, 0.85, 0.52]}>
        <planeGeometry args={[0.55, 0.35]} />
        <meshBasicMaterial map={dotsTexture} transparent />
      </mesh>

      {/* Antenna */}
      <group ref={antennaRef} position={[0, 1.35, 0]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.06]} />
          <meshBasicMaterial color="#ff6600" />
        </mesh>
        {/* Signal waves */}
        {[0.1, 0.15, 0.2].map((r, i) => (
          <mesh key={`wave-${i}`} position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r, r + 0.015, 32]} />
            <meshBasicMaterial color="#ffaa66" transparent opacity={0.4 - i * 0.1} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Status indicator lights */}
      {statusColors.map((color, i) => {
        const angle = -0.6 + i * 0.6;
        return (
          <mesh
            key={`status-${i}`}
            position={[Math.sin(angle) * 0.5, 0.55, Math.cos(angle) * 0.5]}
          >
            <sphereGeometry args={[0.045]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}

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
