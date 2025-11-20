"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin } from "../services/auth";
import apiFetch from "../services/apiClient";
import { DecodedToken, parseJwt } from "@/utils/jwt";

export type Role = "guest" | "manager" | "trainer" | "client";

interface AuthContextValue {
	role: Role;
	setRole: (r: Role) => void;
	token: string | null;
	user: any | null;
	isAuthenticated: boolean;
	isReady: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeRoleFromToken(token: DecodedToken | null): Role {
	console.log("Normalizing role from token:", token);
	if (!token) return "guest";

	const raw =
	token.Role ||
	token.role ||
	token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

	if (!raw || typeof raw !== "string") return "client";

	const lower = raw.toLowerCase();
	if (lower.includes("manager")) return "manager";
	if (lower.includes("personaltrainer")) return "trainer";
	if (lower.includes("client")) return "client";

	return "client";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [role, setRole] = useState<Role>("guest");
	const [user, setUser] = useState<any | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [isReady, setIsReady] = useState<boolean>(false);

	// 1) On mount: hydrate token from localStorage
	useEffect(() => {
		console.log("[Auth] Initializing from localStorage");
		if (typeof window === "undefined") return;

		const stored = localStorage.getItem("auth_token");
		if (!stored) {
			setRole("guest");
			setUser(null);
			setUserId(null);
			setIsReady(true);
			return;
		}

		console.log("[Auth] Found stored token:", stored);
		setToken(stored);
		setIsReady(true);
	}, []);

	// 2) Whenever token changes: persist + decode + set role/user/userId
	useEffect(() => {
		if (typeof window === "undefined") return;

		if (!token) {
			// logged out
			setRole("guest");
			setUser(null);
			setUserId(null);
			return;
		}

		localStorage.setItem("auth_token", token);

		const decoded = parseJwt(token);
		const normalizedRole = normalizeRoleFromToken(decoded);
		setRole(normalizedRole);

		const id = (decoded as any)?.UserId || (decoded as any)?.userId || null;
		setUserId(id ?? null);

		setUser({
			name: (decoded as any)?.Name,
			tokenRole: (decoded as any)?.Role,
			userId: id,
			groupId: (decoded as any)?.GroupId,
		});
	}, [token]);

	// 3) Fetch full profile when token + userId are ready
	useEffect(() => {
		if (!token || !userId) return;

		let cancelled = false;

		async function loadUser() {
			try {
				const profile = await apiFetch(`/api/Users/${userId}`);
				if (cancelled) return;
				setUser((prev: any) => ({
					...(prev || {}),
					...profile,
				}));
				} catch (err) {
				console.warn("[Auth] Failed fetching /api/Users/{id}:", err);
			}
		}

		loadUser();
		return () => {
			cancelled = true;
		};
	}, [token, userId]);

	async function login(email: string, password: string) {
		const t = await apiLogin(email, password);
		setToken(t);
	}

	function logout() {
		setToken(null);
		setUser(null);
		setRole("guest");
		setUserId(null);

    	if (typeof window !== "undefined") localStorage.removeItem("auth_token");
		
		
	}

	return (
	<AuthContext.Provider
		value={{ role, setRole, token, user, isAuthenticated: !!token, isReady, login, logout }}
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
