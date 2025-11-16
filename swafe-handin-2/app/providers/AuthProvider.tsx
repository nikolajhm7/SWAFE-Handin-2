"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin } from "../services/auth";

type Role = "guest" | "manager" | "trainer" | "client";

interface AuthContextValue {
	role: Role;
	setRole: (r: Role) => void;
	token: string | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [role, setRole] = useState<Role>("guest");
	const [token, setToken] = useState<string | null>(() =>
		typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
	);

	useEffect(() => {
		if (token) localStorage.setItem("auth_token", token);
		else localStorage.removeItem("auth_token");
	}, [token]);

	async function login(email: string, password: string) {
		const t = await apiLogin(email, password);
		setToken(t);
	}

	function logout() {
		setToken(null);
		setRole("guest");
	}

	return (
		<AuthContext.Provider
			value={{ role, setRole, token, isAuthenticated: !!token, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}

