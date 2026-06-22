"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdSave, MdCancel } from "react-icons/md";
import { FormField } from "@/components/ui/form-field";

export default function PasswordSettingsPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const validate = () => {
        if (formData.currentPassword.length < 6) {
            setError("كلمة المرور الحالية يجب أن تكون 6 أحرف على الأقل");
            return false;
        }
        if (formData.newPassword.length < 6) {
            setError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
            return false;
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
            setError("كلمتا المرور غير متطابقتين");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setSuccess(false);

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmNewPassword: formData.confirmNewPassword,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "فشل تغيير كلمة المرور");
            }

            setSuccess(true);
            setTimeout(() => router.push("/admin/settings"), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ أثناء تغيير كلمة المرور");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="pt-32 pb-40 px-6 md:px-margin-desktop max-w-container-max mx-auto">
            <div className="mb-12">
                <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">
                    تغيير كلمة المرور
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                    قم بتحديث كلمة المرور الخاصة بحسابك
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="glass-card p-8 rounded-2xl space-y-6">
                    <FormField
                        label="كلمة المرور الحالية"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="أدخل كلمة المرور الحالية"
                        required
                    />

                    <FormField
                        label="كلمة المرور الجديدة"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="أدخل كلمة المرور الجديدة"
                        required
                    />

                    <FormField
                        label="تأكيد كلمة المرور"
                        name="confirmNewPassword"
                        type="password"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                        required
                    />

                    {error && (
                        <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-error text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-center">
                            تم تغيير كلمة المرور بنجاح
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-white/10 text-on-surface-variant hover:bg-white/5 transition-colors"
                        >
                            <MdCancel size={20} />
                            <span>إلغاء</span>
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary-container text-on-primary-container rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
                        >
                            <MdSave size={20} />
                            <span>{loading ? "جاري الحفظ..." : "تغيير كلمة المرور"}</span>
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
}