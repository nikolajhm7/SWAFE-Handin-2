"use client";

import React, { useEffect, useState } from "react";
import { RequireRole } from "@/components/auth/RequireRole";
import CreateUserScreen from "./CreateUserScreen";
import { apiFetch } from "@/services/apiClient";
import Link from "next/link";

export default function ManagerScreen() {
  const [showCreate, setShowCreate] = useState<null | "Client" | "PersonalTrainer" | "__view_trainers__">(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // fetch a larger list so we can filter and pick the newest ids
        const data = await apiFetch("/api/Users?limit=200").catch(() => null);
        if (!mounted) return;
        if (Array.isArray(data)) {
          // derive numeric id from a few possible fields
          const getNumericId = (u: any) => {
            const v = u?.userId ?? u?.userID ?? u?.id ?? u?.user_id ?? u?.idNumber ?? u?.id_number;
            const n = Number(v);
            return Number.isFinite(n) ? n : null;
          };

          // Show newest users first by numeric id (desc). Keep only users with a numeric id.
          const withIds = data
            .map((u: any) => ({ u, id: getNumericId(u) }))
            .filter((x: any) => x.id !== null)
            .sort((a: any, b: any) => b.id - a.id)
            .map((x: any) => x.u);

          setRecentUsers(withIds.slice(0, 10));
        } else {
          setRecentUsers([]);
        }
      } catch (e) {
        setRecentUsers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // trainer list state will be populated when the manager opens the trainers view
  const [trainersList, setTrainersList] = useState<any[]>([]);
  const [trainersLoading, setTrainersLoading] = useState(false);

  // when the user selects View trainers, fetch a larger user set and filter/sort trainers
  React.useEffect(() => {
    if (showCreate !== "__view_trainers__") return;
    let mounted = true;
    async function loadTrainers() {
      setTrainersLoading(true);
      try {
        const data = await apiFetch("/api/Users?limit=500").catch(() => null);
        if (!mounted) return;
        if (!Array.isArray(data)) {
          setTrainersList([]);
          return;
        }

        const trainers = data.filter((u: any) => {
          const t = (u.accountType || u.role || "").toLowerCase();
          return t.includes("trainer");
        });

        // sort trainers by type (personal trainers first), then by numeric id desc
        const getNumericId = (u: any) => Number(u?.userId ?? u?.userID ?? u?.id ?? 0) || 0;
        trainers.sort((a: any, b: any) => {
          const ta = (a.accountType || a.role || "").toLowerCase();
          const tb = (b.accountType || b.role || "").toLowerCase();
          const score = (s: string) => (s.includes("personal") ? 0 : 1);
          const sa = score(ta);
          const sb = score(tb);
          if (sa !== sb) return sa - sb;
          return getNumericId(b) - getNumericId(a);
        });

        setTrainersList(trainers);
      } catch (e) {
        setTrainersList([]);
      } finally {
        if (mounted) setTrainersLoading(false);
      }
    }

    loadTrainers();
    return () => { mounted = false; };
  }, [showCreate]);

  return (
    <RequireRole allowed={["manager"]}>
      <div className="min-h-screen bg-transparent p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Manager dashboard</h1>
          <p className="text-sm text-zinc-600">Actions for managers — create users and manage clients/trainers.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2 rounded-lg border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold mb-3">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowCreate("PersonalTrainer")} className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">Create trainer</button>
              <button onClick={() => setShowCreate("Client")} className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500">Create client</button>
              <Link href="/manager/users" className="rounded-md border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700">View all users</Link>
              <button onClick={() => setShowCreate("__view_trainers__")} className="rounded-md border px-4 py-2 text-sm">View trainers</button>
            </div>

            <div className="mt-6">
              {showCreate === "__view_trainers__" ? (
                <div className="rounded-md border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800">
                  <h3 className="font-medium">Trainers</h3>
                  {trainersLoading ? (
                    <div className="text-sm text-zinc-500 mt-2">Loading trainers…</div>
                  ) : trainersList.length === 0 ? (
                    <div className="text-sm text-zinc-500 mt-2">No trainers found.</div>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {trainersList.map((t: any) => (
                        <li key={t.id || t.userId || t.email} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-zinc-900 dark:text-white">{t.firstName ? `${t.firstName} ${t.lastName || ""}` : t.email}</div>
                            <div className="text-xs text-zinc-500">{t.email}</div>
                          </div>
                          <div className="text-xs text-zinc-500">{t.accountType || t.role || "Trainer"}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                ) : showCreate ? (
                <div className="rounded-md border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800">
                  <CreateUserScreen defaultAccountType={showCreate} onClose={() => setShowCreate(null)} />
                </div>
              ) : (
                <div className="text-sm text-zinc-600">Select an action to show the inline form.</div>
              )}
            </div>
          </div>

          <aside className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold">Recent users</h3>
            <div className="mt-3">
              {loading ? (
                <div className="text-sm text-zinc-500">Loading…</div>
              ) : recentUsers.length === 0 ? (
                <div className="text-sm text-zinc-500">No recent users found.</div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-auto">
                  <ul className="space-y-2">
                    {recentUsers.slice(0, 50).map((u: any) => (
                      <li key={u.id || u.userId || u.email} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-white">{u.firstName ? `${u.firstName} ${u.lastName || ""}` : u.email}</div>
                          <div className="text-xs text-zinc-500">{u.email}</div>
                        </div>
                        <div className="text-xs text-zinc-500">{u.accountType || u.role || "—"}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </RequireRole>
  );
}