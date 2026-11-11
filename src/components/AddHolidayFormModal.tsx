import React, { useState } from 'react';
import { X, Calendar, Sparkles, CheckCircle2, ShieldCheck, Loader2, AlertTriangle, Clock } from 'lucide-react';
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
    wish?: string;
  }) => Promise<any>;
  onNeedMoreSlots: () => void;
  onOpenRules?: () => void;
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
  onNeedMoreSlots,
  onOpenRules
}) => {
  // Pre-select type based on available slots
  const initialType: 'temp' | 'perm' = permSlotsCount > 0 && tempSlotsCount === 0 ? 'perm' : 'temp';
  const [type, setType] = useState<'temp' | 'perm'>(initialType);

  const today = new Date();
  const defaultYear = today.getFullYear() < 2025 ? 2026 : today.getFullYear();
  const defaultMonth = String(today.getMonth() + 1).padStart(2, '0');
  const defaultDay = String(today.getDate()).padStart(2, '0');

  const [title, setTitle] = useState('');
  const [wish, setWish] = useState('');
  const [selectedDate, setSelectedDate] = useState(initialDate || `${defaultYear}-${defaultMonth}-${defaultDay}`);
  const [saving, setSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTitle, setSubmittedTitle] = useState('');
  const [submittedDate, setSubmittedDate] = useState('');
  const [submittedType, setSubmittedType] = useState<'temp' | 'perm'>('temp');
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

    const holidayTitle = title.trim();
    const holidayDate = selectedDate;
    const holidayType = type;

    try {
      await onSaveHoliday({
        title: holidayTitle,
        date: holidayDate,
        type: holidayType,
        orderId,
        wish: wish.trim() || undefined
      });

      setSubmittedTitle(holidayTitle);
      setSubmittedDate(holidayDate);
      setSubmittedType(holidayType);
      setIsSubmitted(true);
      setSaving(false);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to publish holiday to Firestore.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 overflow-hidden">
      <div 
        className="w-full h-full sm:h-auto sm:max-h-[92vh] max-w-xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden border-0 sm:border sm:border-slate-200 flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-holiday-title"
      >
        {/* Header - Fixed on top, always visible with small X button */}
        <div className="bg-[#0e2a3a] text-white p-4 sm:p-5 shrink-0 border-b border-white/10 relative z-20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#f1c40f] text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                <Calendar className="w-4 h-4 text-slate-950" />
              </div>
              <div className="min-w-0">
                <h3 id="add-holiday-title" className="text-base sm:text-lg font-black font-display tracking-tight text-white leading-tight truncate">
                  Add Public Holiday
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-tight truncate">
                  Public holidays appear on the calendar for all users worldwide
                </p>
              </div>
            </div>

            {/* Small X button on top right to cancel or exit */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition cursor-pointer shrink-0"
              aria-label="Close / Exit"
              title="Close / Exit"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slot Balance & Rule Bar - Fixed below header */}
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-50 border-b border-slate-200 text-xs shrink-0 z-10">
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

        {isSubmitted ? (
          /* Confirmation Screen */
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {isAdmin ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>

                <div className="space-y-1.5 max-w-md">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Live Worldwide
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900">
                    Holiday Published Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    "{submittedTitle}" is immediately live on the calendar for all users worldwide.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner ring-8 ring-amber-50">
                  <Clock className="w-9 h-9 text-amber-600 animate-pulse" />
                </div>

                <div className="space-y-2.5 max-w-md">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                    ⏳ Under Admin Review
                  </span>

                  {/* Exact wording requested by user */}
                  <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 leading-tight">
                    Your holiday is under review, wait for admin approve.
                  </h3>

                  <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 font-bold space-y-1">
                    <p>
                      Ka sngi shuti jong phi ka dang don hapoh ka jingpeit bniah, sngewbha ap ia ka jingmynjur jong u Admin.
                    </p>
                    <p className="text-[11px] text-amber-800 font-medium">
                      Notification has been sent to the Admin review box. Once approved, it will automatically appear live on the calendar for all users worldwide.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Submission Summary Card */}
            <div className="w-full max-w-md p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs shadow-2xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Holiday Title:</span>
                <span className="font-extrabold text-slate-900">{submittedTitle}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Date:</span>
                <span className="font-extrabold text-slate-900">{submittedDate}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Duration:</span>
                <span className="font-extrabold text-slate-900">
                  {submittedType === 'temp' ? 'Temporary (1 Year)' : 'Permanent (Every Year)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Status:</span>
                <span className={`font-black px-2.5 py-0.5 rounded-md text-[11px] ${
                  isAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {isAdmin ? 'Active (Live)' : 'Pending Admin Approval'}
                </span>
              </div>
            </div>

            {/* Dismiss button */}
            <div className="pt-2 w-full max-w-md">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-extrabold text-xs shadow-md active:scale-98 transition cursor-pointer"
              >
                OK / Got It
              </button>
            </div>
          </div>
        ) : (
          /* Form - Flex column with scrollable body and fixed bottom action bar */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
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

              {/* Warning Notice above Holiday Name */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border-2 border-red-300 text-slate-900 flex items-start gap-2.5 shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed space-y-0.5 flex-1">
                  <p className="font-extrabold text-red-700">
                    Please read the rules carefully before adding any holiday.
                  </p>
                  <p className="font-bold text-orange-900">
                    Sngewbha pule bha ia ki kyndon ha shwa ban buh sngi shuti.
                  </p>
                  {onOpenRules && (
                    <button
                      type="button"
                      onClick={onOpenRules}
                      className="mt-1 text-[11px] font-extrabold text-red-800 hover:text-red-950 underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>📜 View All Rules / Pule ia ki Kyndon &rarr;</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title / Holiday Name */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">
                  Holiday Name *
                </label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Holiday Name / Buh Kyrteng Sngi Shuti"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                />
              </div>

              {/* Wishing Box (Optional) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span>Wishing Box • Ka Jingkitbok Kitrwiang (Optional)</span>
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Optional
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Enter holiday wish / greeting (e.g. Khublei Behdeiñkhlam / Synod ba suk ba kmen ia phi baroh!)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                />
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  When users click on this holiday, they will see this wish in a greeting card like normal holidays. If left blank, a festive default wish will be generated automatically.
                </p>
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

              {/* Review Process Notice */}
              {!isAdmin && (
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 leading-relaxed text-[11px]">
                    <p className="font-extrabold text-amber-900">
                      Holiday Approval System:
                    </p>
                    <p className="text-amber-800">
                      When you submit, your holiday will be under review. Please wait for admin approval before it appears live on the public calendar.
                    </p>
                  </div>
                </div>
              )}

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

            </div>

            {/* Buttons - Fixed at bottom, identical styling and function */}
            <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0 z-20">
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
                disabled={saving || !title.trim() || (!isAdmin && availableSlotsForSelectedType <= 0)}
                className="px-6 py-2.5 rounded-xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f1c40f]" />
                    <span>Submitting for Review...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#f1c40f]" />
                    <span>
                      {isAdmin ? 'Publish to Calendar' : 'Submit for Admin Approval'}
                    </span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
