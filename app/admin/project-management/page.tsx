// import { ProjectStats } from "@/components/admin/ProjectStats";
// import { SearchFilterBar } from "@/components/admin/SearchFilterBar";
// import { ProjectCard } from "@/components/admin/ProjectCard";
// import { AddProjectCard } from "@/components/admin/AddProjectCard";
// import { AddProjectButton } from "@/components/admin/AddProjectButton";

import { AddProjectButton } from "@/components/layout/admin.add-project-btn";
import { Project, ProjectCard } from "@/components/ui/admin.project-card";
import { SearchFilterBar } from "@/components/ui/admin.seachfilterbar";
import { StatsCard } from "@/components/ui/admin.stats-card";

// Mock data for projects
const projects: Project[] = [
    {
        id: 1,
        title: "إعلان بنك المشرق 2024",
        client: "بنك المشرق - دبي",
        status: "قيد المونتاج",
        statusType: "editing",
        lastUpdated: "منذ ساعتين",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCS0AHtiijZU-nK9qQMyYyv10gjUc4-AUIxCBI3BIixQjzBcAtdQ1jaV0e4dl1UrkKqQAShWK2A2g4U5MXo-o7Q6H9epTVkEXTtW2hGAS3wL1Rb_6QoyPDQmEGVktOTBQ2Hv7JR4ZBw-nDHhEzmZ3cmk7eSoShoy6sKdkSfZglnl0JtH7b69Y8fjKzbKP2VaSvM8he8rTWf-ANiO0nRZcEffXiyDkx53ECzQ6CEjBhuaaxTRx0zoIpvSF8OoC-AjBdDzeojmUi2P0E",
        team: [
            { initials: "MK", bgColor: "bg-surface-variant" },
            { initials: "JD", bgColor: "bg-primary-container" },
        ],
    },
    {
        id: 2,
        title: "فيلم وثائقي: رمال الأمل",
        client: "وزارة الثقافة",
        status: "في انتظار المراجعة",
        statusType: "review",
        lastUpdated: "أمس",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCF3tkEvSoGsmrP1yzUj_8IE8Hh4pNE55wPXP54awpH3VRof3OihLPcQU9c_4rmiAPQQFT-_hj-QdZB6K54DdapgOW5CKxiSKnI8ZLKrU7K7wSCfwHYR1-iUw0x-ee7WnAa1uGmQqea0o64TT6rBDY_8vCfa_9p7gHtSQi7avL-u_uw872wExoL29tMp4PzdrRaqRG9MEosAKbZqxc4TaYZGpfGxgem8EJBI1pBW0fBWx_ww_EU5zfjZQn1YM9KENRZ9w4SHUvOETA",
        team: [{ initials: "AS", bgColor: "bg-secondary text-on-secondary" }],
    },
    {
        id: 3,
        title: "موشن جرافيك: منصة أريد",
        client: "أريد للاتصالات",
        status: "تم التسليم",
        statusType: "delivered",
        lastUpdated: "منذ 3 أيام",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDD8oMJSLT7sLfoMX6UlN2uqMkE2Vt4F9g8IQ0X9E5IVyOI1EVyhMS3rJMT8MWeeD390pxFQ_lvI5zI0wcmO3YjfWPD19PxflqnUXx2wXYOhfQBQzk0XvrHm7T94vz0Jv7eDT4o0EkqsAw1kP03esesjYJy_DEmrKa4kA-i0vJvdpJrUymK4qVANY30HembL8c_cNL6v6paBWbhtMC1ZNgFTcWiXPsr2s6mMkNc_ah9ywjfEdyeyWsKuTurqTel-CA9vtPFSPctPh8",
        team: [
            { initials: "OS", bgColor: "bg-surface-variant" },
            { initials: "TY", bgColor: "bg-primary-container" },
        ],
    },
    {
        id: 4,
        title: "موشن جرافيك: منصة أريد",
        client: "أريد للاتصالات",
        status: "تم التسليم",
        statusType: "delivered",
        lastUpdated: "منذ 3 أيام",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDD8oMJSLT7sLfoMX6UlN2uqMkE2Vt4F9g8IQ0X9E5IVyOI1EVyhMS3rJMT8MWeeD390pxFQ_lvI5zI0wcmO3YjfWPD19PxflqnUXx2wXYOhfQBQzk0XvrHm7T94vz0Jv7eDT4o0EkqsAw1kP03esesjYJy_DEmrKa4kA-i0vJvdpJrUymK4qVANY30HembL8c_cNL6v6paBWbhtMC1ZNgFTcWiXPsr2s6mMkNc_ah9ywjfEdyeyWsKuTurqTel-CA9vtPFSPctPh8",
        team: [
            { initials: "OS", bgColor: "bg-surface-variant" },
            { initials: "TY", bgColor: "bg-primary-container" },
        ],
    },
];

export default function ProjectManagementPage() {
    return (
        <main className="pt-32 pb-40 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-4">
                        إدارة المشاريع
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                        تتبع وراقب تقدم أعمالك السينمائية مع لوحة التحكم المتقدمة. قم بإدارة
                        كل تفاصيل الإنتاج من هنا.
                    </p>
                </div>
                <div className="flex gap-2 items-start">
                    <StatsCard
                        label="المشاريع النشطة"
                        value="24"
                    />
                    <StatsCard
                        label="قيد المراجعة"
                        value="12"
                    />
                </div>
            </div>

            {/* Search & Filter Bar */}
            <SearchFilterBar />

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} className="flex-col" largeImg />
                ))}
                {/* <AddProjectCard /> */}
            </div>

            {/* Floating Action Button */}
            <AddProjectButton />
        </main>
    );
}