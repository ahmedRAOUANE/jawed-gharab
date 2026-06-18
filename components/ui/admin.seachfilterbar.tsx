"use client";

import { useState } from "react";
import { MdSearch, MdFilterList, MdSort } from "react-icons/md";
import GlassCard from "./GlassCard";
import { bold } from "next/dist/lib/picocolors";

export const SearchFilterBar = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <GlassCard className="p-4 rounded-3xl mb-12 flex flex-col md:flex-row gap-4 items-center text-xl hover:shadow-xl transition-all hover:-translate-y-0.5">
            <div className="relative w-full md:flex-1">
                <MdSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-primary-container focus:border-primary transition-all text-on-surface placeholder:text-on-surface-variant/50"
                    placeholder="بحث عن مشروع أو عميل..."
                />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                <button type="button" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 cursor-pointer bg-surface-container-high rounded-xl border border-white/10 hover:bg-surface-variant transition-colors">
                    <MdFilterList size={24} />
                    <span className="font-label-md">تصفية</span>
                </button>

                <button type="button" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 cursor-pointer bg-surface-container-high rounded-xl border border-white/10 hover:bg-surface-variant transition-colors">
                    <MdSort size={24} />
                    <span className="font-label-md">ترتيب</span>
                </button>
            </div>
        </GlassCard>
    );
};