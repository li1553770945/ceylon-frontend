"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { generateCaptcha, verifyCaptcha } from "@/lib/captcha-api";
import type { CaptchaChallenge, Shape } from "@/lib/captcha-api";

interface CaptchaDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

function createGeometry(shape: Shape): THREE.BufferGeometry {
  switch (shape.type) {
    case 0:
      return new THREE.BoxGeometry(1, 1, 1);
    case 1:
      return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    case 2:
      return new THREE.CylinderGeometry(0.5, 0.5, 1.25, 3);
    default:
      return new THREE.BoxGeometry(1, 1, 1);
  }
}

export default function CaptchaDialog({
  open,
  onClose,
  onSuccess,
}: CaptchaDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    meshes: THREE.Mesh[];
    challenge: CaptchaChallenge;
  } | null>(null);

  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Fetch challenge when dialog opens
  useEffect(() => {
    if (!open) return;
    setError("");
    setChallenge(null);
    setLoading(true);
    generateCaptcha()
      .then((data) => {
        setChallenge(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "加载失败");
        setLoading(false);
      });
  }, [open]);

  // Init Three.js scene
  useEffect(() => {
    if (!open || !challenge || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f7);

    const frustumSize = 7.5;
    const aspect = width / height;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      100
    );
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0.5, 0);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888899, 0.4);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff8f0, 1.4);
    dirLight.position.set(4, 12, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.left = -8;
    dirLight.shadow.camera.right = 8;
    dirLight.shadow.camera.top = 8;
    dirLight.shadow.camera.bottom = -8;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xcce0ff, 0.25);
    fillLight.position.set(-6, 5, -4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffeedd, 0.4, 20);
    rimLight.position.set(-2, 6, 4);
    scene.add(rimLight);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0xe8e8ea, roughness: 0.8 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Shapes
    const meshes: THREE.Mesh[] = [];
    challenge.shapes.forEach((shape, index) => {
      const geometry = createGeometry(shape);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(shape.color),
        roughness: 0.35,
        metalness: 0.08,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(shape.x, shape.y, shape.z);
      mesh.rotation.y = shape.rotationY;
      mesh.scale.setScalar(shape.scale);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.index = index;
      scene.add(mesh);
      meshes.push(mesh);
    });

    renderer.render(scene, camera);
    sceneRef.current = { renderer, scene, camera, meshes, challenge };

    return () => {
      meshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, [open, challenge]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current || verifying) return;
    const { renderer, scene, camera, meshes } = sceneRef.current;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const shapeIndex = intersects[0].object.userData.index as number;
      setVerifying(true);
      setError("");
      verifyCaptcha(sceneRef.current.challenge.captchaId, shapeIndex)
        .then((token) => {
          onSuccess(token);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "验证失败，请重试");
          setVerifying(false);
          // Refresh challenge on failure
          setChallenge(null);
          setLoading(true);
          generateCaptcha()
            .then((data) => {
              setChallenge(data);
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[520px] rounded-xl bg-white shadow-2xl">
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-semibold">安全验证</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            请点击场景中{challenge ? `「${challenge.prompt}」的${challenge.targetShape}` : "目标物体"}
          </p>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex h-[360px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-ceylonm border-t-transparent" />
            </div>
          ) : (
            <div
              ref={containerRef}
              onClick={handleClick}
              className="relative h-[360px] w-full cursor-pointer overflow-hidden rounded-lg border bg-[#f5f5f7]"
              style={{ touchAction: "none" }}
            >
              {verifying && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-ceylonm border-t-transparent" />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4">
          <button
            onClick={() => {
              setChallenge(null);
              setLoading(true);
              setError("");
              generateCaptcha()
                .then((data) => {
                  setChallenge(data);
                  setLoading(false);
                })
                .catch(() => setLoading(false));
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
            disabled={loading || verifying}
          >
            换一组
          </button>
          <button
            onClick={onClose}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
