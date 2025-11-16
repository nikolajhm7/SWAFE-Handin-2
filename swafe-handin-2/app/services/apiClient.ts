// apiClient is a utility to make API requests with proper headers and error handling.

export async function apiFetch(path: string, options: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "https://assignment2.swafe.dk";
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${base}${path.startsWith("/") ? path : "/" + path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${text}`);
  }

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// helpers
export const api = {
  get: (path: string) => apiFetch(path, { method: "GET" }),
  post: (path: string, body?: any) =>
    apiFetch(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (path: string, body?: any) =>
    apiFetch(path, { method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) }),
  del: (path: string) => apiFetch(path, { method: "DELETE" }),
};

export default apiFetch;
