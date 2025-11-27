"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiFetch from "@/services/apiClient";
import { useAuth } from "@/providers/AuthProvider";
import TrainerClientsCreateScreenLayout from "./layout/TrainerClientsCreateScreenLayout";

export default function TrainerClientsCreateScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...form,
        personalTrainerId: user?.userId ?? 0,
        accountType: "Client",
      };

      await apiFetch("/api/Users", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      router.push("/trainer/clients");
    } catch (err) {
      console.warn("[Trainer/NewClient] Error creating client:", err);
      setError("Failed to create client.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <TrainerClientsCreateScreenLayout
      form={form}
      setForm={setForm}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
