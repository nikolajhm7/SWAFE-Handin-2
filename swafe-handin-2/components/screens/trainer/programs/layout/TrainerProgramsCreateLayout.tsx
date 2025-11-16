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
  onChange: (field: keyof ProgramFormValues, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export function TrainerProgramsCreateLayout({
  values,
  submitting,
  error,
  validationError,
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
            Client ID
          </label>
          <input
            id="clientId"
            type="number"
            min={1}
            value={values.clientId}
            onChange={(e) => onChange("clientId", e.target.value)}
            className="program-form-input"
            placeholder="Client ID"
            disabled={submitting}
          />
          <p className="program-form-helper">
            (Could be a dropdown of clients)
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
