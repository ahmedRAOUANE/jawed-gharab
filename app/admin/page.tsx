"use client";

import { useEffect, useState } from "react";

import { ActiveProjectsList } from "@/components/layout/admin.active-projects";
import { RecentLeadsList } from "@/components/layout/admin.reacent-leads";
import ScrollReveal from "@/components/providers/ScrollReveal";
import { StatsCard } from "@/components/ui/admin.stats-card";
import { Request } from "@prisma/client";
import { AdminProjectOverview } from "@/lib/validation";
import { Lead } from "@/components/layout/admin.lead-card";

type DashboardStats = {
    activeProjects: number;
    totalViews: number;
    newRequests: number;
};

export default function AdminOverviewPage() {
    const [statsData, setStatsData] = useState<DashboardStats>({
        activeProjects: 0,
        totalViews: 0,
        newRequests: 0,
    });

    const [mappedProjects, setMappedProjects] = useState<AdminProjectOverview[]>([]);
    const [mappedLeads, setMappedLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, projectsRes, leadsRes] = await Promise.all([
                    fetch("/api/stats/dashboard"),
                    fetch(
                        "/api/projects?page=1&limit=5&status=START&status=EDITING&status=REVIEW"
                    ),
                    fetch("/api/requests?page=1&limit=3"),
                ]);

                const stats = statsRes.ok ? await statsRes.json() : null;
                const projects = projectsRes.ok ? await projectsRes.json() : null;
                const leads = leadsRes.ok ? await leadsRes.json() : null;

                const statsData = stats?.data || {
                    activeProjects: 0,
                    totalViews: 0,
                    newRequests: 0,
                };

                const projectsData = projects?.data || [];
                const leadsData = leads?.data || [];

                const mappedLeads: Lead[] = leadsData.map((l: Request) => ({
                    id: l.id,
                    initials: l.name.charAt(0),
                    name: l.name,
                    email: l.email,
                    projectType: l.type,
                    status: l.status.toLowerCase(),
                    replied: l.replied,
                    repliedAt: l.repliedAt
                        ? new Date(l.repliedAt).toLocaleDateString("ar-SA")
                        : undefined,
                }));

                setStatsData(statsData);
                setMappedProjects(projectsData);
                setMappedLeads(mappedLeads);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <main className="pt-32 pb-32 px-gutter max-w-container-max mx-auto">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-section-gap">
                <ScrollReveal>
                    <StatsCard
                        icon="video_library"
                        label="المشاريع النشطة"
                        value={String(statsData.activeProjects)}
                        // trend="+12%"
                        trendUp
                    />
                </ScrollReveal>

                <ScrollReveal>
                    <StatsCard
                        icon="visibility"
                        label="إجمالي المشاهدات"
                        value={String(statsData.totalViews)}
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
                <ActiveProjectsList projects={mappedProjects} loading={loading} />
                <RecentLeadsList leads={mappedLeads} loading={loading} />
            </div>
        </main>
    );
}