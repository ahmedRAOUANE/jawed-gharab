"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { ProjectForm } from "@/components/layout/admin.add-project-form";
import { ProjectUpdateInput } from "@/lib/validation";
import ProjectFormSkeleton from "@/components/ui/project-form-skeleton";

export default function EditProjectPage() {
    const params = useParams();
    const projectId = params.id as string;

    const [initialData, setInitialData] = useState<ProjectUpdateInput | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await fetch(`/api/projects/${projectId}`);

                if (!res.ok) {
                    throw new Error("Failed to fetch project");
                }

                const data = await res.json();
                const project = data.data

                setInitialData({
                    title: project.title,
                    client: project.client,
                    description: project.description,
                    status: project.status,
                    projectType: project.projectType,
                    deadline: project.deadline,
                    budget: project.budget,
                    thumbnailUrl: project.thumbnailUrl || "",
                    projectLink: project.projectLink || "",
                });
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch project"
                );
            } finally {
                setLoading(false);
            }
        }

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    if (error || (!initialData && !loading)) {
        return (
            <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <p>{error ?? "Project not found"}</p>
            </main>
        );
    }

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

            {loading ? (
                <ProjectFormSkeleton/>
            ) : initialData ? (
                    <ProjectForm
                        mode="edit"
                        initialData={initialData}
                        projectId={projectId}
                    />
            ) : (
                <div>no project data found!</div>
            )}
        </main>
    );
}