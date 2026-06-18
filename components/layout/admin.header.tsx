"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdNotifications } from "react-icons/md";

export const AdminHeader = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-primary-container/10 flex flex-row-reverse justify-between items-center px-gutter h-20 transition-all duration-300 ${scrolled ? "scrolled" : ""
                }`}
            id="main-nav"
        >
            <div className="flex items-center gap-4">
                <div className="text-headline-md font-headline-md font-bold tracking-tighter text-primary">
                    Djawad GH
                </div>
            </div>
            
            <nav className="hidden md:flex flex-row-reverse items-center gap-8">
                <Link href="/admin/settings" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all duration-300">
                    الإعدادات
                </Link>

                <Link href="/admin/requests" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all duration-300">
                    الطلبات
                </Link>

                <Link href="/admin/project-management" className="font-label-md text-label-md text-primary font-bold transition-all duration-300">
                    إدارة المشاريع
                </Link>

                <Link href="/admin/" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all duration-300">
                    التقارير
                </Link>
            </nav>

            <div className="flex items-center gap-4">
                <button type="button" title="notification" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary-container/20 transition-colors">
                    <MdNotifications size={20} />
                </button>

                <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
                    <Image
                        height={100}
                        width={100}
                        alt="Admin"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5qpYbp919vE-5hQeM7K7ri4-NuagZOcKPgkM2Dzuoubr4z2i66NjSl-P8S0hUHhOgAmzig5vvBoq06yRswOYXGu0OC2PbhwTyCEYdp03nBoTenANudkrtS96T-bVjsaQErKikd90NfIKbApZPk2rhBMnqLLH7sPHZXgvytAGKmmA_PTdsQ4oZ-MEyXLGvO_tiJDZlq3Z3u6stLWQVxMLpBZCCbULOWIIreP9LwahbyYiqcNco34YVhbRoj0K98WSLvG_u8Cj2FU4"
                    />
                </div>
            </div>
        </header>
    );
};