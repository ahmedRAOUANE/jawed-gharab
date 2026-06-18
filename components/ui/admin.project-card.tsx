import Image from "next/image";
import GlassCard from "./GlassCard";

interface TeamMember { initials: string, bgColor: string }

export interface Project {
    id: number;
    title: string;
    stage?: string;
    status: string;
    statusType: "active" | "review" | "start" | "editing" | "delivered";
    progress?: number;
    imageUrl: string;
    client?: string;
    lastUpdated?: string;
    team?: TeamMember[];
}

const statusStyles = {
    active: "bg-primary-container text-on-primary-container",
    review: "bg-tertiary-container text-on-tertiary-container",
    start: "bg-secondary-container text-on-secondary-container",
    editing: "bg-secondary-container text-on-secondary-container",
    delivered: "bg-secondary-container text-on-secondary-container",
};

export const ProjectCard = ({ project, className, largeImg }: { project: Project, className?: string, largeImg?: boolean }) => {
    return (
        <GlassCard className={`p-4 rounded-xl flex items-center gap-6 ${className}`}>
            <div className={`h-24 rounded-lg overflow-hidden bg-surface-variant ${largeImg ? "w-full" : ""}`}>
                <Image
                    width={100}
                    height={100}
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-body-lg text-body-lg font-bold">{project.title}</h4>
                    <span
                        className={`px-3 py-1 text-xs rounded-full font-label-md ${statusStyles[project.statusType]}`}
                    >
                        {project.status}
                    </span>
                </div>
                <p className="text-on-surface-variant font-caption text-caption mb-4">
                    المرحلة: {project.stage}
                </p>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-primary-container h-full progress-glow"
                        style={{ width: `${project.progress}%` }}
                    ></div>
                </div>
            </div>
        </GlassCard>
    );
};