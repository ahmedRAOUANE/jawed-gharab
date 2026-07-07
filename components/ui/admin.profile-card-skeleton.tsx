export const ProfileCardSkeleton = () => {
    return (
        <div className="bg-surface border border-primary/20 rounded-2xl p-8 flex flex-col items-center text-center animate-pulse">
            {/* Avatar */}
            <div className="relative mb-6">
                <div className="w-32 aspect-square rounded-full border-2 border-primary/20 p-1">
                    <div className="w-full h-full rounded-full bg-white/10" />
                </div>

                {/* Edit button */}
                <div className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-white/10" />
            </div>

            {/* Name */}
            <div className="h-7 w-44 rounded bg-white/10 mb-2" />

            {/* Role */}
            <div className="h-5 w-28 rounded bg-white/10 mb-2" />

            {/* Email */}
            <div className="h-4 w-56 rounded bg-white/10 mb-6" />

            {/* Button */}
            <div className="w-full h-14 rounded-xl bg-white/10" />

            {/* Status Summary */}
            <div className="w-full mt-4 bg-background/70 border border-primary/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-5 w-24 rounded bg-white/10" />
                    <div className="h-5 w-20 rounded bg-white/10" />
                </div>

                {/* Progress bar */}
                <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-2/3 rounded-full bg-white/20" />
                </div>

                {/* Progress text */}
                <div className="mt-3 h-4 w-32 rounded bg-white/10" />
            </div>
        </div>
    );
};