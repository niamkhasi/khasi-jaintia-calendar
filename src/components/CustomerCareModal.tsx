import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  HelpCircle, 
  Image as ImageIcon,
  Bell,
  Check,
  Calendar as CalendarIcon,
  Clock,
  User,
  Loader2
} from 'lucide-react';
import { AllHolidayItem, Holiday } from '../types/calendar';
import { SUPPORT_EMAIL, SUPPORT_PHONE, ADMIN_EMAILS } from '../hooks/useFirebaseHolidays';
import { ENG_MONTHS, KHASI_MONTHS } from '../data/khasiCalendarData';
import { 
  holidayApprovalService, 
  HolidayNotification, 
  NOTIFICATIONS_UPDATED_EVENT 
} from '../services/holidayApprovalService';

interface CustomerCareModalProps {
  onClose: () => void;
  userEmail: string;
  isAdmin?: boolean;
  lastOrderId: string;
  allHolidays: AllHolidayItem[];
  onSubmitReport: (data: { holidayId: string; holidayTitle: string; reason: string }) => Promise<void>;
  onOpenBannerSettings?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onApproveHoliday?: (holidayId: string) => Promise<void>;
  onDenyHoliday?: (holidayId: string, reason?: string) => Promise<void>;
}

export const CustomerCareModal: React.FC<CustomerCareModalProps> = ({
  onClose,
  userEmail,
  isAdmin,
  lastOrderId,
  allHolidays,
  onSubmitReport,
  onOpenBannerSettings,
  onOpenPrivacyPolicy,
  onApproveHoliday,
  onDenyHoliday
}) => {
  // Only muniphawa@gmail.com and niamkhasi@gmail.com can see Banner Settings button
  const isAuthorizedBannerAdmin = Boolean(
    isAdmin || (
      userEmail &&
      ADMIN_EMAILS.some(email => email.toLowerCase() === userEmail.trim().toLowerCase())
    )
  );

  // Holiday Approval System Notifications State (Admin only)
  const [notifications, setNotifications] = useState<HolidayNotification[]>(() => {
    return holidayApprovalService.getNotifications();
  });
  const [activeNotifTab, setActiveNotifTab] = useState<'pending' | 'approved' | 'denied'>('pending');
  const [denyingHolidayId, setDenyingHolidayId] = useState<string | null>(null);
  const [denialReasonInput, setDenialReasonInput] = useState<string>('');
  const [actionStatus, setActionStatus] = useState<{ [id: string]: 'approving' | 'denying' }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(holidayApprovalService.getNotifications());
    };
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);
  }, []);

  const pendingCount = notifications.filter(n => n.status === 'pending').length;
  const approvedCount = notifications.filter(n => n.status === 'approved').length;
  const deniedCount = notifications.filter(n => n.status === 'denied').length;

  const filteredNotifications = notifications.filter(n => n.status === activeNotifTab);

  const handleApprove = async (holidayId: string, holidayTitle: string) => {
    setActionStatus(prev => ({ ...prev, [holidayId]: 'approving' }));
    try {
      if (onApproveHoliday) {
        await onApproveHoliday(holidayId);
      } else {
        await holidayApprovalService.approveHoliday(holidayId, userEmail || 'admin');
      }
      setToastMessage(`Holiday "${holidayTitle}" approved! It is now live on the calendar.`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Failed to approve holiday:', err);
    } finally {
      setActionStatus(prev => {
        const next = { ...prev };
        delete next[holidayId];
        return next;
      });
    }
  };

  const handleConfirmDeny = async (holidayId: string, holidayTitle: string) => {
    setActionStatus(prev => ({ ...prev, [holidayId]: 'denying' }));
    try {
      const reason = denialReasonInput.trim() || undefined;
      if (onDenyHoliday) {
        await onDenyHoliday(holidayId, reason);
      } else {
        await holidayApprovalService.denyHoliday(holidayId, userEmail || 'admin', reason);
      }
      setDenyingHolidayId(null);
      setDenialReasonInput('');
      setToastMessage(`Holiday "${holidayTitle}" denied.`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Failed to deny holiday:', err);
    } finally {
      setActionStatus(prev => {
        const next = { ...prev };
        delete next[holidayId];
        return next;
      });
    }
  };

  const formatHolidayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-');
      const monthIndex = parseInt(m, 10) - 1;
      const monthName = ENG_MONTHS[monthIndex] || m;
      const khasiMonth = KHASI_MONTHS[monthIndex] || '';
      return `${parseInt(d, 10)} ${monthName} ${y} (${khasiMonth})`;
    } catch {
      return dateStr;
    }
  };

  const formatSubmissionTime = (isoString?: string) => {
    if (!isoString) return 'Recently';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  };

  const [selectedHolidayId, setSelectedHolidayId] = useState<string>(allHolidays[0]?.id || '');
  const [reportReason, setReportReason] = useState<string>('');
  const [submittingReport, setSubmittingReport] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // 1. WhatsApp Intent Link
  const whatsappText = `Hi, help needed. Email:${userEmail || 'Not signed in'} Order:${lastOrderId || 'N/A'}`;
  const whatsappUrl = `https://wa.me/917005893341?text=${encodeURIComponent(whatsappText)}`;

  // 2. Email Us Mailto Link
  const emailSubject = 'Complaint - Calendar App';
  const emailBody = `Hi Support,\n\nHelp / Complaint Details:\nUser Email: ${userEmail || 'N/A'}\nOrder ID: ${lastOrderId || 'N/A'}\n\nPlease describe your issue:\n`;
  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    const targetHol = allHolidays.find(h => h.id === selectedHolidayId);
    const title = targetHol ? targetHol.title : 'General / Other Holiday';

    setSubmittingReport(true);
    setReportError(null);
    try {
      await onSubmitReport({
        holidayId: selectedHolidayId || 'general',
        holidayTitle: title,
        reason: reportReason.trim()
      });
      setReportSuccess(true);
      setReportReason('');
    } catch (err: unknown) {
      setReportError(err instanceof Error ? err.message : 'Failed to submit report. Please try again.');
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom duration-300 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customercare-title"
      >
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#f1c40f]/20 border border-[#f1c40f]/40 flex items-center justify-center text-[#f1c40f]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="customercare-title" className="text-lg font-bold font-display">
                Help & Complaint
              </h3>
              <p className="text-xs text-slate-300">
                Customer Care & 24/7 Dedicated Support
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Support Contact Badges */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="font-bold text-slate-900">WhatsApp:</span>
            <span className="font-mono text-emerald-700 font-semibold">{SUPPORT_PHONE}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="font-bold text-slate-900">Email:</span>
            <span className="font-mono text-blue-700 font-semibold">{SUPPORT_EMAIL}</span>
          </div>
        </div>

        {/* Body / Options */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">

          {/* ADMIN NOTIFICATION BOX (Only visible to Admin) */}
          {isAdmin && (
            <div className="rounded-2xl border-2 border-[#f1c40f]/70 bg-gradient-to-b from-[#0e2a3a] via-[#123448] to-[#0a1e2a] p-4 text-white shadow-xl relative overflow-hidden">
              {/* Tribal decorative pattern glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#f1c40f]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#f1c40f] to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                    <Bell className="w-5 h-5 text-slate-950" />
                    {pendingCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-md border-2 border-[#0e2a3a]">
                        {pendingCount}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-black font-display text-white tracking-tight flex items-center gap-1.5">
                        <span>Notifications</span>
                      </h3>
                      {pendingCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                          {pendingCount} Pending Review
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                          ✓ All Reviewed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-300 font-semibold truncate">
                      Holiday Approval System • Admin Review Box
                    </p>
                  </div>
                </div>
              </div>

              {/* Toast message if any action taken */}
              {toastMessage && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{toastMessage}</span>
                </div>
              )}

              {/* Filter Tabs: Pending | Approved | Denied */}
              <div className="flex items-center gap-1.5 pt-3 pb-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveNotifTab('pending');
                    setDenyingHolidayId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black transition flex items-center gap-1.5 cursor-pointer ${
                    activeNotifTab === 'pending'
                      ? 'bg-[#f1c40f] text-slate-950 shadow-md ring-2 ring-[#f1c40f]/50'
                      : 'bg-white/10 hover:bg-white/15 text-slate-300'
                  }`}
                >
                  <span>Pending</span>
                  {pendingCount > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      activeNotifTab === 'pending' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {pendingCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveNotifTab('approved');
                    setDenyingHolidayId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeNotifTab === 'approved'
                      ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-400/50'
                      : 'bg-white/10 hover:bg-white/15 text-slate-300'
                  }`}
                >
                  <span>Approved ({approvedCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveNotifTab('denied');
                    setDenyingHolidayId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeNotifTab === 'denied'
                      ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-500/50'
                      : 'bg-white/10 hover:bg-white/15 text-slate-300'
                  }`}
                >
                  <span>Denied ({deniedCount})</span>
                </button>
              </div>

              {/* Notification List */}
              <div className="mt-2 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredNotifications.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-slate-300 space-y-1">
                    {activeNotifTab === 'pending' && (
                      <>
                        <p className="font-bold text-white">No pending holidays to review.</p>
                        <p className="text-[11px] text-slate-400">When users submit a holiday or special day, it will appear here for your review.</p>
                      </>
                    )}
                    {activeNotifTab === 'approved' && (
                      <>
                        <p className="font-bold text-white">No approved holidays in history.</p>
                        <p className="text-[11px] text-slate-400">Approved holidays appear here and live on the public calendar.</p>
                      </>
                    )}
                    {activeNotifTab === 'denied' && (
                      <>
                        <p className="font-bold text-white">No denied holidays.</p>
                        <p className="text-[11px] text-slate-400">Denied submissions stay hidden from the public calendar.</p>
                      </>
                    )}
                  </div>
                ) : (
                  filteredNotifications.map((notif) => {
                    const isTemp = notif.type === 'temp';
                    const isPending = notif.status === 'pending';
                    const isApproved = notif.status === 'approved';
                    const isDenied = notif.status === 'denied';
                    const isDenyingThis = denyingHolidayId === notif.holidayId;

                    return (
                      <div
                        key={notif.id}
                        className={`p-3.5 rounded-xl border transition shadow-sm space-y-2.5 ${
                          isPending
                            ? 'bg-amber-950/30 border-amber-400/40'
                            : isApproved
                            ? 'bg-emerald-950/30 border-emerald-500/30'
                            : 'bg-slate-900/60 border-slate-700/60 opacity-80'
                        }`}
                      >
                        {/* Card Header: Holiday Name & Type Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-sm text-white tracking-tight break-words">
                                {notif.holidayTitle}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                isTemp ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                              }`}>
                                {isTemp ? 'Temporary (1Y)' : 'Permanent (∞)'}
                              </span>
                            </div>
                            <div className="text-xs text-amber-200 font-semibold mt-0.5 flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5 text-[#f1c40f]" />
                              <span>{formatHolidayDate(notif.date)}</span>
                            </div>
                          </div>

                          {/* Status indicator */}
                          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPending
                              ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                              : isApproved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                          }`}>
                            {isPending ? 'Pending Review' : isApproved ? '✓ Live on Calendar' : '✕ Denied'}
                          </span>
                        </div>

                        {/* Submitter info & Description */}
                        <div className="text-[11px] text-slate-300 space-y-1 bg-black/20 p-2.5 rounded-lg border border-white/5">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Submitted by: <strong className="text-white">{notif.userName}</strong> ({notif.userEmail})</span>
                          </div>

                          {notif.description && (
                            <div className="text-amber-100/90 pt-0.5 italic">
                              "{notif.description}"
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] pt-0.5">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>Submitted: {formatSubmissionTime(notif.submittedAt)}</span>
                          </div>

                          {isApproved && notif.reviewedAt && (
                            <div className="text-emerald-400 text-[10px] font-semibold pt-0.5">
                              ✓ Approved on {formatSubmissionTime(notif.reviewedAt)} by {notif.reviewedBy || 'Admin'}
                            </div>
                          )}

                          {isDenied && (
                            <div className="text-rose-400 text-[10px] font-semibold pt-0.5">
                              ✕ Denied: {notif.denialReason || 'Not approved as public holiday'}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons for Pending */}
                        {isPending && (
                          <div className="pt-1">
                            {isDenyingThis ? (
                              <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/40 space-y-2 animate-in fade-in duration-150">
                                <label className="text-[11px] font-bold text-rose-200 block">
                                  Reason for Denial (Optional):
                                </label>
                                <input
                                  type="text"
                                  value={denialReasonInput}
                                  onChange={(e) => setDenialReasonInput(e.target.value)}
                                  placeholder="e.g. Not a public holiday, duplicate, incorrect..."
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-rose-400/40 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-rose-400"
                                />
                                {/* Quick Chips */}
                                <div className="flex flex-wrap gap-1 text-[10px]">
                                  {['Not a public holiday', 'Personal birthday entry', 'Duplicate date'].map((chip) => (
                                    <button
                                      key={chip}
                                      type="button"
                                      onClick={() => setDenialReasonInput(chip)}
                                      className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-rose-200 transition cursor-pointer"
                                    >
                                      + {chip}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDenyingHolidayId(null);
                                      setDenialReasonInput('');
                                    }}
                                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    disabled={actionStatus[notif.holidayId] === 'denying'}
                                    onClick={() => handleConfirmDeny(notif.holidayId, notif.holidayTitle)}
                                    className="px-3.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    {actionStatus[notif.holidayId] === 'denying' ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <X className="w-3.5 h-3.5 stroke-[3]" />
                                    )}
                                    <span>Confirm Deny</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2 pt-0.5">
                                <button
                                  type="button"
                                  disabled={!!actionStatus[notif.holidayId]}
                                  onClick={() => {
                                    setDenyingHolidayId(notif.holidayId);
                                    setDenialReasonInput('');
                                  }}
                                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition cursor-pointer active:scale-95 disabled:opacity-50"
                                >
                                  <X className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Deny</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={!!actionStatus[notif.holidayId]}
                                  onClick={() => handleApprove(notif.holidayId, notif.holidayTitle)}
                                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition cursor-pointer active:scale-95 disabled:opacity-50"
                                >
                                  {actionStatus[notif.holidayId] === 'approving' ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Approving...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      <span>Approve</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Option 1: WhatsApp Chat */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200 transition shadow-xs text-slate-900"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <span>1. Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  Instant Reply
                </span>
              </div>
              <p className="text-xs text-emerald-900/80 mt-1 leading-relaxed">
                Connect directly with admin support on WhatsApp (+917005893341). Your User Email and Order ID are pre-filled automatically.
              </p>
            </div>
          </a>

          {/* Option 2: Email Us */}
          <a
            href={mailtoUrl}
            className="group flex items-start gap-3.5 p-4 rounded-2xl bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200 transition shadow-xs text-slate-900"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-blue-950 flex items-center gap-1.5">
                  <span>2. Email Us</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200 text-blue-900">
                  muniphawa@gmail.com
                </span>
              </div>
              <p className="text-xs text-blue-900/80 mt-1 leading-relaxed">
                Send a formal complaint or request to muniphawa@gmail.com with subject "Complaint - Calendar App".
              </p>
            </div>
          </a>

          {/* Banner Settings Button - Strictly visible ONLY to muniphawa@gmail.com and niamkhasi@gmail.com */}
          {isAuthorizedBannerAdmin && onOpenBannerSettings && (
            <button
              onClick={() => {
                onClose();
                onOpenBannerSettings();
              }}
              className="w-full group flex items-start gap-3.5 p-4 rounded-2xl bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200 transition shadow-xs text-slate-900 text-left cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition font-black">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
                    <span>Banner Settings</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Admin Only
                  </span>
                </div>
                <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                  Upload up to 3 Flipkart-style banners, set show duration (5–60s), schedule dates, and toggle ON/OFF.
                </p>
              </div>
            </button>
          )}

          {/* Privacy Policy Button - Below Banner Settings */}
          {onOpenPrivacyPolicy && (
            <button
              onClick={() => {
                onClose();
                onOpenPrivacyPolicy();
              }}
              className="w-full group flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200 transition shadow-xs text-slate-900 text-left cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-[#0e2a3a] text-[#f1c40f] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Privacy Policy</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-semibold">
                    AdMob &amp; Data Policy
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Review our privacy commitments and information regarding Google AdMob advertising.
                </p>
              </div>
            </button>
          )}

          {/* Option 3: Report Bad Holiday */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">
                3. Report Bad or Inappropriate Holiday
              </h4>
            </div>
            <p className="text-xs text-slate-600">
              Found a holiday or birthday with incorrect dates, abusive text, or fake entries? Submit a report directly to the admin.
            </p>

            {reportSuccess ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Thank you! Your report has been submitted to Firestore and queued for administrator review.
                </span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3 pt-1">
                {reportError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    {reportError}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Holiday to Report:
                  </label>
                  <select
                    value={selectedHolidayId}
                    onChange={(e) => setSelectedHolidayId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                  >
                    {allHolidays.length > 0 ? (
                      allHolidays.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.title} ({h.date}) - {h.userEmail}
                        </option>
                      ))
                    ) : (
                      <option value="general">No custom holidays found (General Report)</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Reason for Complaint / Report *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Describe what is wrong (e.g. incorrect date, spam, abusive language)..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReport || !reportReason.trim()}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{submittingReport ? 'Submitting to Admin...' : 'Submit Report'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
