// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui/form-field";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
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
        if (formData.password !== formData.confirmPassword) {
            setError("كلمتا المرور غير متطابقتين");
            return false;
        }
        if (formData.password.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            // Mock login
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Login attempt", { email: formData.email, password: formData.password });
            // In the future: POST /api/auth/login
            alert("تم تسجيل الدخول بنجاح (محاكاة)");
            router.push("/admin/overview");
        } catch (err) {
            setError("فشل تسجيل الدخول. تحقق من بياناتك.");
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

                        <FormField
                            label="تأكيد كلمة المرور"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="أعد إدخال كلمة المرور"
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
                            className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
                        >
                            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
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