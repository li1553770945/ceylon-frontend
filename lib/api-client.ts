import { type ApiError } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export class ApiClientError extends Error {
  status: number;
  code: string;
  details: Record<string, unknown>;

  constructor(error: ApiError, status: number) {
    super(error.message);
    this.status = status;
    this.code = error.code;
    this.details = error.details;
    this.name = "ApiClientError";
  }
}

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiJson<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    ...options,
    credentials: options.auth !== false ? "include" : "same-origin",
    headers,
  });

  if (!res.ok) {
    let errorData: ApiError;
    try {
      errorData = await res.json();
    } catch {
      errorData = {
        code: "UNKNOWN_ERROR",
        message: res.statusText || "Unknown error",
        details: {},
      };
    }
    throw new ApiClientError(errorData, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
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
