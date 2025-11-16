"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin } from "../services/auth";
import apiFetch from "../services/apiClient";

type Role = "guest" | "manager" | "trainer" | "client";

interface AuthContextValue {
	role: Role;
	setRole: (r: Role) => void;
	token: string | null;
	user: any | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [role, setRole] = useState<Role>("guest");
	const [user, setUser] = useState<any | null>(null);
	const [token, setToken] = useState<string | null>(() =>
		typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
	);

	useEffect(() => {
		if (token) localStorage.setItem("auth_token", token);
		else localStorage.removeItem("auth_token");
	}, [token]);

	async function login(email: string, password: string) {
		const t = await apiLogin(email, password);
		// persist immediately so apiFetch can read it
		if (typeof window !== "undefined") localStorage.setItem("auth_token", t);
		setToken(t);

		// try to fetch profile /me to get role/user info
		try {
			const profile = await apiFetch("/api/Users/me");
			setUser(profile);
			// determine role from returned profile (adjust field name if different)
			const serverRole = (profile && (profile.accountType || profile.role || profile.accountTypeName)) || null;
			if (serverRole) {
				// normalize common names
				if (serverRole.toLowerCase().includes("manager")) setRole("manager");
				else if (serverRole.toLowerCase().includes("trainer")) setRole("trainer");
				else setRole("client");
			}
		} catch (err) {
			// ignore profile fetch errors — we'll keep token but role stays guest until set manually
			console.warn("Failed fetching profile after login:", err);
		}
	}

	function logout() {
		setToken(null);
		setUser(null);
		setRole("guest");
		if (typeof window !== "undefined") localStorage.removeItem("auth_token");
	}

	return (
		<AuthContext.Provider
			value={{ role, setRole, token, user, isAuthenticated: !!token, login, logout }}
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

