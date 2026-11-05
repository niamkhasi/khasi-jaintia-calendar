import React, { useState } from 'react';
import { X, Sparkles, Share2, Check, Heart } from 'lucide-react';
import { Holiday, MarketDay } from '../types/calendar';
import { ENG_MONTHS, KHASI_MONTHS, getCycleForDate } from '../data/khasiCalendarData';

interface HolidayWishModalProps {
  holiday: Holiday;
  year: number;
  onClose: () => void;
}

export const HolidayWishModal: React.FC<HolidayWishModalProps> = ({
  holiday,
  year,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const market: MarketDay = getCycleForDate(year, holiday.month, holiday.day);

  const defaultKhasiWish = `Khublei ${holiday.khasiName || holiday.name} ba suk ba kmen ia phi baroh!`;
  const defaultEnglishWish = `Wishing you and your family a peaceful, joyous, and blessed ${holiday.name}!`;

  const wishKhasi = holiday.wishKhasi || defaultKhasiWish;
  const wishEnglish = holiday.wishEnglish || defaultEnglishWish;

  const handleShare = async () => {
    const textToShare = `🎉 ${holiday.name} (${holiday.khasiName || ''})\n` +
      `📅 ${holiday.day} ${ENG_MONTHS[holiday.month]} (${KHASI_MONTHS[holiday.month]}) ${year}\n` +
      `🛍️ Sngi Iew: ${market.khasi} / ${market.pnar}\n\n` +
      `✨ "${wishKhasi}"\n` +
      `✨ "${wishEnglish}"\n\n` +
      `Warm wishes from Khasi Jaintia Calendar (By Ieij Iala Ka Jong)`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${holiday.name} Greetings`,
          text: textToShare,
        });
      } catch {
        navigator.clipboard.writeText(textToShare);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0e2a3a] via-[#103447] to-[#0a1e2a] text-white shadow-2xl border-2 border-[#f1c40f] overflow-hidden text-center p-6 md:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          aria-label="Close greeting"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Festive Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1c40f] text-slate-950 font-black text-xs tracking-wider uppercase shadow-md mb-4">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>Holiday Greetings • Khublei Sngi Leh Kmen</span>
        </div>

        {/* Logo Emblem Thumbnail */}
        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-2xl mb-3 shrink-0">
          <img
            src="/logo.png"
            alt="Khasi Jaintia Calendar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Holiday Title */}
        <h3 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-white">
          {holiday.name}
        </h3>
        {holiday.khasiName && holiday.khasiName !== holiday.name && (
          <div className="text-sm font-bold text-[#f1c40f] mt-0.5">
            {holiday.khasiName}
          </div>
        )}

        {/* Date & Sngi Iew Info */}
        <div className="text-xs text-slate-300 mt-2 font-medium">
          {holiday.day} {ENG_MONTHS[holiday.month]} ({KHASI_MONTHS[holiday.month]}) {year}
          <span className="mx-1.5 text-[#f1c40f]">·</span>
          <span>Sngi {market.khasi}/{market.pnar}</span>
        </div>

        {/* Traditional Wishes Card */}
        <div className="mt-5 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-left space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#f1c40f] block">
              Ka Jingkitbok Kitrwiang (Khasi Wish):
            </span>
            <p className="text-base font-extrabold text-amber-200 mt-0.5 leading-snug">
              “{wishKhasi}”
            </p>
          </div>

          <div className="pt-2 border-t border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Holiday Blessing:
            </span>
            <p className="text-xs md:text-sm text-slate-100 mt-0.5 leading-relaxed italic">
              “{wishEnglish}”
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={handleShare}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#f1c40f] hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-800" />
                <span>Wish Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Wish</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
            <span>Khublei Shibun</span>
          </button>
        </div>

      </div>
    </div>
  );
};
