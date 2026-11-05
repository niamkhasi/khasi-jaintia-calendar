import React from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { Holiday } from '../types/calendar';

interface HolidayWishBannerProps {
  holiday: Holiday;
  year: number;
  onOpenDetails: () => void;
  onDismiss: () => void;
}

export const HolidayWishBanner: React.FC<HolidayWishBannerProps> = ({
  holiday,
  year: _year,
  onOpenDetails,
  onDismiss
}) => {
  const wishKhasi = holiday.wishKhasi || `Khublei ${holiday.khasiName || holiday.name} ba kmen!`;

  return (
    <div className="bg-gradient-to-r from-[#0e2a3a] via-[#143c53] to-[#0e2a3a] border-b-2 border-[#f1c40f] text-white px-3 md:px-4 py-2.5 shadow-md animate-in slide-in-from-top-2 duration-300 relative">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left Greeting Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-[#f1c40f] text-slate-950 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4 fill-current text-slate-950" />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#f1c40f] bg-white/10 px-1.5 py-0.2 rounded-sm">
                Today is a Holiday!
              </span>
              <span className="text-xs font-bold text-white truncate">
                {holiday.name} {holiday.khasiName && holiday.khasiName !== holiday.name ? `(${holiday.khasiName})` : ''}
              </span>
            </div>
            
            <p className="text-xs text-amber-200 font-semibold truncate mt-0.5">
              “{wishKhasi}”
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            onClick={onOpenDetails}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f1c40f] hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm transition cursor-pointer"
          >
            <span>View Wish & Greetings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Dismiss greeting banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
