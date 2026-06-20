"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdSave, MdCancel } from "react-icons/md";
import { FormField } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/ui/image-upload";

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface UserData {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    role: string;
    accountStatus: string;
    profileProgress: number;
}

export default function AccountSettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<UserData>>({
        name: "",
        email: "",
        avatarUrl: "",
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>("");

    // Fetch user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/users/me`, {
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to fetch user data");
                const data = await res.json();
                const user = data.data;
                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    avatarUrl: user.avatarUrl || "",
                });
                setAvatarPreview(user.avatarUrl || "");
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "حدث خطأ");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Handle form field changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // If avatarUrl changes, update preview
        if (name === "avatarUrl") {
            setAvatarPreview(value);
        }
    };

    // Handle avatar file selection
    const handleAvatarFileChange = (file: File | null) => {
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
            // Clear the URL field if a file is selected (we'll use the file)
            setFormData((prev) => ({ ...prev, avatarUrl: "" }));
        } else {
            setAvatarFile(null);
            setAvatarPreview(formData.avatarUrl || "");
        }
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Prepare data for API
            const updateData: UserData = {
                ...formData as UserData,
                name: formData.name || "user",
                email: formData.email??"",
            };

            // If a new avatar file is selected, we need to upload it first.
            // For simplicity, we'll convert it to base64 and send as avatarUrl.
            // In production, you'd upload to cloud storage and get a URL.
            if (avatarFile) {
                const reader = new FileReader();
                const base64 = await new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(avatarFile);
                });
                updateData.avatarUrl = base64;
            } else if (formData.avatarUrl) {
                updateData.avatarUrl = formData.avatarUrl;
            }

            // Get user ID (we'll use the one from the fetched data)
            const userId = 1; // hardcoded for now, but in production we'd get from session or fetch

            const res = await fetch(`${API_BASE}/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update profile");
            }

            alert("تم تحديث الملف الشخصي بنجاح");
            router.push("/admin/settings");
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
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
            {/* Header */}
            <div className="mb-12">
                <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">
                    إعدادات الحساب
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                    قم بتحديث معلوماتك الشخصية
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="glass-card p-8 rounded-2xl space-y-6">
                    {/* Avatar Section */}
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

                        <div className="w-full">
                            <ImageUpload
                                value={avatarFile || ""}
                                onChange={handleAvatarFileChange}
                                label="الصورة الشخصية (اختياري)"
                            />
                            <p className="text-caption text-on-surface-variant mt-1">
                                يمكنك رفع صورة جديدة أو إدخال رابط صورة في الحقل أدناه
                            </p>
                        </div>

                        <FormField
                            label="رابط الصورة"
                            name="avatarUrl"
                            type="text"
                            value={formData.avatarUrl || ""}
                            onChange={handleChange}
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>

                    {/* Name */}
                    <FormField
                        label="الاسم الكامل *"
                        name="name"
                        type="text"
                        value={formData.name || ""}
                        onChange={handleChange}
                        placeholder="أدخل اسمك الكامل"
                        required
                    />

                    {/* Email */}
                    <FormField
                        label="البريد الإلكتروني *"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        required
                    />

                    {/* Error message */}
                    {error && (
                        <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-error text-center">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
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
                            disabled={saving}
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary-container text-on-primary-container rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
                        >
                            <MdSave size={20} />
                            <span>{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
}