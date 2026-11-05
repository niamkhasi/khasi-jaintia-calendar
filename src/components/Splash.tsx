import React, { useEffect, useState } from 'react';

interface SplashProps {
  onDismiss: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onDismiss }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onDismiss, 800);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleManualEnter = () => {
    setFading(true);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      onClick={handleManualEnter}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0e2a3a] text-white text-center cursor-pointer select-none transition-opacity duration-700 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative">
        <div className="w-44 h-44 rounded-full overflow-hidden shadow-2xl transition-transform hover:scale-105">
          <img
            src="/logo.png"
            alt="Khasi Jaintia Calendar Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-[#0fb9a0] text-slate-950 font-bold text-xs px-2.5 py-1 rounded-full border-2 border-[#0e2a3a] shadow-md">
          2025–2100
        </div>
      </div>

      <h1 className="mt-6 text-3xl md:text-4xl font-extrabold tracking-tight font-display leading-tight">
        KHASI JAINTIA<br />
        <span className="text-[#f1c40f]">CALENDAR</span>
      </h1>
      <p className="mt-2 text-base md:text-lg font-semibold text-slate-200">
        By Ieij Iala Ka Jong
      </p>

      <div className="mt-7 flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-3 border-white/30 border-t-[#f1c40f] animate-spin" />
        <span className="text-xs text-slate-300 font-medium tracking-wide">
          8 Sngi Iew • Hynniewtrep
        </span>
      </div>

      <div className="absolute bottom-6 text-xs text-slate-400">
        Tap anywhere to enter
      </div>
    </div>
  );
};
