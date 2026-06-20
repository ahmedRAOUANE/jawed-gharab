import { ProjectForm } from "@/components/layout/admin.add-project-form";
import { TeamMember } from "@prisma/client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getProject(id: string) {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch project");
    }
    const data = await res.json();
    return data.data;
}

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const projectId = (await params).id;
    const project = await getProject(projectId);

    // Map API data to form data
    const statusMap: Record<string, string> = {
        START: "بدء العمل",
        EDITING: "قيد المونتاج",
        REVIEW: "في انتظار المراجعة",
        DELIVERED: "تم التسليم",
    };

    const typeMap: Record<string, string> = {
        COMMERCIAL: "إعلان",
        DOCUMENTARY: "وثائقي",
        MOTION_GRAPHICS: "موشن جرافيك",
        MUSIC_VIDEO: "فيديو موسيقي",
        OTHER: "أخرى",
    };

    const initialData = {
        title: project.title,
        client: project.client,
        description: project.description,
        status: statusMap[project.status] || "بدء العمل",
        projectType: typeMap[project.projectType] || "أخرى",
        team: project.teamMembers?.map((tm: TeamMember) => tm.name) || [],
        deadline: project.deadline ? new Date(project.deadline).toISOString().split("T")[0] : "",
        budget: project.budget,
        thumbnail: project.thumbnailUrl || "",
        projectLink: project.projectLink || "",
    };

    return (
        <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <div className="mb-12">
                <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-4">
                    تعديل المشروع
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                    قم بتحديث تفاصيل المشروع الحالي.
                </p>
            </div>
            <ProjectForm mode="edit" initialData={initialData} projectId={projectId} />
        </main>
    );
}