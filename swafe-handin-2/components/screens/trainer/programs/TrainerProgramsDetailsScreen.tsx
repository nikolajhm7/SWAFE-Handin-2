"use client";

import { Id } from "@/models/Id";
import { WorkoutProgram } from "@/models/WorkoutProgram";
import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TrainerProgramsDetailsLayout } from "./layout/TrainerProgramsDetailsLayout";


export function TrainerProgramsDetailsScreen({ id }: Id) {
    const router = useRouter();
    const { isReady } = useAuth();

    const [program, setProgram] = useState<WorkoutProgram | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cancelledRef = useRef(false);

    async function loadProgram() {
        if (!isReady) return;
        cancelledRef.current = false;
        setLoading(true);
        setError(null);

        try {
            const data = await api.get(`/api/WorkoutPrograms/${id}`);
            if (cancelledRef.current) return;
            setProgram(data);
        } catch (err: any) {
            if (cancelledRef.current) return;
            setError(err?.message || String(err));
        } finally {
            if (cancelledRef.current) return;
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isReady) return;
        loadProgram();
        return () => {
            cancelledRef.current = true;
        };
    }, [id, isReady]);

    function goBack() {
        router.push("/trainer/programs");
    }

    // handler to add exercise to program via POST /api/Exercises/Program/{programId}
    async function handleAddExercise(payload: any) {
        try {
            await api.post(`/api/Exercises/Program/${id}`, payload);
            // reload program after successful add
            await loadProgram();
            return { ok: true };
        } catch (err: any) {
            return { ok: false, error: err?.message || String(err) };
        }
    }

    return <TrainerProgramsDetailsLayout
        program={program}
        loading={loading}
        error={error}
        onBack={goBack}
        onAddExercise={handleAddExercise} />;
}