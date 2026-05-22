"use client";

import { Canvas } from "@react-three/fiber";
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
      frameloop="demand"
      gl={{ alpha: true, antialias: true }}
      shadows
      camera={{ position: [8, 5.5, 8], fov: 28, near: 0.1, far: 100 }}
      style={{ background: "transparent" }}
    >
      <SceneLights />
      <group scale={0.82} position={[1.2, 0, 0]}>
        <SourceNode />
        <FeedbackNode />
        <FloatingLogo />
        <FlowBridge />
        <FlowParticles />
      </group>
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.3} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
