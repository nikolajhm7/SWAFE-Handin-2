"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/services/apiClient";
import Link from "next/link";

type Props = { programId: string | number };

export default function ClientWorkoutFullDetail({ programId }: Props) {
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
    <div className="rounded border border-gray-200 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900">
      {loading ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading program…</div>
      ) : !program ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Program not found.</div>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{program.name || `Program ${programId}`}</h1>
              {program.description && <p className="text-sm text-zinc-700 dark:text-zinc-300">{program.description}</p>}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 text-right">
              <div>Program ID: {program.workoutProgramId ?? program.id ?? programId}</div>
              <div>Trainer: {program.personalTrainerId ?? '—'}</div>
              <div>Client: {program.clientId ?? '—'}</div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Exercises</h2>

            {Array.isArray(program.exercises) && program.exercises.length > 0 ? (
              <div className="mt-3 overflow-x-auto">
                <div className="rounded-md overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-800">
                        <th className="text-left text-sm font-medium px-4 py-2 border-r border-gray-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200">Exercise</th>
                        <th className="text-left text-sm font-medium px-4 py-2 border-r border-gray-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200">Description</th>
                        <th className="text-center text-sm font-medium px-4 py-2 border-r border-gray-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200">Set</th>
                        <th className="text-center text-sm font-medium px-4 py-2 text-zinc-700 dark:text-zinc-200">Reps/time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {program.exercises.map((ex: any, idx: number) => (
                        <tr key={ex.exerciseId ?? ex.id ?? idx} className="odd:bg-white even:bg-gray-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800">
                          <td className="align-top px-4 py-3 border-r border-gray-100 dark:border-zinc-800 w-40 text-zinc-800 dark:text-zinc-200">
                            <div className="font-medium">{ex.name || `Exercise ${ex.exerciseId ?? idx}`}</div>
                          </td>
                          <td className="align-top px-4 py-3 border-r border-gray-100 dark:border-zinc-800">
                            <div className="text-sm text-zinc-700 dark:text-zinc-300">{ex.description || '—'}</div>
                          </td>
                          <td className="align-top text-center px-4 py-3 border-r border-gray-100 dark:border-zinc-800 w-20 text-zinc-700 dark:text-zinc-300">
                            {ex.sets ?? '—'}
                          </td>
                          <td className="align-top text-center px-4 py-3 w-28 text-zinc-700 dark:text-zinc-300">
                            {ex.time ? ex.time : (ex.repetitions || ex.repetitions === 0 ? String(ex.repetitions) : '—')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-sm text-zinc-500 mt-2">No exercises listed.</div>
            )}
          </div>

          <div className="mt-6 flex gap-2">
            <Link href="/client" className="rounded border px-3 py-1">Back</Link>
          </div>
        </div>
      )}
    </div>
  );
}
