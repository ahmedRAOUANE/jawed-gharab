"use client";

interface FilterButtonsProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

const filters = ["الكل", "جديد", "قيد الانتظار", "تم التواصل"];

export const FilterButtons = ({ activeFilter, onFilterChange }: FilterButtonsProps) => {
    return (
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
            {filters.map((filter) => (
                <button
                    type="button"
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={`cursor-pointer px-6 py-2 rounded-full text-label-md transition-all active:scale-95 ${activeFilter === filter
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