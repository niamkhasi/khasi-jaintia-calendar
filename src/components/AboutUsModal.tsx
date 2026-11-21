import React from 'react';
import { X, Heart, Mail, MapPin, Sparkles, BookOpen } from 'lucide-react';

interface AboutUsModalProps {
  onClose: () => void;
  onOpenContactUs?: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ onClose, onOpenContactUs }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-us-title"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-5 sm:p-6 shrink-0 relative border-b border-white/10">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer absolute top-4 right-4"
            aria-label="Close About Us"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f1c40f] text-slate-950 font-black shadow-md mb-2">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h2
              id="about-us-title"
              className="text-xl sm:text-2xl font-black font-display tracking-tight text-white"
            >
              About Us
            </h2>
            <p className="text-xs text-amber-300 font-semibold mt-1">
              Welcome to Khasi Jaintia Calendar
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 text-slate-800 text-sm leading-relaxed bg-slate-50/70">
          
          {/* Welcome Intro */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <h3 className="font-extrabold text-[#0e2a3a] text-base sm:text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Welcome to Khasi Jaintia Calendar</span>
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              My name is <strong>Muni Phawa</strong>. I am from <strong>Tuber Kmai Shnong, East Jaintia Hills District, Meghalaya</strong>.
            </p>
          </div>

          {/* Story & Background */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              I made Khasi Jaintia Calendar because normal calendars on phone do not show our eight Market days and festivals date like Shad Suk Mynsiem, Behdeiñkhlam, and Shad Nongkrem, because we fix these festivals date through eight market days not by english days.
            </p>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Many of our elders do not understand English calendar properly, and many young people forget our eight market days now a days.
            </p>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              So I made this simple, free calendar for all Khasi and Jaintia people, so they can see holidays, festivals and important days in one place both english and khasi name.
            </p>
          </div>

          {/* Mission & Purpose */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              Our Aim &amp; Vision
            </h4>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              My aim is to keep our culture alive with technology, and to help our people plan their life easily.
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 shrink-0 fill-current" />
              <span>
                This website is made with love for Meghalaya. It is free for everyone to use.
              </span>
            </div>
            <p className="text-slate-800 text-xs sm:text-sm font-semibold pt-1">
              Thank you for using Khasi Jaintia Calendar.
            </p>
          </div>

          {/* Contact Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-900">
                Tuber Kmai Shnong, East Jaintia Hills District, Meghalaya, India
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700">
                <span>Contact:</span>
                <a
                  href="mailto:muniphawa@gmail.com"
                  className="font-bold text-emerald-700 hover:text-emerald-900 underline inline-flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>muniphawa@gmail.com</span>
                </a>
              </div>
              {onOpenContactUs && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenContactUs();
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                >
                  Open Contact Form &rarr;
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm transition cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
