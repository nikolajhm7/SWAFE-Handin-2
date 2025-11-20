"use client";

import { WorkoutProgram } from "@/models/WorkoutProgram";
import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TrainerProgramsLayout } from "./layout/TrainerProgramsLayout";

export function TrainerProgramsScreen() {
    const router = useRouter();
    const { isReady } = useAuth();

    const [programs, setPrograms] = useState<WorkoutProgram[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isReady) return;

        let cancelled = false;

        async function loadPrograms(){
            setLoading(true);
            setError(null);

            try {
                const data = await api.get("/api/WorkoutPrograms/trainer");

                if (!cancelled){
                    setPrograms(data);
                }
            } catch (err: any) {
                if (cancelled) return;

                setError(err?.message || String(err));
            } finally {
                if (cancelled) return;

                setLoading(false);
            }
        }

        loadPrograms();

        return () => {
            cancelled = true;
        };
    }, [isReady]);

    function handleProgramClick(id: number) {
        router.push(`/trainer/programs/${id}`);
    }

    function handleCreateNew() {
        router.push("/trainer/programs/create");
    }

    return (
        <TrainerProgramsLayout
            programs={programs}
            loading={loading}
            error={error}
            onProgramClick={handleProgramClick}
            onCreateNew={handleCreateNew}/>
    );
}