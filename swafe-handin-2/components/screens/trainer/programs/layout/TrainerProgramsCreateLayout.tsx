import React, { FormEvent } from "react";

interface ProgramFormValues {
  name: string;
  description: string;
  clientId: string;
}

interface Props {
  values: ProgramFormValues;
  submitting: boolean;
  error: string | null;
  validationError: string | null;
  clients?: any[] | null;
  clientsError?: string | null;
  onChange: (field: keyof ProgramFormValues, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export function TrainerProgramsCreateLayout({
  values,
  submitting,
  error,
  validationError,
  clients,
  clientsError,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <div className="program-create-page">
      <header className="program-create-header">
        <h1 className="program-create-title">Create new workout program</h1>
        <p className="program-create-subtitle">
          Fill out the details below to create a new workout program for a client.
        </p>
      </header>

      <form className="program-create-form" onSubmit={onSubmit}>
        {validationError && (
          <div className="program-status program-status--error">
            {validationError}
          </div>
        )}

        {error && (
          <div className="program-status program-status--error">
            {error}
          </div>
        )}

        <div className="program-form-field">
          <label htmlFor="name" className="program-form-label">
            Name<span className="program-form-required">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="program-form-input"
            placeholder="E.g. Full body beginner"
            disabled={submitting}
          />
        </div>

        <div className="program-form-field">
          <label htmlFor="description" className="program-form-label">
            Description
          </label>
          <textarea
            id="description"
            value={values.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="program-form-textarea"
            placeholder="Optional description of the program, goals, notes, etc."
            rows={4}
            disabled={submitting}
          />
        </div>

        <div className="program-form-field">
          <label htmlFor="clientId" className="program-form-label">
            Client
          </label>
          {clientsError && (
            <div className="text-sm text-red-600">{clientsError}</div>
          )}
          {clients && (
            <select
              id="clientId"
              value={values.clientId}
              onChange={(e) => onChange("clientId", e.target.value)}
              disabled={submitting}
              className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">(No client / Unassigned)</option>
              {clients.map((c: any) => (
                <option key={c.userId ?? c.id ?? c.email} value={c.userId ?? c.id}>
                  {c.firstName || c.email || "Client"} {c.lastName ? ` ${c.lastName}` : ""} — #{c.userId ?? c.id}
                </option>
              ))}
            </select>
          )}
          {!clients && !clientsError && (
            <input
              id="clientId"
              type="number"
              min={1}
              value={values.clientId}
              onChange={(e) => onChange("clientId", e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Client ID"
              disabled={submitting}
            />
          )}
          <p className="program-form-helper">
            Select a client for this program (or leave unassigned).
          </p>
        </div>

        <div className="program-form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="program-button program-button--secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="program-button program-button--primary"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create program"}
          </button>
        </div>
      </form>
    </div>
  );
}
