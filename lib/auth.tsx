"use client"

import * as React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { 
    name?: string | null;
    email?: string | null;
    image?: string | null;
    githubUsername?: string;
  } | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  const login = async () => {
    try {
      const result = await signIn("github", {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        console.error("Sign in error:", result.error);
        return;
      }

      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const value = React.useMemo(() => ({
    isAuthenticated,
    user: session?.user || null,
    login,
    logout
  }), [isAuthenticated, session?.user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 