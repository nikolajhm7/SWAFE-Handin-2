"use client";

import React, { useState } from "react";
import { apiFetch } from "@/services/apiClient";

type Props = {
  user: any;
  onSaved: () => void;
  onCancel: () => void;
};

export default function EditUserForm({ user, onSaved, onCancel }: Props) {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [accountType, setAccountType] = useState(user.accountType || user.role || "Client");
  const [password, setPassword] = useState("");
  const [personalTrainerId, setPersonalTrainerId] = useState<string | null>(
    user.personalTrainerId == null ? "" : String(user.personalTrainerId)
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const id = user.userId ?? user.id ?? user.userID ?? user.user_id;
      if (!id) throw new Error("User id not found");

      // Build a full payload and do a PUT request
      const fullPayload: any = {
        userId: Number(id),
        firstName: firstName || user.firstName || "",
        lastName: lastName || user.lastName || "",
        email: email || user.email || "",
        password: password || "",
        personalTrainerId: personalTrainerId === "" ? null : (personalTrainerId == null ? null : Number(personalTrainerId)),
        accountType: accountType || user.accountType || user.role || "",
      };

      // Client-side validation for required fields
      const missing: string[] = [];
      if (!fullPayload.firstName) missing.push("firstName");
      if (!fullPayload.lastName) missing.push("lastName");
      if (!fullPayload.email) missing.push("email");
      if (!fullPayload.password) missing.push("password");
      if (!fullPayload.accountType) missing.push("accountType");

      if (missing.length > 0) {
        setMessage("Missing required fields: " + missing.join(", "));
        setLoading(false);
        return;
      }

      try {
        await apiFetch(`/api/Users/${id}`, { method: "PUT", body: JSON.stringify(fullPayload) });
        setMessage("Saved (PUT)");
        onSaved();
        return;
      } catch (putErr: any) {
        throw putErr;
      }
    } catch (err: any) {
      // If backend returned structured validation errors, show them concisely
      if (err && typeof err === "object" && err.errors) {
        try {
          const parts: string[] = [];
          for (const key of Object.keys(err.errors)) {
            const v = err.errors[key];
            if (Array.isArray(v)) parts.push(`${key}: ${v.join(", ")}`);
            else parts.push(`${key}: ${String(v)}`);
          }
          setMessage("Validation: " + parts.join("; "));
        } catch (parseErr) {
          setMessage("Error: " + (err?.message || String(err)));
        }
      } else {
        setMessage("Error: " + (err?.message || String(err)));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-2">
      <div className="text-xs text-zinc-500">User ID: {user.userId ?? user.id ?? user.userID ?? user.user_id}</div>
      <div className="flex gap-2">
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="flex-1 rounded border px-2 py-1" />
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="flex-1 rounded border px-2 py-1" />
      </div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded border px-2 py-1" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep password" type="password" className="rounded border px-2 py-1" />
      <input value={personalTrainerId ?? ""} onChange={(e) => setPersonalTrainerId(e.target.value)} placeholder="personalTrainerId (leave empty for null)" className="rounded border px-2 py-1" />
      <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className="rounded border px-2 py-1">
        <option>Client</option>
        <option>PersonalTrainer</option>
        <option>Manager</option>
      </select>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="rounded bg-indigo-600 px-3 py-1 text-white">{loading ? "Saving..." : "Save"}</button>
        <button type="button" onClick={onCancel} className="rounded border px-3 py-1">Cancel</button>
      </div>
      {message && <div className="text-sm mt-1">{message}</div>}
    </form>
  );
}
