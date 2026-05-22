"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function createTubeCurve(fromX: number, toX: number, z: number, midY: number) {
  const midX = (fromX + toX) / 2;
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(fromX, 0.4, z),
    new THREE.Vector3(midX - 0.3, midY, z),
    new THREE.Vector3(midX, midY + 0.08, z),
    new THREE.Vector3(midX + 0.3, midY, z),
    new THREE.Vector3(toX, 0.4, z),
  ]);
}

const PARTICLES = [
  { curve: createTubeCurve(-2.7, -0.8, -0.42, 0.72), color: "#c85c1b", speed: 0.35, offset: 0 },
  { curve: createTubeCurve(-2.7, -0.8, 0.42, 0.72), color: "#c85c1b", speed: 0.35, offset: Math.PI },
  { curve: createTubeCurve(0.8, 2.7, -0.42, 0.72), color: "#2a7fff", speed: 0.35, offset: Math.PI * 0.5 },
  { curve: createTubeCurve(0.8, 2.7, 0.42, 0.72), color: "#2a7fff", speed: 0.35, offset: Math.PI * 1.5 },
];

export default function FlowParticles() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    PARTICLES.forEach((p, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      // Back-and-forth along the curve
      const raw = Math.sin(t * p.speed + p.offset);
      const progress = (raw + 1) / 2; // 0..1
      const point = p.curve.getPointAt(progress);
      mesh.position.copy(point);
      mesh.position.y += 0.08; // slightly above tube
      // Look along curve tangent
      const tangent = p.curve.getTangentAt(progress);
      mesh.lookAt(point.clone().add(tangent));
    });
  });

  return (
    <>
      {PARTICLES.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <boxGeometry args={[0.2, 0.14, 0.2]} />
          <meshStandardMaterial
            color={p.color}
            roughness={0.3}
            metalness={0.1}
            emissive={p.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </>
  );
}
