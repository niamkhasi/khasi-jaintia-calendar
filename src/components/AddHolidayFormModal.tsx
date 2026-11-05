import React, { useState } from 'react';
import { X, Calendar, Sparkles, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { ENG_MONTHS, KHASI_MONTHS } from '../data/khasiCalendarData';

interface AddHolidayFormModalProps {
  onClose: () => void;
  tempSlotsCount: number;
  permSlotsCount: number;
  userEmail: string;
  orderId?: string;
  isAdmin?: boolean;
  initialDate?: string;
  onSaveHoliday: (data: {
    title: string;
    date: string; // YYYY-MM-DD
    type: 'temp' | 'perm';
    orderId?: string;
  }) => Promise<any>;
  onNeedMoreSlots: () => void;
}

export const AddHolidayFormModal: React.FC<AddHolidayFormModalProps> = ({
  onClose,
  tempSlotsCount,
  permSlotsCount,
  userEmail,
  orderId,
  isAdmin = false,
  initialDate,
  onSaveHoliday,
  onNeedMoreSlots
}) => {
  // Pre-select type based on available slots
  const initialType: 'temp' | 'perm' = permSlotsCount > 0 && tempSlotsCount === 0 ? 'perm' : 'temp';
  const [type, setType] = useState<'temp' | 'perm'>(initialType);

  const today = new Date();
  const defaultYear = today.getFullYear() < 2025 ? 2026 : today.getFullYear();
  const defaultMonth = String(today.getMonth() + 1).padStart(2, '0');
  const defaultDay = String(today.getDate()).padStart(2, '0');

  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(initialDate || `${defaultYear}-${defaultMonth}-${defaultDay}`);
  const [saving, setSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableSlotsForSelectedType = isAdmin ? 999 : (type === 'temp' ? tempSlotsCount : permSlotsCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || isSubmitted) return;
    if (!title.trim() || !selectedDate) return;

    if (!isAdmin && availableSlotsForSelectedType <= 0) {
      setErrorMsg(`No ${type === 'temp' ? 'Temporary' : 'Permanent'} slots available. Please purchase a slot.`);
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await onSaveHoliday({
        title: title.trim(),
        date: selectedDate,
        type,
        orderId
      });

      setIsSubmitted(true);
      setSuccessMsg(
        isAdmin 
          ? `Successfully published "${title.trim()}" to the calendar!` 
          : `Successfully published "${title.trim()}"! 1 holiday slot consumed. To add more holidays, purchase additional slots.`
      );
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to publish holiday to Firestore.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-holiday-title"
      >
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#f1c40f]" />
              <h3 id="add-holiday-title" className="text-lg font-black font-display tracking-tight">
                Add Public Holiday
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Public holidays appear on the calendar for all users worldwide.
          </p>
        </div>

        {/* Slot Balance & Rule Bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs">
          {isAdmin ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full font-bold text-xs bg-slate-200 text-slate-800">
                  Authorized Administrator
                </span>
                <span className="text-[11px] text-slate-600 font-semibold">
                  Free lifetime publishing enabled
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600">Your Available Slots:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] ${
                    tempSlotsCount > 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-200 text-slate-500 line-through'
                  }`}>
                    {tempSlotsCount} Temp (1Y)
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] ${
                    permSlotsCount > 0 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-200 text-slate-500 line-through'
                  }`}>
                    {permSlotsCount} Perm (∞)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onNeedMoreSlots}
                  className="text-xs font-black text-blue-700 hover:text-blue-900 underline flex items-center gap-1 cursor-pointer"
                >
                  <span>+ Buy More Slots</span>
                </button>
              </div>

              {/* Strict 1 Buy = 1 Holiday Rule notice */}
              <div className="text-[11px] text-slate-600 bg-amber-50/70 border border-amber-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 font-medium">
                <span className="text-amber-700 font-black">★ Rule:</span>
                <span>
                  <strong>1 Buy = 1 Holiday only.</strong> Publishing will use 1 slot. To add more holidays, you must buy more slots.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Slot Type Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 block">
              Choose Holiday Type:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Temp Option */}
              <button
                type="button"
                onClick={() => setType('temp')}
                className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  type === 'temp'
                    ? 'border-[#0e2a3a] bg-amber-50/80 shadow-xs ring-1 ring-[#0e2a3a]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px]">
                    1Y BADGE
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {isAdmin ? 'Unlimited' : `${tempSlotsCount} available`}
                  </span>
                </div>
                <div className="mt-2 font-extrabold text-xs text-slate-900">
                  Temporary (1 Year)
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Shows only on the chosen year
                </div>
              </button>

              {/* Perm Option */}
              <button
                type="button"
                onClick={() => setType('perm')}
                className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  type === 'perm'
                    ? 'border-emerald-700 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-700'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black text-[10px]">
                    ∞ BADGE
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {isAdmin ? 'Unlimited' : `${permSlotsCount} available`}
                  </span>
                </div>
                <div className="mt-2 font-extrabold text-xs text-emerald-950">
                  Permanent (Every Year)
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Repeats forever every year
                </div>
              </button>

            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-extrabold text-slate-700 block mb-1">
              Holiday Title *
            </label>
            <input
              type="text"
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ka Seng Khasi Community Gathering"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-xs font-extrabold text-slate-700 block mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {type === 'temp' 
                ? 'Will be displayed only on the chosen year (e.g. 2027), remaining recorded in that year.' 
                : 'Will appear on this day & month every year (2025–2100) forever.'}
            </p>
          </div>

          {/* Creator email display */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Publishing as:</span>
            <span className="font-bold text-slate-800">{userEmail}</span>
          </div>

          {/* Private Birthday Note */}
          <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
            💡 <strong>Personal Birthdays:</strong> To mark a birthday for yourself or family privately, tap the date directly on the calendar grid to save it 100% free on your phone.
          </div>

          {/* Zero Slot Warning & Buy Prompt */}
          {!isAdmin && availableSlotsForSelectedType <= 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-extrabold text-amber-950">
                  0 {type === 'temp' ? 'Temporary (1Y)' : 'Permanent (∞)'} slots remaining.
                </span>
                <p className="text-[11px] text-amber-800">
                  1 buy = 1 holiday. To publish this holiday, please buy a slot.
                </p>
              </div>
              <button
                type="button"
                onClick={onNeedMoreSlots}
                className="px-3.5 py-1.5 rounded-lg bg-[#0e2a3a] hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f1c40f]" />
                <span>Buy {type === 'temp' ? 'Temporary (₹499)' : 'Permanent (₹999)'}</span>
              </button>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || isSubmitted || !title.trim() || (!isAdmin && availableSlotsForSelectedType <= 0)}
              className="px-6 py-2.5 rounded-xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f1c40f]" />
                  <span>Saving to Calendar...</span>
                </>
              ) : isSubmitted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Published!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#f1c40f]" />
                  <span>
                    {isAdmin ? 'Publish to Calendar' : 'Publish to Calendar (Use 1 Slot)'}
                  </span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
