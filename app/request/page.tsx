"use client";

import ScrollReveal from '@/components/providers/ScrollReveal';
import { FormField } from '@/components/ui/form-field';
import { RequestCreateInput } from '@/lib/validation';
import { ProjectType } from '@prisma/client';
import { SubmitEventHandler, useState } from 'react';

const projectTypeOptions = [
    {
        value: ProjectType.COMMERCIAL,
        label: "إعلان",
    },
    {
        value: ProjectType.DOCUMENTARY,
        label: "فيلم وثائقي",
    },
    {
        value: ProjectType.MOTION_GRAPHICS,
        label: "موشن جرافيك",
    },
    {
        value: ProjectType.MUSIC_VIDEO,
        label: "فيديو موسيقي",
    },
    {
        value: ProjectType.OTHER,
        label: "أخرى",
    },
];

const initialRequest: RequestCreateInput = {
    name: "",
    email: "",
    type: "COMMERCIAL",
    details: "",
    budget: "",
    location: "",
    deadline: "",
}

const RequestPage = () => {
    const [formData, setFormData] = useState<RequestCreateInput>(initialRequest);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        setError(null);

        if (!acceptedTerms) {
            setError("يجب الموافقة على الشروط والأحكام قبل إرسال الطلب.");
            return;
        }
        
        setLoading(true);
        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                body: JSON.stringify(formData)
            })
            if (!res.ok) {
                setError("لم نستطع ارسال طلبك حاليا, يرجى اعادة المحاولة لاحقا");
            }

            setFormData(initialRequest);
            setAcceptedTerms(false);
        } catch {
            setError("حدث خطأ غير متوقع، يرجى إعادة المحاولة.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-4">
                        اطلب مشروعك الان
                    </h1>
                </div>
            </div>

            {error && (
                <div>
                    <p>{error}</p>
                </div>
            )}

            <ScrollReveal>
                <form onSubmit={handleSubmit} className="glass-card p-8 rounded-24 space-y-6">
                    <FormField
                        label="الاسم يالكامل"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="أدخل اسمك هنا"
                    />

                    <FormField
                        label="ايميل"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="ادخل الايميل هنا"
                    />

                    <div className="flex gap-3">
                        <FormField
                            className="flex-1"
                            label="نوع المشروع"
                            type="select"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            placeholder="ادخل نوع مشروعك"
                            options={projectTypeOptions}
                        />

                        <FormField
                            className="flex-1"
                            label="الموقع الجغرافي"
                            type="text"
                            name="location"
                            value={formData.location || ""}
                            onChange={handleChange}
                            placeholder="ادخل موقعك الجغرافي في حال كان متاحا"
                        />
                    </div>

                    <div className="flex gap-3 w-full">
                        <FormField
                            label="مدة المشروع"
                            type="date"
                            name="deadline"
                            value={formData.deadline ? formData.deadline?.toLocaleString().split("T")[0] : ""}
                            onChange={handleChange}
                            className="flex-1"
                        />

                        <FormField
                            label="الميزانية"
                            type="number"
                            name="budget"
                            value={formData.budget || ""}
                            onChange={handleChange}
                            className="flex-1"
                            placeholder="خليها فارغة في حال الميزانية مفتوحة"
                        />
                    </div>

                    <FormField
                        label="تفاصيل إضافية"
                        type="textarea"
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        rows={4}
                        placeholder="اشرح لنا فكرتك..."
                    />

                    {/* Terms & Conditions */}
                    <div className="rounded-2xl border border-outline/20 bg-surface-container p-6 space-y-4">
                        <div>
                            <h3 className="font-bold text-lg text-on-background">
                                الشروط والأحكام
                            </h3>
                            <p className="text-sm text-on-surface-variant mt-1">
                                يرجى قراءة الشروط التالية قبل إرسال طلبك.
                            </p>
                        </div>

                        <ul className="space-y-3 text-sm text-on-surface-variant list-disc pr-5">
                            <li>
                                سيتم استخدام المعلومات التي تقدمها فقط لغرض تنفيذ مشروعك
                                ومساعدة فريق المونتاج على إنتاج الفيديو بالشكل المطلوب.
                            </li>

                            <li>
                                سيتم حذف جميع بيانات الطلب بشكل نهائي بعد الانتهاء من المشروع
                                وتسليمه.
                            </li>

                            <li>
                                بعد إرسال الطلب، لن تتمكن من تعديل بياناته أو حذفه بنفسك.
                                في حال وجود أي تعديل، يمكنك التواصل معنا مباشرة.
                            </li>

                            <li>
                                يتم حذف الطلب بإحدى الطريقتين التاليتين:
                                <ul className="mt-2 space-y-2 list-decimal pr-6">
                                    <li>
                                        بعد وضع علامة <strong>&ldquo;تم التسليم&ldquo;</strong> من قبل الإدارة،
                                        يتم حذف الطلب تلقائياً بعد <strong>3 أيام</strong>.
                                    </li>
                                    <li>
                                        يمكن للإدارة حذف الطلب يدوياً في أي وقت عند الحاجة.
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        <label className="flex items-start gap-3 cursor-pointer pt-2">
                            <input
                                type="checkbox"
                                name="agree"
                                checked={acceptedTerms}
                                onChange={(e) => {
                                    setAcceptedTerms(e.target.checked);

                                    if (e.target.checked) {
                                        setError(null);
                                    }
                                }}
                                className="mt-1 h-4 w-4 accent-primary cursor-pointer"
                            />

                            <span className="text-sm text-on-background">
                                أقر بأنني قرأت الشروط والأحكام وأوافق عليها.
                            </span>
                        </label>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="cursor-pointer w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-xl active:scale-95 hover:scale-[1.02] transition-all"
                    >
                        {loading ? "جار ارسال الطلب" : "إرسال الطلب"}
                    </button>
                </form>
            </ScrollReveal>
        </main>
    )
}

export default RequestPage