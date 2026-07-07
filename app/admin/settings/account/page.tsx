"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdSave, MdCancel } from "react-icons/md";
import { useAuth } from "@/components/providers/AuthProvider";
import { FormField } from "@/components/ui/form-field";
import { UserUpdateInput } from "@/lib/validation";

export default function AccountSettingsPage() {
    const router = useRouter();
    const { user, updateUser, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState<UserUpdateInput>({
        name: "",
        email: "",
        avatarUrl: "",
    });
    const [avatarPreview, setAvatarPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Populate form when user data loads
    useEffect(() => {
        const updateUser = () => {
            if (user) {
                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    avatarUrl: user.avatarUrl || "",
                });
                setAvatarPreview(user.avatarUrl || "");
            }
        }

        updateUser();
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "avatarUrl") setAvatarPreview(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const updateData: UserUpdateInput = {
                name: formData.name,
                email: formData.email,
                avatarUrl: formData.avatarUrl || user?.avatarUrl || "",
            };

            await updateUser(updateData);
            setSuccess(true);
            setTimeout(() => router.push("/admin/settings"), 1500); // in next version we might remove this line
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ أثناء الحفظ");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <main className="pt-32 pb-40 px-6 md:px-margin-desktop max-w-container-max mx-auto">
                <div className="flex justify-center items-center h-64">
                    <div className="text-primary text-xl">جاري التحميل...</div>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-32 pb-40 px-6 md:px-margin-desktop max-w-container-max mx-auto">
            <div className="mb-12">
                <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">
                    إعدادات الحساب
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                    قم بتحديث معلوماتك الشخصية
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="glass-card p-8 rounded-2xl space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30">
                            {avatarPreview ? (
                                <Image
                                    src={avatarPreview}
                                    alt="Avatar preview"
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                                    {formData.name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>

                        <FormField
                            label="رابط الصورة"
                            name="avatarUrl"
                            type="text"
                            value={formData.avatarUrl || ""}
                            onChange={handleChange}
                            placeholder="https://example.com/avatar.jpg"
                            className="flex-1 w-full"
                        />
                    </div>

                    <FormField
                        label="الاسم الكامل *"
                        name="name"
                        type="text"
                        value={formData.name || ""}
                        onChange={handleChange}
                        placeholder="أدخل اسمك الكامل"
                        required
                    />

                    <FormField
                        label="البريد الإلكتروني *"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        required
                    />

                    {error && (
                        <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-error text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-center">
                            تم تحديث الملف الشخصي بنجاح
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
                            disabled={loading || authLoading}
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary-container text-on-primary-container rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
                        >
                            <MdSave size={20} />
                            <span>{loading || authLoading ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
}