import React from 'react';
import { X, ShieldCheck, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header matching app theme */}
        <div className="bg-[#0e2a3a] text-white p-5 sm:p-6 shrink-0 relative border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close Privacy Policy"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f1c40f] text-slate-950 font-black shadow-md mb-2">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h2
              id="privacy-policy-title"
              className="text-xl sm:text-2xl font-black font-display tracking-tight text-white"
            >
              Privacy Policy for Khasi Jaintia Calendar
            </h2>
            <p className="text-xs text-amber-300 font-semibold mt-1">
              Last updated: 7 November 2026
            </p>
          </div>
        </div>

        {/* Scrollable Privacy Policy Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 text-slate-800 text-sm leading-relaxed bg-slate-50/70">
          
          {/* Section 1: Zero Personal Information Collection */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                No Personal Information Collected
              </h3>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
              We do not collect any personal information like name, phone number, email, photos, or location.
            </p>
          </div>

          {/* Section 2: Google AdMob */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Google AdMob Integration
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Our app uses Google AdMob to show ads. Google may collect:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>Device ID</span>
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>Advertising ID</span>
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>App usage to show relevant ads</span>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-xs sm:text-sm text-slate-700">
                You can learn more here:{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-700 hover:text-blue-900 underline inline-flex items-center gap-1"
                >
                  <span>https://policies.google.com/privacy</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </p>
            </div>
          </div>

          {/* Section 3: Contact Us */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Contact Us
            </h3>
            <p className="text-xs sm:text-sm text-slate-700">
              If you have any question, contact us:{' '}
              <a
                href="mailto:muniphawa@gmail.com"
                className="font-bold text-emerald-700 hover:text-emerald-900 underline inline-flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>muniphawa@gmail.com</span>
              </a>
            </p>
          </div>

          {/* Agreement Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-xs sm:text-sm font-bold text-emerald-950">
              By using this app, you agree to this policy.
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
