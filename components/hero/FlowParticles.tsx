"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const flowCurves = [
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.2, 0.55, 0.22),
    new THREE.Vector3(-1.4, 0.8, 0.12),
    new THREE.Vector3(-0.7, 0.6, 0.06),
    new THREE.Vector3(-0.25, 0.5, 0),
  ]),
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.2, 0.55, 0),
    new THREE.Vector3(-1.4, 0.9, 0),
    new THREE.Vector3(-0.7, 0.65, 0),
    new THREE.Vector3(-0.25, 0.5, 0),
  ]),
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.2, 0.55, -0.22),
    new THREE.Vector3(-1.4, 0.8, -0.12),
    new THREE.Vector3(-0.7, 0.6, -0.06),
    new THREE.Vector3(-0.25, 0.5, 0),
  ]),
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.25, 0.5, 0),
    new THREE.Vector3(0.7, 0.6, 0.06),
    new THREE.Vector3(1.4, 0.8, 0.12),
    new THREE.Vector3(2.2, 0.55, 0.22),
  ]),
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.25, 0.5, 0),
    new THREE.Vector3(0.7, 0.65, 0),
    new THREE.Vector3(1.4, 0.9, 0),
    new THREE.Vector3(2.2, 0.55, 0),
  ]),
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.25, 0.5, 0),
    new THREE.Vector3(0.7, 0.6, -0.06),
    new THREE.Vector3(1.4, 0.8, -0.12),
    new THREE.Vector3(2.2, 0.55, -0.22),
  ]),
];

export default function FlowParticles() {
  const particles = useMemo(() => {
    const arr: {
      curve: THREE.CatmullRomCurve3;
      progress: number;
      speed: number;
    }[] = [];
    for (let i = 0; i < 12; i++) {
      arr.push({
        curve: flowCurves[i % flowCurves.length],
        progress: Math.random(),
        speed: 0.12 + Math.random() * 0.08,
      });
    }
    return arr;
  }, []);

  const meshRefs = useRef<THREE.Mesh[]>([]);

  useFrame((_, delta) => {
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const p = particles[i];
      p.progress += p.speed * delta;
      if (p.progress > 1) p.progress = 0;
      const point = p.curve.getPointAt(p.progress);
      mesh.position.copy(point);
    });
  });

  return (
    <>
      {particles.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ffaa66" />
        </mesh>
      ))}
    </>
  );
}
