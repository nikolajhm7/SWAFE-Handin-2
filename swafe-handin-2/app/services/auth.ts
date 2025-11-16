const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://assignment2.swafe.dk";

type LoginResponse = {
  jwt?: string;
  accessToken?: string;
  token?: string;
};

export async function login(email: string, password: string): Promise<string> {
  // Swagger shows the login endpoint under /api/Users/login
  const url = `${API_BASE}/api/Users/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/plain" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Login failed: ${res.status} ${text}`);
  }

  // Some endpoints return JSON, others return text/plain containing JSON. Handle both.
  const ct = res.headers.get("content-type") || "";
  let body: LoginResponse = {};
  if (ct.includes("application/json")) {
    body = await res.json().catch(() => ({} as LoginResponse));
  } else {
    const txt = await res.text().catch(() => "");
    try {
      body = JSON.parse(txt) as LoginResponse;
    } catch {
      // If the response is a raw token string (unlikely), use it directly
      body = { jwt: txt } as any;
    }
  }

  const token = body.jwt || body.accessToken || body.token || null;
  if (!token) throw new Error("Login succeeded but no token returned (check API response)");
  return token;
}
