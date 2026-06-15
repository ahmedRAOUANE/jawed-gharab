import { BiArrowBack } from "react-icons/bi";
import { Project, ProjectCard } from "../ui/admin.project-card";
import Link from "next/link";

const projects: Project[] = [
    {
        id: 1,
        title: "فيلم تجاري - علامة نايكم",
        stage: "تصحيح الألوان (Color Grading)",
        status: "قيد التنفيذ",
        statusType: "active",
        progress: 75,
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCjJ1MlDNKJiknTAC38xYyAPB5vwVMQM_XY2SWVfxNvjBssRdfxrGhAzoXO_FW0F7ie93-5ngNfa5j6ZmQRuzuOwxnLbJWV_pbWSUjE1OIPH8DptOk4dTbzfFoYFvb14AjGl5j-F6Cs-gd_dRxlAoAw7VTixG3Y8MPgwB94CNMAeA8u0kEnxdA-WtvOlH5YpuVjuQp3MKDH1zoSPP-4aSZlxVxp3qTtgpNqrW2qIb265GPHjyBGIsWImNkJsxd_pyBU-GkdW2ueyvY",
    },
    {
        id: 2,
        title: "فيديو موسيقي - فنان سحاب",
        stage: "اللمسات الأخيرة",
        status: "مراجعة العميل",
        statusType: "review",
        progress: 90,
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBy5893PTg867SkSPMOzzuDHN1mUfvLumkiq5zzZ241EHWm6z4EnfFqlBX4tkLKVCHzCzYYROgbluv5BK8L-oDQoXtTcfiSdvYPqT7YCAeskeq-JgoyzMGLqJrXRzfmlrHzjMfpMTGyn29Pm5CQG-1BTIp2dISIvyOkDCaZi9DcXymN5F14t7QxT2lQnG9v3KeVvsFfuPXMmzHV-5thc6awxga1lry3NWYxhqUa0swNpcykqG7Ta5jm9fj0a64-fIEmjgmJWyAxztg",
    },
    {
        id: 3,
        title: "وثائقي - رحلة في الصحراء",
        stage: "تجميع المقاطع (Rough Cut)",
        status: "بدء العمل",
        statusType: "start",
        progress: 15,
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA18FkxWbzBtEgR-sQ5eU8hZAeeOIhVwFjapQEsoLSXoQ1Ll5ODO1ELm-Le7RHtOGe5qvpzvQlxArOI2mcjWp9SAtSJeCoFVP4xtEDzgjAfn8IWLkhmFs8e2KB_CjBuq8vrr18jMjuvRLBDWaRK82X4uV7Qp00LmhQXYqyAsj3Zi2CijVNFcK0n1STmJmbmVtdZ54GlYDVOlDCoqRDNeVr4SE8D1ugCx6Pn5_nQGYCXeL3IvybFnicAmII2rDVFhfij4E-Vr7opzpQ",
    },
];

export const ActiveProjectsList = () => {
    return (
        <section className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                    المشاريع الجارية
                </h2>
                <Link href="/admin/project-management" className="text-primary font-label-md text-label-md flex items-center gap-2 hover:underline">
                    عرض الكل
                    {/* <span className="material-symbols-outlined text-sm">arrow_back_ios</span> */}
                    <BiArrowBack className="text-lg"/>
                </Link>
            </div>
            <div className="space-y-4">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
};