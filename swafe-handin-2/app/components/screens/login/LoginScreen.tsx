"use client";

import React, { useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";

export default function LoginScreen() {
  const { role, login, isAuthenticated, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="mt-2">Current role: <strong>{role}</strong></p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
        <input
          className="rounded border px-2 py-1"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="rounded border px-2 py-1"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <button disabled={loading} className="rounded bg-indigo-600 px-3 py-1 text-white" type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
          {isAuthenticated && (
            <button type="button" onClick={logout} className="rounded bg-gray-500 px-3 py-1 text-white">
              Logout
            </button>
          )}
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </form>

      {/* Roles are determined by the authenticated user from the backend; manual switching removed. */}
    </div>
  );
}
