"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/services/apiClient";
import { RequireRole } from "@/components/auth/RequireRole";
import EditUserForm from "@/components/screens/manager/EditUserForm";

export default function ManagerUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | number | null>(null);
  const [opMessage, setOpMessage] = useState<string | null>(null);

  async function reloadUsers() {
    setLoading(true);
    try {
      const data = await apiFetch('/api/Users?limit=200').catch(() => null);
      setUsers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

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
              {opMessage && <div className="mb-3 text-sm text-zinc-700 dark:text-zinc-300">{opMessage}</div>}
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left text-zinc-600">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => {
                    const id = u.userId ?? u.id ?? u.userID ?? u.user_id ?? u.email;
                    return (
                      <React.Fragment key={id}>
                        <tr className="border-t">
                          <td className="p-2">{u.firstName ? `${u.firstName} ${u.lastName || ""}` : "—"}</td>
                          <td className="p-2">{u.email}</td>
                          <td className="p-2">{u.accountType || u.role || "—"}</td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <button onClick={() => setEditingUserId(id)} className="rounded border px-2 py-1 text-sm">Edit</button>
                              <button onClick={async () => {
                                const deleteId = id;
                                if (!deleteId) { setOpMessage('User id missing'); return; }
                                if (!confirm(`Delete user ${u.email || deleteId}? This cannot be undone.`)) return;

                                // Use a direct fetch here so we can capture raw status/body for debugging
                                try {
                                  const base = process.env.NEXT_PUBLIC_API_BASE || "https://assignment2.swafe.dk";
                                  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
                                  const headers: Record<string,string> = {};
                                  if (token) headers['Authorization'] = `Bearer ${token}`;

                                  const res = await fetch(`${base}/api/Users/${deleteId}`, { method: 'DELETE', headers });
                                  const text = await res.text().catch(() => "");

                                  if (!res.ok) {
                                    let body: any = text;
                                    try { body = JSON.parse(text); } catch {}
                                    console.error('Delete failed', { status: res.status, body, token });
                                    setOpMessage(`Delete failed: ${res.status} ${typeof body === 'string' ? body : JSON.stringify(body)}`);
                                    return;
                                  }

                                  setOpMessage('User deleted');
                                  await reloadUsers();
                                } catch (e: any) {
                                  console.error('Delete request error', e);
                                  setOpMessage('Delete request error: ' + (e?.message || String(e)));
                                }
                              }} className="rounded border px-2 py-1 text-sm text-red-600">Delete</button>
                            </div>
                          </td>
                        </tr>

                        {editingUserId === id && (
                          <tr className="bg-zinc-50 dark:bg-zinc-800">
                            <td colSpan={4} className="p-3">
                              <div className="rounded border bg-white p-3 dark:bg-zinc-900">
                                <h4 className="font-medium mb-2">Edit {u.email || id}</h4>
                                <EditUserForm user={u} onSaved={async () => {
                                  setEditingUserId(null);
                                  await reloadUsers();
                                  setOpMessage('User updated');
                                }} onCancel={() => setEditingUserId(null)} />
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              {/* inline edit forms are rendered directly below each user row */}
            </div>
          )}
        </div>
      </div>
    </RequireRole>
  );
}
