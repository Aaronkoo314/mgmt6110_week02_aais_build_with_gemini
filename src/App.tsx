import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Sparkles, TrendingUp } from 'lucide-react';
import { TopNavBar } from './components/TopNavBar';
import { CategoryPills } from './components/CategoryPills';
import { IndicesBento } from './components/IndicesBento';
import { AssetGrid } from './components/AssetGrid';
import { SideMoversTables } from './components/SideMoversTables';
import { InteractiveChartModal } from './components/InteractiveChartModal';
import { SearchPaletteModal } from './components/SearchPaletteModal';
import { SeeAllMoversModal } from './components/SeeAllMoversModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Footer } from './components/Footer';

import {
  INDICES_DATA,
  ASSETS_BY_CATEGORY,
  HIGHEST_VOLUME_MOVERS,
  MOST_VOLATILE_MOVERS,
  ALL_SYMBOLS_SEARCH_LIST,
} from './data/marketData';
import { CategoryType, IndexItem, MarketAsset, TableMoverItem } from './types/market';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('US stocks');
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | IndexItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [seeAllModal, setSeeAllModal] = useState<{ title: string; items: TableMoverItem[] } | null>(null);
  const [watchlistIds, setWatchlistIds] = useState<string[]>(['nvda', 'aapl']);
  const [liveSimulation, setLiveSimulation] = useState(true);
  const [heroMarketDropdown, setHeroMarketDropdown] = useState(false);

  // Dynamic state for assets to allow real-time live tick updates
  const [indicesState, setIndicesState] = useState(INDICES_DATA);
  const [assetsState, setAssetsState] = useState(ASSETS_BY_CATEGORY);
  const [highestVolumeState, setHighestVolumeState] = useState(HIGHEST_VOLUME_MOVERS);
  const [mostVolatileState, setMostVolatileState] = useState(MOST_VOLATILE_MOVERS);

  // Live simulation ticker effect
  useEffect(() => {
    if (!liveSimulation) return;

    const interval = setInterval(() => {
      // Randomly update an index
      setIndicesState((prev) => {
        const next = { ...prev };
        const categories = Object.keys(next);
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        const items = [...next[randomCat]];
        const idx = Math.floor(Math.random() * items.length);
        const current = items[idx];
        const delta = (Math.random() - 0.49) * (current.value * 0.0008);
        const newVal = Number((current.value + delta).toFixed(2));
        const newPct = Number((current.changePercent + (delta / current.value) * 100).toFixed(2));
        const lastSpark = current.sparkline[current.sparkline.length - 1];
        const newSpark = Math.max(1, Math.min(20, lastSpark + (delta > 0 ? 1 : -1)));

        items[idx] = {
          ...current,
          value: newVal,
          changePercent: newPct,
          sparkline: [...current.sparkline.slice(1), newSpark],
        };
        next[randomCat] = items;
        return next;
      });

      // Randomly update an asset
      setAssetsState((prev) => {
        const next = { ...prev };
        const cats = Object.keys(next);
        const cat = cats[Math.floor(Math.random() * cats.length)];
        const items = [...next[cat]];
        const idx = Math.floor(Math.random() * items.length);
        const asset = items[idx];
        const delta = (Math.random() - 0.48) * (asset.price * 0.0012);
        const newPrice = Number((asset.price + delta).toFixed(2));
        const newPct = Number((asset.changePercent + (delta / asset.price) * 100).toFixed(2));
        const lastSpark = asset.sparkline[asset.sparkline.length - 1];
        const newSpark = Math.max(1, Math.min(20, lastSpark + (delta > 0 ? 1 : -1)));

        items[idx] = {
          ...asset,
          price: newPrice,
          changePercent: newPct,
          sparkline: [...asset.sparkline.slice(1), newSpark],
        };
        next[cat] = items;
        return next;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [liveSimulation]);

  // Watchlist items
  const watchlistAssets: MarketAsset[] = (Object.values(assetsState) as MarketAsset[][])
    .flat()
    .filter((a) => watchlistIds.includes(a.id));

  const handleToggleWatchlist = (id: string, symbol: string) => {
    setWatchlistIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectSymbolFromSearch = (symbol: string) => {
    // Find asset across state
    const allAssets: MarketAsset[] = (Object.values(assetsState) as MarketAsset[][]).flat();
    const foundAsset = allAssets.find((a) => a.symbol.toUpperCase() === symbol.toUpperCase());
    if (foundAsset) {
      setSelectedAsset(foundAsset);
      return;
    }
    const allIndices: IndexItem[] = (Object.values(indicesState) as IndexItem[][]).flat();
    const foundIndex = allIndices.find((i) => i.name.toUpperCase().includes(symbol.toUpperCase()) || i.badge.toUpperCase() === symbol.toUpperCase());
    if (foundIndex) {
      setSelectedAsset(foundIndex);
      return;
    }
    // Fallback: create temporary asset
    const searchItem = ALL_SYMBOLS_SEARCH_LIST.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
    if (searchItem) {
      setSelectedAsset({
        id: searchItem.symbol.toLowerCase(),
        symbol: searchItem.symbol,
        name: searchItem.name,
        category: 'US stocks',
        price: searchItem.price,
        currency: '$',
        change: 1.5,
        changePercent: searchItem.change,
        sparkline: [10, 12, 11, 14, 16],
        high24h: searchItem.price * 1.02,
        low24h: searchItem.price * 0.98,
        openPrice: searchItem.price * 0.99,
        prevClose: searchItem.price * 0.99,
        volume: '32.4M',
        volumeRaw: 32400000,
        exchange: searchItem.exchange,
      });
    }
  };

  const handleSelectMover = (mover: TableMoverItem) => {
    handleSelectSymbolFromSearch(mover.symbol);
  };

  const currentIndices = indicesState[selectedCategory] || indicesState['US stocks'];
  const currentAssets = assetsState[selectedCategory] || assetsState['US stocks'];

  return (
    <div className="bg-[#0f131e] text-[#dfe2f2] font-body-md min-h-screen flex flex-col selection:bg-[#2962ff] selection:text-white">
      {/* Top Navbar */}
      <TopNavBar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlistIds.length}
        liveSimulation={liveSimulation}
        onToggleSimulation={() => setLiveSimulation(!liveSimulation)}
      />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10 relative">
          <div className="inline-block relative">
            <h1
              id="hero-title"
              onClick={() => setHeroMarketDropdown(!heroMarketDropdown)}
              className="text-4xl md:text-5xl lg:text-[48px] font-bold font-display text-[#dfe2f2] flex items-center justify-center gap-2 cursor-pointer group hover:text-white transition-colors select-none tracking-tight"
            >
              <span>Markets, everywhere</span>
              <ChevronDown className="w-8 h-8 text-[#B2B5BE] group-hover:translate-y-1 transition-transform" />
            </h1>

            {/* Hero Market Selector Dropdown */}
            {heroMarketDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[#1E222D] border border-[#2A2E39] rounded-xl shadow-2xl p-2 z-30 text-left">
                <div className="text-[11px] font-bold text-[#8d90a2] px-3 py-1.5 uppercase font-mono">
                  Market Scope
                </div>
                {[
                  { label: 'All Global Markets', cat: 'US stocks' },
                  { label: 'Americas (US Equities)', cat: 'US stocks' },
                  { label: 'Global Exchanges', cat: 'World stocks' },
                  { label: 'Crypto & Web3', cat: 'Crypto' },
                  { label: 'Commodities & Futures', cat: 'Futures' },
                  { label: 'Foreign Exchange (Forex)', cat: 'Forex' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedCategory(item.cat as CategoryType);
                      setHeroMarketDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#dfe2f2] hover:bg-[#262a35] rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <TrendingUp className="w-3.5 h-3.5 text-[#2962ff]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Pills Navigation */}
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Indices Bento Section */}
        <IndicesBento
          indices={currentIndices}
          onSelectIndex={(index) => setSelectedAsset(index)}
          onViewAllIndices={() =>
            setSeeAllModal({
              title: `${selectedCategory} Indices`,
              items: currentIndices.map((i) => ({
                id: i.id,
                symbol: i.badge,
                name: i.name,
                price: i.value,
                changePercent: i.changePercent,
                category: selectedCategory,
                currency: 'pts',
              })),
            })
          }
        />

        {/* Category Stocks & Side Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          {/* Main Stock Cards Grid (Left 8 cols) */}
          <div className="lg:col-span-8">
            <AssetGrid
              categoryTitle={selectedCategory}
              assets={currentAssets}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              onViewAll={() =>
                setSeeAllModal({
                  title: selectedCategory,
                  items: currentAssets.map((a) => ({
                    id: a.id,
                    symbol: a.symbol,
                    name: a.name,
                    price: a.price,
                    changePercent: a.changePercent,
                    volume: a.volume,
                    category: a.category,
                    currency: a.currency,
                  })),
                })
              }
            />
          </div>

          {/* Side Tables (Right 4 cols) */}
          <div className="lg:col-span-4">
            <SideMoversTables
              highestVolume={highestVolumeState}
              mostVolatile={mostVolatileState}
              onSelectMover={handleSelectMover}
              onSeeAllVolume={() =>
                setSeeAllModal({
                  title: 'Highest Volume',
                  items: highestVolumeState,
                })
              }
              onSeeAllVolatile={() =>
                setSeeAllModal({
                  title: 'Most Volatile',
                  items: mostVolatileState,
                })
              }
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Chart & Technical Detail Modal */}
      {selectedAsset && (
        <InteractiveChartModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          isWatchlisted={watchlistIds.includes(selectedAsset.id)}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}

      {/* Command Palette / Symbol Search Modal */}
      <SearchPaletteModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSymbol={handleSelectSymbolFromSearch}
      />

      {/* Watchlist Slide-over Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistItems={watchlistAssets}
        onRemoveItem={(id) => setWatchlistIds((prev) => prev.filter((i) => i !== id))}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />

      {/* See All Screener Modal */}
      {seeAllModal && (
        <SeeAllMoversModal
          title={seeAllModal.title}
          items={seeAllModal.items}
          onClose={() => setSeeAllModal(null)}
          onSelectItem={handleSelectMover}
        />
      )}
    </div>
  );
}
