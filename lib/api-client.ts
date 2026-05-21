import { type ApiError } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const API_VERSION_PREFIX = "/api/v1";
const ACCESS_TOKEN_KEY = "ceylon_access_token";
const REFRESH_TOKEN_KEY = "ceylon_refresh_token";

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = API_BASE.replace(/\/+$/, "");
  const normalizedPath = normalizePath(path);

  if (
    base.endsWith(API_VERSION_PREFIX) &&
    (normalizedPath === API_VERSION_PREFIX ||
      normalizedPath.startsWith(`${API_VERSION_PREFIX}/`))
  ) {
    return `${base}${normalizedPath.slice(API_VERSION_PREFIX.length)}`;
  }

  return `${base}${normalizedPath}`;
}

export class ApiClientError extends Error {
  status: number;
  code: string | number;
  details: Record<string, unknown>;

  constructor(error: ApiError, status: number) {
    super(error.message);
    this.status = status;
    this.code = error.code;
    this.details = error.details || {};
    this.name = "ApiClientError";
  }
}

type ApiOptions = RequestInit & {
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

type ApiEnvelope<T> = {
  code: number;
  message: string;
  data?: T;
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
}

export function getAccessToken(): string | null {
  return getStorage()?.getItem(ACCESS_TOKEN_KEY) || null;
}

export function getRefreshToken(): string | null {
  return getStorage()?.getItem(REFRESH_TOKEN_KEY) || null;
}

export function setAuthTokens(tokens: TokenPair): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  storage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}

export function clearAuthTokens(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value
  );
}

function normalizeError(
  payload: unknown,
  fallbackStatus: number,
  fallbackMessage: string
): ApiError {
  if (typeof payload === "object" && payload !== null) {
    const data = payload as Record<string, unknown>;
    const nested = data.error as Record<string, unknown> | undefined;
    return {
      code: (nested?.code || data.code || fallbackStatus) as string | number,
      message: String(nested?.message || data.message || fallbackMessage),
      details: (nested?.details || data.details || {}) as Record<string, unknown>,
    };
  }

  return {
    code: fallbackStatus,
    message: fallbackMessage,
    details: {},
  };
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as T;
  }

  const payload = await res.json();
  if (isApiEnvelope<T>(payload)) {
    if (payload.code !== 0) {
      throw new ApiClientError(
        {
          code: payload.code,
          message: payload.message,
          details: {},
        },
        res.status
      );
    }
    return payload.data as T;
  }

  return payload as T;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const tokens = await apiPost<TokenPair>(
      "/api/v1/auth/refresh",
      { refresh_token: refreshToken },
      { auth: false, retryOnUnauthorized: false }
    );
    setAuthTokens(tokens);
    return true;
  } catch {
    clearAuthTokens();
    return false;
  }
}

export async function apiJson<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const url = buildApiUrl(path);
  const { auth, retryOnUnauthorized, ...requestOptions } = options;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = auth === false ? null : getAccessToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...requestOptions,
    credentials: auth !== false ? "include" : "same-origin",
    headers,
  });

  if (
    res.status === 401 &&
    auth !== false &&
    retryOnUnauthorized !== false
  ) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiJson<T>(path, { ...options, retryOnUnauthorized: false });
    }
  }

  if (!res.ok) {
    let payload: unknown;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    const errorData = normalizeError(
      payload,
      res.status,
      res.statusText || "Unknown error"
    );
    throw new ApiClientError(errorData, res.status);
  }

  return parseResponse<T>(res);
}

export async function apiPost<T>(path: string, body: unknown, options?: ApiOptions): Promise<T> {
  return apiJson<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });
}

export async function apiPatch<T>(path: string, body: unknown, options?: ApiOptions): Promise<T> {
  return apiJson<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    ...options,
  });
}

export async function apiDelete<T>(path: string, options?: ApiOptions): Promise<T> {
  return apiJson<T>(path, {
    method: "DELETE",
    ...options,
  });
}
