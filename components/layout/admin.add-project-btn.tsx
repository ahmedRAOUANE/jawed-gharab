import Link from "next/link";
import { MdAdd } from "react-icons/md";

export const AddProjectButton = () => {
    return (
        <Link href={"project-management/add-project"} className="cursor-pointer fixed bottom-10 right-10 md:bottom-12 md:right-12 flex items-center gap-3 bg-primary-container text-on-primary-container px-6 py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all z-60 group">
            <MdAdd size={20} className="font-bold" />
            <span className="font-label-md">إضافة عمل جديد</span>
        </Link>
    );
};