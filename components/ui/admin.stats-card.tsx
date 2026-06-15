// src/components/admin/StatsCard.tsx
import { ReactNode } from "react";
import { MdTrendingUp, MdFiberNew } from "react-icons/md";

interface StatsCardProps {
    icon: string; // using material icon name, but we'll use react-icons equivalent
    label: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    badge?: string;
}

// Map material icon names to react-icons
const iconMap: Record<string, ReactNode> = {
    video_library: <MdVideoLibrary />,
    visibility: <MdVisibility />,
    add_comment: <MdAddComment />,
};

import { MdVideoLibrary, MdVisibility, MdAddComment } from "react-icons/md";
import GlassCard from "./GlassCard";

export const StatsCard = ({
    icon,
    label,
    value,
    trend,
    trendUp,
    badge,
}: StatsCardProps) => {
    const IconComponent = iconMap[icon];

    return (
        <GlassCard className="p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-container/20 rounded-lg">
                    {IconComponent && (
                        <span className="text-primary text-2xl">{IconComponent}</span>
                    )}
                </div>
                {trend && (
                    <span
                        className={`flex items-center gap-1 font-label-md text-label-md ${trendUp ? "text-green-400" : "text-primary"
                            }`}
                    >
                        {trend}
                        {trendUp && <MdTrendingUp className="text-sm" />}
                        {badge === "جديد" && <MdFiberNew className="text-sm" />}
                    </span>
                )}
                {badge && !trend && (
                    <span className="flex items-center gap-1 text-primary font-label-md text-label-md">
                        {badge}
                        <MdFiberNew className="text-sm" />
                    </span>
                )}
            </div>
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">
                {label}
            </h3>
            <p className="font-headline-lg text-headline-lg text-on-surface">{value}</p>
        </GlassCard>
    );
};