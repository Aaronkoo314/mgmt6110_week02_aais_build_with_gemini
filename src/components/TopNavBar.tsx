import React, { useState, useEffect } from 'react';
import { Search, Globe, User, Bookmark, Bell, Sparkles, Activity, Check } from 'lucide-react';

interface TopNavBarProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  liveSimulation: boolean;
  onToggleSimulation: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  liveSimulation,
  onToggleSimulation,
}) => {
  const [activeNav, setActiveNav] = useState('Markets');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <>
      <nav className="bg-[#0f131e] border-b border-[#2A2E39] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="flex justify-between items-center h-16 w-full px-4 md:px-8 max-w-[1200px] mx-auto">
          {/* Left: Brand & Search */}
          <div className="flex items-center gap-6">
            <div
              id="brand-logo"
              className="font-bold text-[#dfe2f2] flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity select-none"
              onClick={() => setActiveNav('Markets')}
            >
              <div className="w-7 h-7 flex items-center justify-center text-white">
                <svg fill="currentColor" height="28" viewBox="0 0 28 28" width="28">
                  <path d="M12 4h-4v4h-4v4h-4v12h4v-4h4v-4h4v-4h4v-4h4v-4h-4z"></path>
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight font-display">TV</span>
            </div>

            {/* Search Input Box */}
            <div
              id="top-search-bar"
              onClick={onOpenSearch}
              className="hidden md:flex items-center bg-[#1E222D] border border-[#2A2E39] rounded-full px-4 py-1.5 hover:border-[#2962ff] focus-within:border-[#2962ff] transition-all cursor-pointer w-64 group"
            >
              <Search className="w-4 h-4 text-[#B2B5BE] group-hover:text-[#dfe2f2] transition-colors" />
              <span className="text-xs text-[#B2B5BE] ml-2 select-none group-hover:text-[#dfe2f2] transition-colors">
                Search (Ctrl+K)
              </span>
              <span className="ml-auto text-[10px] bg-[#262a35] text-[#8d90a2] px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </span>
            </div>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6">
            {['Products', 'Community', 'Markets', 'Brokers', 'More'].map((item) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  id={`nav-link-${item.toLowerCase()}`}
                  onClick={() => setActiveNav(item)}
                  className={`font-medium text-sm transition-colors duration-200 relative py-1 cursor-pointer ${
                    isActive
                      ? 'text-[#2962ff] font-semibold'
                      : 'text-[#c3c5d8] hover:text-[#dfe2f2]'
                  }`}
                >
                  {item}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2962ff] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Live tick simulation indicator */}
            <button
              id="btn-live-simulation"
              onClick={onToggleSimulation}
              title={liveSimulation ? 'Real-time market ticks active' : 'Click to enable live stream simulation'}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all ${
                liveSimulation
                  ? 'bg-[#089981]/15 border-[#089981]/40 text-[#089981]'
                  : 'bg-[#1E222D] border-[#2A2E39] text-[#8d90a2] hover:text-[#dfe2f2]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${liveSimulation ? 'bg-[#089981] animate-pulse' : 'bg-[#8d90a2]'}`} />
              <span>{liveSimulation ? 'LIVE' : 'PAUSED'}</span>
            </button>

            {/* Watchlist Quick Button */}
            <button
              id="btn-open-watchlist"
              onClick={onOpenWatchlist}
              className="relative p-2 text-[#c3c5d8] hover:text-[#dfe2f2] hover:bg-[#1E222D] rounded-lg transition-colors"
              title="Open Watchlist"
            >
              <Bookmark className="w-[18px] h-[18px]" />
              {watchlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#2962ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                id="btn-language-selector"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="hidden md:flex items-center gap-1.5 text-[#c3c5d8] hover:text-[#dfe2f2] px-2 py-1 rounded-lg hover:bg-[#1E222D] transition-colors text-xs font-medium"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLang}</span>
              </button>

              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-[#1E222D] border border-[#2A2E39] rounded-lg shadow-xl py-1 z-50">
                  {['EN', 'ES', 'DE', 'FR', 'JA', 'ZH'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setCurrentLang(lang);
                        setShowLanguageDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#dfe2f2] hover:bg-[#262a35] flex items-center justify-between"
                    >
                      <span>{lang}</span>
                      {currentLang === lang && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Icon */}
            <button
              id="btn-user-profile"
              onClick={() => setShowGetStartedModal(true)}
              className="text-[#c3c5d8] hover:text-[#dfe2f2] p-2 hover:bg-[#1E222D] rounded-lg transition-colors"
              title="Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Get Started Button */}
            <button
              id="btn-get-started"
              onClick={() => setShowGetStartedModal(true)}
              className="bg-[#2962ff] text-white px-3.5 md:px-4 py-1.5 rounded text-xs md:text-sm font-semibold hover:bg-[#1e4bd8] active:scale-95 transition-all shadow-sm"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* Get Started Modal */}
      {showGetStartedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl max-w-md w-full p-6 shadow-2xl relative text-[#dfe2f2]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#2962ff]/20 flex items-center justify-center text-[#2962ff]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display">Welcome to TradingView Markets</h3>
                <p className="text-xs text-[#B2B5BE]">Real-time quotes, charts, and analysis</p>
              </div>
            </div>

            <p className="text-sm text-[#c3c5d8] mb-6 leading-relaxed">
              Explore global indices, top equities, crypto assets, forex pairs, and commodities with interactive real-time sparklines and deep technical analysis.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-[#dfe2f2] bg-[#171b26] p-2.5 rounded-lg border border-[#2A2E39]">
                <Activity className="w-4 h-4 text-[#089981]" />
                <span>Live price tick simulation enabled</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#dfe2f2] bg-[#171b26] p-2.5 rounded-lg border border-[#2A2E39]">
                <Search className="w-4 h-4 text-[#2962ff]" />
                <span>Press <code className="bg-[#2A2E39] px-1 py-0.5 rounded text-white">Ctrl+K</code> anytime to search symbols</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowGetStartedModal(false)}
                className="px-4 py-2 bg-[#2962ff] text-white text-xs font-semibold rounded hover:bg-[#1e4bd8] transition-colors"
              >
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
