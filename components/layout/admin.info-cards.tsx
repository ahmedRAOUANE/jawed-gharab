interface InfoCardsProps {
    version: string;
    lastLogin: string;
}

export const InfoCards = ({ version, lastLogin }: InfoCardsProps) => {
    return (
        <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-primary/20 bg-white/2">
                <p className="font-caption text-caption text-on-surface-variant mb-1">
                    الإصدار
                </p>

                <p className="font-label-md text-label-md text-on-surface">{version}</p>
            </div>

            <div className="p-4 rounded-xl border border-primary/20 bg-white/2">
                <p className="font-caption text-caption text-on-surface-variant mb-1">
                    آخر دخول
                </p>
                
                <p className="font-label-md text-label-md text-on-surface">{lastLogin}</p>
            </div>
        </div>
    );
};