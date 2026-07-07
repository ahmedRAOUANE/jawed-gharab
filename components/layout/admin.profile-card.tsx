"use client";

import Image from "next/image";
import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

interface ProfileCardProps {
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
    accountStatus: string;
    profileProgress: number;
}

export const ProfileCard = ({
    name,
    email,
    role,
    avatarUrl,
    accountStatus,
    profileProgress,
}: ProfileCardProps) => {
    return (
        <div className="bg-surface border border-primary/20 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-500 hover:border-white/20">
            <div className="relative mb-6 group">
                <div className="flex items-center justify-center w-32 aspect-square rounded-full overflow-hidden border-2 border-primary/50 p-1 group-hover:border-primary transition-all duration-300">
                    {avatarUrl ? (
                        <Image
                            width={128}
                            height={128}
                            src={avatarUrl}
                            alt={name}
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <FaRegUserCircle size={144} />
                    )}
                </div>

                <Link
                    href="/admin/settings/profile"
                    className="absolute bottom-1 right-1 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all"
                >
                    <MdEdit size={18} />
                </Link>
            </div>

            <h2 className="font-headline-md text-headline-md text-on-surface mb-1">
                {name}
            </h2>

            <p className="font-label-md text-label-md text-primary mb-1">{role}</p>
            <p className="font-caption text-caption text-on-surface-variant mb-6">
                {email}
            </p>

            <Link
                href="/admin/settings/profile"
                className="w-full py-4 px-6 bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:bg-opacity-90 active:scale-95 transition-all duration-200 text-center"
            >
                تعديل الملف الشخصي
            </Link>

            {/* Status Summary */}
            <div className="w-full mt-4 bg-background/70 border border-primary/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-label-md text-label-md text-on-surface-variant">
                        حالة الحساب
                    </span>

                    <span className="flex items-center gap-2 text-emerald-400 font-label-md text-label-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        {accountStatus}
                    </span>
                </div>

                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary"
                        style={{ width: `${profileProgress}%` }}
                    ></div>
                </div>

                <p className="mt-2 font-caption text-caption text-on-surface-variant">
                    اكتمال الملف: {profileProgress}%
                </p>
            </div>
        </div>
    );
};