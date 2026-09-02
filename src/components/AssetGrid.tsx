import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MarketAsset } from '../types/market';
import { formatPercent, formatPrice, generateSparklinePath } from '../utils/formatters';

interface AssetGridProps {
  categoryTitle: string;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  onViewAll?: () => void;
}

export const AssetGrid: React.FC<AssetGridProps> = ({
  categoryTitle,
  assets,
  onSelectAsset,
  onViewAll,
}) => {
  return (
    <div className="flex flex-col">
      {/* Category Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          id="asset-grid-title"
          onClick={onViewAll}
          className="text-2xl md:text-3xl font-bold text-[#dfe2f2] flex items-center gap-1 group cursor-pointer font-display"
        >
          <span>{categoryTitle}</span>
          <ChevronRight className="w-6 h-6 text-[#B2B5BE] group-hover:translate-x-1 group-hover:text-white transition-all" />
        </h2>
      </div>

      {/* Grid of Stock / Asset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {assets.map((asset) => {
          const isPositive = asset.changePercent >= 0;
          const sparklinePath = generateSparklinePath(asset.sparkline, 60, 20);

          return (
            <div
              key={asset.id}
              id={`asset-card-${asset.symbol.toLowerCase()}`}
              onClick={() => onSelectAsset(asset)}
              className="bento-card rounded-xl p-4 cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden group select-none"
            >
              {/* Subtle hover gradient background */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity pointer-events-none bg-gradient-to-br ${
                  isPositive
                    ? 'from-[#089981] to-transparent'
                    : 'from-[#F23645] to-transparent'
                }`}
              />

              {/* Card Header: Name, Symbol, & Badge */}
              <div className="flex justify-between items-start z-10">
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-base text-[#dfe2f2] group-hover:text-white transition-colors truncate">
                    {asset.name}
                  </div>
                  <div className="text-xs text-[#B2B5BE] font-mono-data uppercase">
                    {asset.symbol}
                  </div>
                </div>

                <div
                  className={`bg-[#0f131e]/90 border border-[#2A2E39] rounded px-2 py-0.5 font-mono-data text-[11px] font-semibold shrink-0 ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {formatPercent(asset.changePercent)}
                </div>
              </div>

              {/* Card Footer: Price & Sparkline */}
              <div className="z-10 flex justify-between items-end">
                <div className="font-mono-data text-lg md:text-xl font-bold text-[#dfe2f2]">
                  {formatPrice(asset.price, asset.currency)}
                </div>
                <div className="w-16 h-6 shrink-0 flex items-center justify-end">
                  <svg className="w-full h-full" viewBox="0 0 60 20" preserveAspectRatio="none">
                    <path
                      className={isPositive ? 'sparkline-up' : 'sparkline-down'}
                      d={sparklinePath}
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
