import Image from "next/image";
import ScrollReveal from "../providers/ScrollReveal";

interface PortfolioItem {
    id: number;
    image: string;
    category: string;
    title: string;
    badge?: string;
    badgePosition?: "top-left" | "top-right";
}

const portfolioItems: PortfolioItem[] = [
    {
        id: 1,
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCRxpxigk5i7gbN_hi9bBx1LfAlf4y2-m16afQhqbJm2oj9vY9nupo-z_8xd5YqwKvqhemYhQRqxW07WDQCmsLZaFa6CLz7Z69-lmHIKqs_7KZvCa3fMYKIjHUbcrzKkGIcmT0eZxkvpOgo2Oq1LF0B9v770GBv0JAX361cbSD9VxyZhIjkEBQtCd-bZYACyFnXagWld0Bb3TKT7q2S6BlKlYpZIUqzAaFO9XYTTVDVzNA3kkzm4UyjRdUOiSwG0CeKAg17hOoRczo",
        category: "ADS & COMMERCIAL",
        title: "حملة إطلاق المنتج X",
        badge: "NEW",
        badgePosition: "top-right",
    },
    {
        id: 2,
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuArrzFVtgVfbGFS0mGWIY5r2eLUOtE_C_qmgRGOlzeX_v26_Tq6cgs--cZtqIZx1PzBitvSzp3JEFUxgamyE64OtmmZE_FRVAACFeCUzFVinUCbVeIYiMd_NFLc4J66kAkfk71i6LNuDGYUReL-nPi5TXKJf_Tm0Zi1AwWfKyvlzZbubr3rBEoXWPrQiDAyCJXWWOT_07-dqsYvbYZvOrw3CcEB_-H8V_EPWEwOII5gvvtozSXwjI3uSQvb0d6ccJ26LghSCA8914U",
        category: "COLOR GRADING",
        title: "تصحيح ألوان احترافي",
        badge: "Before / After",
        badgePosition: "top-left",
    },
    {
        id: 3,
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ0Nps5Imr_WH4kBxlapI8-cXl406lRgqDapOhk3wLubU9cqVKHjhsHhRfb4BpzJrWqIKQdgVcSGAgvzoMrA_DpL4kUM4EL56kpwv9j_fuoPyntHho-cBxMDMs0WShgQ0NLftmGCD1pi3TTzGSwBQcN_rBIEU39piRhShIRcSrzj3MjTyMyeuF7GjGC1hiDiDs2Oy7C9ERGjQSBW6pBU7hio2hEvJ7-zdorLSGjQkPL167FSeDNSwXHRzJTRNebDSp63BVE9LPPXM",
        category: "REELS",
        title: "مجموعة ريلز تيك توك",
    },
    {
        id: 4,
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBHuD5ZUo8Nr-X9z1DEq-YQmxJB6dGWoyxBCR0YsgzJceJLq8Sg1k7tORLluRG2ns0V1ZsGyj61yt0MbpfXzTDP2VssoJjDpPimX9ahkbqAs3KhW-NOGOGyxu7Gg0rddIzywItHHOkdeZt9XrV1IOXiUA1jVwhSGDiInsjJVRr5N0-Ifm9kliZ7lBwld4rYxcd8XQIIYQMCeBmKdLd8JNXDkF-1MG2iENg_RxuIKmiMhEF4j7hf8gbwJfoKectgRTIjADD6QGyrcps",
        category: "YOUTUBE",
        title: "وثائقي رحلة رائد أعمال",
    },
];

const PortfolioCard = ({ item }: { item: PortfolioItem }) => {
    return (
        <div className="group relative rounded-24 overflow-hidden glass-card h-80 hover:scale-[1.02] transition-transform duration-500">
            <Image
                height={100}
                width={100}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={item.title}
                src={item.image}
                unoptimized // reomve this for better performance
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                <span className="text-primary font-label-md text-label-md mb-2">
                    {item.category}
                </span>
                <h3 className="text-on-background font-headline-md">{item.title}</h3>
            </div>
            {/* Badge */}
            {item.badge && (
                <div
                    className={`absolute ${item.badgePosition === "top-left" ? "top-4 left-4" : "top-4 right-4"
                        } ${item.badge === "Before / After"
                            ? "glass-card px-4 py-2 rounded-xl text-xs font-bold border border-white/20"
                            : "bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-on-primary"
                        }`}
                >
                    {item.badge}
                </div>
            )}
        </div>
    );
};

export default function PortfolioSection() {
    return (
        <section className="py-24 px-6 md:px-margin-desktop bg-surface-container/30 backdrop-blur-sm">
            <div className="mb-16">
                <ScrollReveal>
                    <h2 className="font-headline-lg text-headline-lg">معرض الأعمال</h2>
                    <p className="text-on-surface-variant font-body-md mt-2">
                        مختارات من مشاريعنا الأخيرة
                    </p>
                </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {portfolioItems.map((item) => (
                    <ScrollReveal key={item.id}>
                        <PortfolioCard item={item} />
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}