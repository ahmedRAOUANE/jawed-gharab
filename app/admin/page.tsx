import { ActiveProjectsList } from "@/components/layout/admin.active-projects";
import { RecentLeadsList } from "@/components/layout/admin.reacent-leads";
import ScrollReveal from "@/components/providers/ScrollReveal";
import { StatsCard } from "@/components/ui/admin.stats-card";
import { Project } from "@/components/ui/admin.project-card";
import { Lead } from "@/components/ui/admin.lead-card";

// API base URL (for server-side fetch, use absolute URL)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchData() {
    "use server";
    
    const [statsRes, projectsRes, leadsRes] = await Promise.all([
        fetch(`${API_BASE}/api/stats/dashboard`, { cache: "no-store" }),
        fetch(`${API_BASE}/api/projects?page=1&limit=5&status=START&status=EDITING&status=REVIEW`, { cache: "no-store" }),
        fetch(`${API_BASE}/api/requests?page=1&limit=3`, { cache: "no-store" }),
    ]);

    const stats = statsRes.ok ? await statsRes.json() : null;
    const projects = projectsRes.ok ? await projectsRes.json() : null;
    const leads = leadsRes.ok ? await leadsRes.json() : null;

    return { stats, projects, leads };
}

export default async function AdminOverviewPage() {
    const { stats, projects, leads } = await fetchData();

    // Extract data with fallbacks
    const statsData = stats?.data || { activeProjects: 0, totalViews: 0, newRequests: 0 };
    const projectsData = projects?.data || [];
    const leadsData = leads?.data || [];

    // Map projects to the format expected by ActiveProjectsList
    const mappedProjects: Project[] = projectsData.map((p: Project) => ({
        id: p.id,
        title: p.title,
        stage: p.stage || "مرحلة غير محددة",
        status: p.status === "EDITING" ? "قيد التنفيذ" :
            p.status === "REVIEW" ? "مراجعة العميل" :
                p.status === "START" ? "بدء العمل" : "تم التسليم",
        statusType: p.status === "EDITING" ? "active" :
            p.status === "REVIEW" ? "review" : "start",
        progress: p.progress,
        imageUrl: p.imageUrl || "https://via.placeholder.com/400x225/2563eb/ffffff?text=MASTERY",
    }));

    // Map leads to the format expected by RecentLeadsList
    const mappedLeads: Lead[] = leadsData.map((l: Lead) => ({
        id: l.id,
        initials: l.name.charAt(0), // first letter of name
        name: l.name,
        projectType: l.projectType,
        status: l.status.toLocaleLowerCase(),
        replied: l.replied,
        repliedAt: l.repliedAt ? new Date(l.repliedAt).toLocaleDateString("ar-SA") : undefined,
    }));

    return (
        <main className="pt-32 pb-32 px-gutter max-w-container-max mx-auto">
            {/* Statistics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-section-gap">
                <ScrollReveal>
                    <StatsCard
                        icon="video_library"
                        label="المشاريع النشطة"
                        value={String(statsData.activeProjects)}
                        trend="+12%" // we keep static trend for now (can be removed later)
                        trendUp
                    />
                </ScrollReveal>
                <ScrollReveal>
                    <StatsCard
                        icon="visibility"
                        label="إجمالي المشاهدات"
                        value={String(statsData.totalViews)}
                    // no trend or badge for now
                    />
                </ScrollReveal>
                <ScrollReveal>
                    <StatsCard
                        icon="add_comment"
                        label="طلبات جديدة"
                        value={String(statsData.newRequests)}
                        badge="جديد"
                    />
                </ScrollReveal>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <ActiveProjectsList projects={mappedProjects} />
                <RecentLeadsList leads={mappedLeads} />
            </div>
        </main>
    );
}