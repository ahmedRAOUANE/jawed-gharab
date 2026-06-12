import ScrollReveal from "../providers/ScrollReveal";
import GlassCard from "../ui/GlassCard";

const steps = [
    {
        step: 1,
        title: "١. استلام الخام",
        description:
            "نستلم جميع المقاطع والصوتيات الخاصة بك ونقوم بتنظيمها بشكل احترافي.",
    },
    {
        step: 2,
        title: "٢. المونتاج",
        description:
            "تطبيق القصة البصرية، القص، وإضافة المؤثرات البصرية والصوتية المناسبة.",
    },
    {
        step: 3,
        title: "٣. المراجعة",
        description:
            "نشاركك النسخة الأولية لاستقبال ملاحظاتك وتعديلها حتى نصل للكمال.",
    },
    {
        step: 4,
        title: "٤. التسليم النهائي",
        description:
            "تسليم الفيديو بأعلى جودة ممكنة وبالصيغ المطلوبة لجميع المنصات.",
    },
];

export default function ProcessTimeline() {
    return (
        <section className="py-24 px-6 md:px-margin-desktop bg-surface-container-lowest/50 backdrop-blur-sm">
            <div className="mb-16 text-center">
                <ScrollReveal>
                    <h2 className="font-headline-lg text-headline-lg">رحلة مشروعك</h2>
                    <p className="text-on-surface-variant font-body-md mt-2">
                        من الفكرة إلى التسليم النهائي
                    </p>
                </ScrollReveal>
            </div>
            <div className="relative max-w-2xl mx-auto">
                {/* Vertical line */}
                <div className="absolute right-8 top-0 h-full w-1 bg-primary/20 rounded-full"></div>

                <div className="space-y-12">
                    {steps.map((step) => (
                        <ScrollReveal key={step.step}>
                            <div className="relative pr-20">
                                {/* Timeline dot */}
                                <div className="absolute right-6 top-0 w-5 h-5 bg-primary rounded-full border-4 border-surface shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                                {/* Card */}
                                <GlassCard
                                    hoverScale={false}
                                    className="p-6 rounded-24 hover:-translate-x-2.5 transition-transform duration-300"
                                >
                                    <h4 className="font-headline-md text-primary mb-2">
                                        {step.title}
                                    </h4>
                                    <p className="text-on-surface-variant text-body-md">
                                        {step.description}
                                    </p>
                                </GlassCard>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}