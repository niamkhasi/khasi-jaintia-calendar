import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  HeartHandshake, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  BookOpen,
  Calendar,
  Landmark,
  Shield,
  Mountain,
  Users
} from 'lucide-react';

export interface ArticleItem {
  id: number;
  title: string;
  category: string;
  subtitle: string;
  summary: string;
  iconName?: string;
}

export const ARTICLES_DATA: ArticleItem[] = [
  {
    id: 1,
    title: 'Our Khasi Calender',
    category: 'Calendar & Tradition',
    subtitle: 'Ka Kot Khubor & Ka Rukom Khein Tarikh Ka Ri',
    summary: 'The unique structure of the Khasi calendar based on lunar cycles, seasonal changes, and traditional market intervals.',
  },
  {
    id: 2,
    title: 'Eight Sngi Iew (8 Market Days)',
    category: 'Markets & Trade',
    subtitle: 'Ka Rukom Khein Sngi Iew ha Khasi & Jaiñtia',
    summary: 'The sacred 8-day weekly cycle: Lawbah, Pnar, Umni, Iewduh, Lyngka, Nongkrem, Ryei, and Hat.',
  },
  {
    id: 3,
    title: 'Hynniew Trep',
    category: 'Ancestry & Heritage',
    subtitle: 'Ki Hynniew Trep Hynniew Skum',
    summary: 'The sacred origin and belief of the Seven Huts placed on earth to care for nature, culture, and kinship.',
  },
  {
    id: 4,
    title: 'Behdeiñkhlam',
    category: 'Festivals & Faith',
    subtitle: 'Ka Niam Ka Rukom ha Jaiñtia Hills',
    summary: 'The grand ritual festival of the Pnar people to drive away evil plagues and invoke bumper harvest and well-being.',
  },
  {
    id: 5,
    title: '12 Daloi 30 Syiem',
    category: 'Traditional Governance',
    subtitle: 'Ki Hima, Ki Elaka & Ka Synshar Khadar Tynrai',
    summary: 'The indigenous democratic chieftainships, traditional Dorbars, and elders governing the Khasi and Jaintia kingdoms.',
  },
  {
    id: 6,
    title: 'Our Khasi Merriage And Our Child',
    category: 'Society & Kinship',
    subtitle: 'Ka Kur Ka Jait & Ka Poikha Poiman',
    summary: 'Matrilineal lineage, sacred marriage rites, clan respect (Ka Akor), and naming traditions passed from mother to children.',
  },
  {
    id: 7,
    title: 'Ka Khun Khadduh (Youngest Daughter)',
    category: 'Family & Custodianship',
    subtitle: 'Ka Nongri Nongda & Ka Kmie ha Iing',
    summary: 'The sacred role of the youngest daughter as the custodian of ancestral property and caretaker of aging parents.',
  },
  {
    id: 8,
    title: 'U Lum Shillong',
    category: 'Sacred Mountains',
    subtitle: "Ka Shnong Ki Blei & U 'Lei Shillong",
    summary: "The highest peak and legendary home of the presiding deity U 'Lei Shillong guarding over the hills.",
  },
  {
    id: 9,
    title: 'U Lum Sohpet Bneng',
    category: 'Sacred Mountains',
    subtitle: 'Ka Jingkieng Ksiar & The Navel of Heaven',
    summary: 'The sacred hill of the golden ladder connecting heaven and earth, venerated by our indigenous faith.',
  },
  {
    id: 10,
    title: 'Shad Suk Mynsiem',
    category: 'Festivals & Dance',
    subtitle: 'Ka Shad Kmen & Dance of Peaceful Hearts',
    summary: 'The spring thanksgiving dance of maidens and men celebrating life, peace, and offering thanks to God (U Blei).',
  },
  {
    id: 11,
    title: 'Shad Sukra',
    category: 'Festivals & Dance',
    subtitle: 'Ka Shad Pyllun ha Pnar / Jaintia',
    summary: 'The joyful sowing festival dance of the Pnar people praying for peace, rain, and fertile earth before planting.',
  },
  {
    id: 12,
    title: 'U Tirot Sing Syiem',
    category: 'Freedom Fighters & Heroes',
    subtitle: 'U Khla Wait Ka Ri Khasi (Hero of Nongkhlaw)',
    summary: 'The fearless Syiem of Nongkhlaw who led the Anglo-Khasi war of 1829–1833 resisting colonial British subjugation.',
  },
  {
    id: 13,
    title: 'U Kiang Nangbah',
    category: 'Freedom Fighters & Heroes',
    subtitle: 'U Shlur Ka Ri Jaiñtia',
    summary: 'The legendary martyr of Jaintia Hills who fought against unjust British taxes and gave his life for the motherland.',
  },
];

interface ArticlesModalProps {
  onClose: () => void;
  onOpenContactUs?: () => void;
}

export const ArticlesModal: React.FC<ArticlesModalProps> = ({ onClose, onOpenContactUs }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  const filteredArticles = ARTICLES_DATA.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="articles-modal-title"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-4 sm:p-5 shrink-0 relative border-b border-white/10">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer absolute top-3.5 right-3.5"
            aria-label="Close Articles"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-br from-[#f1c40f] to-amber-500 text-slate-950 font-black shadow-md flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>

            <div className="min-w-0 pr-8">
              <h2
                id="articles-modal-title"
                className="text-lg sm:text-xl font-black font-display tracking-tight text-white flex items-center gap-2"
              >
                <span>Articles</span>
                <span className="px-2 py-0.2 rounded-full bg-[#f1c40f] text-slate-950 text-[10px] font-black tracking-normal">
                  13 Cultural Topics
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-300 font-medium truncate">
                Culture, History, Festivals &amp; Heroes of Khasi &amp; Jaiñtia
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-800 text-sm leading-relaxed bg-slate-50/70 flex-1">
          
          {/* Apology & Humble Feedback Disclaimer Card (As Requested by User) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-300/80 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-black">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                Humble Request to Our Readers
              </h3>
              <p className="text-xs sm:text-[13px] text-amber-900 font-semibold mt-1 leading-relaxed">
                &ldquo;We always try our best. If we make any mistakes, please forgive us and let us know so we can correct them.&rdquo;
              </p>
              {onOpenContactUs && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenContactUs();
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 hover:text-amber-800 underline cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send a correction or suggestion &rarr;</span>
                </button>
              )}
            </div>
          </div>

          {/* If an article is selected, show the article reading view */}
          {selectedArticle ? (
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Articles List</span>
                </button>

                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                  Article #{selectedArticle.id}
                </span>
              </div>

              {/* Title & Badge */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  {selectedArticle.category}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2 font-display">
                  {selectedArticle.id}. {selectedArticle.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-amber-700 mt-0.5">
                  {selectedArticle.subtitle}
                </p>
              </div>

              {/* Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedArticle.summary}
              </div>

              {/* Full Article Text Placeholder / Notice */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e2a3a] text-white space-y-2.5 shadow-md">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#f1c40f]" />
                  <h4 className="text-xs sm:text-sm font-bold text-[#f1c40f]">
                    Article Content Coming Soon
                  </h4>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  The complete in-depth article text for <strong>{selectedArticle.title}</strong> is currently being compiled and will be published here shortly.
                </p>
                <p className="text-[11px] text-slate-300 italic">
                  Have facts, folk stories, or historical records to contribute? Feel free to contact our team.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  &larr; View Other Articles
                </button>

                {onOpenContactUs && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenContactUs();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0e2a3a] hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#f1c40f]" />
                    <span>Send Information</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search among 13 articles..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a] shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs px-1.5 py-0.5"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* 13 Articles List */}
              <div className="space-y-2">
                {filteredArticles.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
                    No articles found matching &ldquo;{searchQuery}&rdquo;.
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400/80 transition-all shadow-2xs hover:shadow-xs cursor-pointer group flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Number Badge */}
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#0e2a3a] text-white group-hover:bg-[#f1c40f] group-hover:text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 transition-colors shadow-xs">
                          {article.id}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0e2a3a] transition-colors leading-tight">
                              {article.title}
                            </h4>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                              {article.category}
                            </span>
                          </div>

                          <p className="text-[11px] text-amber-700 font-semibold truncate mt-0.5">
                            {article.subtitle}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {article.summary}
                          </p>
                        </div>
                      </div>

                      {/* Right Arrow indicator */}
                      <div className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0">
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            13 Cultural Articles &bull; Khasi Jaintia Calendar
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-extrabold text-xs transition cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
