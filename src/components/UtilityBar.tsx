import React from 'react';
import { Mail, Eye, Languages } from 'lucide-react';
import { useElectionStore } from '../store/electionStore';

interface UtilityBarProps {
  onOpenOutbox: () => void;
}

export const UtilityBar: React.FC<UtilityBarProps> = ({ onOpenOutbox }) => {
  const {
    language,
    setLanguage,
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    unreadOutboxCount,
    chainReport,
  } = useElectionStore();

  return (
    <div className="bg-[#122648] text-[#FAF3E0] text-xs py-1 px-4 border-b border-[#254E8E]/40 flex flex-wrap items-center justify-between gap-2">
      {/* Skip to Content */}
      <div className="flex items-center gap-3">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:inline-block focus:bg-govSaffron focus:text-white focus:px-2 focus:py-0.5 rounded font-medium outline-none ring-2 ring-white"
        >
          Skip to main content
        </a>
        <span className="hidden md:inline-flex items-center gap-1.5 text-cream-300/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sovereign Ledger Node: Connected</span>
        </span>
      </div>

      {/* Accessibility & Language Controls */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Outbox Drawer Trigger */}
        <button
          onClick={onOpenOutbox}
          className="flex items-center gap-1.5 bg-govNavy-light/60 hover:bg-govNavy-light text-cream-100 px-2.5 py-0.5 rounded transition border border-white/20 focus:outline-none focus:ring-1 focus:ring-govSaffron"
          title="Simulated SMS & Email Notifications Outbox"
          aria-label="Simulated notifications outbox"
        >
          <Mail className="w-3.5 h-3.5 text-govSaffron-light" />
          <span>Outbox</span>
          {unreadOutboxCount > 0 && (
            <span className="bg-red-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
              {unreadOutboxCount}
            </span>
          )}
        </button>

        {/* Text Size (A- A A+) */}
        <div className="flex items-center border border-white/20 rounded overflow-hidden">
          <button
            onClick={() => setTextSize('normal')}
            className={`px-2 py-0.5 font-bold ${textSize === 'normal' ? 'bg-govSaffron text-white' : 'hover:bg-white/10'}`}
            title="Normal text size"
            aria-label="Normal text size"
          >
            A-
          </button>
          <button
            onClick={() => setTextSize('large')}
            className={`px-2 py-0.5 font-bold border-l border-white/20 ${textSize === 'large' ? 'bg-govSaffron text-white' : 'hover:bg-white/10'}`}
            title="Large text size"
            aria-label="Large text size"
          >
            A
          </button>
          <button
            onClick={() => setTextSize('xlarge')}
            className={`px-2 py-0.5 font-bold border-l border-white/20 ${textSize === 'xlarge' ? 'bg-govSaffron text-white' : 'hover:bg-white/10'}`}
            title="Extra large text size"
            aria-label="Extra large text size"
          >
            A+
          </button>
        </div>

        {/* High Contrast Toggle */}
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded border border-white/20 transition ${
            highContrast ? 'bg-amber-400 text-black font-semibold' : 'hover:bg-white/10'
          }`}
          title="Toggle High Contrast Mode"
          aria-label="Toggle High Contrast Mode"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Contrast</span>
        </button>

        {/* Hindi / English Toggle */}
        <div className="flex items-center gap-1 border border-white/20 rounded px-1.5 py-0.5 bg-black/20">
          <Languages className="w-3.5 h-3.5 text-govSaffron-light" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-1.5 py-0.5 rounded ${language === 'en' ? 'bg-white/20 font-bold text-white' : 'text-cream-300/80 hover:text-white'}`}
          >
            English
          </button>
          <span className="text-white/40">|</span>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-1.5 py-0.5 rounded ${language === 'hi' ? 'bg-white/20 font-bold text-white' : 'text-cream-300/80 hover:text-white'}`}
          >
            हिंदी
          </button>
        </div>
      </div>
    </div>
  );
};
