// app/admin/project-management/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddProjectButton } from "@/components/layout/admin.add-project-btn";
import { ProjectCard } from "@/components/ui/admin.project-card";
import { SearchFilterBar } from "@/components/ui/admin.seachfilterbar";
import { StatsCard } from "@/components/ui/admin.stats-card";
import { ProjectCardSkeleton } from "@/components/ui/project-card-skeleton";
import { AdminProjectOverview } from "@/lib/validation";

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ProjectManagementPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filter state
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
    const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");
    const [page, setPage] = useState(1);
    const [limit] = useState(9);

    // Data state
    const [projects, setProjects] = useState<AdminProjectOverview[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Stats
    const [activeCount, setActiveCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    // Fetch projects
    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (statusFilter) params.append("status", statusFilter);
            if (typeFilter) params.append("type", typeFilter);
            params.append("page", String(page));
            params.append("limit", String(limit));

            const res = await fetch(`${API_BASE}/api/projects?${params.toString()}`);
            if (!res.ok) {
                throw new Error("Failed to fetch projects");
            }
            const data = await res.json();

            setProjects(data.data);
            setTotal(data.pagination?.total || 0);

            // Calculate stats
            const active = data.data.filter((p: AdminProjectOverview) => p.status === "EDITING" || p.status === "REVIEW").length;
            const review = data.data.filter((p: AdminProjectOverview) => p.status === "REVIEW").length;
            setActiveCount(active);
            setReviewCount(review);
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ");
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, typeFilter, page, limit]);

    useEffect(() => {
        const fetchData = async () => await fetchProjects();
        fetchData();
    }, [fetchProjects]);

    // Update URL when filters change
    const updateFilters = (newSearch: string, newStatus: string, newType: string) => {
        setSearch(newSearch);
        setStatusFilter(newStatus);
        setTypeFilter(newType);
        setPage(1); // reset to first page
        const params = new URLSearchParams();
        if (newSearch) params.append("search", newSearch);
        if (newStatus) params.append("status", newStatus);
        if (newType) params.append("type", newType);
        router.push(`/admin/project-management?${params.toString()}`);
    };

    return (
        <main className="pt-32 pb-40 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-4">
                        إدارة المشاريع
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                        تتبع وراقب تقدم أعمالك السينمائية مع لوحة التحكم المتقدمة. قم بإدارة
                        كل تفاصيل الإنتاج من هنا.
                    </p>
                </div>
                <div className="flex gap-2 items-start">
                    <StatsCard
                        label="المشاريع النشطة"
                        value={String(activeCount)}
                    />
                    <StatsCard
                        label="قيد المراجعة"
                        value={String(reviewCount)}
                    />
                </div>
            </div>

            {/* Search & Filter Bar */}
            <SearchFilterBar
                search={search}
                setSearch={(val) => updateFilters(val, statusFilter, typeFilter)}
                statusFilter={statusFilter}
                setStatusFilter={(val) => updateFilters(search, val, typeFilter)}
                typeFilter={typeFilter}
                setTypeFilter={(val) => updateFilters(search, statusFilter, val)}
            />

            {/* Projects Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <ProjectCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="text-error text-center p-8 glass-card rounded-2xl">
                    <p>حدث خطأ: {error}</p>
                    <button
                        type="button"
                        onClick={() => fetchProjects()}
                        className="cursor-pointer mt-4 px-6 py-2 bg-primary-container text-on-primary-container rounded-lg"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center p-12 glass-card rounded-2xl">
                    <p className="text-on-surface-variant text-lg">لا توجد مشاريع مطابقة للبحث</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} className="flex-col" largeImg />
                    ))}
                </div>
            )}

            {/* Pagination (simple) */}
            {total > limit && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        type="button"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="cursor-pointer px-4 py-2 glass-card rounded-lg disabled:opacity-50"
                    >
                        السابق
                    </button>
                    <span className="px-4 py-2">
                        صفحة {page} من {Math.ceil(total / limit)}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= Math.ceil(total / limit)}
                        className="cursor-pointer px-4 py-2 glass-card rounded-lg disabled:opacity-50"
                    >
                        التالي
                    </button>
                </div>
            )}

            {/* Floating Action Button */}
            <AddProjectButton />
        </main>
    );
}