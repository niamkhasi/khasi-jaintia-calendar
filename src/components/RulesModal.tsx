import React from 'react';
import { X, Scale, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
  onOpenHelp?: () => void;
}

const RULES_LIST = [
  {
    num: 1,
    text: "Ym shah ban buh sngi shuti (Add Holiday) da ki bym dei shisha ki shuti paitbah."
  },
  {
    num: 2,
    text: "Phi lah ban edit ne delete ia ki sngi shuti ba phi la buh tang hapoh shi taiew (Within Seven Days)"
  },
  {
    num: 3,
    text: "Ngi pdiang ruh ia ki sngi kyrpang ban buh kum ki sngi shuti hangne, kum ki sngi long Lympung, Behdeiñkhlam, Jingiaseng, Synod bad kiwei kiwei ba dei na bynta ki paitbah."
  },
  {
    num: 4,
    text: "Lada phi kwah ba ngin buh da ma ngi ia kano kano ka sngi shuti ne sngi kyrpang jong phi phi lah ban email ne whatsapp sha ngi click ha u help button."
  },
  {
    num: 5,
    text: "Shwa ba phin buh sngi shuti ne sngi kyrpang da pule bha ki rule khnang ka pisa jong phi kan nym sep ei namar ngim lah ban return shisien ba phi la dep thied slot."
  },
  {
    num: 6,
    text: "Ha shwa ba phin buh sngi shuti ne sngi kyrpang phi hap thied slot, Kawei ka slot kawei ka sngi shuti ne sngi kyrpang phi lah ban buh, lada phi kwah ban buh bun tylli phi hap thied man la kawei pa kawei."
  },
  {
    num: 7,
    text: "Ka temporary holiday kan pyni tang ha u snem ba phi la jied ban buh ia kata ka sngi shuti ne sngi kyrpang nuksa, kum ki Behdeiñkhlam, Synod, Lympung bad Jingiaseng phim lah ban buh permanent namar ki tarik jong kine ki kylla na uwei sha uwei pat u snem. Ym dei kum ki permanent ba long beit kajuh ka tarik bad u bnai manla u snem."
  },
  {
    num: 8,
    text: "Ka permanent holiday kan pyni ha kata ka tarik bad u bnai ba phi la jied ne buh manla u snem shi junom."
  },
  {
    num: 9,
    text: "Ka dor ban buh sngi shuti ne sngi kyrpang kan long kumne, Temporary 499 bad Permanent 999."
  },
  {
    num: 10,
    text: "Lada phi buh da ki sngi shuti bym dei ne sngi shuti shimet kum ki sngikha bad kiwei kiwei ki bym dei ki sngi shuti paitbah ngim pdiang kan sa long automatic delete hapoh 7-10 sngi."
  },
  {
    num: 11,
    text: "Lada phi kwah pat ngin pyni ia ki advertise jong phi hapoh une u app click ha u help button sa whatsapp sha ngi la don lypa u help number."
  }
];

export const RulesModal: React.FC<RulesModalProps> = ({ onClose, onOpenHelp }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-modal-title"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-5 sm:p-6 shrink-0 relative border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f1c40f] text-slate-950 font-black shadow-md mb-2">
              <Scale className="w-6 h-6 stroke-[2.5]" />
            </div>

            {/* Top Heading in Center, Big Bold */}
            <h2 
              id="rules-modal-title" 
              className="text-xl sm:text-2xl font-black font-display tracking-tight text-white uppercase"
            >
              JINGMANA/RULES
            </h2>

            {/* Small text in center just below heading */}
            <p className="text-xs sm:text-sm text-amber-300 font-semibold mt-1 leading-relaxed max-w-lg mx-auto">
              Please Follow the rules before adding any holiday / Sngewbha bud ia ki kyndon ha shwa ban buh sngi shuti ne sngi kyrpang
            </p>
          </div>
        </div>

        {/* Scrollable Rules List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-3.5 text-xs sm:text-sm bg-slate-50/70">
          {RULES_LIST.map((rule) => {
            const isImportant = rule.num === 1 || rule.num === 5 || rule.num === 10;
            return (
              <div
                key={rule.num}
                className={`p-3.5 sm:p-4 rounded-2xl border transition shadow-xs flex items-start gap-3 sm:gap-3.5 ${
                  isImportant
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shrink-0 shadow-xs ${
                    isImportant
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-[#0e2a3a] text-white'
                  }`}
                >
                  {rule.num}
                </span>

                <div className="flex-1 leading-relaxed pt-0.5">
                  <span className="font-extrabold text-slate-900 block sm:inline sm:mr-1.5">
                    Rule {rule.num}.
                  </span>
                  <span className="font-medium text-slate-800">
                    {rule.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Close Button */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          {onOpenHelp ? (
            <button
              onClick={() => {
                onClose();
                onOpenHelp();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-blue-700 hover:text-blue-900 hover:bg-blue-50 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>💬 Open Help / WhatsApp</span>
            </button>
          ) : (
            <div />
          )}

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
