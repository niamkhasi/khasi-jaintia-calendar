import React, { useState } from 'react';
import { X, MessageCircle, Mail, AlertTriangle, CheckCircle2, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';
import { AllHolidayItem, Holiday } from '../types/calendar';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '../hooks/useFirebaseHolidays';

interface CustomerCareModalProps {
  onClose: () => void;
  userEmail: string;
  lastOrderId: string;
  allHolidays: AllHolidayItem[];
  onSubmitReport: (data: { holidayId: string; holidayTitle: string; reason: string }) => Promise<void>;
  onOpenAndroidBuild?: () => void;
}

export const CustomerCareModal: React.FC<CustomerCareModalProps> = ({
  onClose,
  userEmail,
  lastOrderId,
  allHolidays,
  onSubmitReport,
  onOpenAndroidBuild
}) => {
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
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {onOpenAndroidBuild ? (
            <button
              onClick={() => {
                onClose();
                onOpenAndroidBuild();
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 transition"
            >
              <span>📱 Play Console APK / AAB</span>
            </button>
          ) : <div />}

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
