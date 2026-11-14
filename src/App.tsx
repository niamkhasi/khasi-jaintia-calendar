/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  BookOpen, 
  Search, 
  Sparkles, 
  Printer, 
  WifiOff, 
  Filter, 
  Check, 
  MapPin,
  CalendarCheck,
  Plus,
  ShieldCheck,
  User,
  LogOut,
  Scale,
  X,
  Clock
} from 'lucide-react';
import { 
  KHASI_MONTHS, 
  ENG_MONTHS, 
  KHASI_MONTH_DESCRIPTIONS, 
  CYCLE, 
  getCycleForDate, 
  getCycleIndex, 
  getHolidaysForDate 
} from './data/khasiCalendarData';
import { NameMode, Holiday } from './types/calendar';
import { Splash } from './components/Splash';
import { DayModal } from './components/DayModal';
import { MonthGrid } from './components/MonthGrid';
import { MarketGuideModal } from './components/MarketGuideModal';
import { MarketFinderModal } from './components/MarketFinderModal';
import { RulesModal } from './components/RulesModal';
import { HolidaysModal } from './components/HolidaysModal';
import { HolidayWishModal } from './components/HolidayWishModal';
import { HolidayWishBanner } from './components/HolidayWishBanner';
import { FirebaseHolidayManagerModal } from './components/FirebaseHolidayManagerModal';
import { PaywallModal } from './components/PaywallModal';
import { AddHolidayFormModal } from './components/AddHolidayFormModal';
import { CustomerCareModal } from './components/CustomerCareModal';
import { PurchaseSuccessModal } from './components/PurchaseSuccessModal';
import { AdminHolidayManagerModal } from './components/AdminHolidayManagerModal';
import { AndroidBuildModal } from './components/AndroidBuildModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { useCalendarNotes } from './hooks/useCalendarNotes';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useFirebaseHolidays, ADMIN_EMAILS } from './hooks/useFirebaseHolidays';
import { billingClient, PurchaseResult } from './services/billingClient';
import { BannerCarousel } from './components/BannerCarousel';
import { BannerSettingsModal } from './components/BannerSettingsModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { BannerConfig, getBannerConfig, isBannerActiveToday, subscribeToBannerConfig } from './services/bannerService';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed (9 = October)
  const [nameMode, setNameMode] = useState<NameMode>('Dual');
  const [highlightMarketIdx, setHighlightMarketIdx] = useState<number | null>(null);
  const [todayPulsing, setTodayPulsing] = useState<boolean>(false);

  // Modals state
  const [selectedDayInfo, setSelectedDayInfo] = useState<{ year: number; month: number; day: number } | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showFinder, setShowFinder] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);
  const [showHolidayManager, setShowHolidayManager] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAddPaidHoliday, setShowAddPaidHoliday] = useState(false);
  const [showCustomerCare, setShowCustomerCare] = useState(false);
  const [showAdminManager, setShowAdminManager] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAndroidBuild, setShowAndroidBuild] = useState(false);
  const [recentPurchase, setRecentPurchase] = useState<PurchaseResult | null>(null);
  const [activeWishHoliday, setActiveWishHoliday] = useState<{ holiday: Holiday; year: number } | null>(null);
  const [dismissedHolidayBanner, setDismissedHolidayBanner] = useState<boolean>(false);
  const [addHolidayPreselectedDate, setAddHolidayPreselectedDate] = useState<string | undefined>(undefined);

  // Slots state synced with localStorage / SharedPreferences
  const [slots, setSlots] = useState<{ tempSlotsCount: number; permSlotsCount: number }>(() => billingClient.getSlots());

  // Banner Carousel & Settings
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(() => getBannerConfig());
  const [showBanner, setShowBanner] = useState<boolean>(() => isBannerActiveToday(getBannerConfig()));
  const [showBannerSettings, setShowBannerSettings] = useState<boolean>(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState<boolean>(false);
  const [showSyncedToast, setShowSyncedToast] = useState<boolean>(false);
  const [reviewNoticeToast, setReviewNoticeToast] = useState<string | null>(null);

  useEffect(() => {
    let syncTimer: any;
    const handleSlotsSync = () => {
      setSlots(billingClient.getSlots());
    };
    const handleBannerUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BannerConfig>;
      const newConfig = customEvent.detail || getBannerConfig();
      setBannerConfig(newConfig);
      setShowBanner(isBannerActiveToday(newConfig));
    };
    const handleHolidaysSynced = () => {
      setShowSyncedToast(true);
      if (syncTimer) clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        setShowSyncedToast(false);
      }, 4000);
    };

    // Real-time Firestore sync: auto-shows custom banners to all users live without Play Store update!
    const unsubscribeBanner = subscribeToBannerConfig((liveConfig) => {
      setBannerConfig(liveConfig);
      setShowBanner(isBannerActiveToday(liveConfig));
    });

    window.addEventListener('billing_slots_updated', handleSlotsSync);
    window.addEventListener('storage', handleSlotsSync);
    window.addEventListener('kj_banner_updated', handleBannerUpdate);
    window.addEventListener('kj_holidays_synced', handleHolidaysSynced);

    return () => {
      if (syncTimer) clearTimeout(syncTimer);
      unsubscribeBanner();
      window.removeEventListener('billing_slots_updated', handleSlotsSync);
      window.removeEventListener('storage', handleSlotsSync);
      window.removeEventListener('kj_banner_updated', handleBannerUpdate);
      window.removeEventListener('kj_holidays_synced', handleHolidaysSynced);
    };
  }, []);

  // Firebase Holidays & Auth
  const { 
    customHolidays, 
    allPaidHolidays,
    deletedHolidayKeys,
    reports,
    currentUser, 
    isAdmin, 
    pendingNotificationsCount,
    loginWithGoogle, 
    logout, 
    addPaidHoliday,
    approveHoliday,
    denyHoliday,
    editPaidHolidayTitle,
    deleteHolidayDoc,
    adminDeletePaidHoliday,
    submitHolidayReport,
    addHoliday, 
    updateHoliday,
    deleteHoliday 
  } = useFirebaseHolidays();

  // Notes & Offline status
  const { notes, addNote, deleteNote, getNotesForDate, hasNotes } = useCalendarNotes();
  const isOnline = useOnlineStatus();

  const yearRowRef = useRef<HTMLDivElement>(null);

  // Real today date for holiday detection (including custom holidays from Firebase)
  const todayNow = new Date();
  const todayHolidays = getHolidaysForDate(todayNow.getFullYear(), todayNow.getMonth(), todayNow.getDate(), customHolidays, deletedHolidayKeys);
  const holidayToday = todayHolidays.length > 0 ? todayHolidays[0] : null;

  // Open Add Holiday Flow:
  // 1. If not signed in -> popup Google sign in first.
  // 2. If admin (muniphawa@gmail.com / niamkhasi@gmail.com) -> free lifetime addition without payment!
  // 3. If regular user -> check slots. If 0 slots -> show Paywall (Rs 499 for Temp / Rs 999 for Perm).
  const handleOpenAddHoliday = async (dateStr?: string) => {
    if (dateStr) {
      setAddHolidayPreselectedDate(dateStr);
    } else {
      setAddHolidayPreselectedDate(undefined);
    }

    let activeUser = currentUser;
    if (!activeUser) {
      try {
        activeUser = await loginWithGoogle();
      } catch (err) {
        console.warn('Sign in dismissed', err);
        return;
      }
    }

    if (!activeUser || !activeUser.email) return;

    const email = activeUser.email.toLowerCase();
    const userIsAdmin = ADMIN_EMAILS.some(e => e.toLowerCase() === email);

    if (userIsAdmin) {
      setShowAddPaidHoliday(true);
      return;
    }

    const currentSlots = billingClient.getSlots();
    setSlots(currentSlots);
    if (currentSlots.tempSlotsCount === 0 && currentSlots.permSlotsCount === 0) {
      setShowPaywall(true);
    } else {
      setShowAddPaidHoliday(true);
    }
  };

  // Initialize with real current date on mount (clamped to 2025-2100) & auto wish
  useEffect(() => {
    const today = new Date();
    let y = today.getFullYear();
    let m = today.getMonth();
    if (y < 2025) y = 2025;
    if (y > 2100) y = 2100;
    setCurrentYear(y);
    setCurrentMonth(m);

    // Register service worker if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    }

    // Google Play Billing v6: On app start, call service.listPurchases() and if purchase exists, unlock that feature
    billingClient.checkAndRestorePurchases().then((restoreResult) => {
      if (restoreResult.restored) {
        setSlots(billingClient.getSlots());
        setReviewNoticeToast(`Google Play: Restored ${restoreResult.count} purchased holiday slot(s)!`);
        setTimeout(() => setReviewNoticeToast(null), 6000);
      }
    }).catch((err) => {
      console.warn('App start purchase restore check:', err);
    });

    // Automatic greeting if today is a holiday!
    if (holidayToday) {
      const wishKey = `kj_holiday_greeted_${y}_${m}_${today.getDate()}`;
      if (!sessionStorage.getItem(wishKey)) {
        // Trigger automatic holiday wish greeting
        setTimeout(() => {
          setActiveWishHoliday({
            holiday: holidayToday,
            year: y
          });
        }, 1200);
        sessionStorage.setItem(wishKey, 'true');
      }
    }
  }, []);

  // Scroll active year button into view
  useEffect(() => {
    if (yearRowRef.current) {
      const activeBtn = yearRowRef.current.querySelector<HTMLButtonElement>(`[data-year="${currentYear}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentYear]);

  // Smooth Month Transition & Interactive Gesture State
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [snapBackAnimation, setSnapBackAnimation] = useState<boolean>(false);
  const [transitionState, setTransitionState] = useState<{
    dir: number; // 1 for next month, -1 for prev month
    targetYear: number;
    targetMonth: number;
    pendingDay?: number;
    isAnimating: boolean;
  } | null>(null);

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null);
  const isSwipingHorizontal = useRef<boolean | null>(null);
  const mouseStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isDraggingMouse = useRef<boolean>(false);
  const hasSwiped = useRef<boolean>(false);

  // Buttery-smooth month transition (spring curve like mobile app switcher)
  const triggerSmoothMonthChange = (
    dir: number,
    pendingDay?: number,
    customTargetYear?: number,
    customTargetMonth?: number
  ) => {
    if (transitionState) return;

    let targetY = customTargetYear !== undefined ? customTargetYear : currentYear;
    let targetM = customTargetMonth !== undefined ? customTargetMonth : (currentMonth + dir);

    if (customTargetMonth === undefined) {
      if (targetM > 11) {
        targetM = 0;
        targetY++;
      } else if (targetM < 0) {
        targetM = 11;
        targetY--;
      }
    }

    if (targetY > 2100 || targetY < 2025) {
      setSnapBackAnimation(true);
      setDragOffset(0);
      setIsDragging(false);
      setTimeout(() => setSnapBackAnimation(false), 260);
      return;
    }

    // Trigger month switch transition
    setTransitionState({
      dir,
      targetYear: targetY,
      targetMonth: targetM,
      pendingDay,
      isAnimating: true,
    });
    setIsDragging(false);

    setTimeout(() => {
      setCurrentYear(targetY);
      setCurrentMonth(targetM);
      if (pendingDay !== undefined) {
        setSelectedDayInfo({ year: targetY, month: targetM, day: pendingDay });
      }
      setTransitionState(null);
      setDragOffset(0);
    }, 320);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (transitionState) return;
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
      touchMoveRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isSwipingHorizontal.current = null;
      hasSwiped.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (transitionState) return;
    if (!touchStartRef.current || e.touches.length !== 1) return;
    touchMoveRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const diffX = touchMoveRef.current.x - touchStartRef.current.x;
    const diffY = touchMoveRef.current.y - touchStartRef.current.y;

    if (isSwipingHorizontal.current === null) {
      if (Math.abs(diffX) > 20 || Math.abs(diffY) > 20) {
        isSwipingHorizontal.current = Math.abs(diffX) > Math.abs(diffY) * 1.25;
      }
    }

    if (isSwipingHorizontal.current === true) {
      hasSwiped.current = true;
      let offset = diffX;
      // Rubber-band resistance at boundaries
      if ((currentYear <= 2025 && currentMonth === 0 && diffX > 0) ||
          (currentYear >= 2100 && currentMonth === 11 && diffX < 0)) {
        offset = diffX * 0.22;
      }
      setDragOffset(offset);
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (transitionState) return;
    if (touchStartRef.current && isSwipingHorizontal.current === true) {
      const diffX = touchMoveRef.current ? touchMoveRef.current.x - touchStartRef.current.x : 0;
      const elapsed = Date.now() - touchStartRef.current.time;
      const velocity = Math.abs(diffX) / (elapsed || 1);

      if (Math.abs(diffX) > 48 || (velocity > 0.32 && Math.abs(diffX) > 20)) {
        if (diffX < 0) {
          triggerSmoothMonthChange(1);
        } else {
          triggerSmoothMonthChange(-1);
        }
      } else {
        setIsDragging(false);
        setSnapBackAnimation(true);
        setDragOffset(0);
        setTimeout(() => setSnapBackAnimation(false), 260);
      }
    } else {
      setIsDragging(false);
      setDragOffset(0);
    }

    touchStartRef.current = null;
    touchMoveRef.current = null;
    isSwipingHorizontal.current = null;
    setTimeout(() => {
      hasSwiped.current = false;
    }, 50);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (transitionState) return;
    if (e.button !== 0) return;
    mouseStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    isDraggingMouse.current = true;
    hasSwiped.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (transitionState) return;
    if (!isDraggingMouse.current || !mouseStartRef.current) return;
    const diffX = e.clientX - mouseStartRef.current.x;
    const diffY = e.clientY - mouseStartRef.current.y;

    if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY) * 1.25) {
      hasSwiped.current = true;
      let offset = diffX;
      if ((currentYear <= 2025 && currentMonth === 0 && diffX > 0) ||
          (currentYear >= 2100 && currentMonth === 11 && diffX < 0)) {
        offset = diffX * 0.22;
      }
      setDragOffset(offset);
      setIsDragging(true);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (transitionState) return;
    if (isDraggingMouse.current && mouseStartRef.current) {
      const diffX = e.clientX - mouseStartRef.current.x;
      const elapsed = Date.now() - mouseStartRef.current.time;
      const velocity = Math.abs(diffX) / (elapsed || 1);

      if (Math.abs(diffX) > 48 || (velocity > 0.32 && Math.abs(diffX) > 20)) {
        if (diffX < 0) {
          triggerSmoothMonthChange(1);
        } else {
          triggerSmoothMonthChange(-1);
        }
      } else {
        setIsDragging(false);
        setSnapBackAnimation(true);
        setDragOffset(0);
        setTimeout(() => setSnapBackAnimation(false), 260);
      }
    } else {
      setIsDragging(false);
      setDragOffset(0);
    }
    isDraggingMouse.current = false;
    mouseStartRef.current = null;
    setTimeout(() => {
      hasSwiped.current = false;
    }, 50);
  };

  const goToday = () => {
    const today = new Date();
    let y = today.getFullYear();
    let m = today.getMonth();
    if (y < 2025) y = 2025;
    if (y > 2100) y = 2100;

    setSelectedDayInfo(null);
    setTodayPulsing(true);

    if (y !== currentYear || m !== currentMonth) {
      const dir = y > currentYear || (y === currentYear && m > currentMonth) ? 1 : -1;
      triggerSmoothMonthChange(dir, undefined, y, m);
    }

    setTimeout(() => {
      const todayCell = document.getElementById('today-calendar-cell');
      if (todayCell) {
        todayCell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 380);

    setTimeout(() => {
      setTodayPulsing(false);
    }, 3000);
  };

  // Click on date in current month -> open day details
  const handleCurrentDayClick = (y: number, m: number, d: number) => {
    if (isDragging || transitionState) {
      return;
    }
    setSelectedDayInfo({ year: y, month: m, day: d });
  };

  // Click on leading/trailing date number -> smooth app-switch transition to that month
  const handleTrailingDayClick = (y: number, m: number, _d: number, dir: number) => {
    if (isDragging || transitionState) {
      return;
    }
    triggerSmoothMonthChange(dir, undefined, y, m);
  };

  const handleNavigateModalDay = (offset: number) => {
    if (!selectedDayInfo) return;
    const current = new Date(selectedDayInfo.year, selectedDayInfo.month, selectedDayInfo.day);
    current.setDate(current.getDate() + offset);
    const newY = current.getFullYear();
    const newM = current.getMonth();
    const newD = current.getDate();

    setSelectedDayInfo({
      year: newY,
      month: newM,
      day: newD,
    });

    if (newM !== currentMonth || newY !== currentYear) {
      triggerSmoothMonthChange(offset > 0 ? 1 : -1, newD, newY, newM);
    }
  };

  const handleDropdownMonthChange = (newMonth: number) => {
    if (newMonth === currentMonth || transitionState) return;
    const dir = newMonth > currentMonth ? 1 : -1;
    triggerSmoothMonthChange(dir, undefined, currentYear, newMonth);
  };

  const handlePrint = () => {
    window.print();
  };

  // Real today date for comparison
  const now = new Date();
  const isRealToday = (y: number, m: number, d: number) => {
    return now.getFullYear() === y && now.getMonth() === m && now.getDate() === d;
  };

  const monthDescription = KHASI_MONTH_DESCRIPTIONS[currentMonth];

  // Determine if we need adjacent month panel for smooth app-switching feel
  let adjYear = currentYear;
  let adjMonth = currentMonth;
  let showAdjacent = false;
  let adjDir = 0;

  if (transitionState) {
    showAdjacent = true;
    adjDir = transitionState.dir;
    adjYear = transitionState.targetYear;
    adjMonth = transitionState.targetMonth;
  } else if ((isDragging || snapBackAnimation) && dragOffset !== 0) {
    showAdjacent = true;
    adjDir = dragOffset < 0 ? 1 : -1;
    adjMonth = currentMonth + adjDir;
    adjYear = currentYear;
    if (adjMonth > 11) {
      adjMonth = 0;
      adjYear++;
    } else if (adjMonth < 0) {
      adjMonth = 11;
      adjYear--;
    }
  }

  // Active (current) card transform & transition
  let activeTransform = 'translateX(0px)';
  let activeOpacity = 1;
  let activeTransition = 'none';

  // Adjacent card transform & transition
  let adjacentTransform = adjDir > 0 ? 'translateX(100%)' : 'translateX(-100%)';
  let adjacentOpacity = 1;
  let adjacentTransition = 'none';

  const springEasing = 'cubic-bezier(0.22, 1, 0.36, 1)'; // iOS / Android springboard curve

  if (transitionState) {
    if (!transitionState.isAnimating) {
      activeTransform = 'translateX(0%)';
      activeOpacity = 1;
      activeTransition = 'none';
      adjacentTransform = transitionState.dir > 0 ? 'translateX(100%)' : 'translateX(-100%)';
      adjacentOpacity = 1;
      adjacentTransition = 'none';
    } else {
      activeTransform = transitionState.dir > 0 ? 'translateX(-100%) scale(0.985)' : 'translateX(100%) scale(0.985)';
      activeOpacity = 0.88;
      activeTransition = `transform 340ms ${springEasing}, opacity 340ms ease-out`;
      adjacentTransform = 'translateX(0%) scale(1)';
      adjacentOpacity = 1;
      adjacentTransition = `transform 340ms ${springEasing}, opacity 340ms ease-out`;
    }
  } else if (isDragging) {
    activeTransform = `translateX(${dragOffset}px)`;
    activeOpacity = 1 - Math.min(Math.abs(dragOffset) / 2500, 0.12);
    activeTransition = 'none';

    if (adjDir > 0) {
      adjacentTransform = `translateX(calc(100% + ${dragOffset}px))`;
    } else {
      adjacentTransform = `translateX(calc(-100% + ${dragOffset}px))`;
    }
    adjacentOpacity = 0.9 + Math.min(Math.abs(dragOffset) / 1000, 0.1);
    adjacentTransition = 'none';
  } else if (snapBackAnimation) {
    activeTransform = 'translateX(0px)';
    activeOpacity = 1;
    activeTransition = `transform 260ms ${springEasing}, opacity 260ms ease-out`;

    adjacentTransform = adjDir > 0 ? 'translateX(100%)' : 'translateX(-100%)';
    adjacentOpacity = 0.9;
    adjacentTransition = `transform 260ms ${springEasing}, opacity 260ms ease-out`;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-[#f1c40f] selection:text-slate-900">
      
      {/* Splash Screen */}
      {showSplash && <Splash onDismiss={() => setShowSplash(false)} />}

      {/* Main App Container */}
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col bg-white shadow-xl min-h-screen">
        
        {/* Top Header */}
        <header className="bg-[#0e2a3a] text-white p-3 md:p-4 sticky top-0 z-30 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Brand Zone */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 shadow-lg flex items-center justify-center bg-transparent">
                <img
                  src="/khasi-jaintia-logo-2026.png?v=20261111"
                  alt="Khasi Jaintia Emblem"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-[11px] md:text-xs font-semibold text-[#f1c40f] tracking-wide uppercase">
                  {currentYear} • KHASI JAINTIA CALENDAR
                </div>
                <h1 className="text-base md:text-xl font-extrabold tracking-tight font-display leading-tight">
                  KHASI JAINTIA CALENDAR
                </h1>
                <div className="text-[11px] text-slate-300 font-medium">
                  By Ieij Iala Ka Jong
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2 ml-auto">
              
              {/* PRIMARY ACTION: + Add Holiday/Birthday (Google Play Billing v6 + 1 Slot = 1 Pay / Admin Free Lifetime) */}
              <button
                onClick={() => handleOpenAddHoliday()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-[#f1c40f] to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-sm cursor-pointer"
                title="Add holiday to calendar"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="font-extrabold">+ Add Holiday</span>
                {!isAdmin && (slots.tempSlotsCount > 0 || slots.permSlotsCount > 0) ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[#f1c40f] text-[10px] font-black">
                    {slots.tempSlotsCount + slots.permSlotsCount}
                  </span>
                ) : null}
              </button>

              {/* CUSTOMER CARE: Help & Complaint */}
              <button
                onClick={() => setShowCustomerCare(true)}
                className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer"
                title="Customer Care: WhatsApp (+917005893341) & Email (muniphawa@gmail.com)"
              >
                <span className="text-[#f1c40f]">💬</span>
                <span className="hidden sm:inline">Help & Complaint</span>
                <span className="sm:hidden">Help</span>
                {isAdmin && pendingNotificationsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-md border-2 border-[#0e2a3a]">
                    {pendingNotificationsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                title="Learn about the 8 traditional market days"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#f1c40f]" />
                <span className="hidden sm:inline">8 Sngi Iew Guide</span>
                <span className="sm:hidden">Guide</span>
              </button>

              <button
                onClick={() => setShowRules(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer"
                title="Jingmana / Rules before adding holidays"
              >
                <Scale className="w-3.5 h-3.5 text-[#f1c40f]" />
                <span>Rules</span>
              </button>

              <button
                onClick={() => setShowFinder(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                title="Find upcoming market dates"
              >
                <Search className="w-3.5 h-3.5 text-[#0fb9a0]" />
                <span className="hidden sm:inline">Find Market</span>
                <span className="sm:hidden">Finder</span>
              </button>

              <button
                onClick={() => setShowHolidays(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                title="View Meghalaya state holidays and festivals"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Holidays</span>
                <span className="sm:hidden">Holidays</span>
              </button>

              {/* User Account / Profile inside Gold Circle */}
              <div className="relative">
                {!currentUser ? (
                  <button
                    onClick={loginWithGoogle}
                    className="flex items-center gap-1.5 p-0.5 rounded-full border-2 border-[#f1c40f] bg-white/10 hover:bg-[#f1c40f]/20 transition shadow-sm cursor-pointer group"
                    title="Sign in with Google"
                  >
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[#f1c40f]">
                      <User className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 pr-2 group-hover:text-white hidden sm:inline">
                      Sign In
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowProfileMenu(prev => !prev)}
                    className="relative flex items-center p-0.5 rounded-full border-2 border-[#f1c40f] bg-[#0e2a3a] hover:scale-105 hover:ring-2 hover:ring-[#f1c40f]/60 transition shadow-md cursor-pointer group"
                    title={`Signed in as ${currentUser.displayName || currentUser.email}. Tap to view profile.`}
                  >
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-[#f1c40f] font-bold text-xs shrink-0">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || 'User Profile'}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>
                          {currentUser.displayName
                            ? currentUser.displayName[0].toUpperCase()
                            : currentUser.email
                            ? currentUser.email[0].toUpperCase()
                            : <User className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-[#0e2a3a]" />
                  </button>
                )}

                {/* Profile Modal / Dialog - Centered in viewport */}
                {showProfileMenu && currentUser && (
                  <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="profile-menu-title"
                  >
                    <div
                      className="fixed inset-0"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="relative w-full max-w-xs sm:max-w-sm rounded-3xl bg-[#0e2a3a] border-2 border-[#f1c40f] shadow-2xl p-5 z-10 text-white animate-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#f1c40f] bg-slate-800 shrink-0 flex items-center justify-center shadow-sm">
                            {currentUser.photoURL ? (
                              <img
                                src={currentUser.photoURL}
                                alt={currentUser.displayName || 'Profile'}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-lg font-black text-[#f1c40f]">
                                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div id="profile-menu-title" className="font-bold text-sm text-white truncate">
                              {currentUser.displayName || 'Khasi Calendar User'}
                            </div>
                            <div className="text-[11px] text-slate-300 break-all">
                              {currentUser.email}
                            </div>
                            {isAdmin && (
                              <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[#f1c40f] text-slate-950 text-[10px] font-black uppercase tracking-wider">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Admin</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Top close button to easily dismiss */}
                        <button
                          type="button"
                          onClick={() => setShowProfileMenu(false)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
                          aria-label="Close"
                          title="Close"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="pt-3.5 space-y-2">
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              setShowAdminManager(true);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-linear-to-r from-[#f1c40f] to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition cursor-pointer shadow-sm"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Holiday Manager</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            setShowCustomerCare(true);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span>💬</span>
                            <span>Help & WhatsApp Support</span>
                          </div>
                          {isAdmin && pendingNotificationsCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black animate-pulse shadow-xs">
                              {pendingNotificationsCount} new
                            </span>
                          )}
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              setShowBannerSettings(true);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition cursor-pointer"
                          >
                            <span>🎨</span>
                            <span>Banner Settings</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            setShowPrivacyPolicy(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Privacy Policy</span>
                        </button>

                        <button
                          onClick={async () => {
                            setShowProfileMenu(false);
                            await logout();
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 text-xs font-bold transition cursor-pointer mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition no-print"
                title="Print current month"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              {holidayToday && (
                <button
                  onClick={() => setActiveWishHoliday({ holiday: holidayToday, year: todayNow.getFullYear() })}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#f1c40f] text-slate-950 text-xs font-black animate-pulse shadow-md transition hover:bg-amber-300"
                  title="View today's holiday greetings!"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Holiday Wish!</span>
                </button>
              )}

              <PWAInstallButton />
            </div>

          </div>
        </header>

        {/* Automatic Holiday Greeting Banner if today is a holiday */}
        {holidayToday && !dismissedHolidayBanner && (
          <HolidayWishBanner
            holiday={holidayToday}
            year={todayNow.getFullYear()}
            onOpenDetails={() => setActiveWishHoliday({ holiday: holidayToday, year: todayNow.getFullYear() })}
            onDismiss={() => setDismissedHolidayBanner(true)}
          />
        )}

        {/* Offline & Auto-Sync Banner */}
        {!isOnline && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>Offline Mode • Loaded from local storage (Calendar, Holidays & 8 Sngi Iew work offline without internet)</span>
          </div>
        )}

        {isOnline && showSyncedToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-xs animate-in fade-in transition-all">
            <Check className="w-4 h-4 shrink-0" />
            <span>Internet Connected • Auto-synced all holidays from Firebase</span>
          </div>
        )}

        {/* Holiday Under Review Notification Banner */}
        {reviewNoticeToast && (
          <div className="bg-amber-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between gap-2 shadow-md animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
              <span className="truncate">{reviewNoticeToast}</span>
            </div>
            <button
              onClick={() => setReviewNoticeToast(null)}
              className="p-1 rounded-md text-amber-100 hover:text-white hover:bg-amber-700/50 transition cursor-pointer shrink-0"
              aria-label="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Year Row (2025 to 2100) */}
        <div
          ref={yearRowRef}
          className="flex items-center gap-2 overflow-x-auto p-2.5 bg-white border-b border-slate-200 no-scrollbar select-none"
        >
          {Array.from({ length: 76 }, (_, i) => 2025 + i).map(year => (
            <button
              key={year}
              data-year={year}
              onClick={() => setCurrentYear(year)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition whitespace-nowrap tabular-nums ${
                currentYear === year
                  ? 'bg-[#0e2a3a] text-white border-[#0e2a3a] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Month Navigation & Controls */}
        <div className="p-3 md:p-4 bg-white border-b border-slate-200 space-y-3">
          
          {/* Month Navigation Row in single line without covering arrows */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full">
            <button
              onClick={() => triggerSmoothMonthChange(-1)}
              className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition shrink-0 shadow-xs flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 cursor-pointer"
              title="Previous month (or slide right)"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              value={currentMonth}
              onChange={e => handleDropdownMonthChange(Number(e.target.value))}
              className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl border border-slate-300 bg-white text-slate-800 truncate focus:outline-hidden focus:ring-2 focus:ring-[#0e2a3a]"
            >
              {ENG_MONTHS.map((eng, idx) => (
                <option key={idx} value={idx}>
                  {eng} / {KHASI_MONTHS[idx]}
                </option>
              ))}
            </select>

            <button
              onClick={() => triggerSmoothMonthChange(1)}
              className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition shrink-0 shadow-xs flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 cursor-pointer"
              title="Next month (or slide left)"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Compact Today Button */}
            <button
              onClick={goToday}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#f1c40f] hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition shrink-0 whitespace-nowrap flex items-center gap-1 cursor-pointer"
              title="Go to Today"
            >
              <Calendar className="w-3 h-3 text-slate-950" />
              <span>Today</span>
            </button>
          </div>

          {/* Banner Carousel (Full Screen Width Left-to-Right like Flipkart) */}
          {showBanner && isBannerActiveToday(bannerConfig) && (
            <BannerCarousel
              config={bannerConfig}
              onAutoDisappear={() => setShowBanner(false)}
            />
          )}

          {/* Month Subtitle, Seasonal Meaning & Slide Cue */}
          {monthDescription && (
            <div className="px-1 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-bold text-[#0e2a3a]">
                  {KHASI_MONTHS[currentMonth]} ({ENG_MONTHS[currentMonth]} {currentYear})
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#0fb9a0] font-semibold">{monthDescription.season}</span>
                <span aria-hidden="true">·</span>
                <span className="italic">{monthDescription.meaning}</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1 select-none">
                <span>👈</span>
                <span>Slide page to change month</span>
                <span>👉</span>
              </span>
            </div>
          )}

        </div>

        {/* Filter Toolbar */}
        <div className="px-3 md:px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          
          {/* Name Display Mode */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600">Names:</span>
            <div className="inline-flex rounded-lg bg-slate-200/80 p-0.5">
              {(['Dual', 'Khasi', 'Jaintia'] as NameMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setNameMode(mode)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    nameMode === mode
                      ? 'bg-[#0e2a3a] text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Market Highlight Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Highlight Market:</span>
            <select
              value={highlightMarketIdx === null ? '' : highlightMarketIdx}
              onChange={e => setHighlightMarketIdx(e.target.value === '' ? null : Number(e.target.value))}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden"
            >
              <option value="">None (Show All)</option>
              {CYCLE.map(m => (
                <option key={m.index} value={m.index}>
                  ★ {m.khasi} / {m.pnar}
                </option>
              ))}
            </select>
            {highlightMarketIdx !== null && (
              <button
                onClick={() => setHighlightMarketIdx(null)}
                className="text-slate-400 hover:text-slate-700 text-[11px] underline"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Calendar Grid Container with slide/swipe gesture support */}
        <div 
          className="p-2 md:p-3 flex-1 flex flex-col touch-pan-y select-none relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          title="Slide or click trailing date numbers to change months"
        >
          
          {/* Day Headers (MON to SUN) - Fixed at top */}
          <div className="grid grid-cols-7 bg-[#0e2a3a] text-white rounded-t-xl text-center py-2.5 text-[11px] md:text-xs font-extrabold tracking-wider shadow-xs z-10 relative">
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
            <div>SUN</div>
          </div>

          {/* Smooth Sliding Viewport (Overflow Hidden like Mobile App Carousel) */}
          <div className="relative overflow-hidden rounded-b-xl shadow-xs bg-slate-50 flex-1 min-h-[380px]">
            
            {/* Active Month Card */}
            <div
              style={{
                transform: activeTransform,
                opacity: activeOpacity,
                transition: activeTransition,
                willChange: 'transform, opacity',
              }}
              className="w-full h-full"
            >
              <MonthGrid
                year={currentYear}
                month={currentMonth}
                nameMode={nameMode}
                highlightMarketIdx={highlightMarketIdx}
                todayPulsing={todayPulsing}
                customHolidays={customHolidays}
                deletedHolidayKeys={deletedHolidayKeys}
                getNotesForDate={getNotesForDate}
                onCurrentDayClick={handleCurrentDayClick}
                onTrailingDayClick={handleTrailingDayClick}
                isRealToday={isRealToday}
              />
            </div>

            {/* Adjacent Month Card (slides alongside smoothly like switching apps on home screen) */}
            {showAdjacent && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transform: adjacentTransform,
                  opacity: adjacentOpacity,
                  transition: adjacentTransition,
                  willChange: 'transform, opacity',
                }}
              >
                <MonthGrid
                  year={adjYear}
                  month={adjMonth}
                  nameMode={nameMode}
                  highlightMarketIdx={highlightMarketIdx}
                  todayPulsing={false}
                  customHolidays={customHolidays}
                  deletedHolidayKeys={deletedHolidayKeys}
                  getNotesForDate={getNotesForDate}
                  onCurrentDayClick={handleCurrentDayClick}
                  onTrailingDayClick={handleTrailingDayClick}
                  isRealToday={isRealToday}
                />
              </div>
            )}

          </div>

        </div>

        {/* Cultural Quick Reference Banner - 8 Sngi Iew Dual Cycle */}
        <div className="p-3 md:p-4 bg-slate-50 border-t border-slate-200 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-[#f1c40f]" />
              <span>
                8 Sngi Iew Cycle {nameMode === 'Dual' ? '(Khasi / Jaintia)' : nameMode === 'Khasi' ? '(Khasi)' : '(Jaintia)'}:
              </span>
              {highlightMarketIdx !== null && (
                <button
                  onClick={() => setHighlightMarketIdx(null)}
                  className="text-slate-400 hover:text-slate-700 font-normal text-[11px] underline ml-1"
                >
                  Clear filter
                </button>
              )}
            </div>

            <button
              onClick={() => setShowGuide(true)}
              className="text-[#0fb9a0] font-bold hover:underline text-xs flex items-center gap-1"
            >
              <span>Learn history & market locations</span>
              <span>&rarr;</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {CYCLE.map(m => {
              const isSelected = highlightMarketIdx === m.index;
              const displayName = nameMode === 'Dual' ? `${m.khasi}/${m.pnar}` : nameMode === 'Khasi' ? m.khasi : m.pnar;
              return (
                <button
                  key={m.index}
                  onClick={() => setHighlightMarketIdx(isSelected ? null : m.index)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 flex items-center gap-1 shadow-xs ${
                    isSelected
                      ? 'bg-[#0e2a3a] text-white border-[#0e2a3a] ring-2 ring-[#f1c40f]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-100'
                  }`}
                  title={`Click to highlight all ${displayName} days in calendar`}
                >
                  {nameMode === 'Dual' ? (
                    <>
                      <span className={isSelected ? 'text-[#f1c40f] font-bold' : 'text-slate-900 font-bold'}>
                        {m.khasi}
                      </span>
                      <span className="text-slate-400 font-light">/</span>
                      <span className={isSelected ? 'text-teal-300 font-medium' : 'text-teal-800 font-medium'}>
                        {m.pnar}
                      </span>
                    </>
                  ) : nameMode === 'Khasi' ? (
                    <span className={isSelected ? 'text-[#f1c40f] font-bold' : 'text-slate-900 font-bold'}>
                      {m.khasi}
                    </span>
                  ) : (
                    <span className={isSelected ? 'text-[#f1c40f] font-bold' : 'text-teal-900 font-bold'}>
                      {m.pnar}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center p-6 bg-[#0e2a3a] text-white">
          <div className="text-xs text-slate-300">
            Crafted with pride for our people
          </div>
          <div className="text-base font-extrabold tracking-tight mt-1 font-display">
            KHASI JAINTIA CALENDAR
          </div>
          <div className="text-sm font-bold text-[#f1c40f] mt-0.5">
            By Ieij Iala Ka Jong
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>2025–2100</span>
            <span>•</span>
            <span>Offline Ready</span>
            <span>•</span>
            <span>No Ads</span>
            <span>•</span>
            <span>8 Sngi Iew</span>
            <span>•</span>
            <span>Khasi & Jaiñtia</span>
          </div>
        </footer>

      </div>

      {/* Day Details Modal */}
      {selectedDayInfo && (
        <DayModal
          year={selectedDayInfo.year}
          month={selectedDayInfo.month}
          day={selectedDayInfo.day}
          onClose={() => setSelectedDayInfo(null)}
          onNavigateDay={handleNavigateModalDay}
          notes={getNotesForDate(`${selectedDayInfo.year}-${String(selectedDayInfo.month + 1).padStart(2, '0')}-${String(selectedDayInfo.day).padStart(2, '0')}`)}
          onAddNote={addNote}
          onDeleteNote={deleteNote}
          customHolidays={customHolidays}
          deletedHolidayKeys={deletedHolidayKeys}
          currentUserEmail={currentUser?.email || undefined}
          currentUserId={currentUser?.uid || undefined}
          isAdmin={isAdmin}
          onEditHolidayTitle={editPaidHolidayTitle}
          onDeleteHoliday={deleteHolidayDoc}
          onOpenAddHoliday={(dateStr) => handleOpenAddHoliday(dateStr)}
          onViewWish={(hol, y) => {
            setActiveWishHoliday({ holiday: hol, year: y });
          }}
        />
      )}

      {/* 8 Sngi Iew Guide Modal */}
      {showGuide && (
        <MarketGuideModal
          onClose={() => setShowGuide(false)}
          onSelectMarketForFilter={(idx) => setHighlightMarketIdx(idx)}
        />
      )}

      {/* Jingmana / Rules Modal */}
      {showRules && (
        <RulesModal
          onClose={() => setShowRules(false)}
          onOpenHelp={() => setShowCustomerCare(true)}
        />
      )}

      {/* Sngi Iew Market Finder Modal */}
      {showFinder && (
        <MarketFinderModal
          currentYear={currentYear}
          onClose={() => setShowFinder(false)}
          onSelectDate={(y, m, d) => {
            setCurrentYear(y);
            setCurrentMonth(m);
            setSelectedDayInfo({ year: y, month: m, day: d });
          }}
        />
      )}

      {/* Holidays List Modal */}
      {showHolidays && (
        <HolidaysModal
          currentYear={currentYear}
          onClose={() => setShowHolidays(false)}
          onSelectDate={(y, m, d) => {
            setCurrentYear(y);
            setCurrentMonth(m);
            setSelectedDayInfo({ year: y, month: m, day: d });
          }}
          onViewWish={(hol, y) => {
            setActiveWishHoliday({ holiday: hol, year: y });
          }}
          customHolidays={customHolidays}
          deletedHolidayKeys={deletedHolidayKeys}
          onOpenFirebaseManager={() => setShowHolidayManager(true)}
          isAdmin={isAdmin}
          currentUserEmail={currentUser?.email || undefined}
          currentUserId={currentUser?.uid || undefined}
          onEditHolidayTitle={editPaidHolidayTitle}
          onDeleteHoliday={deleteHolidayDoc}
        />
      )}

      {/* Firebase Holiday Manager Modal (Legacy Admin Templates) */}
      {showHolidayManager && (
        <FirebaseHolidayManagerModal
          onClose={() => setShowHolidayManager(false)}
          currentUser={currentUser}
          isAdmin={isAdmin}
          onLogin={async () => { await loginWithGoogle(); }}
          onLogout={logout}
          customHolidays={customHolidays}
          onAddHoliday={addHoliday}
          onUpdateHoliday={updateHoliday}
          onDeleteHoliday={deleteHoliday}
        />
      )}

      {/* Google Play Billing v6 Paywall Modal (1 Pay = 1 Holiday) */}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          userEmail={currentUser?.email || ''}
          onPurchaseSuccess={(purchase) => {
            setShowPaywall(false);
            setRecentPurchase(purchase);
            setSlots(billingClient.getSlots());
          }}
          onOpenHelpAndComplaint={() => {
            setShowPaywall(false);
            setShowCustomerCare(true);
          }}
          tempSlotsCount={slots.tempSlotsCount}
          permSlotsCount={slots.permSlotsCount}
        />
      )}

      {/* Purchase Success Dialog with Order ID and WhatsApp Chat Support */}
      {recentPurchase && (
        <PurchaseSuccessModal
          purchase={recentPurchase}
          userEmail={currentUser?.email || ''}
          onProceedToAddHoliday={() => {
            setRecentPurchase(null);
            setShowAddPaidHoliday(true);
          }}
          onClose={() => {
            setRecentPurchase(null);
            setShowAddPaidHoliday(true);
          }}
        />
      )}

      {/* Add Holiday / Birthday Form Modal */}
      {showAddPaidHoliday && (
        <AddHolidayFormModal
          onClose={() => {
            setShowAddPaidHoliday(false);
            setAddHolidayPreselectedDate(undefined);
          }}
          tempSlotsCount={slots.tempSlotsCount}
          permSlotsCount={slots.permSlotsCount}
          userEmail={currentUser?.email || ''}
          orderId={recentPurchase?.orderId}
          isAdmin={isAdmin}
          initialDate={addHolidayPreselectedDate}
          onSaveHoliday={async (data) => {
            await addPaidHoliday(data);
            setSlots(billingClient.getSlots());
            setAddHolidayPreselectedDate(undefined);
            if (!isAdmin) {
              setReviewNoticeToast(`"${data.title}": Your holiday is under review, wait for admin approve.`);
              setTimeout(() => {
                setReviewNoticeToast(null);
              }, 8000);
            }
          }}
          onNeedMoreSlots={() => {
            setShowAddPaidHoliday(false);
            setShowPaywall(true);
          }}
          onOpenRules={() => setShowRules(true)}
        />
      )}

      {/* Customer Care: WhatsApp Support (+917005893341), Email, & Report Bad Holiday */}
      {showCustomerCare && (
        <CustomerCareModal
          onClose={() => setShowCustomerCare(false)}
          userEmail={currentUser?.email || ''}
          isAdmin={isAdmin}
          lastOrderId={billingClient.getLastOrderId()}
          allHolidays={allPaidHolidays}
          onSubmitReport={submitHolidayReport}
          onOpenBannerSettings={() => setShowBannerSettings(true)}
          onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
          onApproveHoliday={approveHoliday}
          onDenyHoliday={denyHoliday}
        />
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal
          onClose={() => setShowPrivacyPolicy(false)}
        />
      )}

      {/* Banner Carousel Settings Modal - Only accessible to authorized admins */}
      {showBannerSettings && isAdmin && (
        <BannerSettingsModal
          onClose={() => setShowBannerSettings(false)}
          onSaved={() => {
            const cfg = getBannerConfig();
            setBannerConfig(cfg);
            setShowBanner(isBannerActiveToday(cfg));
          }}
        />
      )}

      {/* Android Play Console Build & Export Modal */}
      {showAndroidBuild && (
        <AndroidBuildModal
          onClose={() => setShowAndroidBuild(false)}
          sharedUrl="https://ais-pre-ifskr2gibimdmh23zskyjq-536277912342.asia-east1.run.app"
        />
      )}

      {/* Admin Delete Power Modal (muniphawa@gmail.com & niamkhasi@gmail.com) */}
      {showAdminManager && isAdmin && (
        <AdminHolidayManagerModal
          onClose={() => setShowAdminManager(false)}
          currentUserEmail={currentUser?.email || ''}
          allHolidays={allPaidHolidays}
          reports={reports}
          onDeleteHoliday={deleteHolidayDoc}
          onEditHolidayTitle={editPaidHolidayTitle}
        />
      )}

      {/* Automatic & Interactive Holiday Wish Greeting Modal */}
      {activeWishHoliday && (
        <HolidayWishModal
          holiday={activeWishHoliday.holiday}
          year={activeWishHoliday.year}
          onClose={() => setActiveWishHoliday(null)}
        />
      )}

    </div>
  );
}
