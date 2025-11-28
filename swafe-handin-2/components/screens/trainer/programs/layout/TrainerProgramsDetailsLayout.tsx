"use client";

import React, { useState } from "react";
import { WorkoutProgram } from "@/models/WorkoutProgram";

interface Props {
    program: WorkoutProgram | null;
    loading: boolean;
    error: string | null;
    onBack: () => void;
    onAddExercise?: (payload: any) => Promise<{ ok: boolean; error?: string }>;
}

export function TrainerProgramsDetailsLayout({ program, loading, error, onBack, onAddExercise }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    sets: "",
    repetitions: "",
    time: "",
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((s) => ({ ...s, [field]: value }));
    setAddError(null);
  }

  async function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!onAddExercise) return;
    const payload: any = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      sets: form.sets ? Number(form.sets) : null,
      repetitions: form.repetitions ? Number(form.repetitions) : null,
      time: form.time ? String(form.time).trim() : null,
    };

    if (!payload.name) {
      setAddError("Name is required.");
      return;
    }

    setSubmitting(true);
    const res = await onAddExercise(payload);
    setSubmitting(false);
    if (!res.ok) {
      setAddError(res.error || "Failed to add exercise.");
    } else {
      setShowAdd(false);
      setForm({ name: "", description: "", sets: "", repetitions: "", time: "" });
    }
  }
    const exerciseCount = program?.exercises?.length ?? 0;

  return (
    <div className="program-page">
      <button type="button" onClick={onBack} className="program-back-button">
        ← Back to Programs
      </button>

      {loading && <div className="program-status program-status--loading">Loading workout program...</div>}

      {error && <div className="program-status program-status--error">{error}</div>}

      {!loading && !error && !program && (
        <div className="program-status program-status--empty">
          Workout program not found.
        </div>
      )}

      {!loading && !error && program && (
        <>
          <header className="program-header">
            <h1 className="program-title">{program.name || "No name"}</h1>

            {program.description && (
              <p className="program-description">{program.description}</p>
            )}

            <div className="program-meta">
              <span>ID: {program.workoutProgramId}</span>
              {program.clientId != null && <span>Client ID: {program.clientId}</span>}
              <span>
                {exerciseCount} exercise{exerciseCount === 1 ? "" : "s"}
              </span>
            </div>
          </header>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h2 className="program-exercises-title">Exercises</h2>
              {onAddExercise && (
                <div>
                  <button className="program-button program-button--primary" onClick={() => setShowAdd((s) => !s)}>
                    {showAdd ? "Cancel" : "+ Add exercise"}
                  </button>
                </div>
              )}
            </div>

            {showAdd && onAddExercise && (
              <form onSubmit={submitAdd}>
                <div className="mt-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm">
                  {addError && <div className="text-sm text-red-600 mb-2">{addError}</div>}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Name</label>
                      <input
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Exercise name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={3}
                        placeholder="Optional description"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Sets</label>
                        <input
                          type="number"
                          min={0}
                          value={form.sets}
                          onChange={(e) => updateField("sets", e.target.value)}
                          className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Repetitions</label>
                        <input
                          type="number"
                          min={0}
                          value={form.repetitions}
                          onChange={(e) => updateField("repetitions", e.target.value)}
                          className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Time</label>
                        <input
                          value={form.time}
                          onChange={(e) => updateField("time", e.target.value)}
                          className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g. 30 sec"
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-md"
                      >
                        {submitting ? "Adding…" : "Add exercise"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {exerciseCount === 0 && (
            <div className="program-status program-status--empty mt-4">
                No exercises in this program.
            </div>
          )}

          {exerciseCount > 0 && (
            <ul className="program-exercises-list mt-4">
              {program.exercises!.map((ex, index) => {
                const hasSetsOrReps = ex.sets != null || (ex.repetitions !== 0);
                const hasTime = !!ex.time;

                return (
                  <li
                    key={ex.exerciseId ?? index}
                    className="program-exercise-item"
                  >
                    <div className="program-exercise-header">
                      <div className="program-exercise-name">
                        {ex.name || `Exercise ${index + 1}`}
                      </div>
                      <div className="program-exercise-id">
                        ID: {ex.exerciseId}
                      </div>
                    </div>

                    {ex.description && (
                      <p className="program-exercise-description">
                        {ex.description}
                      </p>
                    )}

                    <div className="program-exercise-meta">
                      {hasSetsOrReps && (
                        <span>
                          {ex.sets != null && `${ex.sets} sæt`}
                          {ex.sets != null && ex.repetitions != null && " x "}
                          {ex.repetitions != null &&
                            `${ex.repetitions} repetitions`}
                        </span>
                      )}
                      {hasTime && <span>Duration: {ex.time}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}