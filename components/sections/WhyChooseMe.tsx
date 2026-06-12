import Image from "next/image";
import ScrollReveal from "../providers/ScrollReveal";
import {
    MdAnalytics,
    MdAnchor,
    MdGroups,
    MdSpeed,
    MdChatBubble,
    MdZoomIn,
} from "react-icons/md";

const features = [
    {
        icon: MdAnalytics,
        title: "Retention",
        description: "نركز على إبقاء المشاهد للنهاية.",
    },
    {
        icon: MdAnchor,
        title: "Hooks",
        description: "افتتاحيات قوية تجذب الانتباه فوراً.",
    },
    {
        icon: MdGroups,
        title: "Engagement",
        description: "تفاعل حقيقي مع كل ثانية من الفيديو.",
    },
    {
        icon: MdSpeed,
        title: "Fast Delivery",
        description: "التزام تام بالمواعيد النهائية.",
    },
    {
        icon: MdChatBubble,
        title: "Communication",
        description: "تواصل شفاف ودائم طوال المشروع.",
    },
    {
        icon: MdZoomIn,
        title: "Detail-oriented",
        description: "اهتمام دقيق بأصغر تفاصيل المونتاج.",
    },
];

export default function WhyChooseMe() {
    return (
        <section className="py-24 px-6 md:px-margin-desktop">
            <div className="flex flex-col md:flex-row items-center gap-12">
                {/* Left column: text and features grid */}
                <div className="w-full md:w-1/2">
                    <ScrollReveal>
                        <h2 className="font-headline-lg text-headline-lg mb-8">
                            لماذا تختار العمل معي؟
                        </h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <ScrollReveal key={index}>
                                <div className="flex items-start gap-4 hover:translate-x-[-8px] transition-transform duration-300">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <feature.icon className="text-primary text-xl" />
                                    </div>

                                    <div>
                                        <h4 className="font-headline-md text-sm mb-1">
                                            {feature.title}
                                        </h4>

                                        <p className="text-on-surface-variant text-body-md">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>

                {/* Right column: image */}
                <div className="w-full md:w-1/2 relative rounded-24 overflow-hidden shadow-2xl">
                    <ScrollReveal>
                        <Image
                            unoptimized // reomve this for better performance
                            loading="eager"
                            height={100}
                            width={100}
                            className="w-full h-100 object-cover hover:scale-110 transition-transform duration-700"
                            alt="An organized and aesthetic minimalist workspace for a video editor featuring a high-resolution wide monitor displaying a complex video editing timeline. The desk is clean with a professional mouse and keyboard. The ambient room lighting is low and sophisticated, featuring soft blue backlighting that emphasizes a high-end, productive creative atmosphere."
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF5P6uJEpPtMJbD2g78PSCbHdLMOf70gEE2srvziuZTXQ498236jWPUol9FMqXMQeMWst2vbWWGJ4YrlGqb5ecPkzZySPRk08qhAcWUh0826FH_wMGNABv39FQWM_0tD1_naCB4Skl8s2bTqpSxQrLwfXinx3HP5BhDAcjL5ty3qIIqWkB_247JzesQqzXKNLLD6m10Qcpldd_il2AHBJSg-VChKwono7_1a1I7OIfcZYTbQrHF_ng59tnlyger0OS9aZ2BGGmFQY"
                        />
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}