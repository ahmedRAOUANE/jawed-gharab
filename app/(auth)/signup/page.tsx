"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { FormField } from "@/components/ui/form-field";

export default function SignUpPage() {
    const { signup, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreeToTerms) {
            setError("يجب الموافقة على الشروط والأحكام");
            return;
        }
        setLoading(true);
        try {
            await signup(formData);
            // signup redirects to verify-email page
        } catch (err) {
            setError(err instanceof Error ? err.message : "فشل إنشاء الحساب");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="font-display-lg text-display-lg text-primary mb-2">
                        MASTERY
                    </h1>
                    <p className="text-on-surface-variant font-body-lg">
                        إنشاء حساب جديد
                    </p>
                </div>

                <div className="glass-card p-8 rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label="الاسم الكامل"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="أدخل اسمك الكامل"
                            required
                        />

                        <FormField
                            label="البريد الإلكتروني"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            required
                        />

                        <FormField
                            label="كلمة المرور"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                        <FormField
                            label="تأكيد كلمة المرور"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className="w-4 h-4 accent-primary"
                            />
                            <label htmlFor="agreeToTerms" className="text-sm text-on-surface-variant">
                                أوافق على{" "}
                                <Link href="/terms" className="text-primary hover:underline">
                                    الشروط والأحكام
                                </Link>
                            </label>
                        </div>

                        {error && (
                            <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-error text-center text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || authLoading}
                            className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
                        >
                            {loading || authLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                        </button>

                        <div className="text-center text-sm text-on-surface-variant">
                            لديك حساب بالفعل؟{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                تسجيل الدخول
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}