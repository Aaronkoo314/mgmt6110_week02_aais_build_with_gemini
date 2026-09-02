import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { ALL_SYMBOLS_SEARCH_LIST } from '../data/marketData';
import { formatPercent, formatPrice } from '../utils/formatters';

interface SearchPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
}

export const SearchPaletteModal: React.FC<SearchPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['All', 'Stock', 'Crypto', 'Forex', 'Futures', 'Index', 'ETF'];

  const filteredResults = ALL_SYMBOLS_SEARCH_LIST.filter((item) => {
    const matchesQuery =
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.type === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#171b26] border border-[#2A2E39] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col text-[#dfe2f2]">
        {/* Search input line */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#2A2E39] bg-[#1E222D]">
          <Search className="w-5 h-5 text-[#B2B5BE] mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, market, company..."
            className="w-full bg-transparent text-sm md:text-base text-white placeholder-[#8d90a2] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#8d90a2] hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-[#262a35] text-[#B2B5BE] hover:text-white px-2 py-1 rounded border border-[#2A2E39]"
          >
            ESC
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#171b26] border-b border-[#2A2E39] overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#262a35]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 divide-y divide-[#2A2E39]/40">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8d90a2]">
              No symbols found matching &quot;{query}&quot;
            </div>
          ) : (
            filteredResults.map((item) => {
              const isPositive = item.change >= 0;
              return (
                <div
                  key={item.symbol}
                  id={`search-item-${item.symbol.toLowerCase()}`}
                  onClick={() => {
                    onSelectSymbol(item.symbol);
                    onClose();
                  }}
                  className="p-3 hover:bg-[#262a35]/60 rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#1E222D] border border-[#2A2E39] flex items-center justify-center text-xs font-mono font-bold text-white group-hover:border-[#2962ff]">
                      {item.symbol.slice(0, 3)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-data text-white font-bold text-sm">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] bg-[#2A2E39] text-[#B2B5BE] px-1.5 py-0.5 rounded">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-xs text-[#8d90a2] truncate">{item.name}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono-data">
                    <div className="text-sm font-semibold text-white">
                      {formatPrice(item.price)}
                    </div>
                    <div
                      className={`text-xs font-medium flex items-center justify-end gap-0.5 ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {formatPercent(item.change)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer tip */}
        <div className="p-2.5 bg-[#1E222D] border-t border-[#2A2E39] text-[11px] text-[#8d90a2] flex justify-between items-center px-4">
          <span>Navigate with mouse or touch</span>
          <span className="flex items-center gap-1">
            Press <kbd className="bg-[#262a35] px-1 rounded text-[#dfe2f2]">Enter</kbd> to select
          </span>
        </div>
      </div>
    </div>
  );
};
