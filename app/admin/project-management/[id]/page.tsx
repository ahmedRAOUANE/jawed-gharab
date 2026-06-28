"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MdEdit, MdDelete, MdArrowBack, MdLink, MdCalendarToday, MdAttachMoney, MdPerson, MdBusiness } from "react-icons/md";
import { AdminProjectDisplayDetailSchema, type AdminProjectDetailed } from "@/lib/validation";
import { ProjectStatus, ProjectType } from "@prisma/client";
import Image from "next/image";
import { getYoutubeEmbedUrl } from "@/lib/embed";

// Status badge styling
const statusStyles: Record<ProjectStatus, string> = {
    ACTIVE: "bg-tertiary-container text-on-tertiary-container",
    START: "bg-secondary-container text-on-secondary-container",
    EDITING: "bg-primary-container text-on-primary-container",
    REVIEW: "bg-tertiary-container text-on-tertiary-container",
    DELIVERED: "bg-green-500/20 text-green-400",
};

const statusText: Record<ProjectStatus, string> = {
    ACTIVE: "قيد العمل",
    START: "بدء العمل",
    EDITING: "قيد المونتاج",
    REVIEW: "في انتظار المراجعة",
    DELIVERED: "تم التسليم",
};

const projectTypeText: Record<ProjectType, string> = {
    COMMERCIAL: "إعلان",
    DOCUMENTARY: "وثائقي",
    MOTION_GRAPHICS: "موشن جرافيك",
    MUSIC_VIDEO: "فيديو موسيقي",
    OTHER: "أخرى",
};

// Delete Button Component (Client)
function DeleteButton({ projectId, projectTitle }: { projectId: number; projectTitle: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "فشل حذف المشروع");
            }

            router.push("/admin/project-management");
            router.refresh();
        } catch (error) {
            alert(error instanceof Error ? error.message : "حدث خطأ أثناء حذف المشروع");
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-error-container text-on-error-container rounded-xl hover:bg-error hover:text-white transition-all active:scale-95"
                disabled={loading}
            >
                <MdDelete size={20} />
                <span>{loading ? "جاري الحذف..." : "حذف المشروع"}</span>
            </button>

            {/* Confirmation Dialog */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                    <div className="bg-background/90 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="font-headline-md text-headline-md text-on-background mb-4">
                            تأكيد الحذف
                        </h3>

                        <p className="text-on-surface-variant font-body-md mb-6">
                            هل أنت متأكد من حذف المشروع <span className="text-primary font-bold">&ldquo;{projectTitle}&ldquo;</span>؟
                            <br />
                            <span className="text-error text-sm">هذا الإجراء لا يمكن التراجع عنه.</span>
                        </p>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                className="cursor-pointer flex-1 py-3 border border-white/10 text-on-surface-variant rounded-xl hover:bg-white/5 transition-colors"
                            >
                                إلغاء
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading}
                                className="cursor-pointer flex-1 py-3 bg-error-container text-on-error-container rounded-xl hover:bg-error hover:text-white transition-all disabled:opacity-60"
                            >
                                {loading ? "جاري الحذف..." : "تأكيد الحذف"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Main Page Component
export default function ProjectDetailsPage() {
    const params = useParams<{ id: string }>()
    const [project, setProject] = useState<AdminProjectDetailed | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [embedUrl, setEmbedUrl] = useState<string | null>(null);

    const projectId = parseInt(params.id);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${projectId}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("المشروع غير موجود");
                    }
                    throw new Error("فشل جلب بيانات المشروع");
                }
                const data = await res.json();
                const validated = AdminProjectDisplayDetailSchema.parse(data.data);
                setProject(validated);
                setEmbedUrl(getYoutubeEmbedUrl(validated.projectLink ?? ""));
            } catch (err) {
                setError(err instanceof Error ? err.message : "حدث خطأ");
            } finally {
                setLoading(false);
            }
        };

        if (!isNaN(projectId)) {
            fetchProject();
        }
    }, [projectId]);

    if (error || (!loading && !project)) {
        return (
            <main className="pt-32 pb-40 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div className="glass-card p-12 rounded-2xl text-center">
                    <div className="text-4xl mb-4">😕</div>
                    <h2 className="font-headline-lg text-headline-lg text-on-background mb-4">
                        {error || "المشروع غير موجود"}
                    </h2>
                    <Link
                        href="/admin/project-management"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-on-primary-container rounded-xl hover:scale-105 transition-all"
                    >
                        <MdArrowBack size={20} />
                        العودة إلى المشاريع
                    </Link>
                </div>
            </main>
        );
    }

    const safeProject = project!;

    return (
        <main className="pt-32 pb-40 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/project-management"
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <MdArrowBack size={24} className="text-on-surface-variant" />
                    </Link>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">
                        تفاصيل المشروع
                    </h1>
                </div>

                {
                    loading ? (
                        <div className="flex gap-3">
                            <div
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-container text-on-primary-container rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <MdEdit size={20} />
                                <span>تعديل</span>
                            </div>
                            <button
                                type="button"
                                className="disabled cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-error-container text-on-error-container rounded-xl hover:bg-error hover:text-white transition-all active:scale-95"
                                disabled
                            >
                                <MdDelete size={20} />
                                <span>حذف المشروع</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Link
                                href={`/admin/project-management/update-project/${safeProject.id}`}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-container text-on-primary-container rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <MdEdit size={20} />
                                <span>تعديل</span>
                            </Link>
                            <DeleteButton projectId={safeProject.id} projectTitle={safeProject.title} />
                        </div>
                    )
                }
            </div>

            {/* Project Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-3 flex flex-wrap items-start justify-between gap-4">
                    {loading ? (
                        <div className="space-y-4">
                            <div className={`h-12 w-72 animate-pulse bg-on-background/10 rounded`} />

                            <div className="flex items-center gap-3">
                                <div className={`h-4 w-28 animate-pulse bg-on-background/10 rounded`} />
                                <div className="w-1 h-1 rounded-full bg-on-background/20" />
                                <div className={`h-4 w-20 animate-pulse bg-on-background/10 rounded`} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background">
                                {safeProject.title}
                            </h2>

                            <div className="flex items-center gap-3 mt-2">
                                <span className="flex items-center gap-1 text-on-surface-variant text-sm">
                                    <MdBusiness size={16} />
                                    {safeProject.client}
                                </span>

                                <span className="text-on-surface-variant">•</span>

                                <span className="text-on-surface-variant text-sm">
                                    {projectTypeText[safeProject.projectType as keyof typeof projectTypeText]}
                                </span>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="h-10 w-32 rounded-full bg-white/10 animate-pulse" />
                    ) : (
                        <span className={`px-4 py-2 rounded-full text-label-md ${statusStyles[safeProject.status]}`}>
                            {statusText[safeProject.status]}
                        </span>
                    )}
                </div>

                {/* Sidebar - Right */}
                <div className="space-y-6 col-span-3 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="col-span-2 space-y-3">
                        {loading ? (
                            <>
                                <div className="glass-card p-6 rounded-2xl">
                                    <div className={`h-7 w-28 mb-6 animate-pulse bg-white/10 rounded`} />

                                    <div className="space-y-3">
                                        <div className={`h-4 w-full animate-pulse bg-white/10 rounded`} />
                                        <div className={`h-4 w-full animate-pulse bg-white/10 rounded`} />
                                        <div className={`h-4 w-5/6 animate-pulse bg-white/10 rounded`} />
                                        <div className={`h-4 w-3/4 animate-pulse bg-white/10 rounded`} />
                                    </div>
                                </div>

                                <div className="glass-card p-6 rounded-2xl">
                                    <div className={`h-7 w-36 mb-6 animate-pulse bg-white/10 rounded`} />

                                    <div className="space-y-6">
                                        {[1, 2, 3, 4].map((item) => (
                                            <div key={item} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded bg-white/10 animate-pulse mt-1" />

                                                <div className="flex-1 space-y-2">
                                                    <div className={`h-3 w-24 animate-pulse bg-white/10 rounded`} />
                                                    <div className={`h-4 w-40 animate-pulse bg-white/10 rounded`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="col-span-2 space-y-3">
                                    <div className="glass-card p-6 rounded-2xl">
                                        <h3 className="font-headline-md text-headline-md text-on-background mb-4">
                                            الوصف
                                        </h3>
                                        <p className="text-on-surface-variant font-body-lg leading-relaxed">
                                            {safeProject.description}
                                        </p>
                                    </div>

                                    {/* Project Details */}
                                    <div className="glass-card p-6 rounded-2xl space-y-4">
                                        <h3 className="font-headline-md text-headline-md text-on-background mb-4">
                                            معلومات المشروع
                                        </h3>

                                        <div className="flex items-start gap-3">
                                            <MdCalendarToday className="text-primary mt-1" size={20} />
                                            <div>
                                                <p className="text-caption text-on-surface-variant">تاريخ التسليم</p>
                                                <p className="text-on-background font-body-md">
                                                    {/* {format(new Date(safeProject.deadline), "dd MMMM yyyy", { locale: arSA })} */}
                                                    {safeProject.deadline.toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <MdAttachMoney className="text-primary mt-1" size={20} />
                                            <div>
                                                <p className="text-caption text-on-surface-variant">الميزانية</p>
                                                <p className="text-on-background font-body-md">
                                                    {safeProject.budget.toLocaleString("ar-SA")} ريال سعودي
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <MdPerson className="text-primary mt-1" size={20} />
                                            <div>
                                                <p className="text-caption text-on-surface-variant">العميل</p>
                                                <p className="text-on-background font-body-md">{safeProject.client}</p>
                                            </div>
                                        </div>

                                        {safeProject.projectLink && (
                                            <div className="flex items-start gap-3">
                                                <MdLink className="text-primary mt-1" size={20} />
                                                <div>
                                                    <p className="text-caption text-on-surface-variant">رابط المشروع</p>
                                                    <a
                                                        href={safeProject.projectLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline font-body-md break-all"
                                                    >
                                                        {safeProject.projectLink}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Thumbnail */}
                    <div className="col-span-2 space-y-3">
                        <div className="rounded-2xl">
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-variant">
                                {loading ? (
                                    <div className="w-full h-full bg-on-background/10 animate-pulse" />
                                ) : embedUrl ? (
                                    <iframe
                                        src={embedUrl}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={safeProject.title}
                                    />
                                ) : safeProject.thumbnailUrl ? (
                                    <Image
                                        src={safeProject.thumbnailUrl}
                                        alt={safeProject.title}
                                        className="w-full h-full object-cover"
                                        width={100}
                                        height={100}
                                    />
                                ) : null}
                            </div>
                        </div>

                        {/* <div className="glass-card p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-headline-md text-headline-md text-on-background">
                                    التقدم
                                </h3>
                                <span className="text-primary font-bold">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                                <div
                                    className="bg-primary-container h-full transition-all duration-500"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                            {project.stage && (
                                <p className="text-on-surface-variant text-sm mt-3">
                                    المرحلة الحالية: <span className="text-primary">{project.stage}</span>
                                </p>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>
        </main>
    );
}