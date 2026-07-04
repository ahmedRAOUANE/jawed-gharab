"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const { verifyEmail, resendVerification } = useAuth();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    // Auto-verify if token is present
    useEffect(() => {
        if (token) {
            const doVerify = async () => {
                setLoading(true);
                try {
                    await verifyEmail(token);
                    setSuccess(true);
                } catch (err) {
                    console.log("error: ", err);
                    setError(err instanceof Error ? err.message : "فشل تأكيد البريد");
                } finally {
                    setLoading(false);
                }
            };
            doVerify();
        }
    }, [token, verifyEmail]);

    const handleResend = async () => {
        if (!email) {
            setError("البريد الإلكتروني غير موجود");
            return;
        }
        setLoading(true);
        try {
            await resendVerification(email);
            setResendSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "فشل إعادة إرسال الرابط");
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
                            تم تأكيد البريد الإلكتروني
                        </h2>
                        <p className="text-on-surface-variant font-body-md mb-6">
                            شكراً لتأكيد بريدك الإلكتروني. يمكنك الآن تسجيل الدخول.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block cursor-pointer px-6 py-3 bg-primary-container text-on-primary-container rounded-xl hover:scale-105 transition-all"
                        >
                            الذهاب إلى تسجيل الدخول
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <div className="max-w-md w-full text-center">
                    <div className="glass-card p-8 rounded-2xl">
                        <div className="text-4xl mb-4">❌</div>
                        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">
                            فشل تأكيد البريد
                        </h2>

                        <p className="text-error font-body-md mb-6">{error}</p>
                        
                        {email && (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={loading}
                                className="cursor-pointer px-6 py-3 bg-primary-container text-on-primary-container rounded-xl hover:scale-105 transition-all disabled:opacity-60"
                            >
                                {loading ? "جاري الإرسال..." : "إعادة إرسال رابط التأكيد"}
                            </button>
                        )}

                        {resendSuccess && (
                            <p className="text-green-400 mt-4">تم إرسال رابط جديد إلى بريدك الإلكتروني</p>
                        )}

                        <div className="mt-4">
                            <Link href="/login" className="text-primary hover:underline">
                                العودة إلى تسجيل الدخول
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <div className="text-center">
                    <div className="text-primary text-2xl mb-4">جاري التحقق...</div>
                </div>
            </div>
        );
    }

    // No token, show instructions
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="max-w-md w-full text-center">
                <div className="glass-card p-8 rounded-2xl">
                    <div className="text-4xl mb-4">📧</div>
                    <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">
                        تأكيد البريد الإلكتروني
                    </h2>
                    <p className="text-on-surface-variant font-body-md mb-6">
                        {email
                            ? `تم إرسال رابط التأكيد إلى ${email}. يرجى التحقق من بريدك الإلكتروني.`
                            : "يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك."}
                    </p>
                    {email && (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={loading}
                            className="cursor-pointer px-6 py-3 bg-primary-container text-on-primary-container rounded-xl hover:scale-105 transition-all disabled:opacity-60"
                        >
                            {loading ? "جاري الإرسال..." : "إعادة إرسال رابط التأكيد"}
                        </button>
                    )}
                    {resendSuccess && (
                        <p className="text-green-400 mt-4">تم إرسال رابط جديد إلى بريدك الإلكتروني</p>
                    )}
                    <div className="mt-4">
                        <Link href="/login" className="text-primary hover:underline">
                            العودة إلى تسجيل الدخول
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}