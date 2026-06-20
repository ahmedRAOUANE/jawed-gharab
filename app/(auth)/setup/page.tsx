// app/setup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/ui/image-upload";

export default function SetupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: Admin profile
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatar: null as File | null,
        // Step 2: Website settings
        siteName: "MASTERY",
        siteDescription: "منصة إدارة المشاريع السينمائية",
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleAvatarChange = (file: File | null) => {
        setFormData((prev) => ({ ...prev, avatar: file }));
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

    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep1()) return;
        setStep(2);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock setup
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log("Setup completed", formData);
            // In the future: POST /api/setup with all data
            alert("تم إعداد المنصة بنجاح!");
            router.push("/login");
        } catch (err) {
            setError("حدث خطأ أثناء الإعداد");
            console.log("profile setup error: ", err);
        } finally {
            setLoading(false);
        }
    };

    if (step === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
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
                            <ImageUpload
                                value={formData.avatar || ""}
                                onChange={handleAvatarChange}
                                label="الصورة الشخصية (اختياري)"
                            />

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

                            {error && (
                                <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-error text-center text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                التالي: إعدادات الموقع
                            </button>
                        </form>
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
                        إعدادات الموقع
                    </h1>
                    <p className="text-on-surface-variant font-body-lg">
                        قم بتخصيص اسم ووصف المنصة
                    </p>
                </div>

                <div className="glass-card p-8 rounded-2xl">
                    <form onSubmit={handleFinalSubmit} className="space-y-6">
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
                                className="flex-1 py-4 border border-white/10 text-on-surface-variant font-bold rounded-xl hover:bg-white/5 transition-colors"
                            >
                                السابق
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 bg-primary-container text-on-primary-container font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
                            >
                                {loading ? "جاري الإعداد..." : "إكمال الإعداد"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}