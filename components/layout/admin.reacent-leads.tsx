// components/layout/admin.reacent-leads.tsx
import { LeadCard } from "../ui/admin.lead-card";
import { LeadCardSkeleton } from "../ui/lead-card-skeleton";
import { Lead } from "./admin.lead-card";

interface RecentLeadsListProps {
    leads: Lead[];
    loading: boolean;
}

export const RecentLeadsList = ({ leads, loading }: RecentLeadsListProps) => {
    return (
        <section className="lg:col-span-1">
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                    طلبات جديدة
                </h2>
            </div>
            <div className="space-y-4">
                { loading ? (
                    <LeadCardSkeleton />
                ) : leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
            </div>
        </section>
    );
};