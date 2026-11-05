import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, ShieldCheck, LogIn, LogOut, Sparkles, CheckCircle2, Edit2, Copy, RotateCcw } from 'lucide-react';
import { ENG_MONTHS, KHASI_MONTHS, BEHDEINKHLAM_TEMPLATES, LYMPUNG_2026_TEMPLATES, ALL_2026_TEMPLATES, HolidayTemplate } from '../data/khasiCalendarData';
import { Holiday } from '../types/calendar';
import { User } from 'firebase/auth';

interface FirebaseHolidayManagerModalProps {
  onClose: () => void;
  currentUser: User | null;
  isAdmin: boolean;
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
  customHolidays: Holiday[];
  onAddHoliday: (data: {
    name: string;
    khasiName?: string;
    day: number;
    month: number;
    year: number;
    type: 'cultural' | 'state' | 'religious' | 'national';
    description?: string;
    wishKhasi?: string;
    wishEnglish?: string;
  }) => Promise<void>;
  onUpdateHoliday?: (id: string, data: {
    name: string;
    khasiName?: string;
    day: number;
    month: number;
    year: number;
    type: 'cultural' | 'state' | 'religious' | 'national';
    description?: string;
    wishKhasi?: string;
    wishEnglish?: string;
  }) => Promise<void>;
  onDeleteHoliday: (id: string) => Promise<void>;
}

export const FirebaseHolidayManagerModal: React.FC<FirebaseHolidayManagerModalProps> = ({
  onClose,
  currentUser,
  isAdmin,
  onLogin,
  onLogout,
  customHolidays,
  onAddHoliday,
  onUpdateHoliday,
  onDeleteHoliday,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [khasiName, setKhasiName] = useState('');
  const [month, setMonth] = useState<number>(6); // July
  const [day, setDay] = useState<number>(14);
  const [year, setYear] = useState<number>(2026);
  const [durationMode, setDurationMode] = useState<'temporary' | 'permanent'>('temporary');
  const [type, setType] = useState<'cultural' | 'state' | 'religious' | 'national'>('cultural');
  const [description, setDescription] = useState('');
  const [wishKhasi, setWishKhasi] = useState('');
  const [wishEnglish, setWishEnglish] = useState('');

  const [quickYear, setQuickYear] = useState<number>(2027);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartEdit = (hol: Holiday) => {
    setEditingId(hol.id);
    setName(hol.name);
    setKhasiName(hol.khasiName || '');
    setMonth(hol.month);
    setDay(hol.day);
    if (!hol.year || hol.year === 0) {
      setDurationMode('permanent');
      setYear(2026);
    } else {
      setDurationMode('temporary');
      setYear(hol.year);
    }
    setType(hol.type === 'user_paid' ? 'cultural' : hol.type);
    setDescription(hol.description || '');
    setWishKhasi(hol.wishKhasi || '');
    setWishEnglish(hol.wishEnglish || '');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setKhasiName('');
    setDescription('');
    setWishKhasi('');
    setWishEnglish('');
  };

  const handleLoadTemplate = (tmpl: HolidayTemplate, targetYear: number = 2027) => {
    setEditingId(null);
    setName(tmpl.name);
    setKhasiName(tmpl.khasiName);
    setMonth(tmpl.defaultMonth);
    setDay(tmpl.defaultDay);
    setYear(targetYear);
    setDurationMode('temporary');
    setType('cultural');
    setDescription(tmpl.description);
    setWishKhasi(tmpl.wishKhasi);
    setWishEnglish(tmpl.wishEnglish);
    setSuccessMsg(`Loaded template for "${tmpl.name}". You can now set the exact date for ${targetYear} and click Publish!`);
  };

  const handleCopyFor2027 = (hol: Holiday) => {
    setEditingId(null);
    setName(hol.name);
    setKhasiName(hol.khasiName || '');
    setMonth(hol.month);
    setDay(hol.day);
    setYear(2027);
    setDurationMode('temporary');
    setType(hol.type === 'user_paid' ? 'cultural' : hol.type);
    setDescription(hol.description || '');
    setWishKhasi(hol.wishKhasi || '');
    setWishEnglish(hol.wishEnglish || '');
    setSuccessMsg(`Ready to schedule "${hol.name}" for Year 2027! Choose the new month & day, then click Publish.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const targetYear = durationMode === 'permanent' ? 0 : year;
    const payload = {
      name: name.trim(),
      khasiName: khasiName.trim() || undefined,
      day,
      month,
      year: targetYear,
      type,
      description: description.trim() || undefined,
      wishKhasi: wishKhasi.trim() || undefined,
      wishEnglish: wishEnglish.trim() || undefined,
    };

    try {
      if (editingId && onUpdateHoliday) {
        await onUpdateHoliday(editingId, payload);
        setSuccessMsg(`Successfully updated "${name.trim()}" in Firebase!`);
        setEditingId(null);
      } else {
        await onAddHoliday(payload);
        const modeText = durationMode === 'permanent' 
          ? 'Permanent / Lifetime (Every Year 2025–2100)' 
          : `Temporary (${year} Only)`;
        setSuccessMsg(`Successfully published "${name.trim()}" as ${modeText} to Firebase!`);
      }

      setName('');
      setKhasiName('');
      setDescription('');
      setWishKhasi('');
      setWishEnglish('');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save holiday to Firebase.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, holidayName: string) => {
    if (!confirm(`Are you sure you want to remove "${holidayName}" from Firebase?`)) return;
    try {
      await onDeleteHoliday(id);
      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete holiday.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#f1c40f]" />
              <h3 className="text-xl font-bold font-display">Manage Holidays via Firebase</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            Add or update festival dates anytime in Firebase Firestore. All added holidays are stored in the cloud and synced in real-time across all calendar users.
          </p>
        </div>

        {/* Auth Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="font-medium text-slate-700">
                Logged in as <strong>{currentUser.email}</strong>
              </span>
              {isAdmin ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Admin Verified</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                  Not Admin
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-[#f1c40f]" />
              <span>Admin verification required (<strong>niamkhasi@gmail.com</strong>)</span>
            </div>
          )}

          <div>
            {currentUser ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e2a3a] hover:bg-slate-800 text-white font-bold transition shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#f1c40f]" />
                <span>Admin Login with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Info Banner for regular users vs admin */}
        <div className="px-5 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
          <span className="text-base leading-none">📱</span>
          <div className="leading-relaxed">
            <strong>For Calendar Users:</strong> Want to mark your own <strong>Birthday</strong>, anniversary, or private notes? You don't need to put them here! Just tap any date directly on the calendar grid. Your personal marks are stored <strong>100% privately on your phone</strong> and never shared with the public.
          </div>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-6">
          
          {/* Add / Edit Form */}
          {currentUser && isAdmin ? (
            <div className="space-y-4">
              {/* Quick-Schedule Temporary Festivals for 2027 and future years */}
              <div className="p-3.5 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>⚡ Quick Schedule Non-Fixed Holidays for Year:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-amber-900">Target Year:</span>
                    <select
                      value={quickYear}
                      onChange={e => setQuickYear(Number(e.target.value))}
                      className="px-2.5 py-1 text-xs font-extrabold rounded-lg border border-amber-400 bg-white text-slate-900 shadow-2xs focus:outline-hidden"
                    >
                      {Array.from({ length: 76 }, (_, i) => 2025 + i).map(y => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  Click any template below to load full Khasi names, descriptions, and wishes into the form for <strong>Year {quickYear}</strong>. You can then adjust the new month & day and click Publish!
                </p>

                {/* Section 1: Lympung & Sacred Gatherings */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-extrabold text-amber-950 flex items-center gap-1">
                    <span>🪔</span>
                    <span>Lympung & Sacred Indigenous Gatherings:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {LYMPUNG_2026_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.name}
                        type="button"
                        onClick={() => handleLoadTemplate(tmpl, quickYear)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-[11px] font-bold text-amber-950 shadow-2xs transition flex items-center gap-1 hover:border-amber-500"
                        title={`Schedule "${tmpl.name}" for ${quickYear}`}
                      >
                        <Plus className="w-3 h-3 text-amber-700" />
                        <span>{tmpl.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: 7 Behdeinkhlam Raij Festivals */}
                <div className="space-y-1.5 pt-1 border-t border-amber-200/60">
                  <div className="text-[11px] font-extrabold text-amber-950 flex items-center gap-1">
                    <span>🎋</span>
                    <span>7 Behdeiñkhlam Raij Festivals:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {BEHDEINKHLAM_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.name}
                        type="button"
                        onClick={() => handleLoadTemplate(tmpl, quickYear)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-[11px] font-bold text-amber-950 shadow-2xs transition flex items-center gap-1 hover:border-amber-500"
                        title={`Schedule "${tmpl.name}" for ${quickYear}`}
                      >
                        <Plus className="w-3 h-3 text-amber-700" />
                        <span>{tmpl.name.replace('Behdeiñkhlam ', '')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Holiday Form */}
              <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    {editingId ? (
                      <Edit2 className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#0fb9a0]" />
                    )}
                    <h4 className="text-sm font-extrabold text-[#0e2a3a]">
                      {editingId ? 'Edit Holiday in Firebase' : 'Add or Schedule Festival / Holiday'}
                    </h4>
                  </div>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-2 py-1 rounded-md bg-slate-200/80 hover:bg-slate-300 flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>

                {editingId && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center justify-between gap-2">
                    <span className="font-medium">
                      ✏️ Currently editing an existing holiday in Firebase. Modifying will update the date for all users.
                    </span>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-[11px] font-bold underline hover:text-amber-800"
                    >
                      Reset form
                    </button>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Festival Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Behdeinkhlam Festival"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Khasi / Pnar Name
                  </label>
                  <input
                    type="text"
                    value={khasiName}
                    onChange={e => setKhasiName(e.target.value)}
                    placeholder="e.g. Ka Behdeinkhlam"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                  />
                </div>
              </div>

              {/* Date pickers (Month & Day) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Month *
                  </label>
                  <select
                    value={month}
                    onChange={e => setMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-hidden"
                  >
                    {ENG_MONTHS.map((mName, idx) => (
                      <option key={idx} value={idx}>
                        {mName} ({KHASI_MONTHS[idx]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Day of Month (1–31) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={day}
                    onChange={e => setDay(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Holiday Duration Type (Temporary vs Permanent) */}
              <div className="space-y-2 pt-1 border-t border-slate-200">
                <label className="text-xs font-extrabold text-slate-800 block">
                  Schedule Type (Temporary vs Permanent) *
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Temporary (One Year Only) */}
                  <div
                    onClick={() => setDurationMode('temporary')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-start gap-2.5 ${
                      durationMode === 'temporary'
                        ? 'border-[#0e2a3a] bg-amber-50/80 shadow-xs ring-1 ring-[#0e2a3a]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="durationMode"
                      checked={durationMode === 'temporary'}
                      onChange={() => setDurationMode('temporary')}
                      className="mt-0.5 text-[#0e2a3a] focus:ring-[#0e2a3a]"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>🗓️ Temporary (One Year Only)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        For non-fixed festivals (like <em>Behdeiñkhlam</em>, <em>Lympung Sengkhihlang</em>, <em>Wangala</em>) whose date changes every year. Appears <strong>only in the chosen year</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Permanent (Lifetime / Every Year) */}
                  <div
                    onClick={() => setDurationMode('permanent')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-start gap-2.5 ${
                      durationMode === 'permanent'
                        ? 'border-emerald-700 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-700'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="durationMode"
                      checked={durationMode === 'permanent'}
                      onChange={() => setDurationMode('permanent')}
                      className="mt-0.5 text-emerald-700 focus:ring-emerald-700"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                        <span>♾️ Permanent (Every Year / Lifetime)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        For fixed holidays that fall on the exact same date every year (2025–2100) such as state days and fixed celebrations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duration Explanation & Target Year Picker */}
                {durationMode === 'temporary' ? (
                  <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-xl flex flex-wrap items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-950">Target Year:</span>
                      <select
                        value={year}
                        onChange={e => setYear(Number(e.target.value))}
                        className="px-3 py-1.5 text-xs font-extrabold rounded-lg border border-amber-400 bg-white text-slate-900 focus:outline-hidden"
                      >
                        {Array.from({ length: 76 }, (_, i) => 2025 + i).map(y => (
                          <option key={y} value={y}>
                            Year {y}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-[11px] text-amber-900 font-medium leading-tight">
                      📌 Appears <strong>ONLY in {year}</strong>. In {year + 1} and other years it will NOT show, so you can enter the new date when announced.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                    <span className="text-sm">✨</span>
                    <span className="leading-tight">
                      <strong>Lifetime / Every Year:</strong> This holiday will appear on <strong>{day} {ENG_MONTHS[month]} ({KHASI_MONTHS[month]})</strong> every single year from 2025 to 2100 automatically.
                    </span>
                  </div>
                )}
              </div>

              {/* Category Picker */}
              <div className="flex items-center gap-2 text-xs pt-1">
                <span className="font-bold text-slate-700">Category:</span>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  <option value="cultural">Cultural & Festival</option>
                  <option value="state">State & Memorial</option>
                  <option value="religious">Religious</option>
                  <option value="national">National</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description / Significance
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Details about the festival, origin, and rituals..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Khasi Wish / Greeting
                  </label>
                  <input
                    type="text"
                    value={wishKhasi}
                    onChange={e => setWishKhasi(e.target.value)}
                    placeholder="e.g. Khublei Behdeinkhlam ba kmen!"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    English Wish / Greeting
                  </label>
                  <input
                    type="text"
                    value={wishEnglish}
                    onChange={e => setWishEnglish(e.target.value)}
                    placeholder="e.g. Happy Behdeinkhlam Festival to all!"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#f1c40f]" />
                  <span>
                    {saving 
                      ? 'Saving to Firebase...' 
                      : editingId 
                        ? 'Update Holiday in Firebase' 
                        : 'Publish to Firebase'}
                  </span>
                </button>
              </div>
            </form>
          </div>
          ) : currentUser && !isAdmin ? (
            <div className="p-6 text-center rounded-xl border border-amber-200 bg-amber-50/70 space-y-3">
              <ShieldCheck className="w-9 h-9 text-amber-600 mx-auto" />
              <h4 className="text-sm font-extrabold text-amber-950">
                Administrator Privileges Required
              </h4>
              <p className="text-xs text-amber-900 max-w-md mx-auto leading-relaxed">
                You are currently signed in as <strong>{currentUser.email}</strong>. Only the calendar administrator (<strong>niamkhasi@gmail.com</strong>) has access to publish public holidays for all users.
              </p>
              <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 text-xs text-slate-700 max-w-md mx-auto text-left space-y-1.5 shadow-2xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>📱 Want to mark your personal events?</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  You can mark your <strong>Birthday</strong>, family anniversaries, or market shopping notes directly on your own phone! Just tap any date on the calendar. Those marks are saved only in your phone's memory and are never visible to the public.
                </p>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300 transition shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Switch Account</span>
              </button>
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 space-y-3">
              <Calendar className="w-8 h-8 text-[#f1c40f] mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">
                Admin Sign In Required
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Only the calendar administrator (<strong>niamkhasi@gmail.com</strong>) can publish public holidays for all users. If you are the administrator, sign in below.
              </p>
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e2a3a] text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-[#f1c40f]" />
                <span>Sign in as Admin (niamkhasi@gmail.com)</span>
              </button>
            </div>
          )}

          {/* List of Custom Holidays from Firebase */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Cloud Holidays in Firebase ({customHolidays.length})
              </h4>
              <span className="text-[11px] text-slate-400">
                Synced in real-time
              </span>
            </div>

            {customHolidays.length > 0 ? (
              <div className="space-y-2">
                {customHolidays.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-amber-700">
                          {item.day} {ENG_MONTHS[item.month]} ({KHASI_MONTHS[item.month]})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold uppercase">
                          {item.type}
                        </span>
                        {item.year && item.year > 0 ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold border border-amber-300 flex items-center gap-1">
                            <span>🗓️</span>
                            <span>Temporary ({item.year} Only)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center gap-1">
                            <span>♾️</span>
                            <span>Permanent (Lifetime / Every Year)</span>
                          </span>
                        )}
                      </div>

                      <h5 className="text-sm font-bold text-slate-900 mt-0.5">
                        {item.name} {item.khasiName && item.khasiName !== item.name ? `(${item.khasiName})` : ''}
                      </h5>

                      {item.description && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {item.wishKhasi && (
                        <p className="text-xs font-medium text-amber-900 mt-1 italic">
                          “{item.wishKhasi}”
                        </p>
                      )}
                    </div>

                    {currentUser && isAdmin && (
                      <div className="flex items-center gap-1 shrink-0 mt-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 font-bold text-xs transition border border-slate-200 hover:border-amber-400"
                          title="Edit festival details or date"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyFor2027(item)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-200 text-amber-950 font-bold text-xs transition border border-amber-300"
                          title="Schedule this festival for 2027"
                        >
                          <Copy className="w-3.5 h-3.5 text-amber-700" />
                          <span>2027</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                          title="Delete from Firebase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                No custom holidays added in Firebase yet. When you add a festival above, it will appear here and on the calendar!
              </div>
            )}
          </div>

          {/* Reference: 2026 Temporary Festivals Schedule */}
          <div className="p-3.5 bg-slate-100/90 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>🗓️</span>
                <span>2026 Temporary Festivals & Gatherings (Active in 2026 Only)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                13 Festivals (Year 2026 Only)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              These festivals are configured for <strong>2026 only</strong>. In 2027 they will not appear automatically, allowing you as admin to publish the new 2027 dates whenever they are officially announced!
            </p>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Lympung & Sacred Gatherings (6)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {LYMPUNG_2026_TEMPLATES.map((tmpl) => (
                  <div key={tmpl.name} className="flex items-center justify-between px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-[11px]">
                    <span className="font-medium text-slate-800">{tmpl.name}</span>
                    <span className="font-bold text-amber-800">{tmpl.defaultDay} {ENG_MONTHS[tmpl.defaultMonth]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                7 Behdeiñkhlam Raij Festivals (7)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {BEHDEINKHLAM_TEMPLATES.map((tmpl) => (
                  <div key={tmpl.name} className="flex items-center justify-between px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-[11px]">
                    <span className="font-medium text-slate-800">{tmpl.name}</span>
                    <span className="font-bold text-amber-800">{tmpl.defaultDay} {ENG_MONTHS[tmpl.defaultMonth]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
