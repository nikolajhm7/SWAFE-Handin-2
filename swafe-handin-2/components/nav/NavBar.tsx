"use client";

import Link from "next/link";
import { useAuth } from "../../providers/AuthProvider";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar() {
  const { role, isAuthenticated, logout, user } = useAuth();

  const displayName = user?.firstName || user?.email || "User";

  const roleLinks = () => {
    if (!isAuthenticated || role === "guest") {
      return [
        { href: "/", label: "Home" },
      ];
    }

    if (role === "manager") {
      return [
        { href: "/manager", label: "Dashboard" },
        { href: "/manager/users", label: "Users" },
        // { href: "/manager/create-trainer", label: "Create trainer" },
      ];
    }

    if (role === "trainer") {
      return [
        { href: "/trainer", label: "Dashboard" },
        { href: "/trainer/clients", label: "Clients" },
        { href: "/trainer/programs", label: "Programs" },
      ];
    }

    if (role === "client") {
      return [
        { href: "/client", label: "My programs" },
      ];
    }

    return [{ href: "/", label: "Home" }];
  };
  
  const navigationLinks = roleLinks();
  const pathname = usePathname();
  const router = useRouter();

  // Show a back link when the path has at least two segments (e.g. /trainer/programs)
  const segmentCount = pathname ? pathname.split('/').filter(Boolean).length : 0;
  const showBack = segmentCount >= 2;

  return (
    <nav className="w-full px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Left side: brand + role-specific links */}
        <div className="flex items-center gap-4">
          {showBack && (
            <button onClick={() => router.back()} className="text-sm hover:text-zinc-400 mr-2">← Back</button>
          )}
          <Link href="/" className="font-semibold text-lg">
            Fitness App
          </Link>

          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm hover:text-zinc-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-sm">
                Welcome, {displayName}!
                {role !== "guest" && (
                  <span className="ml-2 rounded bg-zinc-100 px-2 py-0.5 text-xs uppercase tracking-wide text-zinc-500">
                    {role}
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="rounded border px-3 py-1 text-sm hover:bg-zinc-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded border px-3 py-1 text-sm hover:bg-zinc-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
