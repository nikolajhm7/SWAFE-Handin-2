"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { apiFetch } from "@/services/apiClient";
import Link from "next/link";
import ClientWorkoutDetail from "./ClientWorkoutDetail";

export default function ClientScreen() {
  const { user, isReady } = useAuth();
  const [programs, setPrograms] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!isReady || !user) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const id = user.userId ?? user.userID ?? user.id ?? user.user_id;
        if (!id) {
          setPrograms([]);
          return;
        }
        // fetch client-specific programs
        const data = await apiFetch(`/api/workoutprograms/client/${id}`).catch(() => null);
        if (!mounted) return;
        setPrograms(Array.isArray(data) ? data : []);
      } catch (e) {
        setPrograms([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [isReady, user]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Client dashboard</h1>
      <p className="text-sm text-zinc-600 mb-4">Your workout programs and details.</p>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Programs</h2>
        {loading ? (
          <div className="text-sm text-zinc-500">Loading…</div>
        ) : !programs ? (
          <div className="text-sm text-zinc-500">—</div>
        ) : programs.length === 0 ? (
          <div className="text-sm text-zinc-500">No programs assigned.</div>
        ) : programs.length === 1 ? (
          // If only one program, show detail inline
          <div className="mt-3">
            <ClientWorkoutDetail programId={programs[0].id ?? programs[0].userId ?? programs[0].programId ?? programs[0].workoutProgramId} />
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {programs.map((p: any) => {
              const pid = p.id ?? p.programId ?? p.workoutProgramId ?? p.userId;
              return (
                <div key={pid}>
                  <div className="rounded border p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name || p.title || `Program ${pid}`}</div>
                      <div className="text-xs text-zinc-500">{p.description || ""}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(pid)} className="rounded border px-3 py-1 text-sm">View</button>
                      <Link href={`/client/programs/${pid}`} className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">Open</Link>
                    </div>
                  </div>

                  {selected === pid && (
                    <div className="mt-2 ml-4">
                      <ClientWorkoutDetail programId={pid} />
                      <div className="mt-2">
                        <button onClick={() => setSelected(null)} className="rounded border px-3 py-1">Close</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
