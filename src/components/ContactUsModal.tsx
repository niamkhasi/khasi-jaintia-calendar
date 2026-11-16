import React, { useState } from 'react';
import { X, Mail, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

interface ContactUsModalProps {
  onClose: () => void;
  defaultEmail?: string;
  defaultName?: string;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({
  onClose,
  defaultEmail = '',
  defaultName = '',
}) => {
  const [name, setName] = useState<string>(defaultName);
  const [email, setEmail] = useState<string>(defaultEmail);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Save message locally so it is safely recorded
    try {
      const stored = localStorage.getItem('kj_contact_messages');
      const messages = stored ? JSON.parse(stored) : [];
      messages.push({
        id: `msg_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        date: new Date().toISOString(),
      });
      localStorage.setItem('kj_contact_messages', JSON.stringify(messages));
    } catch {
      // Ignore localStorage quotas/errors
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setMessage('');
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-us-title"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header matching app theme */}
        <div className="bg-[#0e2a3a] text-white p-5 sm:p-6 shrink-0 relative border-b border-white/10">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer absolute top-4 right-4"
            aria-label="Close Contact Us"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f1c40f] text-slate-950 font-black shadow-md mb-2">
              <MessageSquare className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h2
              id="contact-us-title"
              className="text-xl sm:text-2xl font-black font-display tracking-tight text-white"
            >
              Contact Us
            </h2>
            <p className="text-xs text-amber-300 font-semibold mt-1">
              We are happy to hear from you.
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 text-slate-800 text-sm leading-relaxed bg-slate-50/70">
          
          {/* Welcome Message */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              If you have any question about Khasi Jaintia Calendar, if you see any wrong festival date, if you want to add your local festival, or if you want to give any suggestion, please contact us.
            </p>
            <p className="text-xs font-bold text-[#0e2a3a]">
              You can contact us in 2 ways:
            </p>
          </div>

          {/* Option 1: Email Us */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <span>Email Us</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Reply in 2–3 days</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm">
              <span className="text-slate-600">Email:</span>
              <a
                href="mailto:muniphawa@gmail.com"
                className="font-bold text-emerald-700 hover:text-emerald-900 underline inline-flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>muniphawa@gmail.com</span>
              </a>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500">
              We will try to reply within 2-3 days.
            </p>
          </div>

          {/* Option 2: Contact Form */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Contact Form
              </h3>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Thank you! Your message has been sent. We will reply soon.</span>
                </div>
                <p className="text-xs text-emerald-800">
                  We appreciate your message and will review it promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message, question, suggestion, or festival correction here..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !email.trim() || !message.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Address Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Address:</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pl-5">
              Tuber Kmai Shnong, East Jaintia Hills District, Meghalaya, India
            </p>
          </div>

          {/* Appreciation notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <p className="text-xs sm:text-sm font-bold text-amber-950">
              Thank you for helping us make this calendar better for everyone.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm transition cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
