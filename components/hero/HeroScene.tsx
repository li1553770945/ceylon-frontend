"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene & Camera ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.03);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.5, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ── Controls ──
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.minPolarAngle = Math.PI * 0.3;
    controls.maxPolarAngle = Math.PI * 0.7;

    // ── Post-processing (Bloom) ──
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // ── Lights ──
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xc85c1b, 2, 20);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x22d3ee, 1.5, 20);
    pointLight2.position.set(0, -2, 4);
    scene.add(pointLight2);

    // ── Node data ──
    const nodes = [
      {
        label: "需求",
        pos: new THREE.Vector3(-3, 0.5, 0),
        color: 0xc85c1b,
        emissive: 0xc85c1b,
      },
      {
        label: "AI",
        pos: new THREE.Vector3(0, -0.5, 0),
        color: 0xff8c42,
        emissive: 0xff8c42,
      },
      {
        label: "代码",
        pos: new THREE.Vector3(3, 0.5, 0),
        color: 0x22d3ee,
        emissive: 0x22d3ee,
      },
    ];

    // ── Create nodes ──
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    nodes.forEach((node) => {
      const geometry = new THREE.SphereGeometry(0.55, 64, 64);
      const material = new THREE.MeshStandardMaterial({
        color: node.color,
        metalness: 0.85,
        roughness: 0.15,
        emissive: node.emissive,
        emissiveIntensity: 0.6,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(node.pos);
      nodeGroup.add(mesh);
      nodeMeshes.push(mesh);

      // Inner core (brighter)
      const coreGeo = new THREE.SphereGeometry(0.25, 32, 32);
      const coreMat = new THREE.MeshBasicMaterial({
        color: node.emissive,
        transparent: true,
        opacity: 0.9,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      mesh.add(core);

      // Label sprite
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, 256, 64);
      ctx.font = "bold 32px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, 128, 32);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.8, 0.45, 1);
      sprite.position.set(0, -1, 0);
      mesh.add(sprite);
    });

    // ── Create pipes (tubes) ──
    const pipePaths = [
      [nodes[0].pos, nodes[1].pos],
      [nodes[1].pos, nodes[2].pos],
      [nodes[2].pos, nodes[0].pos],
    ];

    const pipeMaterials: THREE.MeshStandardMaterial[] = [];
    pipePaths.forEach(([start, end]) => {
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      mid.y += 0.8; // arch up
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.08, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xc85c1b,
        emissiveIntensity: 0.15,
      });
      pipeMaterials.push(tubeMat);
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      nodeGroup.add(tube);
    });

    // ── Flowing particles ──
    const particleCount = 60;
    const particles: {
      mesh: THREE.Mesh;
      curve: THREE.CatmullRomCurve3;
      t: number;
      speed: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const pipeIndex = i % 3;
      const [start, end] = pipePaths[pipeIndex];
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      mid.y += 0.8;
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);

      const pGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const pMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      nodeGroup.add(pMesh);

      particles.push({
        mesh: pMesh,
        curve,
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
      });
    }

    // ── Floating dust particles ──
    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 12;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xc85c1b,
      size: 0.03,
      transparent: true,
      opacity: 0.4,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ── Resize handler ──
    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    });
    ro.observe(container);

    // ── Animation loop ──
    let animId: number;
    const clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      controls.update();

      // Pulse nodes
      nodeMeshes.forEach((mesh, i) => {
        const scale = 1 + Math.sin(elapsed * 2 + i * 2) * 0.05;
        mesh.scale.setScalar(scale);
      });

      // Animate particles along curves
      particles.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        const point = p.curve.getPoint(p.t);
        p.mesh.position.copy(point);
        // Fade near ends
        const fadeStart = 0.15;
        const fadeEnd = 0.85;
        if (p.t < fadeStart) {
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = p.t / fadeStart * 0.8;
        } else if (p.t > fadeEnd) {
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - p.t) / (1 - fadeEnd) * 0.8;
        } else {
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = 0.8;
        }
      });

      // Pulse pipe emissive
      pipeMaterials.forEach((mat, i) => {
        mat.emissiveIntensity = 0.1 + Math.sin(elapsed * 1.5 + i) * 0.08;
      });

      // Rotate dust slowly
      dust.rotation.y = elapsed * 0.02;

      composer.render();
    }
    animate();

    // ── Cleanup ──
    cleanupRef.current = () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      controls.dispose();
      composer.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Sprite) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };

    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
