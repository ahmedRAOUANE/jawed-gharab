"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdSave, MdCancel } from "react-icons/md";
import { FormField } from "../ui/form-field";
import { ImageUpload } from "../ui/image-upload";
import { TeamMembersInput } from "../ui/team-member-input";

// Types
interface ProjectData {
    id?: string;
    title: string;
    client: string;
    description: string;
    status: string;
    projectType: string;
    team: string[];
    deadline: string;
    budget: number | "";
    thumbnail: string | File;
}

interface ProjectFormProps {
    mode: "create" | "edit";
    initialData?: Partial<ProjectData>;
}

const statusOptions = [
    "قيد المونتاج",
    "في انتظار المراجعة",
    "تم التسليم",
    "بدء العمل",
];

const projectTypeOptions = [
    "إعلان",
    "وثائقي",
    "موشن جرافيك",
    "فيديو موسيقي",
    "أخرى",
];

export const ProjectForm = ({ mode, initialData = {} }: ProjectFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState<ProjectData>({
        title: initialData.title || "",
        client: initialData.client || "",
        description: initialData.description || "",
        status: initialData.status || "بدء العمل",
        projectType: initialData.projectType || "إعلان",
        team: initialData.team || [],
        deadline: initialData.deadline || "",
        budget: initialData.budget || "",
        thumbnail: initialData.thumbnail || "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleTeamChange = (team: string[]) => {
        setFormData((prev) => ({ ...prev, team }));
    };

    const handleThumbnailChange = (file: File | null) => {
        setFormData((prev) => ({ ...prev, thumbnail: file || "" }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = "عنوان المشروع مطلوب";
        if (!formData.client.trim()) newErrors.client = "اسم العميل مطلوب";
        if (!formData.description.trim()) newErrors.description = "الوصف مطلوب";
        if (!formData.status) newErrors.status = "الحالة مطلوبة";
        if (!formData.deadline) newErrors.deadline = "تاريخ التسليم مطلوب";
        if (!formData.budget && formData.budget !== 0) newErrors.budget = "الميزانية مطلوبة";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        // Simulate API call
        try {
            // In real app, upload thumbnail first if it's a File, then send data
            console.log("Submitting:", formData);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert(mode === "create" ? "تم إضافة المشروع بنجاح" : "تم تحديث المشروع بنجاح");
            router.push("/admin/projects");
        } catch (error) {
            console.error(error);
            alert("حدث خطأ أثناء حفظ المشروع");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glass-card p-8 rounded-2xl space-y-6">
                <h2 className="font-headline-md text-headline-md text-on-background mb-6">
                    المعلومات الأساسية
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="عنوان المشروع *"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="أدخل عنوان المشروع"
                        error={errors.title}
                    />
                    <FormField
                        label="اسم العميل *"
                        name="client"
                        type="text"
                        value={formData.client}
                        onChange={handleChange}
                        placeholder="أدخل اسم العميل"
                        error={errors.client}
                    />
                    <FormField
                        label="نوع المشروع"
                        name="projectType"
                        type="select"
                        value={formData.projectType}
                        onChange={handleChange}
                        options={projectTypeOptions}
                    />
                    <FormField
                        label="الحالة"
                        name="status"
                        type="select"
                        value={formData.status}
                        onChange={handleChange}
                        options={statusOptions}
                        error={errors.status}
                    />
                </div>

                <FormField
                    label="رابط المشروع *"
                    name="link"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g: https://youtube/yourvideo"
                    error={errors.description}
                />

                <FormField
                    label="الوصف *"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="وصف تفصيلي للمشروع"
                    rows={4}
                    error={errors.description}
                />
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-6">
                <h2 className="font-headline-md text-headline-md text-on-background mb-6">
                    التفاصيل الإضافية
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="تاريخ التسليم *"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        error={errors.deadline}
                    />
                    <FormField
                        label="الميزانية (ريال) *"
                        name="budget"
                        type="number"
                        value={String(formData.budget)}
                        onChange={handleChange}
                        placeholder="أدخل الميزانية"
                        error={errors.budget}
                    />
                </div>

                <TeamMembersInput
                    value={formData.team}
                    onChange={handleTeamChange}
                    label="فريق العمل"
                    placeholder="أضف اسم عضو ثم اضغط Enter"
                />

                <ImageUpload
                    value={formData.thumbnail}
                    onChange={handleThumbnailChange}
                    label="الصورة المصغرة"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
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
                    <span>{loading ? "جاري الحفظ..." : mode === "create" ? "إضافة المشروع" : "تحديث المشروع"}</span>
                </button>
            </div>
        </form>
    );
};