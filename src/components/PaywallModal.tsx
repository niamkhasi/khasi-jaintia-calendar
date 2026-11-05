import React, { useState } from 'react';
import { X, Sparkles, Check, HelpCircle, ShieldCheck, Zap, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { BILLING_PRODUCTS, billingClient, PurchaseResult } from '../services/billingClient';

interface PaywallModalProps {
  onClose: () => void;
  userEmail: string;
  onPurchaseSuccess: (purchase: PurchaseResult) => void;
  onOpenHelpAndComplaint: () => void;
  tempSlotsCount: number;
  permSlotsCount: number;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  onClose,
  userEmail,
  onPurchaseSuccess,
  onOpenHelpAndComplaint,
  tempSlotsCount,
  permSlotsCount
}) => {
  const [selectedProduct, setSelectedProduct] = useState<'temp_holiday_1year' | 'permanent_holiday_forever'>('temp_holiday_1year');
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const handleBuy = async () => {
    setPurchasing(true);
    setPurchaseError(null);
    try {
      const result = await billingClient.launchBillingFlow(selectedProduct, userEmail);
      if (result.success) {
        onPurchaseSuccess(result);
      }
    } catch (err: unknown) {
      setPurchaseError(err instanceof Error ? err.message : 'Google Play Billing flow was interrupted.');
    } finally {
      setPurchasing(false);
    }
  };

  const tempProd = BILLING_PRODUCTS.temp_holiday_1year;
  const permProd = BILLING_PRODUCTS.permanent_holiday_forever;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom duration-300 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="paywall-title"
      >
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#f1c40f] text-slate-950 flex items-center justify-center font-black">
                ★
              </span>
              <div>
                <h3 id="paywall-title" className="text-lg font-black font-display tracking-tight">
                  Add Public Holiday
                </h3>
                <p className="text-xs text-[#f1c40f] font-semibold">
                  Google Play Billing v6 • 1 Pay = 1 Holiday Slot
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

          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Public holidays appear for everyone using the Khasi Jaintia Calendar.
          </p>

          <div className="mt-2.5 p-2 rounded-xl bg-white/10 border border-white/15 text-[11px] text-amber-200 leading-snug">
            🎂 <strong>Private Birthdays are Free:</strong> To mark a birthday for yourself only, tap any date cell on the calendar to save it free on your phone without paying!
          </div>

          {/* Current slot balance pills */}
          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/10 text-xs">
            <span className="text-slate-300 text-[11px]">Available Slots:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[11px]">
              {tempSlotsCount} Temporary (1Y)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-bold text-[11px]">
              {permSlotsCount} Permanent (∞)
            </span>
          </div>

          <div className="mt-2.5 p-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-[11px] text-amber-100 flex items-center gap-1.5 font-medium">
            <span className="font-extrabold text-[#f1c40f]">★ Rule:</span>
            <span>1 Buy = 1 Holiday. If you want to add more holidays, you have to buy more.</span>
          </div>
        </div>

        {/* Options Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {purchaseError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {purchaseError}
            </div>
          )}

          {/* Product 1: Temporary (1 Year) */}
          <div
            onClick={() => setSelectedProduct('temp_holiday_1year')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${
              selectedProduct === 'temp_holiday_1year'
                ? 'border-[#0e2a3a] bg-amber-50/70 shadow-md ring-2 ring-[#0e2a3a]'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="productSelection"
                  checked={selectedProduct === 'temp_holiday_1year'}
                  onChange={() => setSelectedProduct('temp_holiday_1year')}
                  className="mt-1 text-[#0e2a3a] focus:ring-[#0e2a3a] w-4 h-4"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900">
                      Temporary (1 Year)
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px] tracking-wide border border-amber-300">
                      1Y BADGE
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    1 slot for 1 temporary public holiday. Appears only on the chosen year (e.g. 2027 only), not every year. In future years (like 2028+), it still remains recorded in that chosen year.
                  </p>
                  <div className="mt-2 text-[11px] font-bold text-amber-900 flex items-center gap-1">
                    <span>🗓️ Consumable: 1 Pay = 1 Holiday Slot</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-lg font-black text-slate-900">{tempProd.price}</div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">One-time</span>
              </div>
            </div>
          </div>

          {/* Product 2: Permanent (Every Year) */}
          <div
            onClick={() => setSelectedProduct('permanent_holiday_forever')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${
              selectedProduct === 'permanent_holiday_forever'
                ? 'border-emerald-700 bg-emerald-50/70 shadow-md ring-2 ring-emerald-700'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="productSelection"
                  checked={selectedProduct === 'permanent_holiday_forever'}
                  onChange={() => setSelectedProduct('permanent_holiday_forever')}
                  className="mt-1 text-emerald-700 focus:ring-emerald-700 w-4 h-4"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900">
                      Permanent (Every Year)
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black text-[10px] tracking-wide border border-emerald-300">
                      ∞ BADGE
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-extrabold text-[10px]">
                      POPULAR
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    1 slot for 1 permanent holiday. Appears on this date every single year from 2025 to 2100 forever without expiring.
                  </p>
                  <div className="mt-2 text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                    <span>♾️ Consumable: 1 Pay = 1 Forever Holiday</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-lg font-black text-emerald-900">{permProd.price}</div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Lifetime</span>
              </div>
            </div>
          </div>

          {/* Play Store Billing Info & Security */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Google Play Billing v6 Secured</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Immediate Consume
            </span>
          </div>

        </div>

        {/* Footer with Purchase Button and Help & Complaint Link */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3">
          <button
            onClick={handleBuy}
            disabled={purchasing}
            className="w-full py-3.5 rounded-2xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-black text-sm shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {purchasing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#f1c40f]" />
                <span>Connecting to Google Play...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#f1c40f]" />
                <span>
                  Buy {selectedProduct === 'temp_holiday_1year' ? 'Temporary (₹499)' : 'Permanent (₹999)'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </>
            )}
          </button>

          {/* Help & Complaint Link */}
          <div className="flex items-center justify-between text-xs pt-1 px-1">
            <button
              type="button"
              onClick={onOpenHelpAndComplaint}
              className="font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help & Complaint (WhatsApp Support)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 font-semibold text-xs"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
