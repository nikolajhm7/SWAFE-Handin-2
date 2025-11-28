"use client";

import { Id } from "@/models/Id";
import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { TrainerProgramsCreateLayout } from "./layout/TrainerProgramsCreateLayout";
import { useEffect } from "react";

interface ProgramFormValues {
    name: string;
    description: string;
    clientId: string;
}

export default function TrainerProgramsCreateScreen() {
    const router = useRouter();
    const { isReady } = useAuth();

    const [clients, setClients] = useState<any[] | null>(null);
    const [clientsError, setClientsError] = useState<string | null>(null);

    const [values, setValues] = useState<ProgramFormValues>({
        name: "",
        description: "",
        clientId: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    if (!isReady) {
        return <div>Loading...</div>;
    }

    useEffect(() => {
        let cancelled = false;
        async function loadClients() {
            try {
                const data = await api.get("/api/Users/Clients");
                if (cancelled) return;
                setClients(data || []);
            } catch (err: any) {
                if (cancelled) return;
                setClientsError(err?.message || String(err));
            }
        }

        loadClients();
        return () => { cancelled = true; };
    }, [isReady]);

    function handleChange(field: keyof ProgramFormValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setValidationError(null);
        setError(null);
    }

    async function handleSubmit(e: FormEvent){
        e.preventDefault();

        const name = values.name.trim();
        const description = values.description.trim();
        const clientId = values.clientId ? Number(values.clientId) : null;

        if (!name) {
            setValidationError("Name is required.");
            return;
        }

        if (values.clientId && (Number.isNaN(clientId) || clientId! <= 0)){
            setValidationError("Client ID must be a positive number.");
            return;
        }

        setSubmitting(true);
        setError(null);
        setValidationError(null);

        try {
            const body = {
                name,
                description,
                exercises: [] as any[], // we add these later
                clientId: clientId
            };

            const created = (await api.post(
                "/api/WorkoutPrograms",
                body
            )) as Id | any;

            if (typeof created.id === "number"){
                router.push(`/trainer/programs/${created.id}`);
            } else {
                router.push("/trainer/programs");
            }
        } catch (err: any) {
            setError(err?.message || String(err));
        } finally {
            setSubmitting(false);
        }
    }

    function handleCancel(){
        router.push("/trainer/programs");
    }

    return (
        <TrainerProgramsCreateLayout
            values={values}
            submitting={submitting}
            error={error}
            validationError={validationError}
            clients={clients}
            clientsError={clientsError}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    )
}