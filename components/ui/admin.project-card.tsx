import { AdminProjectOverview } from "@/lib/validation";
import Image from "next/image";
import Link from "next/link";

const STATUS_INFO = {
    START: {
        text: "بدء العمل",
        style: "bg-secondary-container text-on-secondary-container",
    },
    EDITING: {
        text: "قيد المونتاج",
        style: "bg-secondary-container text-on-secondary-container",
    },
    REVIEW: {
        text: "في انتظار المراجعة",
        style: "bg-tertiary-container text-on-tertiary-container",
    },
    DELIVERED: {
        text: "تم التسليم",
        style: "bg-secondary-container text-on-secondary-container",
    },
    ACTIVE: {
        text: "قيد العمل",
        style: "bg-primary-container text-on-primary-container",
    },
} satisfies Record<
    AdminProjectOverview["status"],
    { text: string; style: string }
>;

export const ProjectCard = ({ project, className, largeImg }: { project: AdminProjectOverview, className?: string, largeImg?: boolean }) => {
    const statusInfo = STATUS_INFO[project.status];

    return (
        <Link href={`project-management/${project.id}`} className={`glass-card p-4 rounded-xl flex items-center gap-6 ${className}`}>
            <div className={`h-24 rounded-lg overflow-hidden bg-surface-variant ${largeImg ? "w-full" : ""}`}>
                {project.thumbnailUrl ?(<Image
                    width={100}
                    height={100}
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    unoptimized
                />) : (
                    <div>
                        Img
                    </div>
                )}
            </div>
            <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-body-lg text-body-lg font-bold">{project.title}</h4>
                    <span
                        className={`px-3 py-1 text-xs rounded-full font-label-md ${statusInfo.style}`}
                    >
                        {statusInfo.text}
                    </span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-primary-container h-full progress-glow"
                        style={{ width: `${project.progress}%` }}
                    ></div>
                </div>
            </div>
        </Link>
    );
};