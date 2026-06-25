"use client";

import { SubmitEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { MdSave, MdCancel } from "react-icons/md";
import { FormField } from "../ui/form-field";
import { ProjectCreateInput, ProjectUpdateInput } from "@/lib/validation";
import { ProjectStatus, ProjectType } from "@prisma/client";

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ProjectFormProps {
    mode: "create" | "edit";
    initialData?: Partial<ProjectUpdateInput>;
    projectId?: string; // for edit mode
}

// Map UI status to API enum
const mapStatusToAPI = (status: ProjectStatus = "ACTIVE"): ProjectStatus => {
    const map: Record<string, ProjectStatus> = {
        "بدء العمل": "START",
        "قيد المونتاج": "EDITING",
        "في انتظار المراجعة": "REVIEW",
        "تم التسليم": "DELIVERED",
    };
    return map[status] || "START";
};

const mapTypeToAPI = (type: ProjectType = "COMMERCIAL"): ProjectType => {
    const map: Record<string, ProjectType> = {
        "إعلان": "COMMERCIAL",
        "وثائقي": "DOCUMENTARY",
        "موشن جرافيك": "MOTION_GRAPHICS",
        "فيديو موسيقي": "MUSIC_VIDEO",
        "أخرى": "OTHER",
    };
    return map[type] || "OTHER";
};

// Map API status to UI
// const mapStatusToUI = (status: ProjectStatus): string => {
//     const map: Record<ProjectStatus, string> = {
//         "START": "بدء العمل",
//         "EDITING": "قيد المونتاج",
//         "REVIEW": "في انتظار المراجعة",
//         "DELIVERED": "تم التسليم",
//     };
//     return map[status] || "بدء العمل";
// };

// const mapTypeToUI = (type: string): string => {
//     const map: Record<string, string> = {
//         "COMMERCIAL": "إعلان",
//         "DOCUMENTARY": "وثائقي",
//         "MOTION_GRAPHICS": "موشن جرافيك",
//         "MUSIC_VIDEO": "فيديو موسيقي",
//         "OTHER": "أخرى",
//     };
//     return map[type] || "أخرى";
// };

export const ProjectForm = ({ mode, initialData = {}, projectId }: ProjectFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState<ProjectUpdateInput>({
        title: initialData.title || "",
        client: initialData.client || "",
        description: initialData.description || "",
        status: initialData.status || "START",
        projectType: initialData.projectType || "COMMERCIAL",
        deadline: initialData.deadline || "",
        budget: initialData.budget,
        thumbnailUrl: initialData.thumbnailUrl || "",
        projectLink: initialData.projectLink || "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    const statusOptions = [
        "بدء العمل",
        "قيد المونتاج",
        "في انتظار المراجعة",
        "تم التسليم",
    ];

    const projectTypeOptions = [
        "إعلان",
        "وثائقي",
        "موشن جرافيك",
        "فيديو موسيقي",
        "أخرى",
    ];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        setSubmitError(null);
    };

    // const handleTeamChange = (team: string[]) => {
    //     setFormData((prev) => ({ ...prev, team }));
    // };

    // const handleThumbnailChange = (file: File | null) => {
    //     setFormData((prev) => ({ ...prev, thumbnail: file || "" }));
    // };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (formData.title && !formData.title.trim()) newErrors.title = "عنوان المشروع مطلوب";
        if (formData.client && !formData.client.trim()) newErrors.client = "اسم العميل مطلوب";
        if (formData.description && !formData.description.trim()) newErrors.description = "الوصف مطلوب";
        if (!formData.status) newErrors.status = "الحالة مطلوبة";
        if (!formData.deadline) newErrors.deadline = "تاريخ التسليم مطلوب";
        if (!formData.budget && formData.budget !== 0) newErrors.budget = "الميزانية مطلوبة";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setSubmitError(null);

        try {
            // Prepare payload
            const payload: ProjectCreateInput | ProjectUpdateInput = {
                title: formData.title,
                client: formData.client,
                description: formData.description,
                status: mapStatusToAPI(formData.status),
                projectType: mapTypeToAPI(formData.projectType),
                stage: "مرحلة غير محددة", // we can allow a stage field later
                progress: 0, // default
                budget: Number(formData.budget),
                deadline: formData.deadline,
                projectLink: formData.projectLink,
            };

            const url = mode === "create"
                ? `${API_BASE}/api/projects`
                : `${API_BASE}/api/projects/${projectId}`;

            const method = mode === "create" ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "حدث خطأ أثناء حفظ المشروع");
            }

            await response.json();
            // const createdProject = result.data;

            // If there are team members, add them
            // if (formData.teamMembers.length > 0 && createdProject.id) {
            //     // Add each team member
            //     for (const memberName of formData.teamMembers) {
            //         try {
            //             await fetch(`${API_BASE}/api/projects/${createdProject.id}/team`, {
            //                 method: "POST",
            //                 headers: { "Content-Type": "application/json" },
            //                 body: JSON.stringify({
            //                     name: memberName,
            //                     email: `${memberName.replace(/\s/g, "").toLowerCase()}@placeholder.com`,
            //                     role: "عضو فريق",
            //                 }),
            //             });
            //         } catch (err) {
            //             console.error("Failed to add team member:", err);
            //         }
            //     }
            // }

            alert(mode === "create" ? "تم إضافة المشروع بنجاح" : "تم تحديث المشروع بنجاح");
            router.push("/admin/project-management");
            router.refresh();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {submitError && (
                <div className="glass-card p-4 rounded-xl border border-error/30 text-error">
                    {submitError}
                </div>
            )}

            <div className="glass-card p-8 rounded-2xl space-y-6">
                <h2 className="font-headline-md text-headline-md text-on-background mb-6">
                    المعلومات الأساسية
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="عنوان المشروع *"
                        name="title"
                        type="text"
                        value={formData.title || ""}
                        onChange={handleChange}
                        placeholder="أدخل عنوان المشروع"
                        error={errors.title}
                    />
                    <FormField
                        label="اسم العميل *"
                        name="client"
                        type="text"
                        value={formData.client || ""}
                        onChange={handleChange}
                        placeholder="أدخل اسم العميل"
                        error={errors.client}
                    />
                    <FormField
                        label="نوع المشروع"
                        name="projectType"
                        type="select"
                        value={formData.projectType || "COMMERCIAL"}
                        onChange={handleChange}
                        options={projectTypeOptions}
                    />
                    <FormField
                        label="الحالة"
                        name="status"
                        type="select"
                        value={formData.status || "START"}
                        onChange={handleChange}
                        options={statusOptions}
                        error={errors.status}
                    />
                </div>

                <FormField
                    label="رابط المشروع"
                    name="projectLink"
                    type="text"
                    value={formData.projectLink || ""}
                    onChange={handleChange}
                    placeholder="https://youtube.com/yourvideo"
                />

                <FormField
                    label="الوصف *"
                    name="description"
                    type="textarea"
                    value={formData.description || ""}
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
                        value={formData.deadline?.toLocaleString() || ""}
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