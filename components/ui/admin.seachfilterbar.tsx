"use client";

import { MdSearch } from "react-icons/md";
import GlassCard from "./GlassCard";

interface SearchFilterBarProps {
    search: string;
    setSearch: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    typeFilter: string;
    setTypeFilter: (val: string) => void;
}

export const SearchFilterBar = ({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
}: SearchFilterBarProps) => {
    // For simplicity, we'll just update search on input change with debounce.
    // For status and type, we can use dropdown or buttons. Let's add simple select boxes.
    // Since the original design used buttons, we'll keep it simple with dropdowns.

    return (
        <GlassCard className="p-4 rounded-3xl mb-12 flex flex-col md:flex-row gap-4 items-center text-xl hover:shadow-xl transition-all hover:-translate-y-0.5">
            <div className="relative w-full md:flex-1">
                <MdSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-primary-container focus:border-primary transition-all text-on-surface placeholder:text-on-surface-variant/50"
                    placeholder="بحث عن مشروع أو عميل..."
                />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                <select
                    title="status filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 md:flex-none px-4 py-3 bg-surface-container-high rounded-xl border border-white/10 text-on-surface hover:bg-surface-variant transition-colors"
                >
                    <option value="">جميع الحالات</option>
                    <option value="START">بدء العمل</option>
                    <option value="EDITING">قيد المونتاج</option>
                    <option value="REVIEW">في انتظار المراجعة</option>
                    <option value="DELIVERED">تم التسليم</option>
                </select>

                <select
                    title="filter type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="flex-1 md:flex-none px-4 py-3 bg-surface-container-high rounded-xl border border-white/10 text-on-surface hover:bg-surface-variant transition-colors"
                >
                    <option value="">جميع الأنواع</option>
                    <option value="COMMERCIAL">إعلان</option>
                    <option value="DOCUMENTARY">وثائقي</option>
                    <option value="MOTION_GRAPHICS">موشن جرافيك</option>
                    <option value="MUSIC_VIDEO">فيديو موسيقي</option>
                    <option value="OTHER">أخرى</option>
                </select>

                <button
                    type="button"
                    onClick={() => { setSearch(""); setStatusFilter(""); setTypeFilter(""); }}
                    className="flex-1 md:flex-none px-4 py-3 bg-surface-container-high rounded-xl border border-white/10 hover:bg-surface-variant transition-colors"
                >
                    إعادة تعيين
                </button>
            </div>
        </GlassCard>
    );
};