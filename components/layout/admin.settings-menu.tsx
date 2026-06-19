import Link from "next/link";
import {
    MdManageAccounts,
    MdLockReset,
    MdChevronLeft,
} from "react-icons/md";

interface MenuItem {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
    href: string;
}

const menuItems: MenuItem[] = [
    {
        id: "account",
        icon: MdManageAccounts,
        title: "إعدادات الحساب",
        description: "البريد الإلكتروني، اللغة، والمنطقة",
        href: "settings/account",
    },
    // {
    //     id: "notifications",
    //     icon: MdNotificationsActive,
    //     title: "تفضلات الإشعارات",
    //     description: "إشعارات البريد، التطبيق، والرسائل",
    //     href: "#",
    // }, // TODO: this feature will be added later
    {
        id: "security",
        icon: MdLockReset,
        title: "تغيير كلمة المرور",
        description: "تحديث كلمة السر وإعدادات الأمان",
        href: "settings/password",
    },
];

export const SettingsMenu = () => {
    return (
        <div className="rounded-2xl overflow-hidden bg-surface border border-primary/20">
            <nav className="flex flex-col">
                {menuItems.map((item, index) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center justify-between p-6 hover:bg-white/5 transition-all group ${index < menuItems.length - 1 ? "border-b border-primary/20" : ""
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <item.icon size={24} />
                            </div>

                            <div className="flex flex-col">
                                <span className="font-headline-md text-[18px] text-on-surface group-hover:text-primary transition-colors">
                                    {item.title}
                                </span>

                                <span className="font-caption text-caption text-on-surface-variant">
                                    {item.description}
                                </span>
                            </div>
                        </div>

                        <MdChevronLeft className="text-on-surface-variant opacity-40 group-hover:translate-x-[-8px] transition-transform" size={24} />
                    </Link>
                ))}
            </nav>
        </div>
    );
};