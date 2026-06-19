// src/components/admin/settings/LogoutCard.tsx
"use client";

import { MdLogout } from "react-icons/md";

export const LogoutCard = () => {
    const handleLogout = () => {
        // Implement logout logic (clear session, redirect, etc.)
        console.log("Logging out...");
        // Redirect to login page or perform API call
    };

    return (
        <div className="glass-card rounded-2xl p-6 border-error/20 flex items-center justify-between">
            <div>
                <h3 className="font-headline-md text-[18px] text-on-surface mb-1">
                    تسجيل الخروج
                </h3>
                <p className="font-caption text-caption text-on-surface-variant">
                    سيتم إنهاء جلسة العمل الحالية على هذا الجهاز
                </p>
            </div>

            <button
                onClick={handleLogout}
                className="cursor-pointer py-3 px-8 bg-on-error text-error font-label-md text-label-md rounded-xl hover:bg-on-error/90 transition-all hover:text-white flex items-center gap-2 group"
            >
                <MdLogout className="text-[20px] transition-transform group-hover:-translate-x-1" />
                خروج
            </button>
        </div>
    );
};