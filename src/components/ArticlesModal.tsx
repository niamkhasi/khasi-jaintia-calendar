import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  HeartHandshake, 
  MessageSquare, 
  Clock, 
  Share2,
  Check,
  BookOpen
} from 'lucide-react';
import { ARTICLES_DATA, ArticleItem } from '../data/articlesData';

interface ArticlesModalProps {
  onClose: () => void;
  onOpenContactUs?: () => void;
}

function parseInlineFormatting(text: string): React.ReactNode {
  if (!text.includes('**')) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-slate-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

const ArticleContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  const paragraphs = content.split('\n\n');

  return (
    <div className="space-y-4 text-slate-800 text-sm sm:text-[15px] leading-relaxed">
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Subheadings starting with ###
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={pIdx}
              className="text-base sm:text-lg font-black text-[#0e2a3a] pt-3 pb-1 border-b border-amber-200/80 font-display flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#f1c40f] shrink-0" />
              <span>{trimmed.replace(/^###\s+/, '')}</span>
            </h4>
          );
        }

        // Multi-line block handling (lists or paragraphs)
        const lines = trimmed.split('\n');

        // Check if all lines are bullet points
        const isBulletList = lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
        if (isBulletList) {
          return (
            <ul key={pIdx} className="space-y-1.5 pl-2 my-2">
              {lines.map((l, lIdx) => (
                <li key={lIdx} className="flex items-start gap-2 text-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                  <span>{parseInlineFormatting(l.replace(/^[-*]\s+/, ''))}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Check if all lines are numbered points
        const isNumberedList = lines.every(l => /^\d+\.\s+/.test(l.trim()));
        if (isNumberedList) {
          return (
            <ol key={pIdx} className="space-y-2 pl-1 my-2">
              {lines.map((l, lIdx) => {
                const numMatch = l.trim().match(/^(\d+)\.\s+(.*)$/);
                if (!numMatch) return <li key={lIdx}>{parseInlineFormatting(l)}</li>;
                return (
                  <li key={lIdx} className="flex items-start gap-2.5 text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-[#0e2a3a] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {numMatch[1]}
                    </span>
                    <span className="font-medium pt-0.5">{parseInlineFormatting(numMatch[2])}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // Mixed or regular paragraph
        return (
          <div key={pIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const lTrim = line.trim();
              if (lTrim.startsWith('- ') || lTrim.startsWith('* ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span>{parseInlineFormatting(lTrim.replace(/^[-*]\s+/, ''))}</span>
                  </div>
                );
              }
              if (/^\d+\.\s+/.test(lTrim)) {
                const numMatch = lTrim.match(/^(\d+)\.\s+(.*)$/);
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1">
                    <span className="w-5 h-5 rounded-full bg-[#0e2a3a] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {numMatch ? numMatch[1] : ''}
                    </span>
                    <span className="font-medium">{numMatch ? parseInlineFormatting(numMatch[2]) : lTrim}</span>
                  </div>
                );
              }
              return (
                <p key={lIdx} className="leading-relaxed">
                  {parseInlineFormatting(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const ArticlesModal: React.FC<ArticlesModalProps> = ({ onClose, onOpenContactUs }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

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

  const handleShareArticle = (article: ArticleItem) => {
    const textToShare = `${article.title}\n\n${article.content || article.summary}\n\n— Khasi Jaintia Calendar`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: textToShare,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      });
    }
  };

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
              
              {/* Navigation & Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Articles</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleShareArticle(selectedArticle)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-950 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                    title="Share this article"
                  >
                    {copiedToast ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-600" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                    Article #{selectedArticle.id}
                  </span>
                </div>
              </div>

              {/* Title & Badge */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                  {selectedArticle.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-display leading-tight">
                  {selectedArticle.id}. {selectedArticle.title}
                </h3>
                {selectedArticle.heading && (
                  <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
                    {selectedArticle.heading}
                  </p>
                )}
              </div>

              {/* Article Content Display */}
              {selectedArticle.content ? (
                <div className="pt-2 border-t border-slate-100">
                  <ArticleContentRenderer content={selectedArticle.content} />
                </div>
              ) : (
                /* Placeholder for articles 7 to 13 */
                <div className="space-y-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {selectedArticle.summary}
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e2a3a] text-white space-y-2.5 shadow-md">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#f1c40f]" />
                      <h4 className="text-xs sm:text-sm font-bold text-[#f1c40f]">
                        Article Content Coming Soon
                      </h4>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      The complete in-depth article text for <strong>{selectedArticle.title}</strong> will be published here as soon as our team finalizes the content.
                    </p>
                    <p className="text-[11px] text-slate-300 italic">
                      Have facts, folk stories, or historical records to contribute? Feel free to contact our team.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-100">
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
                    <span>Send Correction / Feedback</span>
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
                  filteredArticles.map((article) => {
                    const hasFullText = Boolean(article.content);
                    return (
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
                              {hasFullText ? (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
                                  Full Article
                                </span>
                              ) : (
                                <span className="text-[9px] font-medium px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-400 shrink-0">
                                  Coming Soon
                                </span>
                              )}
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
                    );
                  })
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
