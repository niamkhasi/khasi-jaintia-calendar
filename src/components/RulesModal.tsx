import React, { useState } from 'react';
import { X, Scale, Globe } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
  onOpenHelp?: () => void;
}

interface RuleItem {
  num: number;
  en: string;
  kh: string;
  isImportant?: boolean;
}

const RULES_LIST: RuleItem[] = [
  {
    num: 1,
    isImportant: true,
    en: "Adding holidays (Add Holiday) that are not genuine public holidays is strictly prohibited.",
    kh: "Ym shah ban buh sngi shuti (Add Holiday) da ki bym dei shisha ki shuti paitbah."
  },
  {
    num: 2,
    en: "You can edit or delete holidays you have added only within seven days (Within 7 Days).",
    kh: "Phi lah ban edit ne delete ia ki sngi shuti ba phi la buh tang hapoh shi taiew (Within Seven Days)."
  },
  {
    num: 3,
    en: "We also accept special public occasion days to be added as holidays here, such as Lympung, Behdeiñkhlam, Jingiaseng (Church Conferences), Synod, and other public community gatherings.",
    kh: "Ngi pdiang ruh ia ki sngi kyrpang ban buh kum ki sngi shuti hangne, kum ki sngi long Lympung, Behdeiñkhlam, Jingiaseng, Synod bad kiwei kiwei ba dei na bynta ki paitbah."
  },
  {
    num: 4,
    en: "If you want us to add any holiday or special day on your behalf, you can email or WhatsApp us by clicking the Help button.",
    kh: "Lada phi kwah ba ngin buh da ma ngi ia kano kano ka sngi shuti ne sngi kyrpang jong phi phi lah ban email ne whatsapp sha ngi click ha u help button."
  },
  {
    num: 5,
    isImportant: true,
    en: "Before adding a holiday or special day, please read the rules carefully so your money is not wasted, because payments are strictly non-refundable once a slot has been purchased.",
    kh: "Shwa ba phin buh sngi shuti ne sngi kyrpang da pule bha ki rule khnang ka pisa jong phi kan nym sep ei namar ngim lah ban return shisien ba phi la dep thied slot."
  },
  {
    num: 6,
    en: "Before adding a holiday or special day, you must purchase a slot. One slot allows you to add one holiday or special day. If you want to add multiple holidays, you must purchase a slot for each one.",
    kh: "Ha shwa ba phin buh sngi shuti ne sngi kyrpang phi hap thied slot, Kawei ka slot kawei ka sngi shuti ne sngi kyrpang phi lah ban buh, lada phi kwah ban buh bun tylli phi hap thied man la kawei pa kawei."
  },
  {
    num: 7,
    en: "A Temporary Holiday will be displayed only for the specific year you selected. For example, events like Behdeiñkhlam, Synod, Lympung, and Jingiaseng cannot be set as permanent because their calendar dates change from year to year, unlike permanent holidays which always fall on the exact same date and month every year.",
    kh: "Ka temporary holiday kan pyni tang ha u snem ba phi la jied ban buh ia kata ka sngi shuti ne sngi kyrpang nuksa, kum ki Behdeiñkhlam, Synod, Lympung bad Jingiaseng phim lah ban buh permanent namar ki tarik jong kine ki kylla na uwei sha uwei pat u snem. Ym dei kum ki permanent ba long beit kajuh ka tarik bad u bnai manla u snem."
  },
  {
    num: 8,
    en: "A Permanent Holiday will be displayed on that selected date and month every year permanently.",
    kh: "Ka permanent holiday kan pyni ha kata ka tarik bad u bnai ba phi la jied ne buh manla u snem shi junom."
  },
  {
    num: 9,
    en: "The cost to add a holiday or special day is: Temporary ₹499 and Permanent ₹999.",
    kh: "Ka dor ban buh sngi shuti ne sngi kyrpang kan long kumne, Temporary 499 bad Permanent 999."
  },
  {
    num: 10,
    isImportant: true,
    en: "If you add invalid or personal private holidays such as personal birthdays and other non-public events, we will not accept them and they will be automatically deleted within 7 to 10 days.",
    kh: "Lada phi buh da ki sngi shuti bym dei ne sngi shuti shimet kum ki sngikha bad kiwei kiwei ki bym dei ki sngi shuti paitbah ngim pdiang kan sa long automatic delete hapoh 7-10 sngi."
  },
  {
    num: 11,
    en: "If you would like to display your advertisements inside this app, click the Help button to WhatsApp us directly using our official support number.",
    kh: "Lada phi kwah pat ngin pyni ia ki advertise jong phi hapoh une u app click ha u help button sa whatsapp sha ngi la don lypa u help number."
  }
];

export const RulesModal: React.FC<RulesModalProps> = ({ onClose, onOpenHelp }) => {
  const [langFilter, setLangFilter] = useState<'both' | 'en' | 'kh'>('both');

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
              JINGMANA / RULES
            </h2>

            {/* Small text in center just below heading */}
            <p className="text-xs sm:text-sm text-amber-300 font-semibold mt-1 leading-relaxed max-w-lg mx-auto">
              Please follow the rules before adding any holiday • Sngewbha bud ia ki kyndon ha shwa ban buh sngi shuti ne sngi kyrpang
            </p>
          </div>
        </div>

        {/* Language Filter Bar: Both / English / Khasi */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2 flex items-center justify-center gap-1.5 shrink-0 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Language:
          </span>
          <button
            type="button"
            onClick={() => setLangFilter('both')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
              langFilter === 'both'
                ? 'bg-[#0e2a3a] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            English & Khasi (Both)
          </button>
          <button
            type="button"
            onClick={() => setLangFilter('en')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
              langFilter === 'en'
                ? 'bg-[#0e2a3a] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            English Only
          </button>
          <button
            type="button"
            onClick={() => setLangFilter('kh')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
              langFilter === 'kh'
                ? 'bg-[#0e2a3a] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Khasi Only
          </button>
        </div>

        {/* Scrollable Rules List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-3.5 text-xs sm:text-sm bg-slate-50/70">
          {RULES_LIST.map((rule) => {
            const isImportant = rule.isImportant;
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shrink-0 shadow-xs mt-0.5 ${
                    isImportant
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-[#0e2a3a] text-white'
                  }`}
                >
                  {rule.num}
                </span>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      Rule {rule.num}
                    </span>
                    {isImportant && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-950">
                        Important / Donkam
                      </span>
                    )}
                  </div>

                  {/* English Section */}
                  {(langFilter === 'both' || langFilter === 'en') && (
                    <div className={langFilter === 'both' ? 'bg-blue-50/60 p-2.5 rounded-xl border border-blue-100' : ''}>
                      {langFilter === 'both' && (
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-200/80 text-blue-900 mb-1">
                          English
                        </span>
                      )}
                      <p className="font-semibold text-slate-900 leading-relaxed text-xs sm:text-[13px]">
                        {rule.en}
                      </p>
                    </div>
                  )}

                  {/* Khasi Section */}
                  {(langFilter === 'both' || langFilter === 'kh') && (
                    <div className={langFilter === 'both' ? 'bg-amber-50/60 p-2.5 rounded-xl border border-amber-100' : ''}>
                      {langFilter === 'both' && (
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950 mb-1">
                          Khasi (Ktien Khasi)
                        </span>
                      )}
                      <p className="font-medium text-slate-800 leading-relaxed text-xs sm:text-[13px]">
                        {rule.kh}
                      </p>
                    </div>
                  )}
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

