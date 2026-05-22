"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

const BELT_Y = 0.42;
const PACKAGE_Y = BELT_Y + 0.015 + 0.06; // on top of belt

export default function FlowParticles() {
  const particles = useMemo(() => {
    const arr: {
      meshRef: React.MutableRefObject<THREE.Mesh | null>;
      fromX: number;
      toX: number;
      z: number;
      speed: number;
      offset: number;
      color: string;
    }[] = [];

    // Left → Center packages (orange)
    const leftZ = [-0.42, 0, 0.42];
    for (let i = 0; i < 3; i++) {
      arr.push({
        meshRef: { current: null },
        fromX: -1.7,
        toX: -0.95,
        z: leftZ[i],
        speed: 0.5 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        color: "#c85c1b",
      });
    }

    // Center → Right packages (blue)
    const rightZ = [-0.42, 0, 0.42];
    for (let i = 0; i < 3; i++) {
      arr.push({
        meshRef: { current: null },
        fromX: 0.95,
        toX: 1.7,
        z: rightZ[i],
        speed: 0.5 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        color: "#2a7fff",
      });
    }

    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p) => {
      if (!p.meshRef.current) return;
      // Smooth back-and-forth using sin
      const raw = Math.sin(t * p.speed + p.offset);
      const progress = (raw + 1) / 2; // 0..1
      const x = p.fromX + (p.toX - p.fromX) * progress;
      p.meshRef.current.position.set(x, PACKAGE_Y, p.z);
      // Slight wobble for liveliness
      p.meshRef.current.rotation.y = Math.sin(t * 2 + p.offset) * 0.1;
    });
  });

  return (
    <>
      {particles.map((p, i) => (
        <RoundedBox
          key={i}
          ref={(el: THREE.Mesh | null) => {
            p.meshRef.current = el;
          }}
          args={[0.2, 0.14, 0.2]}
          radius={0.03}
          smoothness={2}
        >
          <meshPhysicalMaterial
            color={p.color}
            roughness={0.2}
            metalness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>
      ))}
    </>
  );
}
