import {
  apiJson,
  apiPatch,
  apiPost,
  setAuthTokens,
  type TokenPair,
} from "@/lib/api-client";
import { type Profile, type User } from "@/types";

type BackendRole = "user" | "admin" | "super_user";

export interface BackendProfile {
  id: string;
  email: string;
  username?: string;
  nickname?: string;
  avatar_url?: string | null;
  role?: BackendRole;
}

interface RegisterResponse extends TokenPair {
  id: string;
  email: string;
  username?: string;
  nickname?: string;
}

export function mapBackendProfile(profile: BackendProfile): {
  user: User;
  profile: Profile;
} {
  const displayName = profile.nickname || profile.username || profile.email;

  return {
    user: {
      id: profile.id,
      email: profile.email,
      username: profile.username,
    },
    profile: {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      display_name: displayName,
      avatar_url: profile.avatar_url || null,
      role: profile.role || "user",
      subscription_tier: "free",
    },
  };
}

export async function fetchCurrentProfile() {
  const profile = await apiJson<BackendProfile>("/api/v1/me/profile");
  return mapBackendProfile(profile);
}

export async function loginWithPassword(identifier: string, password: string) {
  const tokens = await apiPost<TokenPair>(
    "/api/v1/auth/login",
    { identifier, password },
    { auth: false }
  );
  setAuthTokens(tokens);
  return fetchCurrentProfile();
}

export async function sendLoginCode(email: string) {
  await apiPost<{ message: string }>(
    "/api/v1/auth/login/code/send",
    { email },
    { auth: false }
  );
}

export async function loginWithCode(email: string, code: string) {
  const tokens = await apiPost<TokenPair>(
    "/api/v1/auth/login/code",
    { email, code },
    { auth: false }
  );
  setAuthTokens(tokens);
  return fetchCurrentProfile();
}

export async function registerWithPassword(input: {
  email: string;
  username: string;
  nickname: string;
  password: string;
  invite_code: string;
}) {
  const result = await apiPost<RegisterResponse>("/api/v1/auth/register", input, {
    auth: false,
  });
  setAuthTokens(result);
  return fetchCurrentProfile();
}

export async function updateCurrentProfile(input: {
  nickname?: string;
  avatar_url?: string | null;
}) {
  const profile = await apiPatch<BackendProfile>("/api/v1/me/profile", input);
  return mapBackendProfile(profile);
}
