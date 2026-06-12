"use client";

import { useState } from "react";
import ScrollReveal from "../providers/ScrollReveal";
import { MdEmail, MdWhatsapp } from "react-icons/md";

export default function ContactSection() {
    const [formData, setFormData] = useState({
        fullName: "",
        projectType: "ريلز / تيك توك",
        details: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted:", formData);
        alert("تم استلام طلبك! سنتواصل معك قريباً.");
    };

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

                {/* Contact Form */}
                <ScrollReveal>
                    <form onSubmit={handleSubmit} className="glass-card p-8 rounded-24 space-y-6">
                        <div>
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                الاسم بالكامل
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-background focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                                placeholder="أدخل اسمك هنا"
                            />
                        </div>

                        <div>
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                نوع المشروع
                            </label>
                            <select
                                title="project type"
                                name="projectType"
                                value={formData.projectType}
                                onChange={handleChange}
                                className="cursor-pointer w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-background focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                            >
                                <option>ريلز / تيك توك</option>
                                <option>فيديو إعلاني</option>
                                <option>يوتيوب</option>
                                <option>أخرى</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                تفاصيل إضافية
                            </label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-on-background focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all h-32"
                                placeholder="اشرح لنا فكرتك..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="cursor-pointer w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-xl active:scale-95 hover:scale-[1.02] transition-all"
                        >
                            إرسال الطلب
                        </button>
                    </form>
                </ScrollReveal>
            </div>
        </section>
    );
}