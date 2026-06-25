import GlassCard from "./GlassCard";

export const ProjectCardSkeleton = ({
    className,
}: {
    className?: string;
}) => {
    return (
        <GlassCard
            className={`p-4 rounded-xl flex items-center gap-6 animate-pulse ${className}`}
        >
            {/* Thumbnail */}
            <div className="h-24 w-24 rounded-lg bg-surface-variant shrink-0" />

            {/* Content */}
            <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-3">
                    {/* Title */}
                    <div className="h-5 w-48 rounded-md bg-surface-variant" />

                    {/* Status Badge */}
                    <div className="h-7 w-20 rounded-full bg-surface-variant" />
                </div>

                {/* Stage */}
                <div className="h-4 w-32 rounded-md bg-surface-variant mb-4" />

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-surface-variant overflow-hidden">
                    <div className="h-full w-2/3 bg-white/10 rounded-full" />
                </div>
            </div>
        </GlassCard>
    );
};