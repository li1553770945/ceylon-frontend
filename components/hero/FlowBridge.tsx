"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const Z_OFFSETS = [-0.42, 0, 0.42];

// Glow material for conveyor tubes
const tubeMat = new THREE.MeshStandardMaterial({
  color: "#c85c1b",
  roughness: 0.2,
  metalness: 0.1,
  emissive: "#c85c1b",
  emissiveIntensity: 0.4,
});

const tubeGlowMat = new THREE.MeshBasicMaterial({
  color: "#ff8844",
  transparent: true,
  opacity: 0.15,
  depthWrite: false,
});

// Inlet/outlet connectors on dark tier
const inletMat = new THREE.MeshStandardMaterial({
  color: "#1a1e24",
  roughness: 0.4,
  metalness: 0.5,
});

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

export default function FlowBridge() {
  const glowRefs = useRef<THREE.Mesh[]>([]);

  const curves = useMemo(() => {
    // Left → Center: from x=-2.7 to x=-0.8
    const leftCurves = Z_OFFSETS.map((z) =>
      createTubeCurve(-2.7, -0.8, z, 0.72)
    );
    // Center → Right: from x=0.8 to x=2.7
    const rightCurves = Z_OFFSETS.map((z) =>
      createTubeCurve(0.8, 2.7, z, 0.72)
    );
    return { leftCurves, rightCurves };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Gentle pulse on glow overlays
    glowRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + Math.sin(t * 1.5 + i * 0.7) * 0.05;
    });
  });

  return (
    <>
      {/* Left → Center tubes */}
      {curves.leftCurves.map((curve, i) => {
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
        return (
          <group key={`lc-${i}`}>
            <mesh geometry={tubeGeo}>
              <primitive object={tubeMat} attach="material" />
            </mesh>
            {/* Glow overlay */}
            <mesh
              ref={(el) => {
                if (el) glowRefs.current[i] = el;
              }}
              geometry={new THREE.TubeGeometry(curve, 32, 0.1, 8, false)}
            >
              <primitive object={tubeGlowMat} attach="material" />
            </mesh>
            {/* Inlet at left platform */}
            <mesh position={[-2.7, 0.4, Z_OFFSETS[i]]}>
              <cylinderGeometry args={[0.07, 0.07, 0.15, 12]} />
              <primitive object={inletMat} attach="material" />
            </mesh>
            {/* Inlet at center platform */}
            <mesh position={[-0.8, 0.4, Z_OFFSETS[i]]}>
              <cylinderGeometry args={[0.07, 0.07, 0.15, 12]} />
              <primitive object={inletMat} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* Center → Right tubes */}
      {curves.rightCurves.map((curve, i) => {
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
        return (
          <group key={`cr-${i}`}>
            <mesh geometry={tubeGeo}>
              <primitive object={tubeMat} attach="material" />
            </mesh>
            {/* Glow overlay */}
            <mesh
              ref={(el) => {
                if (el) glowRefs.current[i + 3] = el;
              }}
              geometry={new THREE.TubeGeometry(curve, 32, 0.1, 8, false)}
            >
              <primitive object={tubeGlowMat} attach="material" />
            </mesh>
            {/* Inlet at center platform */}
            <mesh position={[0.8, 0.4, Z_OFFSETS[i]]}>
              <cylinderGeometry args={[0.07, 0.07, 0.15, 12]} />
              <primitive object={inletMat} attach="material" />
            </mesh>
            {/* Inlet at right platform */}
            <mesh position={[2.7, 0.4, Z_OFFSETS[i]]}>
              <cylinderGeometry args={[0.07, 0.07, 0.15, 12]} />
              <primitive object={inletMat} attach="material" />
            </mesh>
          </group>
        );
      })}
    </>
  );
}
