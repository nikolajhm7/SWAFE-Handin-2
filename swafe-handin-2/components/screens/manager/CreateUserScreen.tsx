"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../providers/AuthProvider";
import { apiFetch } from "../../../services/apiClient";

export default function CreateUserScreen() {
    const { role, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait until auth state is known, then check role
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (role !== "manager") {
            router.push("/"); // or /client view
        }
    }, [role, isAuthenticated, router]);
    
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("Client"); // Manager/PersonalTrainer/Client
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            // Endpoint path in backend: /api/Users
            const payload = { email, firstName, lastName, password, accountType };
            const res = await apiFetch("/api/Users", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            setMessage("User created successfully.");
            // Clear form
            setEmail("");
            setFirstName("");
            setLastName("");
            setPassword("");
            setAccountType("Client");
        } catch (err: any) {
            setMessage("Error: " + (err?.message || String(err)));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-xl">
            <h2 className="text-xl font-semibold">Create user</h2>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
                <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded border px-2 py-1" />
                <input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded border px-2 py-1" />
                <input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded border px-2 py-1" />
                <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded border px-2 py-1" />
                <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className="rounded border px-2 py-1">
                    <option>Client</option>
                    <option>PersonalTrainer</option>
                    <option>Manager</option>
                </select>
                <div className="flex gap-2 mt-2">
                    <button type="submit" disabled={loading} className="rounded bg-blue-600 px-3 py-1 text-white">
                        {loading ? "Creating..." : "Create user"}
                    </button>
                </div>
                {message && <div className="mt-2 text-sm">{message}</div>}
            </form>
        </div>
    );
}