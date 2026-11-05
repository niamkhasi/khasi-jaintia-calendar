import React, { useState } from 'react';
import { X, Calendar, Sparkles, ArrowRight, Edit3, Trash2, Clock, AlertCircle } from 'lucide-react';
import { getHolidaysForYear, ENG_MONTHS, KHASI_MONTHS, getCycleForDate } from '../data/khasiCalendarData';
import { Holiday } from '../types/calendar';
import { ADMIN_EMAILS } from '../hooks/useFirebaseHolidays';

interface HolidaysModalProps {
  currentYear: number;
  onClose: () => void;
  onSelectDate: (year: number, month: number, day: number) => void;
  onViewWish?: (holiday: Holiday, year: number) => void;
  customHolidays?: Holiday[];
  deletedHolidayKeys?: string[];
  onOpenFirebaseManager?: () => void;
  isAdmin?: boolean;
  currentUserEmail?: string;
  currentUserId?: string;
  onEditHolidayTitle?: (holidayId: string, newTitle: string) => Promise<void>;
  onDeleteHoliday?: (holidayId: string, holidayName?: string) => Promise<void>;
}

export const HolidaysModal: React.FC<HolidaysModalProps> = ({
  currentYear,
  onClose,
  onSelectDate,
  onViewWish,
  customHolidays = [],
  deletedHolidayKeys = [],
  onOpenFirebaseManager,
  isAdmin = false,
  currentUserEmail,
  currentUserId,
  onEditHolidayTitle,
  onDeleteHoliday
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [filterType, setFilterType] = useState<string>('all');

  // Edit / Delete state
  const [editingHolidayId, setEditingHolidayId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleStartEdit = (holiday: Holiday) => {
    setEditingHolidayId(holiday.id);
    setEditingTitle(holiday.name);
    setEditError(null);
  };

  const handleSaveEdit = async (holidayId: string) => {
    if (!editingTitle.trim() || !onEditHolidayTitle) return;
    setIsSavingEdit(true);
    setEditError(null);
    try {
      await onEditHolidayTitle(holidayId, editingTitle.trim());
      setEditingHolidayId(null);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Failed to update holiday title.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const executeDeleteHoliday = async (holiday: Holiday) => {
    if (!onDeleteHoliday) return;
    setDeletingId(holiday.id);
    setDeleteError(null);
    try {
      await onDeleteHoliday(holiday.id, holiday.name);
      setConfirmDeleteId(null);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete holiday.');
    } finally {
      setDeletingId(null);
    }
  };

  const holidays = getHolidaysForYear(selectedYear, customHolidays, deletedHolidayKeys).sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  });

  const filtered = filterType === 'all'
    ? holidays
    : holidays.filter(h => h.type === filterType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#f1c40f]" />
              <h3 className="text-xl font-bold font-display">Meghalaya Holidays & Festivals</h3>
            </div>
            <div className="flex items-center gap-2">
              {onOpenFirebaseManager && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenFirebaseManager();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs ${
                    isAdmin
                      ? 'bg-[#f1c40f] text-slate-950 hover:bg-amber-300'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                  title={isAdmin ? "Add or manage holiday dates in Firebase" : "Admin portal for calendar administrator"}
                >
                  {isAdmin ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>👑 Admin: Add Holiday</span>
                    </>
                  ) : (
                    <span>Admin Portal</span>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Official state holidays, indigenous Khasi & Jaiñtia festivals, and traditional blessings for {selectedYear}.
          </p>
        </div>

        {/* Filter controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'cultural', label: 'Cultural & Festivals' },
              { id: 'state', label: 'State & Memorials' },
              { id: 'religious', label: 'Religious' },
              { id: 'national', label: 'National' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  filterType === tab.id
                    ? 'bg-[#0e2a3a] text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
          >
            {Array.from({ length: 76 }, (_, i) => 2025 + i).map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Holiday list */}
        <div className="p-4 max-h-[52vh] overflow-y-auto space-y-2.5">
          {filtered.map(item => {
            const market = getCycleForDate(selectedYear, item.month, item.day);
            const isOwner = !!(
              (currentUserId && item.userId && item.userId === currentUserId) ||
              (currentUserEmail && item.userEmail && item.userEmail.toLowerCase() === currentUserEmail.toLowerCase())
            );
            const createdTime = item.createdAt ? new Date(item.createdAt).getTime() : 0;
            const elapsed = Date.now() - createdTime;
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
            const remainingDays = createdTime > 0 ? Math.max(0, Math.ceil((sevenDaysMs - elapsed) / (24 * 60 * 60 * 1000))) : 7;
            const isWithin7Days = createdTime === 0 || elapsed <= sevenDaysMs;
            const canEdit = !!onEditHolidayTitle && (isAdmin || (isOwner && isWithin7Days));
            const canDelete = !!onDeleteHoliday && (isAdmin || isOwner);
            const isEditingThis = editingHolidayId === item.id;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition group"
              >
                {isEditingThis ? (
                  <div className="p-3 bg-white rounded-xl border border-amber-300 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-[#0e2a3a]" />
                        <span>Edit Holiday Name</span>
                      </span>
                      {isOwner && !isAdmin && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          {remainingDays} days left to edit
                        </span>
                      )}
                      {isAdmin && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          👑 Admin Power
                        </span>
                      )}
                    </div>

                    {editError && (
                      <div className="text-[11px] text-rose-800 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
                        {editError}
                      </div>
                    )}

                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      maxLength={120}
                      placeholder="Enter new holiday name..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                      autoFocus
                    />

                    <div className="flex items-center justify-end gap-2 text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingHolidayId(null);
                          setEditError(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isSavingEdit || !editingTitle.trim()}
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0e2a3a] text-white font-bold hover:bg-slate-800 disabled:opacity-50 transition"
                      >
                        {isSavingEdit ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-amber-700">
                          {item.day} {ENG_MONTHS[item.month]} ({KHASI_MONTHS[item.month]})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase font-semibold">
                          {item.type}
                        </span>
                        {isOwner && !item.name.toLowerCase().includes('soul') && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-300">
                            ⭐ Added by You
                          </span>
                        )}
                        {!item.name.toLowerCase().includes('soul') && item.badge && item.badge === '1Y' ? (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-amber-100 text-amber-950 border-amber-300">
                            🗓️ 1Y Temporary
                          </span>
                        ) : !item.name.toLowerCase().includes('soul') && item.year && item.year > 0 ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold border border-amber-300">
                            🗓️ {item.year} Only
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                            ♾️ Every Year
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mt-0.5 group-hover:text-amber-950">
                        {item.name}
                        {item.khasiName && item.khasiName !== item.name && (
                          <span className="text-xs font-medium text-slate-500 ml-2">
                            ({item.khasiName})
                          </span>
                        )}
                      </h4>

                      {item.userEmail && !item.name.toLowerCase().includes('soul') && !ADMIN_EMAILS.some(a => a.toLowerCase() === item.userEmail?.toLowerCase()) && (
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          By: {item.userEmail}
                          {item.expiryDate && item.badge === '1Y' && (
                            <span className="ml-1 text-amber-900">(until {item.expiryDate})</span>
                          )}
                        </div>
                      )}

                      {item.wishKhasi && (
                        <div className="mt-1 text-xs font-semibold text-amber-900 bg-amber-100/60 px-2 py-1 rounded-md inline-block">
                          ✨ “{item.wishKhasi}”
                        </div>
                      )}

                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-2 text-[11px] text-slate-400">
                        Sngi Iew: <strong className="text-slate-700">{market.khasi}</strong> / {market.pnar}
                      </div>

                      {/* Edit Name & Delete bar for owner or admin */}
                      {(canEdit || canDelete || (isOwner && !isWithin7Days)) && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                              title="Edit holiday name (Available within 7 days)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Name</span>
                              {isOwner && !isAdmin && (
                                <span className="text-[10px] text-amber-800 font-normal">
                                  ({remainingDays}d left)
                                </span>
                              )}
                            </button>
                          )}

                          {isOwner && !isWithin7Days && !isAdmin && (
                            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium bg-slate-100 px-2 py-1 rounded-lg">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>7-day edit window closed</span>
                            </span>
                          )}

                          {canDelete && (
                            confirmDeleteId === item.id ? (
                              <div className="w-full mt-2 p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs space-y-2">
                                <div className="font-extrabold text-rose-950 flex items-center gap-1.5">
                                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                  <span>Delete "{item.name}" from calendar?</span>
                                </div>
                                <p className="text-[11px] text-rose-800">
                                  This will permanently remove this holiday from the calendar for all users.
                                </p>
                                {deleteError && (
                                  <div className="p-2 rounded-lg bg-white border border-rose-200 text-rose-700 font-bold text-[11px]">{deleteError}</div>
                                )}
                                <div className="flex items-center justify-end gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => { setConfirmDeleteId(null); setDeleteError(null); }}
                                    className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    disabled={deletingId === item.id}
                                    onClick={() => executeDeleteHoliday(item)}
                                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                                  >
                                    {deletingId === item.id ? 'Deleting...' : 'Yes, Delete'}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => { setConfirmDeleteId(item.id); setDeleteError(null); }}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs flex items-center gap-1 transition shadow-2xs cursor-pointer"
                                title="Delete holiday"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0 mt-1">
                      {onViewWish && (
                        <button
                          onClick={() => onViewWish(item, selectedYear)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0e2a3a] text-[#f1c40f] text-xs font-bold hover:bg-slate-800 transition shadow-2xs cursor-pointer"
                          title="View holiday greeting wish"
                        >
                          <Sparkles className="w-3 h-3 fill-current" />
                          <span>Wish</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onSelectDate(selectedYear, item.month, item.day);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-700 font-semibold px-2 py-1 cursor-pointer"
                      >
                        <span>Jump</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
