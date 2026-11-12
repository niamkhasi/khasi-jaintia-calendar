import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  Save, 
  Clock, 
  Calendar, 
  Power, 
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  Info,
  Radio,
  Sparkles,
  Cloud,
  Loader2
} from 'lucide-react';
import { 
  BannerConfig, 
  BannerItem, 
  getBannerConfig, 
  saveBannerConfigToFirestore, 
  processBannerImageFile,
  DEFAULT_GOOGLE_ADS_CONFIG
} from '../services/bannerService';

interface BannerSettingsModalProps {
  onClose: () => void;
  onSaved?: () => void;
}

export const BannerSettingsModal: React.FC<BannerSettingsModalProps> = ({
  onClose,
  onSaved,
}) => {
  const [config, setConfig] = useState<BannerConfig>(() => getBannerConfig());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [processingSlot, setProcessingSlot] = useState<number | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);

  const fileInputRefs = [fileInputRef1, fileInputRef2, fileInputRef3];

  // Get or initialize slots 1, 2, 3
  const getBannerForSlot = (slotIdx: number): BannerItem => {
    return (
      config.banners[slotIdx] || {
        id: `banner_${slotIdx + 1}`,
        imageUrl: '',
        title: '',
        link: '',
        enabled: true,
        durationSeconds: config.customBannerDurationSeconds || 10
      }
    );
  };

  const handleUpdateSlot = (slotIdx: number, updates: Partial<BannerItem>) => {
    const updated = [...config.banners];
    while (updated.length <= slotIdx) {
      updated.push({
        id: `banner_${updated.length + 1}`,
        imageUrl: '',
        title: '',
        link: '',
        enabled: true,
        durationSeconds: config.customBannerDurationSeconds || 10
      });
    }
    updated[slotIdx] = {
      ...updated[slotIdx],
      ...updates
    };
    setConfig(prev => ({
      ...prev,
      banners: updated
    }));
  };

  const handleDeleteSlot = (slotIdx: number) => {
    const updated = config.banners.filter((_, idx) => idx !== slotIdx);
    setConfig(prev => ({
      ...prev,
      banners: updated
    }));
  };

  const handleFileUpload = async (slotIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessingSlot(slotIdx);
    try {
      const dataUrl = await processBannerImageFile(file);
      handleUpdateSlot(slotIdx, { imageUrl: dataUrl, enabled: true });
    } catch (err) {
      console.error('Failed to process image:', err);
      alert('Could not read image file. Please try another image.');
    } finally {
      setProcessingSlot(null);
      if (fileInputRefs[slotIdx].current) {
        fileInputRefs[slotIdx].current!.value = '';
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Preserve custom banners with their individual enabled flag and duration (5s - 60s)
      const validBanners = config.banners.map((b, idx) => ({
        ...b,
        id: b.id || `banner_${idx + 1}`,
        enabled: typeof b.enabled === 'boolean' ? b.enabled : true,
        durationSeconds: (b.durationSeconds && b.durationSeconds >= 5 && b.durationSeconds <= 60)
          ? b.durationSeconds
          : (config.customBannerDurationSeconds || 10)
      }));

      const finalConfig: BannerConfig = {
        ...config,
        customBannerDurationSeconds: config.customBannerDurationSeconds || 10,
        showDurationSeconds: config.customBannerDurationSeconds || 10,
        banners: validBanners,
        googleAds: config.googleAds || DEFAULT_GOOGLE_ADS_CONFIG
      };

      // Save directly to Cloud Firestore so ALL users automatically receive it live without updating from Play Store!
      await saveBannerConfigToFirestore(finalConfig);

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        if (onSaved) onSaved();
        onClose();
      }, 700);
    } catch (err) {
      console.error('Failed to save banner config to Firestore:', err);
      alert('Failed to save to Cloud Firestore. Please check your network and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isGoogleAdsOn = Boolean(config.googleAds && config.googleAds.enabled);
  const globalDuration = config.customBannerDurationSeconds || 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-200 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-sm border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#f1c40f]/20 border border-[#f1c40f]/40 flex items-center justify-center text-[#f1c40f]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display">
                Banner &amp; Google Ads Settings
              </h3>
              <p className="text-xs text-slate-300">
                Custom Banners (5s–60s) • Google Ads (60s) • Live Cloud Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50 text-slate-800 text-xs">
          
          {/* Cloud Sync Announcement */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 flex items-start gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Cloud className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-emerald-950">
                  Live Cloud Sync Enabled
                </h4>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-950 text-[9px] font-black uppercase tracking-wider">
                  Auto-Update
                </span>
              </div>
              <p className="text-[11px] text-emerald-900/90 mt-0.5 leading-relaxed">
                When you add or update custom banners, they <strong>automatically show to all users live on their phones</strong> without needing to update the app from Google Play Store!
              </p>
            </div>
          </div>

          {/* Section 1: ALL 4 BANNERS ON / OFF TOGGLES TOGETHER */}
          <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#1A5C3A]" />
                <span>All 4 Banners Quick Controls</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                Independent ON / OFF
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Rotation order: <strong>Custom 1</strong> → <strong>Custom 2</strong> → <strong>Custom 3</strong> → <strong>Google Ad (60s)</strong> → repeat. If all 4 are OFF, banner place collapses completely (View.GONE).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              
              {/* Custom 1 Toggle */}
              {(() => {
                const b1 = getBannerForSlot(0);
                const isB1On = b1.enabled !== false;
                const hasImg = Boolean(b1.imageUrl && b1.imageUrl.trim());
                const dur = b1.durationSeconds || globalDuration;
                return (
                  <div className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                    isB1On && hasImg ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs">Custom 1</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                        isB1On && hasImg ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isB1On && hasImg ? `ON (${dur}s)` : 'OFF'}
                      </span>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">{hasImg ? 'Ready' : 'No Image'}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isB1On}
                          onChange={e => handleUpdateSlot(0, { enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#1A5C3A]"></div>
                      </label>
                    </div>
                  </div>
                );
              })()}

              {/* Custom 2 Toggle */}
              {(() => {
                const b2 = getBannerForSlot(1);
                const isB2On = b2.enabled !== false;
                const hasImg = Boolean(b2.imageUrl && b2.imageUrl.trim());
                const dur = b2.durationSeconds || globalDuration;
                return (
                  <div className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                    isB2On && hasImg ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs">Custom 2</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                        isB2On && hasImg ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isB2On && hasImg ? `ON (${dur}s)` : 'OFF'}
                      </span>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">{hasImg ? 'Ready' : 'No Image'}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isB2On}
                          onChange={e => handleUpdateSlot(1, { enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#1A5C3A]"></div>
                      </label>
                    </div>
                  </div>
                );
              })()}

              {/* Custom 3 Toggle */}
              {(() => {
                const b3 = getBannerForSlot(2);
                const isB3On = b3.enabled !== false;
                const hasImg = Boolean(b3.imageUrl && b3.imageUrl.trim());
                const dur = b3.durationSeconds || globalDuration;
                return (
                  <div className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                    isB3On && hasImg ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs">Custom 3</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                        isB3On && hasImg ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isB3On && hasImg ? `ON (${dur}s)` : 'OFF'}
                      </span>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">{hasImg ? 'Ready' : 'No Image'}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isB3On}
                          onChange={e => handleUpdateSlot(2, { enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#1A5C3A]"></div>
                      </label>
                    </div>
                  </div>
                );
              })()}

              {/* 4th Box: Google Ads Toggle */}
              <div className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                isGoogleAdsOn ? 'bg-blue-50/90 border-blue-300 ring-1 ring-blue-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-950 text-xs">Google Ads</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                    isGoogleAdsOn ? 'bg-blue-200 text-blue-950' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isGoogleAdsOn ? 'ON (60s)' : 'OFF'}
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-blue-700 font-bold">4th Box</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGoogleAdsOn}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        googleAds: {
                          ...(prev.googleAds || DEFAULT_GOOGLE_ADS_CONFIG),
                          enabled: e.target.checked
                        }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: CUSTOM BANNER DURATION (5s - 60s) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#1A5C3A]" />
                <span>Custom Banner Display Duration</span>
              </span>
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 font-mono border border-emerald-300">
                {globalDuration} seconds
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Set how long each custom banner stays visible before switching. You can set anywhere from <strong>5 seconds to 60 seconds</strong>:
            </p>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={globalDuration}
                onChange={e => {
                  const val = Math.max(5, Math.min(60, Number(e.target.value) || 10));
                  setConfig(prev => ({
                    ...prev,
                    customBannerDurationSeconds: val,
                    showDurationSeconds: val
                  }));
                }}
                className="flex-1 accent-[#1A5C3A] cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={globalDuration}
                  onChange={e => {
                    const val = Math.max(5, Math.min(60, Number(e.target.value) || 10));
                    setConfig(prev => ({
                      ...prev,
                      customBannerDurationSeconds: val,
                      showDurationSeconds: val
                    }));
                  }}
                  className="w-16 px-2.5 py-1.5 text-xs font-black font-mono border border-slate-300 rounded-lg bg-slate-50 focus:bg-white text-center focus:outline-hidden focus:ring-1 focus:ring-[#1A5C3A]"
                />
                <span className="text-slate-500 text-[10px] font-bold">sec</span>
              </div>
            </div>

            {/* Quick Duration Preset Buttons */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              <span className="text-[10px] text-slate-500 font-bold mr-1">Quick Presets:</span>
              {[5, 10, 15, 20, 30, 45, 60].map((presetSec) => (
                <button
                  key={presetSec}
                  type="button"
                  onClick={() => setConfig(prev => ({
                    ...prev,
                    customBannerDurationSeconds: presetSec,
                    showDurationSeconds: presetSec
                  }))}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    globalDuration === presetSec
                      ? 'bg-[#1A5C3A] text-white shadow-xs font-black'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {presetSec}s
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: BANNERS 1, 2, 3 CONFIGURATION SLOTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">
                Custom Banners 1, 2, 3:
              </span>
              <span className="text-[11px] text-slate-500">
                Recommended size: 1200 x 400 pixels
              </span>
            </div>

            {[0, 1, 2].map(slotIdx => {
              const banner = getBannerForSlot(slotIdx);
              const hasImage = Boolean(banner.imageUrl && banner.imageUrl.trim());
              const isProcessing = processingSlot === slotIdx;
              const isSlotOn = banner.enabled !== false;
              const slotDuration = banner.durationSeconds || globalDuration;

              return (
                <div
                  key={`slot-${slotIdx}`}
                  className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1A5C3A] text-white font-extrabold text-[10px] flex items-center justify-center">
                        {slotIdx + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        Custom Banner {slotIdx + 1}
                      </span>
                      {hasImage && (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black">
                          Ready ({slotDuration}s)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* ON / OFF Switch for this custom banner */}
                      <div className="flex items-center gap-1.5 mr-2">
                        <span className="text-[10px] font-bold text-slate-500">
                          {isSlotOn ? 'ON' : 'OFF'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSlotOn}
                            onChange={e => handleUpdateSlot(slotIdx, { enabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#1A5C3A]"></div>
                        </label>
                      </div>

                      {hasImage && (
                        <button
                          onClick={() => handleDeleteSlot(slotIdx)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition"
                          title="Delete banner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Image Preview / Upload Area */}
                  <div>
                    {hasImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                        <img
                          src={banner.imageUrl}
                          alt={`Banner ${slotIdx + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            onClick={() => fileInputRefs[slotIdx].current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold shadow-md cursor-pointer hover:bg-slate-100 transition"
                          >
                            Change Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRefs[slotIdx].current?.click()}
                        className="w-full h-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#1A5C3A] bg-slate-50 hover:bg-emerald-50/40 transition flex flex-col items-center justify-center gap-1.5 cursor-pointer text-slate-500"
                      >
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="font-bold text-xs text-slate-700">
                          {isProcessing ? 'Processing image...' : `Upload Image for Banner ${slotIdx + 1}`}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Click to select PNG or JPEG (Auto-fit full screen)
                        </span>
                      </div>
                    )}

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRefs[slotIdx]}
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(slotIdx, e)}
                      className="hidden"
                    />
                  </div>

                  {/* Settings Grid: Title, Link, Custom Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">
                        Title (Optional badge):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Festival Greetings"
                        value={banner.title || ''}
                        onChange={e => handleUpdateSlot(slotIdx, { title: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1A5C3A]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">
                        Link URL (Optional click):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. https://example.com"
                        value={banner.link || ''}
                        onChange={e => handleUpdateSlot(slotIdx, { link: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1A5C3A]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">
                        Display Duration:
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={slotDuration}
                          onChange={e => {
                            const val = Math.max(5, Math.min(60, Number(e.target.value) || 10));
                            handleUpdateSlot(slotIdx, { durationSeconds: val });
                          }}
                          className="w-20 px-2.5 py-1.5 text-xs font-black font-mono border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1A5C3A]"
                        />
                        <span className="text-slate-500 text-[10px] font-semibold">sec (5–60s)</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 4: 4TH BOX - GOOGLE ADS DETAILS */}
          <div className="p-4 rounded-2xl bg-white border-2 border-blue-200 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  4
                </span>
                <div>
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                    <span>Google Ads 4th Box (Dedicated)</span>
                    <span className="px-2 py-0.2 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">
                      60 Seconds
                    </span>
                  </h4>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGoogleAdsOn}
                  onChange={e => setConfig(prev => ({
                    ...prev,
                    googleAds: {
                      ...(prev.googleAds || DEFAULT_GOOGLE_ADS_CONFIG),
                      enabled: e.target.checked
                    }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              When ON, the Google Ads banner shows for <strong>60 seconds</strong> in the rotation loop after Custom Banners 1, 2, and 3. If there are no custom banners, Google Ads runs alone in that place.
            </p>

            {/* Configured Google AdSense & AdMob IDs */}
            <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-blue-950">AdSense Publisher ID:</span>
                <span className="font-mono text-[10px] text-blue-800 select-all font-semibold">ca-pub-2632827933421052</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-blue-950">AdMob App ID:</span>
                <span className="font-mono text-[10px] text-blue-800 select-all font-semibold">ca-app-pub-2632827933421052~6102872245</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-blue-950">Ad Unit / View ID:</span>
                <span className="font-mono text-[10px] text-emerald-800 font-bold">@+id/googleBanner (auto)</span>
              </div>
            </div>
          </div>

          {/* Section 5: SCHEDULE DATES (START & END) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Show Days (Optional Schedule):</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Set active date window. If today is outside, normal calendar info text shows automatically.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">Start Date</label>
                <input
                  type="date"
                  value={config.startDate}
                  onChange={e => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">End Date</label>
                <input
                  type="date"
                  value={config.endDate}
                  onChange={e => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            {savedSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Live Cloud Sync complete! Auto-updated for all users.
              </span>
            ) : isSaving ? (
              <span className="text-blue-700 font-bold flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Syncing to Cloud Firestore...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-emerald-600 inline" />
                Live auto-update across all devices without Play Store update.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-bold text-xs transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 rounded-xl bg-[#1A5C3A] hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Publish Live</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
