"use client";

import React from "react";
import { RequireRole } from "@/components/auth/RequireRole";
import ClientScreen from "@/components/screens/client/ClientScreen";

export default function ClientPage() {
  return (
    <RequireRole allowed={["client"]}>
      <div className="min-h-screen p-6">
        <ClientScreen />
      </div>
    </RequireRole>
  );
}