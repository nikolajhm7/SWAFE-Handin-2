"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../providers/AuthProvider";
import { apiFetch } from "../../../services/apiClient";

type Props = {
    defaultAccountType?: string;
    className?: string;
    onClose?: () => void;
};

export default function CreateUserScreen({ defaultAccountType, className, onClose }: Props) {
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
    const [accountType, setAccountType] = useState(defaultAccountType || "Client"); // Manager/PersonalTrainer/Client
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            // Endpoint path in backend: /api/Users
            const payload = { email, firstName, lastName, password, accountType };
            await apiFetch("/api/Users", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            setMessage("User created successfully.");
            // Clear form
            setEmail("");
            setFirstName("");
            setLastName("");
            setPassword("");
            setAccountType(defaultAccountType || "Client");
        } catch (err: any) {
            setMessage("Error: " + (err?.message || String(err)));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={className ?? "p-6 max-w-xl bg-white/50 dark:bg-zinc-900/60 rounded-md"}>
            <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">Create user</h2>
                {onClose && (
                    <button type="button" onClick={onClose} className="ml-3 rounded-md border border-zinc-200 px-3 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-700">Close</button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-zinc-500"
                />

                <div className="flex gap-2">
                    <input
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-zinc-500"
                    />
                    <input
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-zinc-500"
                    />
                </div>

                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-zinc-500"
                />

                <div className="relative">
                    <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="appearance-none w-full rounded-md border border-zinc-300 bg-white px-3 py-2 pr-10 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-zinc-500"
                    >
                        <option>Client</option>
                        <option>PersonalTrainer</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="flex gap-2 mt-2">
                    <button type="submit" disabled={loading} className="rounded-md bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60">
                        {loading ? "Creating..." : "Create user"}
                    </button>
                </div>
                {message && <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{message}</div>}
            </form>
        </div>
    );
}