"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full border-b bg-white px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold text-lg">Fitness App</Link>
          <Link href="/trainer" className="text-sm text-zinc-600">Trainer</Link>
          <Link href="/manager" className="text-sm text-zinc-600">Manager</Link>
          <Link href="/client" className="text-sm text-zinc-600">Client</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded border px-3 py-1 text-sm">Login</Link>
        </div>
      </div>
    </nav>
  );
}
