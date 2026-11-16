import React, { useState, useMemo } from 'react';
import { X, Search, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { CYCLE, ENG_MONTHS, KHASI_MONTHS, getCycleIndex } from '../data/khasiCalendarData';

interface MarketFinderModalProps {
  currentYear: number;
  currentMonth?: number;
  onClose: () => void;
  onSelectDate: (year: number, month: number, day: number) => void;
}

export const MarketFinderModal: React.FC<MarketFinderModalProps> = ({
  currentYear,
  currentMonth,
  onClose,
  onSelectDate
}) => {
  const [targetMarketIdx, setTargetMarketIdx] = useState<number>(0); // Default to Ïewduh / Hat
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>(
    typeof currentMonth === 'number' ? currentMonth : 'all'
  );
  const [onlyUpcoming, setOnlyUpcoming] = useState<boolean>(true);

  const market = CYCLE[targetMarketIdx];

  // Calculate all dates matching selectedYear, targetMarketIdx, and optional selectedMonth
  const matchingDates = useMemo(() => {
    const list: { year: number; month: number; day: number; weekday: string; isPast: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startMonth = selectedMonth === 'all' ? 0 : selectedMonth;
    const endMonth = selectedMonth === 'all' ? 11 : selectedMonth;

    for (let m = startMonth; m <= endMonth; m++) {
      const daysInMonth = new Date(selectedYear, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const cycleIdx = getCycleIndex(selectedYear, m, d);
        if (cycleIdx === targetMarketIdx) {
          const dt = new Date(selectedYear, m, d);
          const isPast = dt < today;
          list.push({
            year: selectedYear,
            month: m,
            day: d,
            weekday: dt.toLocaleDateString('en-US', { weekday: 'short' }),
            isPast
          });
        }
      }
    }

    if (onlyUpcoming) {
      return list.filter(item => !item.isPast);
    }
    return list;
  }, [selectedYear, selectedMonth, targetMarketIdx, onlyUpcoming]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-4 sm:p-5 shrink-0 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#f1c40f]/20 border border-[#f1c40f]/40 flex items-center justify-center text-[#f1c40f] shrink-0">
                <Search className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display">
                  Sngi Iew Finder
                </h3>
                <p className="text-xs text-slate-300">
                  Find any of the 8 market days by Month &amp; Year
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls: Market Day + Month + Year */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Market Day */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                1. Select Market Day:
              </label>
              <select
                value={targetMarketIdx}
                onChange={e => setTargetMarketIdx(Number(e.target.value))}
                className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a] shadow-2xs"
              >
                {CYCLE.map(m => (
                  <option key={m.index} value={m.index}>
                    {m.khasi} / {m.pnar} (Day {m.index + 1})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Month (Fast & Easy to choose) */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                2. Select Month:
              </label>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a] shadow-2xs"
              >
                <option value="all">All Months (Jan – Dec)</option>
                {ENG_MONTHS.map((eng, idx) => (
                  <option key={idx} value={idx}>
                    {idx + 1}. {eng} / {KHASI_MONTHS[idx]}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Year */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                3. Select Year:
              </label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a] shadow-2xs"
              >
                {Array.from({ length: 76 }, (_, i) => 2025 + i).map(y => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Month Select Pills for 1-tap switching */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 select-none">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider shrink-0 mr-0.5">
              Quick:
            </span>
            <button
              type="button"
              onClick={() => setSelectedMonth('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition shrink-0 cursor-pointer ${
                selectedMonth === 'all'
                  ? 'bg-[#0e2a3a] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Year
            </button>
            {ENG_MONTHS.map((eng, idx) => {
              const isSelected = selectedMonth === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedMonth(idx)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#f1c40f] text-slate-950 font-black shadow-xs ring-1 ring-[#f1c40f]'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                  title={`${eng} / ${KHASI_MONTHS[idx]}`}
                >
                  {eng.slice(0, 3)}
                </button>
              );
            })}
          </div>

          {/* Filter options bar */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-1 gap-2 border-t border-slate-200/80">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
              <input
                type="checkbox"
                checked={onlyUpcoming}
                onChange={e => setOnlyUpcoming(e.target.checked)}
                className="rounded text-[#0e2a3a] focus:ring-[#0e2a3a]"
              />
              <span className="text-[11px] sm:text-xs font-medium">Show only upcoming dates</span>
            </label>
            <span className="text-[11px] sm:text-xs text-slate-600 font-bold bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
              Found {matchingDates.length} {market.khasi} day{matchingDates.length === 1 ? '' : 's'}
              {selectedMonth !== 'all' ? ` in ${ENG_MONTHS[selectedMonth]}` : ''} {selectedYear}
            </span>
          </div>
        </div>

        {/* List of Matching Market Dates */}
        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-2 flex-1">
          {matchingDates.length > 0 ? (
            matchingDates.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectDate(item.year, item.month, item.day);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-[#0fb9a0] hover:bg-teal-50/40 bg-white cursor-pointer transition shadow-2xs hover:shadow-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0e2a3a] text-white flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow-2xs group-hover:scale-105 transition">
                    <span className="text-[10px] text-amber-400 font-medium leading-none">
                      {item.weekday}
                    </span>
                    <span className="text-sm font-black leading-tight">{item.day}</span>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm group-hover:text-teal-900 leading-tight">
                      {item.day} {ENG_MONTHS[item.month]} {item.year}
                    </h5>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      {KHASI_MONTHS[item.month]} · <strong className="text-slate-800">{market.khasi}</strong> ({market.pnar})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-teal-700 font-bold shrink-0">
                  <span className="hidden sm:inline">Go to date</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-800">
                No dates found for {market.khasi} in {selectedMonth === 'all' ? selectedYear : `${ENG_MONTHS[selectedMonth]} ${selectedYear}`}.
              </p>
              <p className="text-[11px] text-slate-500">
                {onlyUpcoming
                  ? 'Try unchecking "Show only upcoming dates" or choose a different month/year above.'
                  : 'Try selecting a different month or year above.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
