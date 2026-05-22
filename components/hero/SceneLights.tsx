"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SceneLights() {
  const frameCount = useRef(0);

  useFrame(() => {
    frameCount.current += 1;
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#c0c8d0" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight
        position={[-4, 6, -3]}
        intensity={0.4}
        color="#8899aa"
      />
      {/* Orange rim light - matches conveyor glow */}
      <pointLight position={[2, 2, 0]} intensity={0.6} color="#ff7733" distance={6} />
      {/* Cool fill from right */}
      <pointLight position={[5, 3, 4]} intensity={0.3} color="#667788" distance={8} />
      {/* Subtle top accent */}
      <pointLight position={[0, 6, 0]} intensity={0.2} color="#ddeeff" distance={10} />
    </>
  );
}
