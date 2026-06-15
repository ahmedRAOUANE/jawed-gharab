"use client";

import { useState } from "react";
import GlassCard from "./GlassCard";

export interface Lead {
    id: number;
    initials: string;
    name: string;
    projectType: string;
    status: "new" | "pending" | "replied";
    replied?: boolean;
    repliedAt?: string;
}

export const LeadCard = ({ lead }: { lead: Lead }) => {
    const [isReplied, setIsReplied] = useState(lead.replied || false);

    const handleQuickReply = () => {
        // Implement reply logic (open modal, send message, etc.)
        console.log(`Quick reply to ${lead.name}`);
        setIsReplied(true);
    };

    const borderClass =
        lead.status === "new" ? "border-l-4 border-primary" : "border-l-4 border-transparent";
    const opacityClass = lead.status === "replied" ? "opacity-60" : "";

    return (
        <GlassCard className={`p-5 rounded-xl ${borderClass} ${opacityClass}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-bold text-primary">
                    {lead.initials}
                </div>
                <div>
                    <h5 className="font-body-md text-body-md font-bold">{lead.name}</h5>
                    <p className="text-on-surface-variant text-xs">{lead.projectType}</p>
                </div>
            </div>
            {!isReplied ? (
                <button
                    onClick={handleQuickReply}
                    className="w-full py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md transition-all active:scale-95"
                >
                    رد سريع
                </button>
            ) : (
                <p className="text-center font-caption text-caption text-on-surface-variant italic">
                    تم الرد {lead.repliedAt || "منذ قليل"}
                </p>
            )}
        </GlassCard>
    );
};