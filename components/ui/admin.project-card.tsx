import Image from "next/image";
import GlassCard from "./GlassCard";

export interface Project {
    id: number;
    title: string;
    stage: string;
    status: string;
    statusType: "active" | "review" | "start";
    progress: number;
    imageUrl: string;
}

const statusStyles = {
    active: "bg-primary-container text-on-primary-container",
    review: "bg-tertiary-container text-on-tertiary-container",
    start: "bg-secondary-container text-on-secondary-container",
};

export const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <GlassCard className="p-4 rounded-xl flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-40 h-24 rounded-lg overflow-hidden bg-surface-variant">
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