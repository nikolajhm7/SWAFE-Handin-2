"use client";

import { RequireRole } from "@/components/auth/RequireRole";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/apiClient";

export default function TrainerScreen() {
    const router = useRouter();
    const [programCount, setProgramCount] = useState<number | null>(null);
    const [clientCount, setClientCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            try {
                const progs = await api.get("/api/WorkoutPrograms/trainer");
                const clients = await api.get("/api/Users/Clients");

                if (cancelled) return;
                setProgramCount(Array.isArray(progs) ? progs.length : null);
                setClientCount(Array.isArray(clients) ? clients.length : null);
            } catch (err) {
                if (cancelled) return;
                setProgramCount(null);
                setClientCount(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    function goToPrograms() {
        router.push("/trainer/programs");
    }

    function goToCreateProgram() {
        router.push("/trainer/programs/create");
    }

    function goToClients() {
        router.push("/trainer/clients");
    }

    function goToCreateClient() {
        router.push("/trainer/clients/new");
    }

    return (
        <RequireRole allowed={["trainer"]}>
            <div className="min-h-screen p-6">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold">Trainer dashboard</h1>
                    <p className="text-sm text-zinc-600">Actions for personal trainers — manage clients and workout programs.</p>
                </header>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="col-span-2 rounded-lg border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="text-lg font-semibold mb-3">Actions</h2>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={goToCreateClient} className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500">Create client</button>
                            <button onClick={goToCreateProgram} className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">Create program</button>
                            <button onClick={goToClients} className="rounded-md border px-4 py-2 text-sm">View clients</button>
                            <button onClick={goToPrograms} className="rounded-md border px-4 py-2 text-sm">View programs</button>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-md font-medium">Summary</h3>
                            {loading ? (
                                <div className="text-sm text-zinc-500 mt-2">Loading summary…</div>
                            ) : (
                                <div className="mt-2 flex gap-4">
                                    <div className="rounded-md border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800">
                                        <div className="text-sm text-zinc-500">Programs</div>
                                        <div className="text-2xl font-bold">{programCount ?? "—"}</div>
                                    </div>
                                    <div className="rounded-md border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800">
                                        <div className="text-sm text-zinc-500">Clients</div>
                                        <div className="text-2xl font-bold">{clientCount ?? "—"}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <div className="mt-3 flex flex-col gap-2">
                            <button onClick={goToPrograms} className="text-left text-sm hover:underline">Programs</button>
                            <button onClick={goToClients} className="text-left text-sm hover:underline">Clients</button>
                            <button onClick={goToCreateProgram} className="text-left text-sm hover:underline">New Program</button>
                            <button onClick={goToCreateClient} className="text-left text-sm hover:underline">New Client</button>
                        </div>
                    </aside>
                </div>
            </div>
        </RequireRole>
    );
}