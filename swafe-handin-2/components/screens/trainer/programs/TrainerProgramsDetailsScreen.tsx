"use client";

import { Id } from "@/models/Id";
import { WorkoutProgram } from "@/models/WorkoutProgram";
import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TrainerProgramsDetailsLayout } from "./layout/TrainerProgramsDetailsLayout";


export function TrainerProgramsDetailsScreen({ id }: Id) {
    const router = useRouter();
    const { isReady } = useAuth();

    const [program, setProgram] = useState<WorkoutProgram | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isReady) return;

        let cancelled = false;

        async function loadProgram(){
            setLoading(true);
            setError(null);

            try {
                const data = await api.get(`/api/WorkoutPrograms/${id}`);

                if (!cancelled){
                    setProgram(data);
                }
            } catch (err: any) {
                if (cancelled) return;

                setError(err?.message || String(err));
            } finally {
                if (cancelled) return;

                setLoading(false);
            }
        }

        loadProgram();

        return () => {
            cancelled = true;
        };
    }, [id, isReady]);

    function goBack() {
        router.push("/trainer/programs");
    }

    return <TrainerProgramsDetailsLayout
        program={program}
        loading={loading}
        error={error}
        onBack={goBack}/>
}