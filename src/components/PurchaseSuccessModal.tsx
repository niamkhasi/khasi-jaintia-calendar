import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PurchaseResult } from '../services/billingClient';
import { SUPPORT_PHONE } from '../hooks/useFirebaseHolidays';

interface PurchaseSuccessModalProps {
  purchase: PurchaseResult;
  userEmail: string;
  onProceedToAddHoliday: () => void;
  onClose: () => void;
}

export const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({
  purchase,
  userEmail,
  onProceedToAddHoliday,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  const whatsappText = `Hi, help needed. Email:${userEmail || 'Customer'} Order:${purchase.orderId}`;
  const whatsappUrl = `https://wa.me/917005893341?text=${encodeURIComponent(whatsappText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(purchase.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isTemp = purchase.productId === 'temp_holiday_1year';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-linear-to-r from-emerald-600 to-teal-700 text-white p-6 text-center relative">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center mx-auto mb-3 shadow-md">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-black font-display tracking-tight">
            Purchase Confirmed!
          </h3>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            Google Play Billing v6 • Consumed & Slot Added
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Order Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Product Purchased</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[11px]">
                {isTemp ? '1Y Temporary (₹499)' : '∞ Permanent (₹999)'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 block mb-1">
                Google Play Order ID:
              </span>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-300 font-mono text-xs text-slate-900 font-bold">
                <span className="truncate">{purchase.orderId}</span>
                <button
                  onClick={handleCopy}
                  className="ml-2 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition shrink-0 flex items-center gap-1 text-[11px] font-sans"
                  title="Copy Order ID"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Account:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                {userEmail}
              </span>
            </div>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="text-xs text-emerald-950 font-bold flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Need help with this order?</span>
            </div>
            <p className="text-[11px] text-emerald-900/80 leading-relaxed">
              WhatsApp customer care is available at <strong>{SUPPORT_PHONE}</strong>. Click below to chat with your pre-filled Order ID.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Support on WhatsApp</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onProceedToAddHoliday}
              className="w-full py-3 rounded-2xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#f1c40f]" />
              <span>Add Your Holiday / Birthday Now</span>
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
