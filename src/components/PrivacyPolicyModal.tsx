import React from 'react';
import { X, ShieldCheck, Mail, CheckCircle2, CreditCard, Sparkles, AlertCircle, HeartHandshake } from 'lucide-react';

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
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-amber-300 font-semibold mt-1.5">
              <span>Effective Date: November 13, 2026</span>
              <span>•</span>
              <span>Last Updated: November 13, 2026</span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Developer: <strong className="text-white">Ieij Iala Ka Jong</strong>
            </p>
          </div>
        </div>

        {/* Scrollable Privacy Policy Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 text-slate-800 text-sm leading-relaxed bg-slate-50/70">
          
          {/* Section 1: Information We Do NOT Collect Directly */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                1. Information We Do NOT Collect Directly
              </h3>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              We do NOT directly collect, store, or sell your name, email address, phone number, contacts, photos or files. We do NOT sell your personal data.
            </p>
          </div>

          {/* Section 2: Holiday Data You Create */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                2. Holiday Data You Create
              </h3>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              When you add a Temporary Holiday or Permanent Holiday in Khasi Jaintia Calendar, that information is stored ONLY on your own device. We cannot see your holidays. If you clear app data or uninstall the app, your holiday data will be deleted.
            </p>
          </div>

          {/* Section 3: Payments and In-App Purchases */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600 shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                3. Payments and In-App Purchases
              </h3>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Our app offers two consumable in-app products:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                <span className="font-bold text-[#0e2a3a] block">Temporary Holiday</span>
                <span className="text-slate-600">₹499 — 1 Slot = 1 Temporary Holiday</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                <span className="font-bold text-[#0e2a3a] block">Permanent Holiday</span>
                <span className="text-slate-600">₹999 — 1 Slot = 1 Permanent Holiday</span>
              </div>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed pt-1">
              All payments are processed securely by Google Play Billing. We do NOT collect, see, or store your card, UPI ID, bank account, or any payment details.
            </p>
          </div>

          {/* Section 4: Advertising - Generic For Lifetime */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              4. Advertising - Generic For Lifetime
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Our app may show ads. We currently use Monetag to show ads. We may change, add, or remove any advertising partner at any time in the future without changing this policy.
            </p>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-semibold text-slate-900">
              Our current and any future advertising partners may collect and use:
            </p>
            <ul className="space-y-1.5 pl-2">
              <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>Device ID / Advertising ID</span>
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>Device model, OS version, language, IP address</span>
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>Approximate location (city level, not exact GPS)</span>
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>App usage and ad interaction data to show relevant ads and prevent fraud</span>
              </li>
            </ul>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed pt-1">
              We do NOT provide your name, email, or phone number to any advertising partner.
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
              You can control ads anytime: <strong>Android Settings &gt; Privacy &gt; Ads &gt; Delete Advertising ID</strong>, or turn off <strong>&quot;Personalized Ads&quot;</strong>.
            </div>
          </div>

          {/* Section 5: Third-Party Services */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              5. Third-Party Services
            </h3>
            <ul className="space-y-1.5 pl-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                <span><strong>Google Play Services</strong> - For in-app purchases</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                <span><strong>Monetag and/or any other Advertising Partner</strong> - For showing ads (current or future)</span>
              </li>
            </ul>
          </div>

          {/* Section 6: Data Safety */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                6. Data Safety
              </h3>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              <strong>Data collected by us:</strong> None. <strong>Data collected by advertising partners:</strong> Device ID, Advertising ID, approximate location, app interaction - for ads only. <strong>Data stored by us:</strong> Only on your device.
            </p>
          </div>

          {/* Section 7: Children's Privacy */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-purple-600 shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                7. Children&apos;s Privacy
              </h3>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Our app is safe for all ages. We do not knowingly collect personal information from children.
            </p>
          </div>

          {/* Section 8: Your Rights */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              8. Your Rights
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              You can delete your holiday data anytime by clearing app data or uninstalling the app. You can opt-out of personalized ads from device settings.
            </p>
          </div>

          {/* Section 9: Changes to This Policy */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                9. Changes to This Policy
              </h3>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              If we change our advertising partner in future, this policy will still apply because it is generic and covers any current or future partner.
            </p>
          </div>

          {/* Section 10: Contact Us */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              10. Contact Us
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 space-y-1">
              <p className="flex items-center gap-1.5">
                <span>Email:</span>
                <a
                  href="mailto:muniphawa@gmail.com"
                  className="font-bold text-emerald-700 hover:text-emerald-900 underline inline-flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>muniphawa@gmail.com</span>
                </a>
              </p>
              <p>
                <span>App Name: </span>
                <strong className="text-slate-900">Khasi Jaintia Calendar</strong>
              </p>
              <p>
                <span>Developer: </span>
                <strong className="text-slate-900">Ieij Iala Ka Jong</strong>
              </p>
            </div>
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
