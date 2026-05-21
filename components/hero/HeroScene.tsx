"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
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
    scene.background = new THREE.Color(0x06060a);

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.8, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    container.appendChild(renderer.domElement);

    // ── Post-processing (Bloom) ──
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.3,
      0.5,
      0.2
    );
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0x1a1a2e, 0.35));

    const keyLight = new THREE.DirectionalLight(0xffffff, 4);
    keyLight.position.set(4, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffddcc, 1.5);
    fillLight.position.set(-6, 4, 5);
    scene.add(fillLight);

    const bottomWarm = new THREE.PointLight(0xc85c1b, 3, 50);
    bottomWarm.position.set(0, -8, 4);
    scene.add(bottomWarm);

    const sideCool = new THREE.PointLight(0x22d3ee, 2, 40);
    sideCool.position.set(-7, 2, -2);
    scene.add(sideCool);

    const topRim = new THREE.PointLight(0xffaa66, 1.5, 35);
    topRim.position.set(5, 5, -3);
    scene.add(topRim);

    // ── Background grid plane (visible through glass refraction) ──
    const gridHelper = new THREE.GridHelper(20, 40, 0x333344, 0x1a1a2a);
    gridHelper.position.set(0, -4, -4);
    gridHelper.rotation.x = 0.1;
    scene.add(gridHelper);

    // Vertical grid lines behind
    const vGridGeo = new THREE.BufferGeometry();
    const vGridPos = new Float32Array([
      -6, -5, -5,  -6, 5, -5,
      -3, -5, -5.5, -3, 5, -5.5,
      0, -5, -6,   0, 5, -6,
      3, -5, -5.5, 3, 5, -5.5,
      6, -5, -5,   6, 5, -5,
    ]);
    vGridGeo.setAttribute("position", new THREE.BufferAttribute(vGridPos, 3));
    const vGridMat = new THREE.LineBasicMaterial({ color: 0x222233, transparent: true, opacity: 0.4 });
    scene.add(new THREE.LineSegments(vGridGeo, vGridMat));

    // ── Background content (visible through glass) ──
    // A field of small glowing dots behind the stack
    const bgDotsCount = 250;
    const bgDotsGeo = new THREE.BufferGeometry();
    const bgDotPositions = new Float32Array(bgDotsCount * 3);
    const bgDotColors = new Float32Array(bgDotsCount * 3);
    for (let i = 0; i < bgDotsCount; i++) {
      bgDotPositions[i * 3] = (Math.random() - 0.5) * 20;
      bgDotPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      bgDotPositions[i * 3 + 2] = -6 - Math.random() * 6;

      const warm = Math.random() > 0.5;
      bgDotColors[i * 3] = warm ? 0.9 : 0.2;
      bgDotColors[i * 3 + 1] = warm ? 0.5 : 0.7;
      bgDotColors[i * 3 + 2] = warm ? 0.2 : 0.9;
    }
    bgDotsGeo.setAttribute("position", new THREE.BufferAttribute(bgDotPositions, 3));
    bgDotsGeo.setAttribute("color", new THREE.BufferAttribute(bgDotColors, 3));
    const bgDotsMat = new THREE.PointsMaterial({
      size: 0.06,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      vertexColors: true,
    });
    const bgDots = new THREE.Points(bgDotsGeo, bgDotsMat);
    scene.add(bgDots);

    // Large soft glow orbs behind
    const orbGeo = new THREE.SphereGeometry(1, 32, 32);
    const orbMat1 = new THREE.MeshBasicMaterial({
      color: 0xc85c1b,
      transparent: true,
      opacity: 0.06,
    });
    const orb1 = new THREE.Mesh(orbGeo, orbMat1);
    orb1.position.set(-2, -3, -6);
    orb1.scale.set(4, 4, 4);
    scene.add(orb1);

    const orbMat2 = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.05,
    });
    const orb2 = new THREE.Mesh(orbGeo, orbMat2);
    orb2.position.set(3, 2, -7);
    orb2.scale.set(5, 5, 5);
    scene.add(orb2);

    // ── Glass Material ──
    function createGlassMaterial(color: number, thickness: number) {
      return new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.15,
        roughness: 0.06,
        transmission: 0.55,
        thickness: thickness,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        envMapIntensity: 2.5,
        attenuationColor: new THREE.Color(color),
        attenuationDistance: 0.25,
      });
    }

    // ── Main Group ──
    const mainGroup = new THREE.Group();
    mainGroup.position.x = 1.5;
    scene.add(mainGroup);

    // Helper: create a glass plate with edge highlight
    function createGlassPlate(
      width: number,
      height: number,
      depth: number,
      color: number,
      thickness: number,
      labelText: string,
      labelColor: string
    ) {
      const group = new THREE.Group();

      // Main glass body
      const geo = new THREE.BoxGeometry(width, height, depth);
      const mat = createGlassMaterial(color, thickness);
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);

      // Edge highlight lines
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      group.add(edges);

      // Top surface subtle glow ring
      const ringGeo = new THREE.RingGeometry(width * 0.35, width * 0.38, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = height / 2 + 0.001;
      group.add(ring);

      // Label
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 80;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, 256, 80);
      ctx.font = "bold 26px sans-serif";
      ctx.fillStyle = labelColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labelText, 128, 40);
      const tex = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.8,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.6, 0.5, 1);
      sprite.position.set(0, 0, depth / 2 + 0.15);
      group.add(sprite);

      return { group, mesh, mat, edges, edgeMat, ring, ringMat, sprite };
    }

    // ── Layer 1: User Feedback (bottom) ──
    const layer1 = createGlassPlate(
      4.2, 0.06, 4.2,
      0xff8c42, 0.4,
      "用户反馈", "rgba(255,180,100,0.85)"
    );
    layer1.group.position.y = -1.8;
    mainGroup.add(layer1.group);

    // Feedback bubbles
    const bubbles: THREE.Mesh[] = [];
    const bubbleData = [
      { x: -1.1, z: -0.9 }, { x: 1.2, z: 0.6 },
      { x: -0.5, z: 1.0 }, { x: 0.7, z: -1.1 },
      { x: -1.4, z: 0.4 }, { x: 1.4, z: -0.4 },
      { x: 0, z: 0.5 }, { x: -0.8, z: -0.3 },
    ];
    bubbleData.forEach((pos, i) => {
      const bGeo = new THREE.SphereGeometry(0.09 + (i % 3) * 0.02, 12, 12);
      const bMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xffbb77 : 0xffddaa,
        transparent: true,
        opacity: 0.45,
      });
      const bubble = new THREE.Mesh(bGeo, bMat);
      bubble.position.set(pos.x, 0.08, pos.z);
      layer1.group.add(bubble);
      bubbles.push(bubble);
    });

    // ── Layer 2: AI Engine (middle) ──
    const layer2 = createGlassPlate(
      3.2, 0.08, 3.2,
      0xc85c1b, 0.6,
      "AI 引擎", "rgba(255,140,60,0.9)"
    );
    layer2.group.position.y = 0;
    mainGroup.add(layer2.group);

    // AI Core
    const coreGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xff6b1a,
      emissive: 0xff6b1a,
      emissiveIntensity: 2.5,
      metalness: 0.05,
      roughness: 0.02,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 0.2;
    layer2.group.add(coreMesh);

    // Inner white core
    const innerCoreGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreMesh.add(innerCore);

    // Orbiting satellites
    const satellites: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const sGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const sMat = new THREE.MeshBasicMaterial({
        color: 0xffcc88,
        transparent: true,
        opacity: 0.7,
      });
      const sat = new THREE.Mesh(sGeo, sMat);
      layer2.group.add(sat);
      satellites.push(sat);
    }

    // ── Layer 3: Code Repository (top) ──
    const layer3 = createGlassPlate(
      2.4, 0.06, 2.4,
      0x22d3ee, 0.5,
      "代码仓库", "rgba(100,230,255,0.85)"
    );
    layer3.group.position.y = 1.8;
    mainGroup.add(layer3.group);

    // Branch nodes (git graph abstraction)
    const nodePositions = [
      { x: -0.8, z: -0.8 }, { x: 0.8, z: -0.8 },
      { x: 0.8, z: 0.8 }, { x: -0.8, z: 0.8 },
      { x: 0, z: 0 }, { x: 0, z: -0.8 },
      { x: 0.8, z: 0 },
    ];
    const branchNodes: THREE.Mesh[] = [];
    nodePositions.forEach((pos) => {
      const nGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const nMat = new THREE.MeshBasicMaterial({
        color: 0x66eeff,
        transparent: true,
        opacity: 0.65,
      });
      const node = new THREE.Mesh(nGeo, nMat);
      node.position.set(pos.x, 0.08, pos.z);
      layer3.group.add(node);
      branchNodes.push(node);
    });

    // Connection lines
    const lineConnections = [
      [-0.8, 0, -0.8, 0, 0, 0],
      [0.8, 0, -0.8, 0, 0, 0],
      [0.8, 0, 0.8, 0, 0, 0],
      [-0.8, 0, 0.8, 0, 0, 0],
      [0, 0, -0.8, 0, 0, 0],
      [0.8, 0, 0, 0, 0, 0],
      [-0.8, 0, -0.8, 0, 0, -0.8],
      [0, 0, -0.8, 0.8, 0, -0.8],
      [0.8, 0, -0.8, 0.8, 0, 0],
      [0.8, 0, 0, 0.8, 0, 0.8],
    ];
    const linePosArray = new Float32Array(lineConnections.flat());
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePosArray, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x44ccdd,
      transparent: true,
      opacity: 0.25,
    });
    const branchLines = new THREE.LineSegments(lineGeo, lineMat);
    layer3.group.add(branchLines);

    // ── Data flow particles between layers ──
    const flowCount = 60;
    const flowParticles: {
      mesh: THREE.Mesh;
      speed: number;
      progress: number;
      phase: number;
      fromY: number;
      toY: number;
      spiralR: number;
    }[] = [];

    for (let i = 0; i < flowCount; i++) {
      const upward = i < flowCount * 0.6;
      const fromY = upward ? -1.6 : 1.6;
      const toY = upward ? 1.6 : -1.6;

      const pGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({
        color: upward ? 0xffaa55 : 0x55ddff,
        transparent: true,
        opacity: 0,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      scene.add(pMesh);

      flowParticles.push({
        mesh: pMesh,
        speed: 0.0015 + Math.random() * 0.0035,
        progress: Math.random(),
        phase: Math.random() * Math.PI * 2,
        fromY,
        toY,
        spiralR: 0.4 + Math.random() * 0.6,
      });
    }

    // ── Foreground floating particles ──
    const fgCount = 80;
    const fgGeo = new THREE.BufferGeometry();
    const fgPositions = new Float32Array(fgCount * 3);
    const fgOpacities = new Float32Array(fgCount);
    for (let i = 0; i < fgCount; i++) {
      fgPositions[i * 3] = (Math.random() - 0.5) * 18;
      fgPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      fgPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      fgOpacities[i] = Math.random();
    }
    fgGeo.setAttribute("position", new THREE.BufferAttribute(fgPositions, 3));
    const fgMat = new THREE.PointsMaterial({
      color: 0xffccaa,
      size: 0.03,
      transparent: true,
      opacity: 0.25,
      sizeAttenuation: true,
    });
    const fgParticles = new THREE.Points(fgGeo, fgMat);
    scene.add(fgParticles);

    // ── Mouse interaction ──
    const mouse = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Resize ──
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

    // ── Animation ──
    let animId: number;
    const clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Overall slow rotation
      mainGroup.rotation.y = t * 0.1;

      // Layer breathing
      layer1.group.position.y = -1.8 + Math.sin(t * 0.45) * 0.07;
      layer2.group.position.y = Math.sin(t * 0.55 + 1.0) * 0.05;
      layer3.group.position.y = 1.8 + Math.sin(t * 0.4 + 2.0) * 0.04;

      // AI core pulse
      coreMat.emissiveIntensity = 2.0 + Math.sin(t * 2.5) * 0.7;
      innerCoreMat.opacity = 0.75 + Math.sin(t * 3.2) * 0.15;

      // Satellites orbit
      satellites.forEach((sat, i) => {
        const angle = t * 0.65 + (i * Math.PI * 2) / 8;
        const r = 0.75 + Math.sin(t * 0.2 + i) * 0.1;
        sat.position.x = Math.cos(angle) * r;
        sat.position.z = Math.sin(angle) * r;
        sat.position.y = 0.2 + Math.sin(t * 0.9 + i * 0.4) * 0.05;
      });

      // Bubbles gentle motion
      bubbles.forEach((bubble, i) => {
        bubble.position.y = 0.08 + Math.sin(t * 0.7 + i * 1.1) * 0.03;
        bubble.rotation.x = t * 0.15 + i;
      });

      // Branch nodes pulse
      branchNodes.forEach((node, i) => {
        const s = 1 + Math.sin(t * 1.6 + i * 0.8) * 0.18;
        node.scale.setScalar(s);
      });

      // Edge opacity pulse
      layer1.edgeMat.opacity = 0.3 + Math.sin(t * 1.0) * 0.12;
      layer2.edgeMat.opacity = 0.32 + Math.sin(t * 0.85 + 1) * 0.12;
      layer3.edgeMat.opacity = 0.28 + Math.sin(t * 0.7 + 2) * 0.1;

      // Ring pulse
      layer1.ringMat.opacity = 0.06 + Math.sin(t * 0.8) * 0.03;
      layer2.ringMat.opacity = 0.07 + Math.sin(t * 0.7 + 1) * 0.03;
      layer3.ringMat.opacity = 0.05 + Math.sin(t * 0.6 + 2) * 0.025;

      // Flow particles
      flowParticles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const y = p.fromY + (p.toY - p.fromY) * p.progress;
        const prog = p.progress;
        const r = p.spiralR * Math.sin(prog * Math.PI);
        const x = Math.cos(prog * Math.PI * 5 + p.phase) * r * 0.2;
        const z = Math.sin(prog * Math.PI * 5 + p.phase) * r * 0.2;

        p.mesh.position.set(x, y, z);

        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        if (prog < 0.1) mat.opacity = (prog / 0.1) * 0.75;
        else if (prog > 0.9) mat.opacity = ((1 - prog) / 0.1) * 0.75;
        else mat.opacity = 0.75;
      });

      // Background dots drift
      bgDots.rotation.y = t * 0.008;
      // Foreground particles
      fgParticles.rotation.y = t * 0.005;
      fgParticles.rotation.x = t * 0.003;

      // Background orbs pulse
      orbMat1.opacity = 0.05 + Math.sin(t * 0.3) * 0.02;
      orbMat2.opacity = 0.04 + Math.sin(t * 0.25 + 1) * 0.015;

      // Mouse tilt
      targetRot.x = mouse.y * 0.05;
      targetRot.y = mouse.x * 0.05;
      mainGroup.rotation.x += (targetRot.x - mainGroup.rotation.x) * 0.02;
      mainGroup.rotation.z += (-targetRot.y * 0.35 - mainGroup.rotation.z) * 0.02;

      composer.render();
    }
    animate();

    // ── Cleanup ──
    cleanupRef.current = () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      composer.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (
          obj instanceof THREE.Mesh ||
          obj instanceof THREE.Points ||
          obj instanceof THREE.Sprite ||
          obj instanceof THREE.LineSegments
        ) {
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
