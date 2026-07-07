"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lead, LeadCard } from "@/components/layout/admin.lead-card";
import { FilterButtons } from "@/components/ui/admin.filter-btns";
import { StatsCard } from "@/components/ui/admin.stats-card";
import { LeadCardSkeleton } from "@/components/ui/lead-card-skeleton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Mapping for API status to UI text
const statusMap: Record<string, string> = {
    NEW: "جديد",
    PENDING: "قيد الانتظار",
    CONTACTED: "تم التواصل",
};

// Mapping for UI text to API status (for filter)
const statusReverseMap: Record<string, string> = {
    "الكل": "",
    "جديد": "NEW",
    "قيد الانتظار": "PENDING",
    "تم التواصل": "CONTACTED",
};

export default function LeadsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [leads, setLeads] = useState<Lead[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState("الكل");

    // Filter state
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
    const [page, setPage] = useState(1);
    const limit = 10;

    // Stats
    const [totalLeads, setTotalLeads] = useState(0);
    const [newLeads, setNewLeads] = useState(0);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.append("status", statusFilter);
            params.append("page", String(page));
            params.append("limit", String(limit));

            const res = await fetch(`${API_BASE}/api/requests?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch requests");
            const data = await res.json();

            // Map API data to UI Lead type
            const mappedLeads: Lead[] = data.data.map((item: Lead) => ({
                id: item.id,
                name: item.name,
                replied: item.replied,
                repliedAt: new Date(item.repliedAt || "").toLocaleDateString(),
                type: item.type,
                createdAt: new Date(item.createdAt).toLocaleDateString("ar-SA"),
                details: item.details,
                budget: item.budget || undefined,
                location: item.location || undefined,
                deadline: item.deadline || undefined,
                status: statusMap[item.status] || item.status,
                icon: item.icon as "person" | "business" | "movie",
            }));

            setLeads(mappedLeads);
            setTotal(data.pagination?.total || 0);

            // Calculate stats from all requests (could be better with separate API, but we'll compute)
            // For now, we'll set total and new from counts (we can get from stats endpoint)
            // But we already have the stats endpoint /api/stats/dashboard that gives these
            // We'll fetch stats separately if needed, or we can get counts from this response if we had total count.
            // For simplicity, we'll fetch stats from the dashboard endpoint separately.
            const statsRes = await fetch(`${API_BASE}/api/stats/dashboard`);
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setTotalLeads(statsData.data.totalRequests || 0);
                setNewLeads(statsData.data.newRequests || 0);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, page, limit]);

    // Update URL when filter changes
    const updateFilter = (filter: string) => {
        setActiveFilter(filter);
        const apiStatus = statusReverseMap[filter] || "";
        setStatusFilter(apiStatus);
        setPage(1);
        const params = new URLSearchParams();
        if (apiStatus) params.append("status", apiStatus);
        router.push(`/admin/requests?${params.toString()}`);
    };

    useEffect(() => {
        const fetchData = async () => fetchLeads();
        fetchData();
    }, [fetchLeads]);

    return (
        <main className="pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-4">
                        إدارة الطلبات
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                        تتبع وراقب تقدم أعمالك السينمائية مع لوحة التحكم المتقدمة. قم بإدارة
                        كل تفاصيل الإنتاج من هنا.
                    </p>
                </div>
                <div className="flex gap-2 items-start">
                    <StatsCard label="اجمالي الطلبات" value={String(totalLeads)} />
                    <StatsCard label="الطلبات الجديدة" value={String(newLeads)} />
                </div>
            </div>

            {/* Filter Buttons */}
            <FilterButtons
                activeFilter={activeFilter}
                onFilterChange={updateFilter}
            />

            {/* Leads List */}
            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <LeadCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="text-error text-center p-8 glass-card rounded-2xl">
                    <p>حدث خطأ: {error}</p>
                    <button
                        type="button"
                        onClick={() => fetchLeads()}
                        className="mt-4 px-6 py-2 bg-primary-container text-on-primary-container rounded-lg"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            ) : leads.length === 0 ? (
                <div className="text-center p-12 glass-card rounded-2xl">
                    <p className="text-on-surface-variant text-lg">لا توجد طلبات مطابقة</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                    ))}
                </div>
            )}
            {total > limit && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= Math.ceil(total / limit)}
                        className="cursor-pointer px-4 py-2 glass-card rounded-lg disabled:opacity-50"
                    >
                        التالي
                    </button>
                </div>
            )}
        </main>
    );
}