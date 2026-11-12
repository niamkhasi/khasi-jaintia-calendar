import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';

export interface BannerItem {
  id: string; // 'banner_1', 'banner_2', 'banner_3'
  imageUrl: string; // data URL or web URL
  title?: string;
  link?: string;
  enabled?: boolean; // ON / OFF for this specific custom banner
  durationSeconds?: number; // Custom duration from 5 to 60 seconds for this banner
}

export interface GoogleAdConfig {
  enabled: boolean; // ON / OFF for Google Ads box
  durationSeconds: number; // default 60 seconds
  appId?: string; // AdMob App ID
  adUnitId?: string; // Top Banner Ad Unit ID
  client?: string; // ca-app-pub-2632827933421052~6102872245
  slot?: string; // ca-app-pub-2632827933421052/4130268849
  adTitle?: string; // Optional sponsor label
}

export interface BannerConfig {
  enabled: boolean; // Master enable
  customBannerDurationSeconds: number; // 5 to 60 seconds (default 10s)
  showDurationSeconds?: number; // legacy alias
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  banners: BannerItem[];
  googleAds: GoogleAdConfig;
  updatedAt?: string;
  updatedBy?: string;
}

const STORAGE_KEY = 'kj_banner_carousel_config';
export const BANNER_SETTINGS_DOC_PATH = 'app_settings';
export const BANNER_SETTINGS_DOC_ID = 'banner_carousel';

export const ADMOB_APP_ID = 'ca-app-pub-2632827933421052~6102872245';
export const ADMOB_TOP_BANNER_AD_UNIT_ID = 'ca-app-pub-2632827933421052/4130268849';
// Google AdSense Publisher ID (Preserved / commented out as requested)
export const ADSENSE_PUBLISHER_ID = 'ca-pub-2632827933421052';
// Monetag Zone ID
export const MONETAG_ZONE_ID = '12249169';

export const DEFAULT_GOOGLE_ADS_CONFIG: GoogleAdConfig = {
  enabled: true,
  durationSeconds: 15,
  appId: ADMOB_APP_ID,
  adUnitId: ADMOB_TOP_BANNER_AD_UNIT_ID,
  client: ADSENSE_PUBLISHER_ID,
  slot: MONETAG_ZONE_ID,
  adTitle: 'Monetag Ads'
};

export const DEFAULT_BANNER_CONFIG: BannerConfig = {
  enabled: true,
  customBannerDurationSeconds: 10, // Default 10 seconds (configurable 5s to 60s)
  showDurationSeconds: 10,
  startDate: '',
  endDate: '',
  banners: [
    {
      id: 'banner_1',
      imageUrl: '/assets/aistudio/20261104_071930_864cdcde.jpg',
      title: 'Khasi Jaintia Calendar 2026',
      enabled: true,
      durationSeconds: 10
    },
    {
      id: 'banner_2',
      imageUrl: '/assets/aistudio/IMG-20261103-WA9014_25a4e9f8.jpg',
      title: '8 Sngi Iew • Traditional Markets',
      enabled: true,
      durationSeconds: 10
    },
    {
      id: 'banner_3',
      imageUrl: '/assets/aistudio/IMG-20261103-WA5997_d7059fe6.jpg',
      title: 'Cultural Festivals & Holidays',
      enabled: true,
      durationSeconds: 10
    }
  ],
  googleAds: DEFAULT_GOOGLE_ADS_CONFIG
};

/**
 * Normalizes raw config object from localStorage or Firestore
 */
export function sanitizeBannerConfig(raw: any): BannerConfig {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_BANNER_CONFIG;
  }

  // Parse banners array and ensure each has valid properties and duration (5s - 60s)
  const hasRawBanners = Array.isArray(raw.banners) && raw.banners.some((b: any) => Boolean(b && b.imageUrl && b.imageUrl.trim()));
  const parsedBanners: BannerItem[] = hasRawBanners
    ? raw.banners.map((b: any, idx: number) => {
        const itemDuration = Number(b.durationSeconds);
        return {
          id: b.id || `banner_${idx + 1}`,
          imageUrl: typeof b.imageUrl === 'string' ? b.imageUrl : '',
          title: typeof b.title === 'string' ? b.title : '',
          link: typeof b.link === 'string' ? b.link : '',
          enabled: typeof b.enabled === 'boolean' ? b.enabled : true,
          durationSeconds: !isNaN(itemDuration) && itemDuration >= 5 && itemDuration <= 60 
            ? Math.round(itemDuration) 
            : undefined
        };
      })
    : DEFAULT_BANNER_CONFIG.banners;

  // Parse Google Ads config
  const parsedGoogleAds: GoogleAdConfig = raw.googleAds
    ? {
        enabled: typeof raw.googleAds.enabled === 'boolean' ? raw.googleAds.enabled : true,
        durationSeconds: Math.max(10, Math.min(180, Number(raw.googleAds.durationSeconds) || 60)),
        appId: raw.googleAds.appId || ADMOB_APP_ID,
        adUnitId: raw.googleAds.adUnitId || ADMOB_TOP_BANNER_AD_UNIT_ID,
        client: raw.googleAds.client || ADMOB_APP_ID,
        slot: raw.googleAds.slot || ADMOB_TOP_BANNER_AD_UNIT_ID,
        adTitle: raw.googleAds.adTitle || 'Google Ads'
      }
    : DEFAULT_GOOGLE_ADS_CONFIG;

  const customDuration = Number(raw.customBannerDurationSeconds || raw.showDurationSeconds);
  const safeCustomDuration = !isNaN(customDuration) && customDuration >= 5 && customDuration <= 60
    ? Math.round(customDuration)
    : 10;

  return {
    enabled: typeof raw.enabled === 'boolean' ? raw.enabled : true,
    customBannerDurationSeconds: safeCustomDuration,
    showDurationSeconds: safeCustomDuration,
    startDate: typeof raw.startDate === 'string' ? raw.startDate : '',
    endDate: typeof raw.endDate === 'string' ? raw.endDate : '',
    banners: parsedBanners,
    googleAds: parsedGoogleAds,
    updatedAt: raw.updatedAt || undefined,
    updatedBy: raw.updatedBy || undefined
  };
}

/**
 * Gets cached banner configuration from localStorage
 */
export function getBannerConfig(): BannerConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BANNER_CONFIG;
    const parsed = JSON.parse(raw);
    return sanitizeBannerConfig(parsed);
  } catch {
    return DEFAULT_BANNER_CONFIG;
  }
}

/**
 * Saves banner configuration to localStorage and notifies local listeners
 */
export function saveBannerConfig(config: BannerConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('kj_banner_updated', { detail: config }));
  } catch (err) {
    console.error('Failed to save banner config to localStorage:', err);
  }
}

/**
 * Subscribes to real-time banner updates from Cloud Firestore.
 * Automatically pushes new banners to ALL users live without needing an app store update!
 */
export function subscribeToBannerConfig(
  onUpdate: (config: BannerConfig) => void
): () => void {
  // First, provide cached local data immediately for instantaneous startup
  const cached = getBannerConfig();
  onUpdate(cached);

  try {
    const bannerDocRef = doc(db, BANNER_SETTINGS_DOC_PATH, BANNER_SETTINGS_DOC_ID);
    
    const unsubscribe = onSnapshot(
      bannerDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const liveData = snapshot.data();
          const cleanConfig = sanitizeBannerConfig(liveData);
          saveBannerConfig(cleanConfig);
          onUpdate(cleanConfig);
        } else {
          // If no remote doc exists yet, stay with cached/default
          onUpdate(cached);
        }
      },
      (error) => {
        console.warn('Real-time banner listener error (fallback to local cache):', error);
        // Fall back to local storage
        onUpdate(getBannerConfig());
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach banner snapshot listener:', err);
    return () => {};
  }
}

/**
 * Saves banner configuration to Cloud Firestore so ALL users automatically receive it live!
 */
export async function saveBannerConfigToFirestore(config: BannerConfig): Promise<void> {
  const cleanConfig = sanitizeBannerConfig(config);
  
  // Clean payload for Firestore
  const payload = {
    enabled: cleanConfig.enabled,
    customBannerDurationSeconds: cleanConfig.customBannerDurationSeconds,
    showDurationSeconds: cleanConfig.customBannerDurationSeconds,
    startDate: cleanConfig.startDate || '',
    endDate: cleanConfig.endDate || '',
    banners: cleanConfig.banners.map(b => ({
      id: b.id,
      imageUrl: b.imageUrl || '',
      title: b.title || '',
      link: b.link || '',
      enabled: b.enabled !== false,
      durationSeconds: b.durationSeconds || cleanConfig.customBannerDurationSeconds
    })),
    googleAds: {
      enabled: cleanConfig.googleAds.enabled !== false,
      durationSeconds: cleanConfig.googleAds.durationSeconds || 60,
      appId: ADMOB_APP_ID,
      adUnitId: ADMOB_TOP_BANNER_AD_UNIT_ID,
      client: ADMOB_APP_ID,
      slot: ADMOB_TOP_BANNER_AD_UNIT_ID,
      adTitle: cleanConfig.googleAds.adTitle || 'Google Ads'
    },
    updatedAt: new Date().toISOString(),
    updatedBy: auth.currentUser?.email || 'admin'
  };

  // 1. Save immediately to localStorage for zero-lag instant local preview
  saveBannerConfig(cleanConfig);

  // 2. Persist to Firestore so all users in the world receive the live update
  const bannerDocRef = doc(db, BANNER_SETTINGS_DOC_PATH, BANNER_SETTINGS_DOC_ID);
  try {
    await setDoc(bannerDocRef, payload);
    console.log('Banner configuration successfully saved to Firestore & live to all users!');
  } catch (error) {
    console.error('Failed to save banner config to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, `${BANNER_SETTINGS_DOC_PATH}/${BANNER_SETTINGS_DOC_ID}`);
  }
}

/**
 * Checks if the banner carousel should display today:
 * 1. Master toggle must be enabled
 * 2. Must have at least 1 active item (either an enabled custom banner OR enabled Google Ads)
 * 3. Today's date must be within [startDate, endDate] if set
 * 4. If all 4 are OFF, returns false (View.GONE, no empty space)
 */
export function isBannerActiveToday(config: BannerConfig): boolean {
  if (!config.enabled) return false;
  
  const validCustomBanners = (config.banners || []).filter(
    b => b.enabled !== false && Boolean(b.imageUrl && b.imageUrl.trim())
  );
  const isGoogleAdsActive = Boolean(config.googleAds && config.googleAds.enabled);

  // If all 4 are OFF (no active custom banners and no active Google Ads), hide completely
  if (validCustomBanners.length === 0 && !isGoogleAdsActive) {
    return false;
  }

  const todayStr = new Date().toISOString().split('T')[0];

  if (config.startDate && todayStr < config.startDate) {
    return false;
  }

  if (config.endDate && todayStr > config.endDate) {
    return false;
  }

  return true;
}

/**
 * Resizes an uploaded image file to max 1200x400 (or 3:1 ratio)
 * and outputs a compressed JPEG data URL for smooth Firestore & local storage.
 */
export function processBannerImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 400;

        let width = img.width;
        let height = img.height;

        // Scale down if exceeds max dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG 0.78 for optimal visual fidelity and tiny file size (~60KB)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
