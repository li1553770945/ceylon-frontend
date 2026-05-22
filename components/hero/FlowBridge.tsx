"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float flow = sin(vUv.x * 12.0 - uTime * 2.5) * 0.5 + 0.5;
    float glow = smoothstep(0.3, 0.7, flow);
    vec3 finalColor = mix(uColor * 0.5, uColor, glow);
    float alpha = 0.45 + glow * 0.45;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const flowCurves = [
  // Left to center
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
  // Center to right
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

// Bottom dashed arc
const dashCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2.2, -0.25, 0.6),
  new THREE.Vector3(-1.0, -0.7, 0.9),
  new THREE.Vector3(1.0, -0.7, 0.9),
  new THREE.Vector3(2.2, -0.25, 0.6),
]);

export default function FlowBridge() {
  const materialRefs = useRef<THREE.ShaderMaterial[]>([]);

  const uniformsList = useMemo(
    () =>
      flowCurves.map(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#ff8c42") },
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    materialRefs.current.forEach((mat, i) => {
      if (mat) {
        mat.uniforms.uTime.value = t + i * 0.3;
      }
    });
  });

  const dashPoints = useMemo(() => dashCurve.getPoints(30), []);
  const dashGeo = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(dashPoints),
    [dashPoints]
  );

  return (
    <>
      {flowCurves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
          <shaderMaterial
            ref={(el) => {
              if (el) materialRefs.current[i] = el;
            }}
            uniforms={uniformsList[i]}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* Bottom dashed arc */}
      <points geometry={dashGeo}>
        <pointsMaterial
          color="#c85c1b"
          size={0.07}
          transparent
          opacity={0.5}
        />
      </points>
    </>
  );
}
