import { MdHome, MdMovieFilter, MdAutoAwesome, MdContactSupport } from "react-icons/md";

const MobileBottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex flex-row-reverse justify-around items-center py-3 px-4 bg-surface-container/60 backdrop-blur-2xl border-t border-white/10 md:hidden rounded-t-xl shadow-2xl">
      <div className="flex flex-col items-center justify-center text-primary bg-primary-container/20 rounded-xl px-4 py-2 transition-all duration-200">
        <MdHome size={24} />
        <span className="font-label-md text-label-md mt-1">الرئيسية</span>
      </div>

      <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-white/5 transition-all">
        <MdMovieFilter size={24} />
        <span className="font-label-md text-label-md mt-1">أعمالي</span>
      </div>

      <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-white/5 transition-all">
        <MdAutoAwesome size={24} />
        <span className="font-label-md text-label-md mt-1">خدماتي</span>
      </div>

      <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-white/5 transition-all">
        <MdContactSupport size={24} />
        <span className="font-label-md text-label-md mt-1">تواصل</span>
      </div>
    </nav>
  );
};

export default MobileBottomNav