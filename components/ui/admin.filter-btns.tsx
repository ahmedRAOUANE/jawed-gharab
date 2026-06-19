"use client";

import { useState } from "react";

// const filters = ["الكل", "قيد الانتظار", "تم التواصل"]; // TODO: this feature will be added in the future
const filters = ["الكل"];

export const FilterButtons = () => {
    const [activeFilter, setActiveFilter] = useState("الكل");

    return (
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
            {filters.map((filter) => (
                <button
                    type="button"
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-6 py-2 rounded-full text-label-md transition-all active:scale-95 ${activeFilter === filter
                            ? "bg-primary-container text-on-primary-container"
                            : "glass-card text-on-surface-variant hover:text-primary"
                        }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};