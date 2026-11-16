import React from 'react';
import { X, Scale, Mail, CheckCircle2, AlertCircle, ShieldAlert, FileText } from 'lucide-react';

interface TermsConditionsModalProps {
  onClose: () => void;
  onOpenContactUs?: () => void;
}

export const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({ onClose, onOpenContactUs }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-conditions-title"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header matching app theme */}
        <div className="bg-[#0e2a3a] text-white p-5 sm:p-6 shrink-0 relative border-b border-white/10">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer absolute top-4 right-4"
            aria-label="Close Terms and Conditions"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f1c40f] text-slate-950 font-black shadow-md mb-2">
              <Scale className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h2
              id="terms-conditions-title"
              className="text-xl sm:text-2xl font-black font-display tracking-tight text-white"
            >
              Terms and Conditions
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-amber-300 font-semibold mt-1.5">
              <span>Last Updated: 15 November 2026</span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Khasi Jaintia Calendar
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 text-slate-800 text-sm leading-relaxed bg-slate-50/70">
          
          {/* Intro Notice */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-slate-900">
              Welcome to Khasi Jaintia Calendar.
            </p>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              By using our website and app, you agree to these Terms and Conditions. If you do not agree, please do not use our website.
            </p>
          </div>

          {/* Section 1: About Our Service */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                1. About Our Service
              </h3>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Khasi Jaintia Calendar is a free information website made for the people of Meghalaya. We provide calendar dates, government holidays, Khasi, Jaintia and Garo festival dates, and festival information.
            </p>
          </div>

          {/* Section 2: Accuracy of Dates */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                2. Accuracy of Dates
              </h3>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              We try our best to give correct dates for holidays and festivals. However, festival dates can change as per official government notification or traditional leaders.
            </p>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              We are not responsible if a date changes. Please always check with the official Meghalaya Government holiday list or your local Dorbar for final confirmation.
            </p>
          </div>

          {/* Section 3: Use of Our Content */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                3. Use of Our Content
              </h3>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              All articles, festival information, and calendar data on this website are written by our team. You can read and share our articles for personal use.
            </p>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-semibold text-slate-900">
              You cannot copy our full articles and post them on your own website or app without our permission.
            </p>
          </div>

          {/* Section 4: Advertisements */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              4. Advertisements
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Our website is free to use. To keep it free, we show advertisements from Google AdSense and other ad partners. By using our site, you agree that ads may be shown.
            </p>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              We do not control the products shown in ads. Please check any product or service yourself before buying.
            </p>
          </div>

          {/* Section 5: Third-Party Links */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              5. Third-Party Links
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Our website may contain links to other websites like Meghalaya Government sites or news sites. We are not responsible for the content of those websites.
            </p>
          </div>

          {/* Section 6: No Guarantee */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-600 shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                6. No Guarantee
              </h3>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              We provide this website &quot;as is&quot;. We do not guarantee that the website will always work without any error or interruption.
            </p>
          </div>

          {/* Section 7: Changes to Terms */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              7. Changes to Terms
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              We may update these Terms and Conditions at any time. The new version will be posted on this page with a new date.
            </p>
          </div>

          {/* Section 8: Contact Us */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              8. Contact Us
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              If you have any questions about these Terms, you can contact us through our Contact Us page.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700">
                <span>Email:</span>
                <a
                  href="mailto:muniphawa@gmail.com"
                  className="font-bold text-emerald-700 hover:text-emerald-900 underline inline-flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>muniphawa@gmail.com</span>
                </a>
              </div>
              {onOpenContactUs && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenContactUs();
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                >
                  Go to Contact Us &rarr;
                </button>
              )}
            </div>
          </div>

          {/* Agreement Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-center">
            <p className="text-xs font-bold text-slate-800">
              By using our website and app, you agree to these Terms and Conditions.
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
