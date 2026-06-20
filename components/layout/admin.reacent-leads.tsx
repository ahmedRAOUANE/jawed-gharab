// components/layout/admin.reacent-leads.tsx
import { Lead, LeadCard } from "../ui/admin.lead-card";

interface RecentLeadsListProps {
    leads: Lead[];
}

export const RecentLeadsList = ({ leads }: RecentLeadsListProps) => {
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