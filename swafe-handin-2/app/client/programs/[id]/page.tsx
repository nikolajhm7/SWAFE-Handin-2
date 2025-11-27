"use client";

import React from "react";
import { useParams } from "next/navigation";
import ClientWorkoutFullDetail from "@/components/screens/client/ClientWorkoutFullDetail";

export default function ProgramPage() {
  const params = useParams();
  const rawId = (params && (params as any).id) || null;
  const id = rawId ? Number(rawId) : NaN;

  if (!id || Number.isNaN(id)) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold">Program</h1>
        <div className="text-sm text-zinc-500">Invalid program id.</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Program {id}</h1>
      <ClientWorkoutFullDetail programId={id} />
    </div>
  );
}
