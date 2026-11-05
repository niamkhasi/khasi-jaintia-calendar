import React, { useState } from 'react';
import { X, BookOpen, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';
import { CYCLE } from '../data/khasiCalendarData';

interface MarketGuideModalProps {
  onClose: () => void;
  onSelectMarketForFilter?: (marketIndex: number) => void;
}

export const MarketGuideModal: React.FC<MarketGuideModalProps> = ({
  onClose,
  onSelectMarketForFilter
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0); // Default to Ïewduh / Hat
  const selectedDay = CYCLE[selectedIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#f1c40f]" />
              <h3 className="text-xl font-bold font-display">8 Sngi Ka Iew (The 8 Market Days)</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            In Hynniewtrep culture (Khasi & Jaiñtia), the traditional week consists of eight revolving market days that rhythmically link hill villages with urban trading centers.
          </p>
        </div>

        {/* 8-Day Selector Tabs */}
        <div className="flex overflow-x-auto p-2 bg-slate-100 border-b border-slate-200 no-scrollbar gap-1.5">
          {CYCLE.map((item, idx) => (
            <button
              key={item.index}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition flex flex-col items-center gap-0.5 ${
                selectedIdx === idx
                  ? 'bg-[#0e2a3a] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              <span className="text-[10px] opacity-75">Day {idx + 1}</span>
              <span className={selectedIdx === idx ? 'text-[#f1c40f]' : 'text-slate-900 font-bold'}>
                {item.khasi}
              </span>
              <span className="text-[10px] text-slate-400">
                {item.pnar}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Market Day Deep Dive */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-[#0fb9a0] uppercase tracking-wider">
                Cycle Day {selectedDay.index + 1} of 8
              </span>
              <h4 className="text-2xl font-extrabold text-[#0e2a3a] mt-1 font-display">
                {selectedDay.khasi} <span className="text-slate-400 font-light">/</span> {selectedDay.pnar}
              </h4>
            </div>
            {onSelectMarketForFilter && (
              <button
                onClick={() => {
                  onSelectMarketForFilter(selectedDay.index);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f1c40f] text-slate-900 hover:bg-amber-300 transition"
              >
                <span>Highlight in Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                Khasi Tradition
              </span>
              <h5 className="text-base font-bold text-[#0e2a3a] mt-1">Sngi {selectedDay.khasi}</h5>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {selectedDay.khasiMeaning || 'Traditional Khasi hill market assembly.'}
              </p>
            </div>

            <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-200">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wide block">
                Jaintia Tradition
              </span>
              <h5 className="text-base font-bold text-teal-950 mt-1">Sngi {selectedDay.pnar}</h5>
              <p className="mt-2 text-xs text-teal-900/80 leading-relaxed">
                {selectedDay.pnarMeaning || 'Traditional Jaintia marketplace gathering.'}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Significance & Culture
              </h5>
              <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                {selectedDay.significance}
              </p>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Prominent Locations:</strong>
                <p className="mt-0.5">{selectedDay.majorLocations}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Characteristic Trade & Goods:</strong>
                <p className="mt-0.5">{selectedDay.activities}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0e2a3a] text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
