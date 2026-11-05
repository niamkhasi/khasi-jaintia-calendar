import React, { useState, useMemo } from 'react';
import { X, Search, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { CYCLE, ENG_MONTHS, KHASI_MONTHS, getCycleIndex } from '../data/khasiCalendarData';

interface MarketFinderModalProps {
  currentYear: number;
  onClose: () => void;
  onSelectDate: (year: number, month: number, day: number) => void;
}

export const MarketFinderModal: React.FC<MarketFinderModalProps> = ({
  currentYear,
  onClose,
  onSelectDate
}) => {
  const [targetMarketIdx, setTargetMarketIdx] = useState<number>(0); // Default to Ïewduh / Hat
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [onlyUpcoming, setOnlyUpcoming] = useState<boolean>(true);

  const market = CYCLE[targetMarketIdx];

  // Calculate all dates in selectedYear with this market index
  const matchingDates = useMemo(() => {
    const list: { year: number; month: number; day: number; weekday: string; isPast: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let m = 0; m < 12; m++) {
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
  }, [selectedYear, targetMarketIdx, onlyUpcoming]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-[#f1c40f]" />
              <h3 className="text-xl font-bold font-display">Sngi Iew Finder</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Locate all upcoming occurrences of your preferred market day in {selectedYear}.
          </p>
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Select Market Day:
              </label>
              <select
                value={targetMarketIdx}
                onChange={e => setTargetMarketIdx(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
              >
                {CYCLE.map(m => (
                  <option key={m.index} value={m.index}>
                    {m.khasi} / {m.pnar} (Day {m.index + 1})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Select Year:
              </label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
              >
                {Array.from({ length: 76 }, (_, i) => 2025 + i).map(y => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={onlyUpcoming}
                onChange={e => setOnlyUpcoming(e.target.checked)}
                className="rounded text-[#0e2a3a] focus:ring-[#0e2a3a]"
              />
              <span>Show only upcoming dates</span>
            </label>
            <span className="text-slate-500 font-medium">
              Found {matchingDates.length} days
            </span>
          </div>
        </div>

        {/* List of Dates */}
        <div className="p-4 max-h-[50vh] overflow-y-auto space-y-2">
          {matchingDates.length > 0 ? (
            matchingDates.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectDate(item.year, item.month, item.day);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0fb9a0] hover:bg-teal-50/40 cursor-pointer transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0e2a3a] text-white flex flex-col items-center justify-center font-bold text-xs shrink-0">
                    <span className="text-[10px] text-amber-400 font-medium leading-none">
                      {item.weekday}
                    </span>
                    <span className="text-sm leading-tight">{item.day}</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm group-hover:text-teal-900">
                      {item.day} {ENG_MONTHS[item.month]} {item.year}
                    </h5>
                    <div className="text-xs text-slate-500">
                      {KHASI_MONTHS[item.month]} · {market.khasi} ({market.pnar})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-teal-700 font-semibold">
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No upcoming dates for this market in {selectedYear}. Uncheck "Show only upcoming dates" to see past dates.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
