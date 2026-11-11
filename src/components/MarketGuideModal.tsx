import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Layers,
  Sparkles
} from 'lucide-react';
import { getCycleIndex } from '../data/khasiCalendarData';
import { 
  SNGI_IEW_GUIDE_DATA, 
  REGIONS_LIST, 
  searchMarkets, 
  SngiIewGuideDay 
} from '../data/marketGuideData';

interface MarketGuideModalProps {
  onClose: () => void;
  onSelectMarketForFilter?: (marketIndex: number) => void;
}

export const MarketGuideModal: React.FC<MarketGuideModalProps> = ({
  onClose,
  onSelectMarketForFilter,
}) => {
  // 1. Calculate today's Sngi Ïew from current calendar date
  const today = useMemo(() => new Date(), []);
  const todayCycleIdx = useMemo(() => {
    return getCycleIndex(today.getFullYear(), today.getMonth(), today.getDate());
  }, [today]);

  const todayDay: SngiIewGuideDay = useMemo(() => {
    return SNGI_IEW_GUIDE_DATA[todayCycleIdx] || SNGI_IEW_GUIDE_DATA[0];
  }, [todayCycleIdx]);

  // Formatted date string (e.g., "Friday, 6 November 2026")
  const todayFormatted = useMemo(() => {
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [today]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Filter Chips state: 'all' or regionKey ('hynniew_trep', 'mihngi', 'jaintia', 'ri_bhoi', 'sepngi')
  const [activeChip, setActiveChip] = useState<'all' | string>('all');

  // Browse by Sngi Ïew: active expanded day card (defaults to today's market day)
  const [expandedDayIdx, setExpandedDayIdx] = useState<number | null>(todayCycleIdx);

  // Browse by Region: active selected region (defaults to first region)
  const [selectedRegionKey, setSelectedRegionKey] = useState<string>('jaintia');

  // Search results
  const searchResults = useMemo(() => {
    return searchMarkets(searchQuery);
  }, [searchQuery]);

  // Filter chips list
  const filterChips = useMemo(() => [
    { key: 'all', label: 'All' },
    ...REGIONS_LIST.map(r => ({ key: r.key, label: r.chipLabel }))
  ], []);

  // Filter helper for regions
  const shouldShowRegion = (regionKey: string) => {
    if (activeChip === 'all') return true;
    return activeChip === regionKey;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-3 md:p-5 overflow-y-auto">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[94vh] sm:max-w-3xl sm:rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Top Header - Green #1A5C3A with Back Button */}
        <header className="bg-[#1A5C3A] text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-white/15 active:bg-white/20 transition flex items-center gap-1.5 text-white cursor-pointer"
              aria-label="Back to Calendar"
              title="Back to Calendar"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              <span className="text-sm font-bold sm:inline hidden">Back</span>
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight leading-tight">
                Khasi Jaintia Market Guide
              </h2>
              <div className="text-[11px] text-emerald-100 font-medium">
                8 Sngi Ïew • Hynniewtrep Cultural Trade
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/15 text-white/90 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50 text-slate-800">
          
          {/* ========================================================
              1. TODAY'S MARKET - TOP BANNER
              Green banner #1A5C3A at top
              ======================================================== */}
          <section className="bg-[#1A5C3A] text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/60 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f1c40f] animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-200">
                  Today&apos;s Sngi Ïew • {todayFormatted}
                </span>
              </div>
              {onSelectMarketForFilter && (
                <button
                  onClick={() => {
                    onSelectMarketForFilter(todayCycleIdx);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#f1c40f] hover:bg-amber-300 text-slate-950 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Highlight on Calendar</span>
                </button>
              )}
            </div>

            {/* "Today is - [Sngi Ïew Name]" */}
            <div className="space-y-1 mb-4">
              <div className="text-sm text-emerald-100 font-medium">
                According to the 8-day traditional revolving cycle:
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                Today is - <span className="text-[#f1c40f]">{todayDay.name}</span>
              </h3>
            </div>

            {/* Markets for today grouped by region */}
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Markets Trading Today by Region:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {todayDay.regions.map(r => (
                  <div
                    key={r.regionKey}
                    className="bg-black/20 backdrop-blur-xs rounded-xl p-3 border border-white/10"
                  >
                    <div className="text-xs font-bold text-[#f1c40f] flex items-center gap-1.5 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{r.regionName}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {r.markets.map(m => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded-md bg-white/15 text-white font-semibold text-xs border border-white/10"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================
              2. SEARCH BY MARKET NAME
              One search box on top: "Search market... e.g. Jowai"
              ======================================================== */}
          <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-3">
            <label htmlFor="market-search" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide">
              Search by Market Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="market-search"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search market... e.g. Jowai"
                className="w-full pl-10 pr-10 py-2.5 text-sm font-medium rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A5C3A] focus:border-transparent transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results Display */}
            {searchQuery.trim() !== '' && (
              <div className="pt-2 space-y-2 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-500">
                  {searchResults.length > 0 
                    ? `Found ${searchResults.length} match${searchResults.length > 1 ? 'es' : ''} for "${searchQuery}":`
                    : `No markets found matching "${searchQuery}".`}
                </div>

                <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  {searchResults.map((res, i) => (
                    <div 
                      key={`${res.marketName}-${res.sngiIewName}-${res.regionName}-${i}`}
                      className="p-3 flex flex-wrap items-center justify-between gap-2 hover:bg-emerald-50/50 transition"
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <span className="text-[#1A5C3A]">●</span>
                          <span>{res.sngiIewName}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-700 font-semibold">{res.regionName}</span>
                        </div>
                        <div className="text-xs text-slate-600 pl-4">
                          Market: <strong className="text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded font-bold">{res.marketName}</strong>
                        </div>
                      </div>

                      {onSelectMarketForFilter && (
                        <button
                          onClick={() => {
                            onSelectMarketForFilter(res.sngiIewIndex);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#1A5C3A] text-white hover:bg-emerald-800 transition cursor-pointer"
                        >
                          View in Calendar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ========================================================
              3. QUICK FILTER CHIPS
              All | Hynniew Trep | Mihngi | Jaintia | Ri Bhoi | Sepngi
              ======================================================== */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1A5C3A]" />
                <span>Quick Filter by Region:</span>
              </span>
              {activeChip !== 'all' && (
                <button
                  onClick={() => setActiveChip('all')}
                  className="text-[11px] text-[#1A5C3A] font-bold hover:underline cursor-pointer"
                >
                  Reset to All
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {filterChips.map(chip => {
                const isActive = activeChip === chip.key;
                return (
                  <button
                    key={chip.key}
                    onClick={() => setActiveChip(chip.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                      isActive
                        ? 'bg-[#1A5C3A] text-white shadow-sm ring-2 ring-[#1A5C3A]/30'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ========================================================
              4. BROWSE BY SNGI ÏEW
              Title: "Browse by Sngi Ïew"
              Show 8 cards:
              Ïewduh/Hat, Lyngka/Khyllaw, Nongkrem/Pynsiñ, Mawlong/Mulong,
              Rynghep/Musiang, Shyllong/Muchai, Pomtiah/Pyngkat, Umni/Thymbleiñ
              If user clicks one, show its markets grouped by region.
              ======================================================== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#1A5C3A]" />
                  <span>Browse by Sngi Ïew</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tap any of the 8 market days below to view all markets grouped by region.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SNGI_IEW_GUIDE_DATA.map((day) => {
                const isExpanded = expandedDayIdx === day.index;
                const isToday = todayCycleIdx === day.index;

                // Total markets count (filtered or total)
                const visibleRegions = day.regions.filter(r => shouldShowRegion(r.regionKey));
                const totalMarkets = visibleRegions.reduce((sum, r) => sum + r.markets.length, 0);

                return (
                  <div
                    key={day.name}
                    className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                      isExpanded
                        ? 'border-[#1A5C3A] ring-2 ring-[#1A5C3A]/20 shadow-md sm:col-span-2'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {/* Clickable Header Card */}
                    <button
                      onClick={() => setExpandedDayIdx(isExpanded ? null : day.index)}
                      className={`w-full p-4 flex items-center justify-between text-left transition cursor-pointer ${
                        isExpanded ? 'bg-slate-50/80 border-b border-slate-100' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                          isToday 
                            ? 'bg-[#1A5C3A] text-white' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {day.index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-slate-900">
                              {day.name}
                            </span>
                            {isToday && (
                              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#1A5C3A] text-[10px] font-black uppercase">
                                Today
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {totalMarkets} market{totalMarkets !== 1 ? 's' : ''} {activeChip !== 'all' ? `in selected region` : 'across all regions'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {onSelectMarketForFilter && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectMarketForFilter(day.index);
                              onClose();
                            }}
                            className="hidden sm:inline-block px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 hover:text-[#1A5C3A] bg-slate-100 hover:bg-slate-200 transition"
                            title="Highlight in calendar"
                          >
                            Highlight Day
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Markets Body Grouped by Region */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 space-y-4 bg-white">
                        {visibleRegions.length === 0 ? (
                          <div className="text-xs text-slate-400 italic">
                            No markets in this Sngi Ïew for the selected region filter.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {visibleRegions.map(region => (
                              <div
                                key={region.regionKey}
                                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                              >
                                <div className="text-xs font-bold text-[#1A5C3A] flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                                  <span>{region.regionName}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {region.markets.map(market => (
                                    <span
                                      key={market}
                                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold text-xs shadow-2xs"
                                    >
                                      {market}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ========================================================
              5. BROWSE BY REGION
              Title: "Browse by Region"
              Show 5 cards:
              Sngi Ïew Heh U Hynniew Trep, Ha Ri Lum Mihngi, Ha Ri Lum Jaintia,
              Ha Them Ri Bhoi, Ha Ri Lum Sepngi
              If user clicks one region, show all 8 Sngi Ïew again,
              but under each Sngi Ïew show ONLY markets of that region.
              ======================================================== */}
          <section className="space-y-3 pt-2">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#1A5C3A]" />
                <span>Browse by Region</span>
              </h3>
              <p className="text-xs text-slate-500">
                Select a region below to see its weekly trading schedule across all 8 Sngi Ïew.
              </p>
            </div>

            {/* 5 Region Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {REGIONS_LIST.map((reg) => {
                const isSelected = selectedRegionKey === reg.key;
                return (
                  <button
                    key={reg.key}
                    onClick={() => setSelectedRegionKey(reg.key)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-xs ${
                      isSelected
                        ? 'bg-[#1A5C3A] text-white border-[#1A5C3A] ring-2 ring-[#1A5C3A]/30 shadow-md'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                      Region
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm leading-tight">
                      {reg.name}
                    </div>
                    <div className={`text-[10px] font-semibold mt-1 flex items-center gap-1 ${
                      isSelected ? 'text-emerald-200' : 'text-slate-400'
                    }`}>
                      <span>8 Sngi Ïew view</span>
                      <span>&rarr;</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Region Markets Across All 8 Sngi Ïew */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 mt-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    All 8 Sngi Ïew Schedule For:
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-[#1A5C3A]">
                    {REGIONS_LIST.find(r => r.key === selectedRegionKey)?.name}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#1A5C3A] text-[10px] font-bold border border-emerald-200">
                  8-Day Cycle
                </span>
              </div>

              <div className="divide-y divide-slate-100 space-y-1">
                {SNGI_IEW_GUIDE_DATA.map((day) => {
                  const regGroup = day.regions.find(r => r.regionKey === selectedRegionKey);
                  const isToday = todayCycleIdx === day.index;

                  return (
                    <div
                      key={`region-view-${day.name}`}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="sm:w-1/3 flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                          isToday ? 'bg-[#1A5C3A] text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {day.index + 1}
                        </span>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>{day.name}</span>
                            {isToday && (
                              <span className="text-[9px] font-black uppercase text-[#1A5C3A] bg-emerald-100 px-1 rounded">
                                Today
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="sm:w-2/3 flex flex-wrap gap-1.5">
                        {regGroup && regGroup.markets.length > 0 ? (
                          regGroup.markets.map(m => (
                            <span
                              key={m}
                              className="px-2.5 py-1 rounded-md bg-emerald-50 text-[#1A5C3A] font-bold text-xs border border-emerald-100"
                            >
                              {m}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            No market recorded on this day in this region
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </div>

        {/* Bottom Footer Bar with Back button */}
        <footer className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            Khasi Jaintia Calendar • Traditional 8-day revolving market system
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1A5C3A] hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer ml-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Calendar</span>
          </button>
        </footer>

      </div>
    </div>
  );
};
