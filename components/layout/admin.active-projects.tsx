// components/layout/admin.active-projects.tsx
import { BiArrowBack } from "react-icons/bi";
import { Project, ProjectCard } from "../ui/admin.project-card";
import Link from "next/link";

interface ActiveProjectsListProps {
    projects: Project[];
}

export const ActiveProjectsList = ({ projects }: ActiveProjectsListProps) => {
    return (
        <section className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                    المشاريع الجارية
                </h2>
                <Link href="/admin/project-management" className="text-primary font-label-md text-label-md flex items-center gap-2 hover:underline">
                    عرض الكل
                    <BiArrowBack className="text-lg" />
                </Link>
            </div>
            <div className="space-y-4">
                {
                    projects.length > 0 
                    ? projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))
                    : (
                        <div>
                            <h3 className="text-4xl">لا توجد مشاريع</h3>
                        </div>
                    )
                }
            </div>
        </section>
    );
};