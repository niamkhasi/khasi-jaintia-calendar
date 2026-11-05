import React from 'react';
import { getCycleForDate, getCycleIndex, getHolidaysForDate, ENG_MONTHS } from '../data/khasiCalendarData';
import { NameMode, Holiday, DayNote } from '../types/calendar';

interface MonthGridProps {
  year: number;
  month: number;
  nameMode: NameMode;
  highlightMarketIdx: number | null;
  todayPulsing: boolean;
  customHolidays: Holiday[];
  deletedHolidayKeys?: string[];
  getNotesForDate: (dateKey: string) => DayNote[];
  onCurrentDayClick: (y: number, m: number, d: number) => void;
  onTrailingDayClick: (y: number, m: number, d: number, dir: number) => void;
  isRealToday: (y: number, m: number, d: number) => boolean;
}

export const MonthGrid: React.FC<MonthGridProps> = ({
  year,
  month,
  nameMode,
  highlightMarketIdx,
  todayPulsing,
  customHolidays,
  deletedHolidayKeys = [],
  getNotesForDate,
  onCurrentDayClick,
  onTrailingDayClick,
  isRealToday,
}) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDaysInCurrentMonth = lastDayOfMonth.getDate();
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7;

  return (
    <div className="grid grid-cols-7 border-l border-t border-slate-200 bg-white rounded-b-xl overflow-hidden shadow-xs w-full">
      {/* Previous Month Lead Days */}
      {Array.from({ length: startDayOffset }).map((_, i) => {
        const prevMonthDay = prevMonthLastDate - (startDayOffset - 1 - i);
        const prevDateMonth = month === 0 ? 11 : month - 1;
        const prevDateYear = month === 0 ? year - 1 : year;
        const cycle = getCycleForDate(prevDateYear, prevDateMonth, prevMonthDay);
        const isSunday = (i % 7) === 6;

        return (
          <div
            key={`prev-${i}`}
            onClick={(e) => {
              e.stopPropagation();
              onTrailingDayClick(prevDateYear, prevDateMonth, prevMonthDay, -1);
            }}
            title={`Click date to switch smoothly to ${ENG_MONTHS[prevDateMonth]}`}
            className="border-r border-b border-slate-200 p-1.5 md:p-2 text-center min-h-[76px] md:min-h-[88px] opacity-40 hover:opacity-85 cursor-pointer bg-slate-50/70 hover:bg-slate-100 transition-all flex flex-col justify-between group"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-300 flex items-center justify-center mx-auto text-xs font-semibold tabular-nums text-slate-600 group-hover:scale-105 group-hover:border-slate-500 transition">
              {prevMonthDay}
            </div>

            <div className="text-[10px] md:text-[11px] font-semibold leading-tight mt-1 text-slate-500">
              {nameMode === 'Dual' ? (
                <>
                  <div className="font-bold text-slate-600 truncate">{cycle.khasi}</div>
                  <span className="font-normal text-slate-400 block text-[9px] md:text-[10px] truncate">
                    {cycle.pnar}
                  </span>
                </>
              ) : nameMode === 'Khasi' ? (
                <span className="font-bold text-slate-600 truncate block">{cycle.khasi}</span>
              ) : (
                <span className="font-bold text-slate-600 truncate block">{cycle.pnar}</span>
              )}
            </div>
          </div>
        );
      })}

      {/* Current Month Days */}
      {Array.from({ length: totalDaysInCurrentMonth }).map((_, i) => {
        const day = i + 1;
        const cycle = getCycleForDate(year, month, day);
        const cycleIdx = getCycleIndex(year, month, day);
        const isTodayDay = isRealToday(year, month, day);
        const holidays = getHolidaysForDate(year, month, day, customHolidays, deletedHolidayKeys);
        const hasHoliday = holidays.length > 0;
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayNotesList = getNotesForDate(dateKey);
        const dayHasNotes = dayNotesList.length > 0;
        const birthdayNote = dayNotesList.find(n => n.category === 'birthday');
        const anniversaryNote = dayNotesList.find(n => n.category === 'anniversary');
        const isHighlighted = highlightMarketIdx !== null && highlightMarketIdx === cycleIdx;

        // Check if day is Sunday
        const dayOfWeek = (startDayOffset + i) % 7;
        const isSunday = dayOfWeek === 6;

        return (
          <div
            key={`cur-${day}`}
            id={isTodayDay ? 'today-calendar-cell' : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onCurrentDayClick(year, month, day);
            }}
            className={`border-r border-b border-slate-200 p-1.5 md:p-2 text-center min-h-[76px] md:min-h-[88px] cursor-pointer transition-all duration-200 flex flex-col justify-between relative group ${
              isTodayDay
                ? `bg-amber-50/95 ring-2 ring-[#0e2a3a] ${
                    todayPulsing ? 'ring-4 ring-[#f1c40f] scale-105 shadow-xl animate-bounce' : 'shadow-xs'
                  }`
                : isHighlighted
                ? 'bg-amber-50/90 ring-2 ring-inset ring-[#f1c40f]'
                : isSunday
                ? 'bg-rose-50/20 hover:bg-slate-50'
                : 'hover:bg-slate-50'
            }`}
          >
            {/* Top indicator icons */}
            <div className="flex items-center justify-between w-full px-0.5">
              {isTodayDay ? (
                <span className="text-[8px] md:text-[9px] font-black uppercase text-[#0e2a3a] bg-[#f1c40f] px-1.5 py-0.2 rounded-full shadow-xs">
                  TODAY
                </span>
              ) : birthdayNote ? (
                <span className="text-[11px] leading-none" title={`Birthday: ${birthdayNote.text} (Private on this phone)`}>🎂</span>
              ) : anniversaryNote ? (
                <span className="text-[11px] leading-none" title={`Anniversary: ${anniversaryNote.text} (Private on this phone)`}>🎉</span>
              ) : dayHasNotes ? (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" title="Private note on phone" />
              ) : (
                <span className="w-1.5 h-1.5" />
              )}

              {hasHoliday && (
                <div className="flex items-center gap-0.5">
                  {holidays[0].badge && (
                    <span 
                      className={`text-[8px] font-black px-1 py-0.2 rounded-sm shadow-2xs ${
                        holidays[0].badge === '1Y' 
                          ? 'bg-amber-400 text-slate-950 border border-amber-500' 
                          : 'bg-emerald-600 text-white border border-emerald-700'
                      }`}
                      title={holidays[0].badge === '1Y' ? 'Temporary (1 Year)' : 'Permanent (Every Year)'}
                    >
                      {holidays[0].badge}
                    </span>
                  )}
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title={`Holiday: ${holidays[0].name}`} />
                </div>
              )}
            </div>

            {/* Day circle */}
            <div
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mx-auto text-xs md:text-sm font-bold tabular-nums transition ${
                isTodayDay
                  ? 'bg-[#0e2a3a] text-[#f1c40f] border-2 border-[#f1c40f] shadow-md'
                  : isSunday
                  ? 'border border-rose-400 text-rose-700 bg-rose-50/50'
                  : 'border border-[#0fb9a0] text-slate-800 group-hover:scale-105'
              }`}
            >
              {day}
            </div>

            {/* Market Day Name Display */}
            <div className="text-[10px] md:text-[11px] mt-1 font-bold leading-tight">
              {nameMode === 'Dual' ? (
                <>
                  <div className={`truncate ${isTodayDay ? 'text-[#0e2a3a] font-black' : isHighlighted ? 'text-amber-950 font-black' : 'text-[#0e2a3a]'}`}>
                    {cycle.khasi}
                  </div>
                  <span className={`font-normal block text-[9px] md:text-[10px] truncate ${isTodayDay ? 'text-teal-900 font-bold' : 'text-slate-500'}`}>
                    {cycle.pnar}
                  </span>
                </>
              ) : nameMode === 'Khasi' ? (
                <div className={`truncate ${isTodayDay ? 'text-[#0e2a3a] font-black' : isHighlighted ? 'text-amber-950 font-black' : 'text-[#0e2a3a]'}`}>
                  {cycle.khasi}
                </div>
              ) : (
                <div className={`truncate ${isTodayDay ? 'text-teal-900 font-black' : isHighlighted ? 'text-amber-950 font-black' : 'text-teal-900'}`}>
                  {cycle.pnar}
                </div>
              )}
            </div>

            {/* Public / Paid Holiday title tag with 1Y and ∞ badges */}
            {hasHoliday && (
              <div 
                className={`mt-0.5 text-[8px] md:text-[9px] font-bold truncate px-1 rounded flex items-center justify-center gap-1 ${
                  holidays[0].badge === '1Y'
                    ? 'bg-amber-100 text-amber-950 border border-amber-300'
                    : holidays[0].badge === '∞'
                    ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                    : 'bg-amber-100/90 text-amber-800'
                }`} 
                title={`Holiday: ${holidays[0].name}${holidays[0].badge ? ` (${holidays[0].badge === '1Y' ? '1 Year Temporary' : 'Permanent Every Year'})` : ''}`}
              >
                {holidays[0].badge && (
                  <span className={`px-1 rounded font-black text-[7px] md:text-[8px] leading-tight shrink-0 ${
                    holidays[0].badge === '1Y' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-600 text-white'
                  }`}>
                    {holidays[0].badge}
                  </span>
                )}
                <span className="truncate">{holidays[0].name}</span>
              </div>
            )}

            {/* Private phone Birthday tag if present */}
            {!hasHoliday && birthdayNote && (
              <div className="mt-0.5 text-[8px] md:text-[9px] font-bold text-pink-700 truncate px-1 rounded bg-pink-100/90 flex items-center justify-center gap-0.5" title={`Private Birthday: ${birthdayNote.text}`}>
                <span>🎂</span>
                <span className="truncate">{birthdayNote.text}</span>
              </div>
            )}

            {/* Private phone Anniversary tag if present */}
            {!hasHoliday && !birthdayNote && anniversaryNote && (
              <div className="mt-0.5 text-[8px] md:text-[9px] font-bold text-purple-700 truncate px-1 rounded bg-purple-100/90 flex items-center justify-center gap-0.5" title={`Private Anniversary: ${anniversaryNote.text}`}>
                <span>🎉</span>
                <span className="truncate">{anniversaryNote.text}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Next Month Trailing Days */}
      {(() => {
        const currentTotalCells = startDayOffset + totalDaysInCurrentMonth;
        const remainingCells = (7 - (currentTotalCells % 7)) % 7;
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;

        return Array.from({ length: remainingCells }).map((_, i) => {
          const nextDay = i + 1;
          const cycle = getCycleForDate(nextYear, nextMonth, nextDay);
          const dayOfWeek = (currentTotalCells + i) % 7;
          const isSunday = dayOfWeek === 6;

          return (
            <div
              key={`next-${i}`}
              onClick={(e) => {
                e.stopPropagation();
                onTrailingDayClick(nextYear, nextMonth, nextDay, 1);
              }}
              title={`Click date to switch smoothly to ${ENG_MONTHS[nextMonth]}`}
              className="border-r border-b border-slate-200 p-1.5 md:p-2 text-center min-h-[76px] md:min-h-[88px] opacity-40 hover:opacity-85 cursor-pointer bg-slate-50/70 hover:bg-slate-100 transition-all flex flex-col justify-between group"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-300 flex items-center justify-center mx-auto text-xs font-semibold tabular-nums text-slate-600 group-hover:scale-105 group-hover:border-slate-500 transition">
                {nextDay}
              </div>

              <div className="text-[10px] md:text-[11px] font-semibold leading-tight mt-1 text-slate-500">
                {nameMode === 'Dual' ? (
                  <>
                    <div className="font-bold text-slate-600 truncate">{cycle.khasi}</div>
                    <span className="font-normal text-slate-400 block text-[9px] md:text-[10px] truncate">
                      {cycle.pnar}
                    </span>
                  </>
                ) : nameMode === 'Khasi' ? (
                  <span className="font-bold text-slate-600 truncate block">{cycle.khasi}</span>
                ) : (
                  <span className="font-bold text-slate-600 truncate block">{cycle.pnar}</span>
                )}
              </div>
            </div>
          );
        });
      })()}
    </div>
  );
};
