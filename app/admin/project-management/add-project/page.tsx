import { ProjectForm } from "@/components/layout/admin.add-project-form";

export default function AddProjectPage() {
    return (
        <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <div className="mb-12">
                <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-4">
                    إضافة مشروع جديد
                </h1>

                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                    قم بإدخال تفاصيل المشروع الجديد. جميع الحقول المطلوبة محددة بعلامة *.
                </p>
            </div>

            <ProjectForm mode="create"/>
        </main>
    );
}