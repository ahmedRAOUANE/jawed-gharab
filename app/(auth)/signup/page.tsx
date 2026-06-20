// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui/form-field";

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
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
        if (!formData.name.trim()) {
            setError("الاسم مطلوب");
            return false;
        }
        if (!formData.email.includes("@")) {
            setError("البريد الإلكتروني غير صالح");
            return false;
        }
        if (formData.password.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("كلمتا المرور غير متطابقتين");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            // Mock sign up
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Sign up attempt", formData);
            // In the future: POST /api/auth/signup
            alert("تم إنشاء الحساب بنجاح (محاكاة)");
            router.push("/login");
        } catch (err) {
            setError("حدث خطأ أثناء إنشاء الحساب");
            console.log("signup error: ", err);
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

                        {/* Password strength indicator (optional enhancement) */}
                        {formData.password && (
                            <div className="space-y-2">
                                <div className="flex gap-1">
                                    <div
                                        className={`h-1 flex-1 rounded-full ${formData.password.length >= 6 ? "bg-green-500" : "bg-white/10"
                                            }`}
                                    />
                                    <div
                                        className={`h-1 flex-1 rounded-full ${formData.password.length >= 8 ? "bg-green-500" : "bg-white/10"
                                            }`}
                                    />
                                    <div
                                        className={`h-1 flex-1 rounded-full ${formData.password.match(/[A-Z]/) && formData.password.match(/[0-9]/)
                                                ? "bg-green-500"
                                                : "bg-white/10"
                                            }`}
                                    />
                                </div>
                                <p className="text-caption text-on-surface-variant">
                                    كلمة المرور يجب أن تكون 6 أحرف على الأقل
                                </p>
                            </div>
                        )}

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
                            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
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