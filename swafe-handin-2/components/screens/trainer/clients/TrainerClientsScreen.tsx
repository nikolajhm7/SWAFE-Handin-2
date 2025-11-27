"use client";

import { useEffect, useState } from "react";
import apiFetch from "@/services/apiClient";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import TrainerClientsScreenLayout from "./layout/TrainerClientsScreenLayout";

export default function TrainerClientsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadClients() {
      try {
        setLoading(true);
        const result = await apiFetch("/api/Users/Clients");

        if (!cancelled) setClients(result || []);
      } catch (err) {
        if (!cancelled) {
          console.warn("[TrainerClientsScreen] Error loading clients:", err);
          setError("Failed to load clients.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadClients();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleCreateClient() {
    router.push("/trainer/clients/new");
  }

  return (
    <TrainerClientsScreenLayout
      clients={clients}
      loading={loading}
      error={error}
      onCreateClient={handleCreateClient}
    />
  );
}
