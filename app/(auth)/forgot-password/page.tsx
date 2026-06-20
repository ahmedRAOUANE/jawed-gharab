// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/form-field";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes("@")) {
            setError("البريد الإلكتروني غير صالح");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            // Mock password reset request
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Password reset requested for:", email);
            // In the future: POST /api/auth/forgot-password
            setSubmitted(true);
        } catch (err) {
            console.log("forget password error: ", err);
            setError("حدث خطأ. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <div className="max-w-md w-full text-center">
                    <div className="glass-card p-8 rounded-2xl">
                        <div className="text-4xl mb-4">📧</div>
                        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">
                            تم إرسال رابط إعادة التعيين
                        </h2>
                        <p className="text-on-surface-variant font-body-md mb-6">
                            تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
                            يرجى التحقق من صندوق الوارد.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block px-6 py-3 bg-primary-container text-on-primary-container rounded-xl hover:scale-105 transition-all"
                        >
                            العودة إلى تسجيل الدخول
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
                        استعادة كلمة المرور
                    </h1>
                    <p className="text-on-surface-variant font-body-lg">
                        أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
                    </p>
                </div>

                <div className="glass-card p-8 rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label="البريد الإلكتروني"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(null);
                            }}
                            placeholder="admin@jawedgharab.com"
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
                            {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
                        </button>

                        <div className="text-center text-sm text-on-surface-variant">
                            تذكرت كلمة المرور؟{" "}
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