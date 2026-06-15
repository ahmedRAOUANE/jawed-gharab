import { ActiveProjectsList } from "@/components/layout/admin.active-projects";
import { RecentLeadsList } from "@/components/layout/admin.reacent-leads";
import ScrollReveal from "@/components/providers/ScrollReveal";
import { StatsCard } from "@/components/ui/admin.stats-card";

export default function AdminOverviewPage() {
    return (
        <main className="pt-32 pb-32 px-gutter max-w-container-max mx-auto">
            {/* Statistics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-section-gap">
                <ScrollReveal>
                    <StatsCard
                        icon="video_library"
                        label="المشاريع النشطة"
                        value="24"
                        trend="+12%"
                        trendUp
                    />
                </ScrollReveal >
                <ScrollReveal>
                    <StatsCard
                        icon="visibility"
                        label="إجمالي المشاهدات"
                        value="1.2M"
                        trend="+8%"
                        trendUp
                    />
                </ScrollReveal>
                <ScrollReveal>
                    <StatsCard
                        icon="add_comment"
                        label="طلبات جديدة"
                        value="7"
                        badge="جديد"
                    />
                </ScrollReveal>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <ActiveProjectsList />
                <RecentLeadsList />
            </div>
        </main>
    );
}