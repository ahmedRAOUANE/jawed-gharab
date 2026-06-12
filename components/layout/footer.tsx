export const Footer = () => {
    return (
        <footer className="bg-surface-container-lowest py-section-gap border-t border-white/5 flex flex-col md:flex-row-reverse justify-between items-center px-margin-desktop gap-unit">
            <div className="text-headline-md font-bold text-on-background">Djawad GH</div>
            <p className="font-caption text-caption text-on-surface-variant">
                © 2026 جميع الحقوق محفوظة
            </p>
            <div className="flex gap-8">
                <a href="#" className="text-on-surface-variant font-body-md hover:text-primary transition-colors hover:underline">
                    سياسة الخصوصية
                </a>
                <a href="#" className="text-on-surface-variant font-body-md hover:text-primary transition-colors hover:underline">
                    الشروط والأحكام
                </a>
            </div>
        </footer>
    );
};