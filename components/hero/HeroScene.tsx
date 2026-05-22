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
      gl={{ alpha: true, antialias: true }}
      shadows
      camera={{ position: [9, 6.5, 9], fov: 26, near: 0.1, far: 100 }}
      style={{ background: "transparent" }}
    >
      <SceneLights />
      <group scale={0.82} position={[1.5, 0, 0]}>
        <SourceNode />
        <FeedbackNode />
        <FloatingLogo />
        <FlowBridge />
        <FlowParticles />
      </group>
      <EffectComposer>
        <Bloom intensity={1.0} luminanceThreshold={0.25} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
