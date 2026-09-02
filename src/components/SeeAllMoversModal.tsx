import React, { useState } from 'react';
import { X, ArrowUpDown, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { TableMoverItem } from '../types/market';
import { formatPercent, formatPrice } from '../utils/formatters';

interface SeeAllMoversModalProps {
  title: string;
  items: TableMoverItem[];
  onClose: () => void;
  onSelectItem: (item: TableMoverItem) => void;
}

export const SeeAllMoversModal: React.FC<SeeAllMoversModalProps> = ({
  title,
  items,
  onClose,
  onSelectItem,
}) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'changePercent'>('changePercent');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = items.filter(
    (item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      (item.name && item.name.toLowerCase().includes(search.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'symbol') diff = a.symbol.localeCompare(b.symbol);
    else if (sortBy === 'price') diff = a.price - b.price;
    else if (sortBy === 'changePercent') diff = a.changePercent - b.changePercent;
    return sortAsc ? diff : -diff;
  });

  const toggleSort = (col: 'symbol' | 'price' | 'changePercent') => {
    if (sortBy === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(col);
      setSortAsc(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#171b26] border border-[#2A2E39] rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col text-[#dfe2f2] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#2A2E39] flex justify-between items-center bg-[#1E222D]">
          <div>
            <h3 className="text-xl font-bold font-display text-white">{title} Screener</h3>
            <p className="text-xs text-[#B2B5BE] mt-0.5">Real-time market movers and volume leaders</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8d90a2] hover:text-white bg-[#171b26] border border-[#2A2E39] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar inside modal */}
        <div className="p-4 border-b border-[#2A2E39] bg-[#171b26] flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8d90a2]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by symbol or company..."
              className="w-full bg-[#1E222D] border border-[#2A2E39] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#8d90a2] focus:outline-none focus:border-[#2962ff]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div className="min-w-[500px]">
            {/* Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 px-3 py-2 text-[11px] font-bold text-[#B2B5BE] uppercase tracking-wider border-b border-[#2A2E39] mb-2 font-mono">
              <button
                onClick={() => toggleSort('symbol')}
                className="flex items-center gap-1 hover:text-white text-left"
              >
                <span>Symbol</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
              <button
                onClick={() => toggleSort('price')}
                className="flex items-center justify-end gap-1 hover:text-white text-right"
              >
                <span>Price</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
              <button
                onClick={() => toggleSort('changePercent')}
                className="flex items-center justify-end gap-1 hover:text-white text-right"
              >
                <span>Chg %</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
              <div className="text-right">Volume</div>
            </div>

            {/* List */}
            <div className="space-y-1">
              {sorted.map((item) => {
                const isPositive = item.changePercent >= 0;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectItem(item);
                      onClose();
                    }}
                    className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 px-3 py-2.5 hover:bg-[#262a35]/60 rounded-lg cursor-pointer items-center transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono-data text-white font-bold text-sm">
                        {item.symbol}
                      </span>
                      {item.name && (
                        <span className="text-xs text-[#B2B5BE] truncate">{item.name}</span>
                      )}
                    </div>

                    <div className="font-mono-data text-white text-right text-xs font-semibold">
                      {formatPrice(item.price, item.currency || '$')}
                    </div>

                    <div
                      className={`font-mono-data text-right text-xs font-bold flex items-center justify-end gap-1 ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      {formatPercent(item.changePercent)}
                    </div>

                    <div className="font-mono-data text-[#8d90a2] text-right text-xs">
                      {item.volume || '14.2M'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
