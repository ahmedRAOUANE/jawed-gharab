"use client";

import { useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/form-field";

export default function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // In a real app, we'd get the token from the URL query param.
    // const searchParams = useSearchParams();
    // const token = searchParams.get('token');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const validate = () => {
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
            // Mock password reset
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Password reset confirmed", formData);
            // In the future: POST /api/auth/reset-password with token and new password
            setSuccess(true);
        } catch (err) {
            console.log("reset password error: ", err);
            setError("حدث خطأ. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <div className="max-w-md w-full text-center">
                    <div className="glass-card p-8 rounded-2xl">
                        <div className="text-4xl mb-4">✅</div>
                        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">
                            تم تغيير كلمة المرور بنجاح
                        </h2>
                        <p className="text-on-surface-variant font-body-md mb-6">
                            يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block px-6 py-3 bg-primary-container text-on-primary-container rounded-xl hover:scale-105 transition-all"
                        >
                            الذهاب إلى تسجيل الدخول
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="font-display-lg text-display-lg text-primary mb-2">
                        إعادة تعيين كلمة المرور
                    </h1>
                    <p className="text-on-surface-variant font-body-lg">
                        أدخل كلمة المرور الجديدة لحسابك
                    </p>
                </div>

                <div className="glass-card p-8 rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label="كلمة المرور الجديدة"
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
                            {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
                        </button>

                        <div className="text-center text-sm text-on-surface-variant">
                            <Link href="/login" className="text-primary hover:underline">
                                العودة إلى تسجيل الدخول
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}