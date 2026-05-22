"use client";

export default function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 6]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      <directionalLight
        position={[-5, 4, -3]}
        intensity={0.4}
        color="#e8f0ff"
      />
      <pointLight position={[0, 4, 3]} intensity={0.8} color="#c85c1b" />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color="#ffffff" />
      <pointLight position={[3, 2, 2]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 1, -2]} intensity={0.3} color="#ffaa66" />
    </>
  );
}
