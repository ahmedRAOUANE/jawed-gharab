// src/components/admin/RecentLeadsList.tsx

import { Lead, LeadCard } from "../ui/admin.lead-card";

const leads: Lead[] = [
    {
        id: 1,
        initials: "أ",
        name: "أحمد منصور",
        projectType: "إعلان تجاري لشركة سيارات",
        status: "new",
        replied: false,
    },
    {
        id: 2,
        initials: "س",
        name: "سارة الخالدي",
        projectType: "تغطية مؤتمر تقني",
        status: "pending",
        replied: false,
    },
    {
        id: 3,
        initials: "م",
        name: "محمد إبراهيم",
        projectType: "فيديو يوتيوب (مونتاج)",
        status: "replied",
        replied: true,
        repliedAt: "منذ ساعتين",
    },
];

export const RecentLeadsList = () => {
    return (
        <section className="lg:col-span-1">
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                    طلبات جديدة
                </h2>
            </div>
            <div className="space-y-4">
                {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
            </div>
        </section>
    );
};