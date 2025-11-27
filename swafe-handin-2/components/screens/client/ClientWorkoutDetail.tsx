"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/services/apiClient";

type Props = {
  programId: string | number | null | undefined;
};

export default function ClientWorkoutDetail({ programId }: Props) {
  const [program, setProgram] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!programId) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await apiFetch(`/api/workoutprograms/${programId}`).catch(() => null);
        if (!mounted) return;
        setProgram(data || null);
      } catch (e) {
        setProgram(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [programId]);

  if (!programId) return <div className="text-sm text-zinc-500">No program selected.</div>;

  return (
    <div className="rounded border p-4 bg-white dark:bg-zinc-900">
      {loading ? (
        <div className="text-sm text-zinc-500">Loading program…</div>
      ) : !program ? (
        <div className="text-sm text-zinc-500">Program not found.</div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold">{program.name || program.title || `Program ${programId}`}</h3>
          {program.description && <p className="text-sm text-zinc-600">{program.description}</p>}

          <div className="mt-3">
            <h4 className="font-medium">Exercises</h4>
            {Array.isArray(program.exercises) && program.exercises.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {program.exercises.map((ex: any, i: number) => (
                  <li key={ex.id ?? i} className="rounded border p-2">
                    <div className="font-medium">{ex.name || ex.title}</div>
                    <div className="text-xs text-zinc-500">{ex.description || ''}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-zinc-500">No exercises listed.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
