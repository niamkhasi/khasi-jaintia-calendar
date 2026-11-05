import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, AlertTriangle, Calendar, User, Search, Loader2, CheckCircle2, MessageSquare, Edit3 } from 'lucide-react';
import { AllHolidayItem, HolidayReport } from '../types/calendar';
import { ADMIN_EMAILS } from '../hooks/useFirebaseHolidays';

interface AdminHolidayManagerModalProps {
  onClose: () => void;
  currentUserEmail: string;
  allHolidays: AllHolidayItem[];
  reports: HolidayReport[];
  onDeleteHoliday: (holidayId: string, holidayName?: string) => Promise<void>;
  onEditHolidayTitle?: (holidayId: string, newTitle: string) => Promise<void>;
}

export const AdminHolidayManagerModal: React.FC<AdminHolidayManagerModalProps> = ({
  onClose,
  currentUserEmail,
  allHolidays,
  reports,
  onDeleteHoliday,
  onEditHolidayTitle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'holidays' | 'reports'>('holidays');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [savingEditId, setSavingEditId] = useState<string | null>(null);

  // Sort by newest createdAt descending
  const sortedHolidays = [...allHolidays].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const filteredHolidays = sortedHolidays.filter((h) => {
    const q = searchQuery.toLowerCase();
    return (
      h.title.toLowerCase().includes(q) ||
      h.userEmail.toLowerCase().includes(q) ||
      h.date.includes(q)
    );
  });

  const executeDelete = async (holiday: AllHolidayItem) => {
    setDeletingId(holiday.id);
    setErrorMsg(null);
    setDeleteSuccessMsg(null);

    try {
      await onDeleteHoliday(holiday.id, holiday.title);
      setConfirmDeleteId(null);
      setDeleteSuccessMsg(`Deleted "${holiday.title}" from Firestore.`);
      setTimeout(() => setDeleteSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete holiday.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = async (holidayId: string) => {
    if (!editingTitle.trim() || !onEditHolidayTitle) return;
    setSavingEditId(holidayId);
    setErrorMsg(null);
    try {
      await onEditHolidayTitle(holidayId, editingTitle.trim());
      setDeleteSuccessMsg(`Updated holiday title to "${editingTitle.trim()}".`);
      setEditingId(null);
      setTimeout(() => setDeleteSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update holiday title.');
    } finally {
      setSavingEditId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-title"
      >
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-5 h-5 text-[#f1c40f]" />
              </div>
              <div>
                <h3 id="admin-title" className="text-lg font-black font-display tracking-tight flex items-center gap-2">
                  <span>Administrator Control Panel</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] tracking-wider uppercase">
                    Admin Only
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  Signed in as <strong>{currentUserEmail}</strong> (Authorized Admins: {ADMIN_EMAILS.join(' & ')})
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-xs">
            <button
              onClick={() => setActiveTab('holidays')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                activeTab === 'holidays'
                  ? 'bg-[#f1c40f] text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>All Firestore Holidays ({allHolidays.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Complaints & Reports ({reports.length})</span>
            </button>
          </div>
        </div>

        {/* Search bar & status messages */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          {deleteSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{deleteSuccessMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {activeTab === 'holidays' && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, date (YYYY-MM-DD), or user email..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Holidays list ordered by newest with RED DELETE button */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'holidays' ? (
            filteredHolidays.length > 0 ? (
              <div className="space-y-2.5">
                {filteredHolidays.map((holiday) => {
                  const isDeleting = deletingId === holiday.id;
                  const isTemp = holiday.type === 'temp';

                  return (
                    <div
                      key={holiday.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-[#0e2a3a] bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                            📅 {holiday.date}
                          </span>

                          <span className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase border ${
                            isTemp 
                              ? 'bg-amber-100 text-amber-950 border-amber-300' 
                              : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                          }`}>
                            {isTemp ? '1Y Temporary' : '∞ Permanent'}
                          </span>

                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                            Status: {holiday.status}
                          </span>

                          {holiday.expiryDate && isTemp && (
                            <span className="text-[10px] text-slate-500">
                              (Expires: {holiday.expiryDate})
                            </span>
                          )}
                        </div>

                        {editingId === holiday.id ? (
                          <div className="pt-2 space-y-2">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                              placeholder="New title..."
                              autoFocus
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveEdit(holiday.id)}
                                disabled={savingEditId === holiday.id || !editingTitle.trim()}
                                className="px-3 py-1 rounded-lg bg-[#0e2a3a] text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-50"
                              >
                                {savingEditId === holiday.id ? 'Saving...' : 'Save Title'}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <h4 className="text-sm font-extrabold text-slate-900 pt-0.5">
                            {holiday.title}
                          </h4>
                        )}

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>Creator: <strong>{holiday.userEmail}</strong></span>
                          </span>
                          {holiday.orderId && (
                            <span className="font-mono text-[11px] text-slate-400">
                              Order: {holiday.orderId}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onEditHolidayTitle && editingId !== holiday.id && (
                          <button
                            onClick={() => {
                              setEditingId(holiday.id);
                              setEditingTitle(holiday.title);
                            }}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                            title="Edit holiday title"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        )}

                        {/* RED DELETE BUTTON / INLINE CONFIRMATION */}
                        {confirmDeleteId === holiday.id ? (
                          <div className="flex flex-col items-end gap-1.5 p-2 rounded-xl bg-rose-50 border border-rose-300">
                            <span className="text-[11px] font-black text-rose-950 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Permanently delete?</span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => executeDelete(holiday)}
                                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs disabled:opacity-50 flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setConfirmDeleteId(holiday.id); setErrorMsg(null); }}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                            title="Delete from Firestore for all users"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>RED DELETE</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                {searchQuery ? 'No holidays matched your search query.' : 'No holidays recorded in Firestore all_holidays collection yet.'}
              </div>
            )
          ) : (
            /* Tab 2: Reports */
            reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map((rep, idx) => (
                  <div key={rep.id || idx} className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-rose-950 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Report on: {rep.holidayTitle}</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 bg-white p-2.5 rounded-xl border border-rose-100 font-medium">
                      “{rep.reason}”
                    </p>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Reporter: {rep.reporterEmail}</span>
                      <span className="font-mono text-[10px]">ID: {rep.holidayId}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No reports or complaints submitted yet. Everything is running smoothly!
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition"
          >
            Close Admin Screen
          </button>
        </div>
      </div>
    </div>
  );
};
