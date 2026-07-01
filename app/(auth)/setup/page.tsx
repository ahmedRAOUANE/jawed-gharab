"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormField } from "@/components/ui/form-field";

export default function SetupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1
        name: "",
        email: searchParams.get("email") || "",

        // Step 2
        siteName: "",
        siteDescription: "منصة إدارة المشاريع السينمائية",

        // Step 3
        emailProvider: "gmail",

        // smtpHost: "smtp.gmail.com",
        // smtpPort: "587",
        // smtpSecure: false, //! these are hardcoded in email service untill other providers are supported

        smtpUser: searchParams.get("email") || "",
        smtpPassword: "",

        fromName: "",
        fromEmail: searchParams.get("email") || "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const validateStep1 = () => {
        if (!formData.name.trim()) {
            setError("الاسم مطلوب");
            return false;
        }
        if (!formData.email.includes("@")) {
            setError("البريد الإلكتروني غير صالح");
            return false;
        }
        return true;
    };

    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep1()) return;
        setStep(2);
    };

    const validateStep2 = () => {
        if (!formData.siteName.trim()) {
            setError("اسم الموقع مطلوب");
            return false;
        }
        
        if (!formData.siteDescription.trim()) {
            setError("وصف الموقع مطلوب");
            return false;
        }

        return true;
    }

    const handleStep2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;
        setStep(3);
    };

    const validateStep3 = () => {
        if (!formData.smtpPassword.trim()) {
            setError("كلمة المرور لا يمكن ان تكون فارغة");
            return false;
        }

        if (!formData.fromEmail.includes("@")) {
            setError("البريد الإلكتروني غير صالح");
            return false;
        }

        return true;
    }

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!validateStep3()) return;

        setLoading(true);
        try {
            // Mock setup
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log("Setup completed", formData);
            // In the future: POST /api/setup with all data
            // alert("تم إعداد المنصة بنجاح!");
            // router.push("/login");
        } catch (err) {
            setError("حدث خطأ أثناء الإعداد");
            console.log("profile setup error: ", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-hidden">
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                    transform: `translateX(${(step - 1) * 100}%)`,
                }}
            >
                {/* step 1 */}
                <div className="min-w-full shrink-0 min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <h1 className="font-display-lg text-display-lg text-primary mb-2">
                                مرحباً بك
                            </h1>
                            <p className="text-on-surface-variant font-body-lg">
                                قم بإعداد حساب المشرف الخاص بك
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-2xl">
                            <form onSubmit={handleStep1Submit} className="space-y-6">
                                <FormField
                                    label="الاسم الكامل"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="أحمد المنصور"
                                    required
                                />

                                <FormField
                                    label="البريد الإلكتروني"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    className="cursor-pointer w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    التالي: إعدادات الموقع
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* step 2 */}
                <div className="min-w-full shrink-0 min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <h1 className="font-display-lg text-display-lg text-primary mb-2">
                                إعدادات الموقع
                            </h1>
                            <p className="text-on-surface-variant font-body-lg">
                                قم بتخصيص اسم ووصف المنصة
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-2xl">
                            <form onSubmit={handleStep2Submit} className="space-y-6">
                                <FormField
                                    label="اسم الموقع"
                                    name="siteName"
                                    type="text"
                                    value={formData.siteName}
                                    onChange={handleChange}
                                    placeholder="MASTERY"
                                    required
                                />

                                <FormField
                                    label="وصف الموقع"
                                    name="siteDescription"
                                    type="text"
                                    value={formData.siteDescription}
                                    onChange={handleChange}
                                    placeholder="منصة إدارة المشاريع السينمائية"
                                    required
                                />

                                {error && (
                                    <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-error text-center text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="cursor-pointer flex-1 py-4 border border-white/10 text-on-surface-variant font-bold rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        السابق
                                    </button>

                                    <button
                                        type="submit"
                                        className="cursor-pointer flex-1 py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
                                    >
                                        التالي
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                {/* step 3 */}
                {/* step 3 */}
                <div className="min-w-full shrink-0 min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <h1 className="font-display-lg text-display-lg text-primary mb-2">
                                إعداد البريد الإلكتروني
                            </h1>

                            <p className="text-on-surface-variant font-body-lg">
                                اربط حساب Gmail لإرسال رسائل الموقع.
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-2xl">
                            <form onSubmit={handleFinalSubmit} className="space-y-6">

                                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-7 text-on-surface-variant">
                                    <p className="font-bold text-primary mb-2">
                                        ملاحظة
                                    </p>

                                    <p>
                                        يحتاج Gmail إلى <strong>App Password</strong> لإرسال
                                        الرسائل من الموقع.
                                    </p>

                                    <p className="mt-2">
                                        قم بتفعيل التحقق بخطوتين في حساب Google ثم أنشئ
                                        App Password والصقه في الحقل التالي.
                                    </p>
                                </div>

                                <FormField
                                    disabled
                                    label="حساب Gmail"
                                    name="smtpUser"
                                    type="email"
                                    value={formData.smtpUser}
                                    onChange={handleChange}
                                    placeholder="admin@gmail.com"
                                    required
                                />

                                <FormField
                                    label="Google App Password"
                                    name="smtpPassword"
                                    type="password"
                                    value={formData.smtpPassword}
                                    onChange={handleChange}
                                    placeholder="•••• •••• •••• ••••"
                                    required
                                />

                                <FormField
                                    label="البريد الظاهر للمرسل"
                                    name="fromEmail"
                                    type="email"
                                    value={formData.fromEmail}
                                    onChange={handleChange}
                                    placeholder="admin@gmail.com"
                                    required
                                />

                                {error && (
                                    <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-error text-center text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="cursor-pointer flex-1 py-4 border border-white/10 text-on-surface-variant font-bold rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        السابق
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="cursor-pointer flex-1 py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
                                    >
                                        {loading ? "جاري الإعداد..." : "إكمال الإعداد"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}