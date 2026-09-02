import React from 'react';
import { X, Trash2, TrendingUp, TrendingDown, Bookmark, ExternalLink } from 'lucide-react';
import { MarketAsset } from '../types/market';
import { formatPercent, formatPrice } from '../utils/formatters';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistItems: MarketAsset[];
  onRemoveItem: (id: string) => void;
  onSelectAsset: (asset: MarketAsset) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistItems,
  onRemoveItem,
  onSelectAsset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#171b26] border-l border-[#2A2E39] shadow-2xl flex flex-col text-[#dfe2f2]">
          {/* Header */}
          <div className="p-5 border-b border-[#2A2E39] bg-[#1E222D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#2962ff]" />
              <h3 className="font-bold text-lg text-white font-display">My Watchlist</h3>
              <span className="text-xs bg-[#262a35] text-[#B2B5BE] px-2 py-0.5 rounded-full font-mono">
                {watchlistItems.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8d90a2] hover:text-white rounded-lg hover:bg-[#262a35] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 divide-y divide-[#2A2E39]/40">
            {watchlistItems.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-[#1E222D] border border-[#2A2E39] flex items-center justify-center text-[#8d90a2] mb-3">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Your watchlist is empty</h4>
                <p className="text-xs text-[#8d90a2] max-w-xs">
                  Click the bookmark icon on any index, stock, or crypto asset to track it in real time here.
                </p>
              </div>
            ) : (
              watchlistItems.map((asset) => {
                const isPositive = asset.changePercent >= 0;
                return (
                  <div
                    key={asset.id}
                    className="py-3 flex items-center justify-between group hover:bg-[#1E222D]/40 px-2 rounded-xl transition-colors cursor-pointer"
                    onClick={() => {
                      onSelectAsset(asset);
                      onClose();
                    }}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-data font-bold text-sm text-white">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] text-[#8d90a2] truncate">{asset.name}</span>
                      </div>
                      <div className="text-[11px] text-[#8d90a2] font-mono-data mt-0.5">
                        Vol: {asset.volume}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono-data">
                        <div className="text-sm font-bold text-white">
                          {formatPrice(asset.price, asset.currency)}
                        </div>
                        <div
                          className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                            isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                          }`}
                        >
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {formatPercent(asset.changePercent)}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(asset.id);
                        }}
                        className="p-1.5 text-[#8d90a2] hover:text-[#F23645] hover:bg-[#F23645]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer stats */}
          {watchlistItems.length > 0 && (
            <div className="p-4 bg-[#1E222D] border-t border-[#2A2E39] text-xs text-[#8d90a2] flex justify-between items-center">
              <span>Auto-refreshing quotes</span>
              <span className="text-[#089981] font-mono-data flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" /> Synced
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
