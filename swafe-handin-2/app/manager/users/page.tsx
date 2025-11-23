"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/services/apiClient";
import { RequireRole } from "@/components/auth/RequireRole";

export default function ManagerUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // attempt to fetch a larger list; adjust query if your backend uses different params
        const data = await apiFetch("/api/Users?limit=200").catch(() => null);
        if (!mounted) return;
        if (Array.isArray(data)) setUsers(data);
        else setUsers([]);
      } catch (e) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <RequireRole allowed={["manager"]}>
      <div className="min-h-screen p-6">
        <h1 className="text-2xl font-bold">All users</h1>
        <p className="text-sm text-zinc-600">Listing users from the API. Use search or pagination if needed.</p>

        <div className="mt-6">
          {loading ? (
            <div className="text-sm text-zinc-500">Loading…</div>
          ) : users.length === 0 ? (
            <div className="text-sm text-zinc-500">No users returned.</div>
          ) : (
            <div className="overflow-auto rounded border bg-white p-4 shadow-sm dark:bg-zinc-900">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left text-zinc-600">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id || u.userId || u.email} className="border-t">
                      <td className="p-2">{u.firstName ? `${u.firstName} ${u.lastName || ""}` : "—"}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.accountType || u.role || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </RequireRole>
  );
}
