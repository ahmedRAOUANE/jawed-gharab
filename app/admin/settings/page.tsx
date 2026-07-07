"use client";

import { InfoCards } from "@/components/layout/admin.info-cards";
import { LogoutCard } from "@/components/layout/admin.logout-card";
import { ProfileCard } from "@/components/layout/admin.profile-card";
import { SettingsMenu } from "@/components/layout/admin.settings-menu";
import { useAuth } from "@/components/providers/AuthProvider";
import { ProfileCardSkeleton } from "@/components/ui/admin.profile-card-skeleton";
import { UserRole } from "@prisma/client";

export default function SettingsPage() {
    const { user, loading, logout } = useAuth();

    if (!user) return;

    // Default/fallback data if API fails
    const userData = user;

    // Map user role to Arabic display name
    const roleMap: Record<UserRole, string> = {
        ADMIN: "مدير النظام",
        DIRECTOR: "مخرج فني",
        EDITOR: "محرر فيديو",
        VIEWER: "مشاهد",
    };

    const displayRole = roleMap[userData.role as UserRole] || userData.role;

    // Format last login
    const lastLoginFormatted = userData.lastLogin
        ? new Date(userData.lastLogin).toLocaleString()
        : "لم يتم تسجيل الدخول بعد";

    return (
        <main className="min-h-screen pt-32 pb-40 px-6 md:px-margin-desktop max-w-container-max mx-auto">
            {/* Header Section */}
            <section className="mb-12">
                <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">
                    الإعدادات
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant opacity-70">
                    إدارة حسابك وتفضيلات المنصة
                </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                {/* Profile Column */}
                <div className="lg:col-span-4 flex flex-col gap-unit">
                    {loading ? (
                        <ProfileCardSkeleton />
                    ) : (
                        <ProfileCard
                        name={userData.name}
                        email={userData.email}
                        role={displayRole}
                        accountStatus={userData.accountStatus || "نشط"}
                        profileProgress={userData.profileProgress || 0}
                    />
                    )}
                </div>

                {/* Settings Actions Column */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <SettingsMenu />
                    <LogoutCard onlogout={logout} />
                    <InfoCards
                        version="v2.4.0 (Mastery Suite)"
                        lastLogin={lastLoginFormatted}
                    />
                </div>
            </div>
        </main>
    );
}