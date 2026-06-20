import { InfoCards } from "@/components/layout/admin.info-cards";
import { LogoutCard } from "@/components/layout/admin.logout-card";
import { ProfileCard } from "@/components/layout/admin.profile-card";
import { SettingsMenu } from "@/components/layout/admin.settings-menu";

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchUserProfile() {
    try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch user profile");
        }

        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        // Return fallback/default data
        return null;
    }
}

export default async function SettingsPage() {
    const user = await fetchUserProfile();

    // Default/fallback data if API fails
    const userData = user || {
        name: "أحمد المنصور",
        email: "admin@jawedgharab.com",
        role: "ADMIN",
        avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB8amvLXePbS1IZORTo1vCf4QByU1UWsK58dHIk4g74Nq74i7cjkDHBViX86MXV7OWQveqkfh1eVU-VXWfuR4SH5ToVNTuG0qtEPZFgwYY7Wi9h2L7a34ZpxhOoF4z1RcumFetArepUdaFbwYLU-pBORnt-kRUbmCUV59jT4d8tKeAlO9keOZICoySEd2KoMn31nKMsYdojAKPUEkuvgax9qFOReIbpdKpnk0QSKguvq6Bedm3FifHoPQ571CBeXk4CcQlINfNJxUo",
        accountStatus: "نشط",
        profileProgress: 80,
        lastLogin: new Date().toLocaleString("ar-SA"),
    };

    // Map user role to Arabic display name
    const roleMap: Record<string, string> = {
        ADMIN: "مدير النظام",
        DIRECTOR: "مخرج فني",
        EDITOR: "محرر فيديو",
        VIEWER: "مشاهد",
    };

    const displayRole = roleMap[userData.role] || userData.role;

    // Format last login
    const lastLoginFormatted = userData.lastLogin
        ? new Date(userData.lastLogin).toLocaleString("ar-SA", {
            dateStyle: "medium",
            timeStyle: "short",
        })
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
                    <ProfileCard
                        name={userData.name}
                        email={userData.email}
                        role={displayRole}
                        avatarUrl={userData.avatarUrl || "/default-avatar.png"}
                        accountStatus={userData.accountStatus || "نشط"}
                        profileProgress={userData.profileProgress || 0}
                    />
                </div>

                {/* Settings Actions Column */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <SettingsMenu />
                    <LogoutCard />
                    <InfoCards
                        version="v2.4.0 (Mastery Suite)"
                        lastLogin={lastLoginFormatted}
                    />
                </div>
            </div>
        </main>
    );
}