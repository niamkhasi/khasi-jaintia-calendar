import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { BannerItem, BannerConfig, GoogleAdConfig } from '../services/bannerService';

interface BannerCarouselProps {
  config: BannerConfig;
  onAutoDisappear?: () => void;
}

export type CarouselSlide =
  | { type: 'custom'; id: string; banner: BannerItem; durationMs: number }
  | { type: 'google_ad'; id: string; durationMs: number; config: GoogleAdConfig };

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  config,
  onAutoDisappear,
}) => {
  // 1. Gather all active custom banners (must be enabled & have image)
  const customSlides: CarouselSlide[] = (config.banners || [])
    .filter(b => b.enabled !== false && Boolean(b.imageUrl && b.imageUrl.trim()))
    .map((b, idx) => {
      const bannerSec = (b.durationSeconds && b.durationSeconds >= 5 && b.durationSeconds <= 60)
        ? b.durationSeconds
        : (config.customBannerDurationSeconds >= 5 && config.customBannerDurationSeconds <= 60
            ? config.customBannerDurationSeconds
            : 10);
      return {
        type: 'custom',
        id: b.id || `custom_${idx + 1}`,
        banner: b,
        durationMs: bannerSec * 1000
      };
    });

  // 2. 4th Box: Google Ads (must be enabled)
  const googleAdSlide: CarouselSlide[] = (config.googleAds && config.googleAds.enabled)
    ? [{
        type: 'google_ad',
        id: 'google_ad_slot',
        durationMs: (config.googleAds.durationSeconds || 60) * 1000,
        config: config.googleAds
      }]
    : [];

  // All active boxes in loop order: Custom 1 (5s) -> Custom 2 (5s) -> Custom 3 (5s) -> Google Ad (60s)
  const activeSlides: CarouselSlide[] = [...customSlides, ...googleAdSlide];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-switch carousel using each slide's individual duration (5s for custom, 60s for Google Ad)
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const currentSlide = activeSlides[currentIndex % activeSlides.length];
    const duration = currentSlide ? currentSlide.durationMs : 5000;

    const timer = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % activeSlides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, activeSlides.length]);

  // If all 4 are OFF, hide whole banner place with View.GONE (no empty space)
  if (activeSlides.length === 0) {
    return null;
  }

  // Swipe handling for touch devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 40 && activeSlides.length > 1) {
      if (distance > 0) {
        // Swipe left -> Next
        setCurrentIndex(prev => (prev + 1) % activeSlides.length);
      } else {
        // Swipe right -> Prev
        setCurrentIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeIndex = currentIndex % activeSlides.length;
  const currentSlide = activeSlides[activeIndex] || activeSlides[0];

  const handleCustomBannerClick = (banner: BannerItem) => {
    if (banner.link && banner.link.trim()) {
      let targetUrl = banner.link.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="-mx-3 md:-mx-4 w-[calc(100%+1.5rem)] md:w-[calc(100%+2rem)] overflow-hidden relative select-none animate-in fade-in duration-300"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Container: touches left and right edges like Flipkart */}
      <div className="w-full h-20 sm:h-24 md:h-28 relative overflow-hidden bg-slate-900">
        
        {/* SLIDE TYPE: 4th Box = GOOGLE ADS (60 seconds) */}
        {currentSlide.type === 'google_ad' ? (
          <div 
            id="googleBanner"
            data-ad-unit-id={currentSlide.config.adUnitId || 'ca-app-pub-2632827933421052/4130268849'}
            data-ad-client={currentSlide.config.appId || 'ca-app-pub-2632827933421052~6102872245'}
            className="w-full h-full bg-gradient-to-r from-slate-950 via-[#0e2a3a] to-slate-900 text-white flex items-center justify-between px-3 sm:px-6 relative overflow-hidden select-none border-y border-amber-400/20"
          >
            {/* Background subtle glow effect */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute left-1/4 -bottom-8 w-32 h-32 bg-[#f1c40f]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2.5 sm:gap-4 relative z-10 flex-1 min-w-0 pr-2">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-md">
                <span className="font-black text-xs sm:text-sm tracking-tight text-[#f1c40f]">Ads</span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#f1c40f] text-slate-950 uppercase tracking-wider">
                    Google Ad
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-100 truncate">
                    {currentSlide.config.adTitle || 'Promoted Community Listing'}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 truncate mt-0.5 font-medium">
                  Reach thousands of customers daily across Khasi & Jaintia Hills.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10 shrink-0">
              <a
                href="https://wa.me/917005893341?text=Hi%2C%20I%20would%20like%20to%20advertise%20in%20Khasi%20Jaintia%20Calendar%20App"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#f1c40f] to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
              >
                <span>Advertise</span>
                <ExternalLink className="w-3 h-3 stroke-[2.5]" />
              </a>

              {/* 60s rotation countdown badge */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-[10px] font-mono text-amber-300">
                <Clock className="w-3 h-3" />
                <span>60s</span>
              </div>
            </div>
          </div>
        ) : (
          /* SLIDE TYPE: CUSTOM BANNERS 1, 2, 3 (5 seconds each) */
          <div 
            onClick={() => handleCustomBannerClick(currentSlide.banner)}
            className={`w-full h-full relative overflow-hidden bg-slate-900 ${
              currentSlide.banner.link ? 'cursor-pointer' : ''
            }`}
          >
            <img
              src={currentSlide.banner.imageUrl}
              alt={currentSlide.banner.title || `Khasi Jaintia Promo Banner ${activeIndex + 1}`}
              className="w-full h-full object-cover rounded-none block transition-opacity duration-500"
              style={{ borderRadius: '0px' }}
            />

            {/* Optional Title Badge if set */}
            {currentSlide.banner.title && currentSlide.banner.title.trim() && (
              <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md pointer-events-none shadow-xs">
                {currentSlide.banner.title}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Small Dots below if 2 or more slides */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-1 right-3 flex items-center gap-1.5 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs pointer-events-none z-20">
          {activeSlides.map((s, idx) => {
            const isGoogleAd = s.type === 'google_ad';
            const isActive = idx === activeIndex;
            return (
              <span
                key={s.id || idx}
                className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                  isActive
                    ? isGoogleAd
                      ? 'w-7 px-1 h-3.5 bg-blue-500 text-[8px] font-black text-white'
                      : 'w-4 h-1.5 bg-[#f1c40f]'
                    : isGoogleAd
                    ? 'w-2 h-2 bg-blue-400/60'
                    : 'w-1.5 h-1.5 bg-white/60'
                }`}
              >
                {isActive && isGoogleAd ? 'Ad' : null}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
