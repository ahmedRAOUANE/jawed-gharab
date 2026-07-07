"use client";

import { useState } from "react";
import {
    MdPerson,
    MdBusiness,
    MdMovie,
    MdExpandMore,
} from "react-icons/md";
import { EmailReplyBtn } from "./admin.email-reply-btn";

export interface Lead {
    id: number;
    name: string;
    type: string;
    date: string;
    details: string;
    budget?: string;
    location?: string;
    deadline?: string;
    icon: "person" | "business" | "movie";
    createdAt: Date;
    initials: string;
    email: string;
    projectType: string;
    status: "new" | "pending" | "replied";
    replied?: boolean;
    repliedAt?: string;
}

const iconMap = {
    person: MdPerson,
    business: MdBusiness,
    movie: MdMovie,
};

interface LeadCardProps {
    lead: Lead;
}

export const LeadCard = ({ lead }: LeadCardProps) => {
    const [expanded, setExpanded] = useState(false);
    const [isReplied, setIsReplied] = useState(lead.replied);
    const IconComponent = iconMap[lead.icon];

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div
            className={`glass-card rounded-2xl p-6 cursor-pointer group transition-all ${expanded ? "item-expanded" : ""
                }`}
            onClick={toggleExpand}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <IconComponent size={24} />
                    </div>
                    <div>
                        <h3 className="font-headline-md text-[20px] text-on-background">
                            {lead.name}
                        </h3>
                        <p className="text-label-md text-primary mt-1 uppercase tracking-wider">
                            {lead.type}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto justify-between">
                    <div className="text-right">
                        <span className="text-caption text-on-surface-variant block mb-1">
                            تاريخ الطلب
                        </span>
                        <span className="text-label-md text-on-background">{lead.date}</span>
                    </div>
                    <MdExpandMore
                        className={`text-on-surface-variant transition-transform duration-300 ${expanded ? "rotate-180" : ""
                            }`}
                        size={24}
                    />
                </div>
            </div>

            {/* Expandable content */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-out ${expanded ? "max-h-125 opacity-100 mt-6" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-caption text-on-surface-variant mb-1 block">
                                تفاصيل المشروع
                            </label>
                            <p className="text-body-md text-on-background leading-relaxed">
                                {lead.details}
                            </p>
                        </div>
                        {lead.budget && (
                            <div>
                                <label className="text-caption text-on-surface-variant mb-1 block">
                                    الميزانية المتوقعة
                                </label>
                                <p className="text-label-md text-primary">{lead.budget}</p>
                            </div>
                        )}
                        {lead.location && (
                            <div>
                                <label className="text-caption text-on-surface-variant mb-1 block">
                                    الموقع
                                </label>
                                <p className="text-label-md text-primary">{lead.location}</p>
                            </div>
                        )}
                        {lead.deadline && (
                            <div>
                                <label className="text-caption text-on-surface-variant mb-1 block">
                                    الموعد النهائي
                                </label>
                                <p className="text-label-md text-error font-bold">{lead.deadline}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-end gap-3">
                        {!isReplied ? (
                            <EmailReplyBtn lead={lead} onclick={() => setIsReplied(true)} />
                        ) : (
                            <p className="text-center font-caption text-caption text-on-surface-variant italic">
                                تم الرد {lead.repliedAt || "منذ قليل"}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};