export type DecodedToken = {
    Name?: string;
    Role?: string;
    UserId?: string;
    GroupId?: string;
    [key: string]: any;
}

export function parseJwt(token: string): DecodedToken | null {
    if (!token) return null;

    try {
      const [, payloadBase64] = token.split(".");
      if (!payloadBase64) return null;
  
      const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      const json =
        typeof atob === "function"
          ? atob(normalized)
          : Buffer.from(normalized, "base64").toString("utf-8");
  
      return JSON.parse(json);
    } catch (err) {
      console.error("[JWT] Failed to parse token:", err);
      return null;
    }
}