"use client";

import Link from "next/link";
import { useAuth } from "../../providers/AuthProvider";

export default function NavBar() {
  const { role, isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="w-full border-b bg-white px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold text-lg">Fitness App</Link>
          <Link href="/trainer" className="text-sm text-zinc-600">Trainer</Link>
          <Link href="/manager" className="text-sm text-zinc-600">Manager</Link>
          <Link href="/client" className="text-sm text-zinc-600">Client</Link>
          {role === "manager" && (
            <Link href="/manager/create-user" className="text-sm text-zinc-600">Create user</Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-sm">{user?.firstName || user?.email || "User"}</div>
              <button onClick={logout} className="rounded border px-3 py-1 text-sm">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="rounded border px-3 py-1 text-sm">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
