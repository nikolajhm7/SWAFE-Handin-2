"use client";

import { Role, useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RequireRoleProps {
    allowed: Role[];
    children: React.ReactNode;
    redirectTo?: string;
}

export function RequireRole({ allowed, children, redirectTo = "/" }: RequireRoleProps) {
    const { role, isAuthenticated, isReady } = useAuth();
    const router = useRouter();

    const isAllowed =
        isAuthenticated && allowed.includes(role);

    useEffect(() => {
        if (!isReady) return;

        if (!isAllowed) {
            router.push(redirectTo);
        }
    }, [isReady, isAllowed, redirectTo, router]);

    if (!isReady) {
        return <div>Loading...</div>;
    }

    if (!isAllowed) {
        return null;
    }

    return <>{children}</>;
}