"use client";

import { SubmitEventHandler, useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/form-field";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
    const { login, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const validate = () => {
        if (!formData.email) {
            setError("البريد الإلكتروني مطلوب");
            return false;
        }
        if (!formData.password) {
            setError("كلمة المرور مطلوبة");
            return false;
        }
        if (formData.password.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            return false;
        }
        return true;
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            await login(formData.email, formData.password);
        } catch (err) {
            console.log("error logging in: ", err);
            setError(`${err}` || "فشل تسجيل الدخول. تحقق من بياناتك.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="font-display-lg text-display-lg text-primary mb-2">
                        Djawad GH
                    </h1>
                    <p className="text-on-surface-variant font-body-lg">
                        تسجيل الدخول إلى لوحة التحكم
                    </p>
                </div>

                <div className="glass-card p-8 rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label="البريد الإلكتروني"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@jawedgharab.com"
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

                        {error && (
                            <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-error text-center text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
                        >
                            {loading || authLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                        </button>

                        <div className="text-center text-sm text-on-surface-variant">
                            ليس لديك حساب؟{" "}
                            <Link href="/signup" className="text-primary hover:underline">
                                إنشاء حساب جديد
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}