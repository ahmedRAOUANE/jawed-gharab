import ScrollReveal from "../providers/ScrollReveal";
import GlassCard from "../ui/GlassCard";
import { MdFormatQuote } from "react-icons/md";

interface Testimonial {
    id: number;
    quote: string;
    initials: string;
    name: string;
    role: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote:
            "العمل مع Mastery كان نقلة نوعية في محتوى وكالتنا. الاهتمام بالتفاصيل وسرعة التسليم كانت مذهلة فعلاً.",
        initials: "أ.ع",
        name: "أحمد علي",
        role: "مدير وكالة Creative Flow",
    },
    {
        id: 2,
        quote:
            "أفضل مونتير تعاملت معه للفيديوهات القصيرة. استطاع تحويل أفكارنا إلى واقع بصري مبهر زاد من تفاعلنا بنسبة ٤٠٪.",
        initials: "س.م",
        name: "سارة محمود",
        role: "صانعة محتوى تعليمي",
    },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    return (
        <GlassCard hoverScale className="p-10 rounded-24 flex-1 relative">
            <MdFormatQuote className="text-primary/20 text-6xl absolute top-6 left-6" />
            <p className="text-on-background font-body-lg mb-8 italic">
                {testimonial.quote}
            </p>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {testimonial.initials}
                </div>
                <div>
                    <h5 className="font-headline-md text-sm">{testimonial.name}</h5>
                    <p className="text-on-surface-variant text-xs">{testimonial.role}</p>
                </div>
            </div>
        </GlassCard>
    );
};

export default function TestimonialsSection() {
    return (
        <section className="py-24 px-6 md:px-margin-desktop overflow-hidden">
            <h2 className="font-headline-lg text-headline-lg mb-16 text-center">
                <ScrollReveal>آراء عملائنا</ScrollReveal>
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
                {testimonials.map((testimonial) => (
                    <ScrollReveal key={testimonial.id}>
                        <TestimonialCard testimonial={testimonial} />
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}