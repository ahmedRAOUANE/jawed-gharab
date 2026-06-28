"use client";

import { MdCancel, MdSave } from "react-icons/md";

export default function ProjectFormSkeleton () {
    const inputClass =
        "w-full rounded-xl border border-white/10 bg-surface-container px-4 py-3 text-transparent placeholder-transparent outline-none animate-pulse cursor-default";

    return (
        <form className="space-y-8">
            {/* Basic Information */}
            <div className="glass-card rounded-2xl p-8 space-y-6">
                <div className="h-7 w-44 rounded bg-white/10 animate-pulse" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        "عنوان المشروع",
                        "اسم العميل",
                        "نوع المشروع",
                        "الحالة",
                    ].map((label) => (
                        <div key={label} className="space-y-2">
                            <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />

                            {label === "نوع المشروع" || label === "الحالة" ? (
                                <select
                                    title="loding list"
                                    disabled
                                    className={inputClass}
                                    defaultValue=""
                                >
                                    <option />
                                </select>
                            ) : (
                                <input
                                    title="loading"
                                    disabled
                                    className={inputClass}
                                    placeholder=" "
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
                    <input
                        title="loading"
                        disabled
                        className={inputClass}
                        placeholder=" "
                    />
                </div>

                <div className="space-y-2">
                    <div className="h-4 w-20 rounded bg-white/10 animate-pulse" />
                    <textarea
                        title="loading"
                        disabled
                        rows={4}
                        className={`${inputClass} resize-none`}
                    />
                </div>
            </div>

            {/* Additional Details */}
            <div className="glass-card rounded-2xl p-8 space-y-6">
                <div className="h-7 w-40 rounded bg-white/10 animate-pulse" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((item) => (
                        <div key={item} className="space-y-2">
                            <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
                            <input
                                title="loading"
                                disabled
                                className={inputClass}
                                placeholder=" "
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-8 py-3 opacity-50 cursor-not-allowed"
                >
                    <MdCancel size={20} />
                    <span>إلغاء</span>
                </button>

                <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary-container px-8 py-3 text-on-primary-container opacity-50 cursor-not-allowed"
                >
                    <MdSave size={20} />
                    <span>جاري التحميل...</span>
                </button>
            </div>
        </form>
    );
};