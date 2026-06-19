import { Lead, LeadCard } from "@/components/layout/admin.lead-card";
import { FilterButtons } from "@/components/ui/admin.filter-btns";
import { StatsCard } from "@/components/ui/admin.stats-card";

// Mock data - in real app, fetch from API
const leadsData: Lead[] = [
    {
        id: 1,
        name: "أحمد العمري",
        type: "إنتاج وثائقي",
        date: "١٢ مايو ٢٠٢٤",
        details:
            "نبحث عن شريك لإنتاج سلسلة وثائقية قصيرة (٣ حلقات) تسلط الضوء على الحرف اليدوية في المناطق الجبلية. نحتاج إلى تصوير سينمائي عالي الجودة ومونتاج احترافي يتناسب مع هوية المشروع.",
        budget: "١٥,٠٠٠ - ٢٠,٠٠٠ ريال سعودي",
        status: "جديد",
        icon: "person",
    },
    {
        id: 2,
        name: "شركة نجد للتطوير",
        type: "فيديو إعلاني",
        date: "١٠ مايو ٢٠٢٤",
        details:
            "تصوير فيديو ترويجي للمجمع السكني الجديد 'فلل الريم'. التركيز على الرفاهية والمساحات الخضراء. نحتاج إلى استخدام طائرات الدرون في التصوير.",
        location: "الرياض، المملكة العربية السعودية",
        status: "قيد الانتظار",
        icon: "business",
    },
    {
        id: 3,
        name: "سارة منصور",
        type: "تعديل وتلوين",
        date: "٠٨ مايو ٢٠٢٤",
        details:
            "لدي مادة خام تم تصويرها بكاميرا RED ونحتاج إلى خبير تلوين (Colorist) لإعطاء الفيديو طابعاً سينمائياً دافئاً. طول المادة حوالي ٥ دقائق.",
        deadline: "٢٠ مايو ٢٠٢٤ (عاجل)",
        status: "تم التواصل",
        icon: "movie",
    },
];

export default function LeadsPage() {
    return (
        <main className="pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-32">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-4">
                        إدارة الطلبات
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                        تتبع وراقب تقدم أعمالك السينمائية مع لوحة التحكم المتقدمة. قم بإدارة
                        كل تفاصيل الإنتاج من هنا.
                    </p>
                </div>
                <div className="flex gap-2 items-start">
                    <StatsCard
                        label="اجمالي الطلبات"
                        value="24"
                    />
                    <StatsCard
                        label="الطلبات الجديدة"
                        value="12"
                    />
                </div>
            </div>

            {/* Filter Buttons */}
            <FilterButtons />

            {/* Leads List */}
            <div className="space-y-4">
                {leadsData.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
            </div>
        </main>
    );
}