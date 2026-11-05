import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  PackageCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Terminal, 
  FileCode2, 
  Sparkles,
  Info
} from 'lucide-react';

interface AndroidBuildModalProps {
  onClose: () => void;
  sharedUrl: string;
}

export const AndroidBuildModal: React.FC<AndroidBuildModalProps> = ({
  onClose,
  sharedUrl
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const packageName = "com.khasi.jaintia.calendar";
  const downloadZipUrl = "/downloads/khasi-jaintia-calendar-android-project.zip";

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const bubblewrapCmd = `npm i -g @bubblewrap/cli
bubblewrap init --manifest=${sharedUrl}/manifest.json
bubblewrap build`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="android-modal-title"
      >
        {/* Header */}
        <div className="bg-[#0e2a3a] text-white p-5 shrink-0 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f1c40f] text-slate-950 flex items-center justify-center font-black shadow-md">
              <Smartphone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 id="android-modal-title" className="text-lg font-black font-display tracking-tight">
                Android APK & Play Console Bundle
              </h3>
              <p className="text-xs text-[#f1c40f] font-semibold">
                Package: <span className="font-mono">{packageName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 text-xs">
          
          {/* Quick Download Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-br from-emerald-50 via-teal-50 to-emerald-100/50 border-2 border-emerald-300 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  📦
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-950">
                    Complete Android Studio Project (.ZIP)
                  </h4>
                  <p className="text-[11px] text-emerald-900 font-medium">
                    Pre-configured Gradle, Manifest, Play Billing v6, and Icons (5.1 MB)
                  </p>
                </div>
              </div>

              <a
                href={downloadZipUrl}
                download="khasi-jaintia-calendar-android-project.zip"
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Android ZIP</span>
              </a>
            </div>

            <p className="text-[11px] text-emerald-900 leading-relaxed border-t border-emerald-200/80 pt-2">
              Extract this zip and open the folder in <strong>Android Studio</strong>. Click <strong>Build &gt; Generate Signed Bundle / APK</strong> to immediately get your release <code className="font-mono bg-white/70 px-1 py-0.5 rounded text-emerald-950 font-bold">.aab</code> file for Google Play Console.
            </p>
          </div>

          {/* Option A: 1-Click PWABuilder (No Android Studio required) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                  Option 1: 1-Click Online Build with PWABuilder (Recommended)
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                Easiest • 60 Seconds
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Google & Microsoft's official PWABuilder generates the signed <strong>Android App Bundle (.aab)</strong> directly in your browser without needing Android Studio or Java installed:
            </p>

            <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 text-[11px]">
              <li>
                Open <a href="https://www.pwabuilder.com" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-700 hover:underline">PWABuilder.com</a>.
              </li>
              <li>
                Enter your calendar URL: <code className="bg-white border px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">{sharedUrl}</code>
              </li>
              <li>Click <strong>Package for Stores</strong> &gt; Select <strong>Google Play</strong>.</li>
              <li>Set Package ID to: <strong className="font-mono text-[#0e2a3a]">{packageName}</strong></li>
              <li>Click <strong>Generate Package</strong> to download your <code className="font-mono font-bold">.aab</code> and <code className="font-mono font-bold">.apk</code>!</li>
            </ol>

            <div className="pt-1 flex items-center justify-end">
              <a
                href={`https://www.pwabuilder.com/?url=${encodeURIComponent(sharedUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
              >
                <span>Open in PWABuilder</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Option B: CLI with Bubblewrap */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-700" />
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                  Option 2: Build via Terminal (Google Bubblewrap CLI)
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                Developers
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              If you have Node.js and JDK 17 installed on your computer, run:
            </p>

            <div className="relative p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed">
              <pre className="overflow-x-auto whitespace-pre-wrap">{bubblewrapCmd}</pre>
              <button
                onClick={() => handleCopy(bubblewrapCmd, 'cmd')}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition"
                title="Copy commands"
              >
                {copiedText === 'cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Play Console Checklist & In-App Products */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
            <div className="flex items-center gap-2 text-blue-950 font-extrabold text-xs">
              <PackageCheck className="w-4 h-4 text-blue-700" />
              <span>Google Play Console In-App Products Setup</span>
            </div>

            <p className="text-[11px] text-blue-900 leading-relaxed">
              In your <strong>Google Play Console</strong> under <em>Monetize &gt; In-app products</em>, configure these 2 products to activate the holiday system:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-white border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div>
                  <div className="font-mono font-bold text-slate-900">temp_holiday_1year</div>
                  <div className="text-slate-500">Temporary (1 Year) Holiday • Consumable</div>
                </div>
                <div className="font-black text-slate-900 bg-amber-100 px-2.5 py-1 rounded-lg">
                  ₹499
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div>
                  <div className="font-mono font-bold text-slate-900">permanent_holiday_forever</div>
                  <div className="text-slate-500">Permanent (Every Year) Holiday • Consumable</div>
                </div>
                <div className="font-black text-slate-900 bg-emerald-100 px-2.5 py-1 rounded-lg">
                  ₹999
                </div>
              </div>
            </div>
          </div>

          {/* Digital Asset Links */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Digital Asset Links (Full-screen TWA)</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ✓ Hosted & Active
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Your app automatically serves <code className="bg-white border px-1 py-0.2 rounded font-mono">/.well-known/assetlinks.json</code> for <span className="font-mono font-bold">{packageName}</span> so the app launches in clean, full-screen standalone mode without any browser URL address bar.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <a
            href={downloadZipUrl}
            download="khasi-jaintia-calendar-android-project.zip"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Direct Zip Download</span>
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0e2a3a] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
