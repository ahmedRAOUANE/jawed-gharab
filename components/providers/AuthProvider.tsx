"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
    accountStatus: string;
    profileProgress: number;
    emailVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: { name: string; email: string; password: string; confirmPassword: string; agreeToTerms: boolean }) => Promise<void>;
    logout: () => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
    resendVerification: (email: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string, confirmPassword: string) => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch current user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/users/me", {
                    credentials: "include", // important for cookies
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "فشل تسجيل الدخول");
        }

        const data = await res.json();
        setUser(data.data);
        router.push("/admin/");
    };

    const signup = async (data: { name: string; email: string; password: string; confirmPassword: string; agreeToTerms: boolean }) => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "فشل إنشاء الحساب");
        }

        // After signup, redirect to verify email page
        router.push("/verify-email?email=" + encodeURIComponent(data.email));
    };

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/login");
    };

    const verifyEmail = async (token: string) => {
        const res = await fetch("/api/auth/verify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "فشل تأكيد البريد");
        }

        // After verification, we can redirect to login
        router.push("/login?verified=true");
    };

    const resendVerification = async (email: string) => {
        const res = await fetch("/api/auth/resend-verification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "فشل إعادة إرسال رابط التحقق");
        }
    };

    const forgotPassword = async (email: string) => {
        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "فشل إرسال رابط إعادة التعيين");
        }
    };

    const resetPassword = async (token: string, password: string, confirmPassword: string) => {
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password, confirmPassword }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "فشل تغيير كلمة المرور");
        }

        router.push("/login?reset=true");
    };

    const updateUser = async (data: Partial<User>) => {
        const res = await fetch("/api/users/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "فشل تحديث الملف الشخصي");
        }

        const updated = await res.json();
        setUser(updated.data);
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        signup,
        logout,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}