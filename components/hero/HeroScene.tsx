"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SceneLights from "./SceneLights";
import SourceNode from "./SourceNode";
import FeedbackNode from "./FeedbackNode";
import FloatingLogo from "./FloatingLogo";
import FlowBridge from "./FlowBridge";
import FlowParticles from "./FlowParticles";

export default function HeroScene() {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      shadows
      camera={{ position: [7, 5, 7], fov: 30, near: 0.1, far: 100 }}
      style={{ background: "transparent" }}
    >
      <SceneLights />
      <SourceNode />
      <FeedbackNode />
      <FloatingLogo />
      <FlowBridge />
      <FlowParticles />
      <OrbitControls
        autoRotate={false}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
