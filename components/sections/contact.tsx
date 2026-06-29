"use client";

import ScrollReveal from "../providers/ScrollReveal";
import { MdEmail, MdWhatsapp } from "react-icons/md";

export default function ContactSection() {
    return (
        <section className="py-24 px-6 md:px-margin-desktop bg-surface-container-high rounded-t-[40px]">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <ScrollReveal>
                    <h2 className="font-display-lg-mobile text-display-lg-mobile md:text-headline-lg mb-6">
                        هل أنت جاهز لبدء مشروعك القادم؟
                    </h2>
                    <p className="text-on-surface-variant font-body-lg">
                        تواصل معنا اليوم لتحويل رؤيتك إلى واقع بصري مذهل.
                    </p>
                </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Info Cards */}
                <div className="space-y-8">
                    <ScrollReveal>
                        <div className="glass-card p-6 rounded-24 flex items-center gap-6 group hover:bg-primary/5 transition-colors cursor-pointer hover:scale-105 duration-300">
                            <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MdWhatsapp className="text-on-primary-container text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-headline-md">واتساب</h4>
                                <p className="text-on-surface-variant">+966 50 000 0000</p>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal>
                        <div className="glass-card p-6 rounded-24 flex items-center gap-6 group hover:bg-primary/5 transition-colors cursor-pointer hover:scale-105 duration-300">
                            <div className="w-14 h-14 bg-surface-container-highest rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MdEmail className="text-primary text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-headline-md">البريد الإلكتروني</h4>
                                <p className="text-on-surface-variant">contact@masteryvideo.com</p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section >
    );
}