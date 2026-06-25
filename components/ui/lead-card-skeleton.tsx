import GlassCard from "./GlassCard";

export const LeadCardSkeleton = () => {
    return (
        <GlassCard className="p-5 rounded-2xl animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-surface-variant shrink-0" />

                {/* Name + Project Type */}
                <div className="flex-1">
                    <div className="h-4 w-28 rounded bg-surface-variant mb-2" />
                    <div className="h-3 w-20 rounded bg-surface-variant" />
                </div>
            </div>

            {/* Button */}
            <div className="h-10 w-full rounded-lg bg-surface-variant" />
        </GlassCard>
    );
};