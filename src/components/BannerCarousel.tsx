import React, { useState, useEffect, useRef } from 'react';
import { BannerItem, BannerConfig, GoogleAdConfig } from '../services/bannerService';

interface BannerCarouselProps {
  config: BannerConfig;
  onAutoDisappear?: () => void;
}

export type CarouselSlide =
  | { type: 'custom'; id: string; banner: BannerItem; durationMs: number }
  | { type: 'google_ad'; id: string; durationMs: number; config: GoogleAdConfig };

/**
 * Google AdSense Component
 * Uses publisher client ca-pub-2632827933421052
 * Matches custom banner dimensions and responsive on mobile
 */
const GoogleAdSenseSlide: React.FC = () => {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (err) {
      console.warn('Google AdSense push notice:', err);
    }
  }, []);

  return (
    <div
      id="googleBanner"
      className="w-full h-full bg-slate-950 text-white flex items-center justify-center relative overflow-hidden select-none border-y border-amber-400/20"
    >
      {/* Background subtle glow effect */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-1/4 -bottom-8 w-32 h-32 bg-[#f1c40f]/10 rounded-full blur-2xl pointer-events-none" />

      {/* AdSense ins tag: exact specification */}
      <div className="w-full h-full flex items-center justify-center relative z-10 overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client="ca-pub-2632827933421052"
          data-ad-slot="auto"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {/* Clean fallback placeholder visible behind or before live ad renders */}
      <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-6 pointer-events-none z-0">
        <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0 pr-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-sm">
            <span className="font-black text-xs text-[#f1c40f]">Ad</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#f1c40f] text-slate-950 uppercase tracking-wider">
                Google AdSense
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-slate-200 truncate">
                Sponsored Ad
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-300 truncate mt-0.5 font-medium">
              ca-pub-2632827933421052 • Responsive Ad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  config,
  onAutoDisappear,
}) => {
  // 1. Gather all active custom banners (Banner 1, Banner 2, Banner 3)
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

  // 2. 4th Slide: Google AdSense Ad (always included in rotation loop)
  const isGoogleAdEnabled = config.googleAds ? config.googleAds.enabled !== false : true;
  const googleAdDuration = (config.googleAds && config.googleAds.durationSeconds)
    ? config.googleAds.durationSeconds * 1000
    : 15000;

  const googleAdSlide: CarouselSlide[] = isGoogleAdEnabled
    ? [{
        type: 'google_ad',
        id: 'google_ad_slot',
        durationMs: googleAdDuration,
        config: config.googleAds
      }]
    : [];

  // All active slides in rotation loop:
  // Banner 1 -> Banner 2 -> Banner 3 -> Google Ad -> Banner 1 again
  const activeSlides: CarouselSlide[] = [...customSlides, ...googleAdSlide];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-switch carousel using each slide's individual duration
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const currentSlide = activeSlides[currentIndex % activeSlides.length];
    const duration = currentSlide ? currentSlide.durationMs : 10000;

    const timer = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % activeSlides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, activeSlides.length]);

  // If all are OFF, hide whole banner place with View.GONE (no empty space)
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
        
        {/* Render all slides in rotation loop with smooth cross-fade */}
        {activeSlides.map((slide, idx) => {
          const isActive = idx === activeIndex;

          if (slide.type === 'google_ad') {
            return (
              <div
                key={slide.id}
                className={`w-full h-full absolute inset-0 transition-opacity duration-500 ${
                  isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
                }`}
              >
                <GoogleAdSenseSlide />
              </div>
            );
          }

          return (
            <div
              key={slide.id}
              onClick={() => handleCustomBannerClick(slide.banner)}
              className={`w-full h-full absolute inset-0 transition-opacity duration-500 bg-slate-900 ${
                slide.banner.link ? 'cursor-pointer' : ''
              } ${isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
            >
              <img
                src={slide.banner.imageUrl}
                alt={slide.banner.title || `Khasi Jaintia Promo Banner ${idx + 1}`}
                className="w-full h-full object-cover rounded-none block"
                style={{ borderRadius: '0px' }}
              />

              {/* Optional Title Badge if set */}
              {slide.banner.title && slide.banner.title.trim() && (
                <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md pointer-events-none shadow-xs">
                  {slide.banner.title}
                </div>
              )}
            </div>
          );
        })}

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
