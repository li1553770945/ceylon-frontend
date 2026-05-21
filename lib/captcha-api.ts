import { apiJson, apiPost } from "@/lib/api-client";

export interface Shape {
  type: number;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  scale: number;
  color: string;
  volume: number;
}

export interface CaptchaChallenge {
  captchaId: string;
  shapes: Shape[];
  prompt: string;
  targetShape: string;
  width: number;
  height: number;
}

export async function generateCaptcha() {
  return apiJson<CaptchaChallenge>("/api/v1/captcha/generate", {
    auth: false,
  });
}

export async function verifyCaptcha(captchaId: string, shapeIndex: number) {
  const res = await apiPost<{ token: string }>(
    "/api/v1/captcha/verify",
    { captchaId, shapeIndex },
    { auth: false }
  );
  return res.token;
}
