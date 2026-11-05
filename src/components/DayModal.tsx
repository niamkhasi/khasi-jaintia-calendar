import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, MapPin, Tag, Plus, Trash2, ChevronLeft, ChevronRight, Share2, Check, Edit3, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { KHASI_MONTHS, ENG_MONTHS, getCycleForDate, getHolidaysForDate } from '../data/khasiCalendarData';
import { DayNote, Holiday } from '../types/calendar';
import { ADMIN_EMAILS } from '../hooks/useFirebaseHolidays';

interface DayModalProps {
  year: number;
  month: number;
  day: number;
  onClose: () => void;
  onNavigateDay: (offset: number) => void;
  notes: DayNote[];
  onAddNote: (dateKey: string, text: string, category: DayNote['category']) => void;
  onDeleteNote: (dateKey: string, noteId: string) => void;
  customHolidays?: Holiday[];
  deletedHolidayKeys?: string[];
  currentUserEmail?: string;
  currentUserId?: string;
  isAdmin?: boolean;
  onEditHolidayTitle?: (holidayId: string, newTitle: string) => Promise<void>;
  onDeleteHoliday?: (holidayId: string, holidayName?: string) => Promise<void>;
  onOpenAddHoliday?: (dateStr: string) => void;
}

export const DayModal: React.FC<DayModalProps> = ({
  year,
  month,
  day,
  onClose,
  onNavigateDay,
  notes,
  onAddNote,
  onDeleteNote,
  customHolidays = [],
  deletedHolidayKeys = [],
  currentUserEmail,
  currentUserId,
  isAdmin = false,
  onEditHolidayTitle,
  onDeleteHoliday,
  onOpenAddHoliday
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<DayNote['category']>('general');
  const [copied, setCopied] = useState(false);

  // Edit / Delete holiday state
  const [editingHolidayId, setEditingHolidayId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingHolidayId, setDeletingHolidayId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const dateObj = new Date(year, month, day);
  const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const market = getCycleForDate(year, month, day);
  const holidays = getHolidaysForDate(year, month, day, customHolidays, deletedHolidayKeys);
  const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const isToday = () => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(dateKey, newNoteText, newNoteCategory);
    setNewNoteText('');
  };

  const handleShare = async () => {
    const textToShare = `${day} ${ENG_MONTHS[month]} (${KHASI_MONTHS[month]}) ${year}\n` +
      `Sngi Iew: ${market.khasi} (Khasi) / ${market.pnar} (Jaintia)\n` +
      (holidays.length > 0 ? `Holiday: ${holidays.map(h => h.name).join(', ')}\n` : '') +
      `Khasi Jaintia Calendar - By Ieij Iala Ka Jong`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Khasi Jaintia Calendar - ${day} ${KHASI_MONTHS[month]} ${year}`,
          text: textToShare,
        });
      } catch {
        // fallback to clipboard
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
      setEditError(err instanceof Error ? err.message : 'Failed to update holiday name.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const executeDeleteHoliday = async (holiday: Holiday) => {
    if (!onDeleteHoliday) return;
    setDeletingHolidayId(holiday.id);
    setDeleteError(null);
    try {
      await onDeleteHoliday(holiday.id, holiday.name);
      setConfirmDeleteId(null);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete holiday.');
    } finally {
      setDeletingHolidayId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header Banner */}
        <div className="bg-[#0e2a3a] text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f1c40f] text-slate-950">
                {isToday() ? 'TODAY' : `${weekdayName}`}
              </span>
              <span className="text-xs text-slate-300">
                Sngi Iew #{market.index + 1} of 8
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                title="Share date info"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Date Headings */}
          <div className="mt-3">
            <h2 className="text-2xl font-extrabold font-display">
              {day} {ENG_MONTHS[month]} {year}
            </h2>
            <div className="text-sm font-semibold text-[#f1c40f] mt-0.5">
              {day} {KHASI_MONTHS[month]} {year}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[72vh] overflow-y-auto">
          
          {/* Market Day Spotlight */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Traditional Market Day
              </span>
              <span className="text-xs font-semibold text-[#0fb9a0]">
                8 Sngi Iew
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <div>
                <span className="text-xs text-slate-500 block">Khasi Name</span>
                <span className="text-lg font-bold text-[#0e2a3a]">{market.khasi}</span>
              </div>
              <div className="text-slate-300 font-light text-xl">/</div>
              <div>
                <span className="text-xs text-slate-500 block">Jaintia Name</span>
                <span className="text-lg font-bold text-teal-800">{market.pnar}</span>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-700 leading-relaxed">
              {market.significance}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-slate-800">Primary Hubs:</strong> {market.majorLocations}</span>
              </div>
              <div className="flex items-start gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-slate-800">Trade & Goods:</strong> {market.activities}</span>
              </div>
            </div>
          </div>

          {/* Add Public Holiday Quick Bar on this date (Admin Free or User Pay) */}
          {onOpenAddHoliday && (
            isAdmin ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Publish Holiday for {day} {ENG_MONTHS[month]} {year}</span>
                  </div>
                  <div className="text-[11px] text-amber-800 font-medium mt-0.5">
                    Free addition for lifetime • Syncs automatically to all users worldwide in real-time
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAddHoliday(dateKey)}
                  className="px-3.5 py-2 rounded-xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition shadow-sm shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#f1c40f]" />
                  <span>+ Add Holiday</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs gap-2">
                <span className="text-slate-600 font-medium">Want to publish a public holiday for {day} {ENG_MONTHS[month]}?</span>
                <button
                  type="button"
                  onClick={() => onOpenAddHoliday(dateKey)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-amber-400 hover:text-amber-900 text-slate-800 font-bold text-xs flex items-center gap-1 transition shadow-2xs cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>+ Add Public Holiday</span>
                </button>
              </div>
            )
          )}

          {/* Holidays / Festivals */}
          {holidays.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>Holiday / Observance</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold">
                  Khublei Sngi Leh Kmen
                </span>
              </span>
              {holidays.map(h => {
                const isOwner = !!(
                  (currentUserId && h.userId && h.userId === currentUserId) ||
                  (currentUserEmail && h.userEmail && h.userEmail.toLowerCase() === currentUserEmail.toLowerCase())
                );
                const createdTime = h.createdAt ? new Date(h.createdAt).getTime() : 0;
                const elapsed = Date.now() - createdTime;
                const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
                const remainingDays = createdTime > 0 ? Math.max(0, Math.ceil((sevenDaysMs - elapsed) / (24 * 60 * 60 * 1000))) : 7;
                const isWithin7Days = createdTime === 0 || elapsed <= sevenDaysMs;
                const canEdit = !!onEditHolidayTitle && (isAdmin || (isOwner && isWithin7Days));
                const canDelete = !!onDeleteHoliday && (isAdmin || isOwner);
                const isEditingThis = editingHolidayId === h.id;

                return (
                  <div
                    key={h.id}
                    className="rounded-2xl border-2 border-amber-300 bg-linear-to-br from-amber-50 via-amber-100/50 to-orange-50 p-4 text-slate-800 shadow-sm space-y-2.5"
                  >
                    {isEditingThis ? (
                      /* Inline Name Editor */
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
                            onClick={() => handleSaveEdit(h.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#0e2a3a] text-white font-bold hover:bg-slate-800 disabled:opacity-50 transition"
                          >
                            {isSavingEdit ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-extrabold text-amber-950 text-base md:text-lg leading-tight">
                              {h.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {isOwner && !h.name.toLowerCase().includes('soul') && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-300 shrink-0">
                                  ⭐ Added by You
                                </span>
                              )}
                              {!h.name.toLowerCase().includes('soul') && h.badge && h.badge === '1Y' ? (
                                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full border shrink-0 flex items-center gap-1 bg-amber-200 text-amber-950 border-amber-400">
                                  <span>🗓️ 1Y Temporary</span>
                                </span>
                              ) : !h.name.toLowerCase().includes('soul') && h.year && h.year > 0 ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300 shrink-0">
                                  🗓️ {h.year} Only
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                                  ♾️ Every Year
                                </span>
                              )}
                            </div>
                          </div>

                          {h.userEmail && !h.name.toLowerCase().includes('soul') && !ADMIN_EMAILS.some(a => a.toLowerCase() === h.userEmail?.toLowerCase()) && (
                            <div className="text-[11px] text-slate-600 font-medium">
                              Published by: <strong>{h.userEmail}</strong>
                              {h.expiryDate && h.badge === '1Y' && (
                                <span className="ml-2 text-amber-900">(Valid until {h.expiryDate})</span>
                              )}
                            </div>
                          )}

                          {h.khasiName && h.khasiName !== h.name && (
                            <div className="text-xs font-bold text-amber-900 bg-amber-200/90 px-2.5 py-1 rounded-lg inline-block border border-amber-300/80 leading-snug">
                              {h.khasiName}
                            </div>
                          )}
                        </div>
                        
                        {/* Traditional Wishes */}
                        {(h.wishKhasi || h.wishEnglish) && (
                          <div className="p-3 rounded-xl bg-white/80 border border-amber-200/80 space-y-1 shadow-2xs">
                            {h.wishKhasi && (
                              <p className="text-xs font-extrabold text-amber-950">
                                ✨ “{h.wishKhasi}”
                              </p>
                            )}
                            {h.wishEnglish && (
                              <p className="text-[11px] text-slate-700 italic">
                                “{h.wishEnglish}”
                              </p>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-amber-900/90 leading-relaxed">{h.description}</p>

                        {/* Owner & Admin Actions: Edit Name (within 7 days) and Delete anytime */}
                        {(canEdit || canDelete || (isOwner && !isWithin7Days)) && (
                          <div className="pt-2 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {canEdit && (
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(h)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                                  title="Edit holiday name"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit Name</span>
                                  {isOwner && !isAdmin && (
                                    <span className="text-[10px] font-semibold text-amber-800">
                                      ({remainingDays}d left)
                                    </span>
                                  )}
                                </button>
                              )}

                              {isOwner && !isWithin7Days && !isAdmin && (
                                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium bg-white/80 px-2 py-1 rounded-lg border border-slate-200">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>7-day edit window closed</span>
                                </span>
                              )}
                            </div>

                            {canDelete && (
                              confirmDeleteId === h.id ? (
                                <div className="w-full mt-2 p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs space-y-2">
                                  <div className="font-extrabold text-rose-950 flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                    <span>Delete "{h.name}" from calendar?</span>
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
                                      disabled={deletingHolidayId === h.id}
                                      onClick={() => executeDeleteHoliday(h)}
                                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                                    >
                                      {deletingHolidayId === h.id ? 'Deleting...' : 'Yes, Delete'}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => { setConfirmDeleteId(h.id); setDeleteError(null); }}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs flex items-center gap-1 transition shadow-2xs cursor-pointer"
                                  title="Delete holiday"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Holiday</span>
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Personal Phone Events & Notes (Private) */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>📱 Private Marks & Notes ({notes.length})</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                🔒 Saved on this phone only
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 leading-relaxed">
              <span className="font-extrabold text-indigo-950 block mb-0.5">🎂 100% Free Personal Marks (Private on this phone):</span>
              Mark your <strong>Birthday</strong>, family anniversaries, or reminders here. These are saved <strong>only on your phone for free</strong> without any sign-in or payment, just like Google Calendar.
            </div>

            {/* Note items list */}
            {notes.length > 0 ? (
              <div className="space-y-2">
                {notes.map(note => {
                  const isBirthday = note.category === 'birthday';
                  const isAnniversary = note.category === 'anniversary';
                  const isShopping = note.category === 'shopping';

                  return (
                    <div
                      key={note.id}
                      className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition ${
                        isBirthday
                          ? 'border-pink-300 bg-pink-50/70 text-pink-950 shadow-2xs'
                          : isAnniversary
                          ? 'border-purple-300 bg-purple-50/70 text-purple-950 shadow-2xs'
                          : isShopping
                          ? 'border-teal-300 bg-teal-50/60 text-teal-950 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-800 shadow-2xs'
                      }`}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          {isBirthday && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-pink-200 text-pink-900 flex items-center gap-1">
                              <span>🎂</span>
                              <span>Birthday</span>
                            </span>
                          )}
                          {isAnniversary && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 flex items-center gap-1">
                              <span>🎉</span>
                              <span>Anniversary</span>
                            </span>
                          )}
                          {isShopping && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 flex items-center gap-1">
                              <span>🛒</span>
                              <span>Shopping</span>
                            </span>
                          )}
                          {(!note.category || note.category === 'general' || note.category === 'event' || note.category === 'meeting') && (
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              Personal Note
                            </span>
                          )}
                        </div>
                        <div className="text-xs leading-relaxed break-words font-medium">
                          {note.text}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteNote(dateKey, note.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1"
                        title="Delete private note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 text-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                No personal marks or birthdays saved on your phone for this date yet.
              </div>
            )}

            {/* Add note / event form */}
            <form onSubmit={handleAdd} className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-600 text-[11px]">Choose:</span>
                {[
                  { id: 'birthday', label: '🎂 Birthday (Free)' },
                  { id: 'anniversary', label: '🎉 Anniversary (Free)' },
                  { id: 'general', label: '📝 Note (Free)' },
                  { id: 'shopping', label: '🛒 Shopping (Free)' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setNewNoteCategory(cat.id as DayNote['category'])}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      newNoteCategory === cat.id
                        ? 'bg-[#0e2a3a] text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder={
                    newNoteCategory === 'birthday'
                      ? "Whose birthday? (e.g., My Birthday, Mom's Birthday, Bah John...)"
                      : newNoteCategory === 'anniversary'
                      ? "Anniversary name (e.g., Wedding Anniversary, Milestone...)"
                      : newNoteCategory === 'shopping'
                      ? "Shopping list (e.g., Buy Kwai, ginger, and honey at Iewduh...)"
                      : "Personal note or reminder..."
                  }
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="px-4 py-2 rounded-lg bg-[#0e2a3a] text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 transition flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#f1c40f]" />
                  <span>
                    {newNoteCategory === 'birthday' ? 'Save Birthday' : newNoteCategory === 'anniversary' ? 'Save Anniversary' : 'Save'}
                  </span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-medium">
          <button
            onClick={() => onNavigateDay(-1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous Day
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition font-semibold"
          >
            Close
          </button>

          <button
            onClick={() => onNavigateDay(1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 transition"
          >
            Next Day
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
