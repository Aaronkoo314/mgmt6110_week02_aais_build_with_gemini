import React from 'react';
import { TableMoverItem } from '../types/market';
import { formatPercent, formatPrice } from '../utils/formatters';

interface SideMoversTablesProps {
  highestVolume: TableMoverItem[];
  mostVolatile: TableMoverItem[];
  onSelectMover: (item: TableMoverItem) => void;
  onSeeAllVolume: () => void;
  onSeeAllVolatile: () => void;
}

export const SideMoversTables: React.FC<SideMoversTablesProps> = ({
  highestVolume,
  mostVolatile,
  onSelectMover,
  onSeeAllVolume,
  onSeeAllVolatile,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Highest Volume Section */}
      <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-base text-[#dfe2f2] font-display">
            Highest volume
          </h3>
          <button
            id="btn-see-all-volume"
            onClick={onSeeAllVolume}
            className="text-[#2962ff] text-xs font-semibold hover:underline cursor-pointer transition-colors hover:text-[#5080ff]"
          >
            See all
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-2 py-1 text-[11px] font-bold text-[#B2B5BE] uppercase tracking-wider border-b border-[#2A2E39] mb-1 select-none font-mono">
            <div>Symbol</div>
            <div className="text-right">Price</div>
            <div className="text-right w-16">Chg%</div>
          </div>

          {/* Rows */}
          {highestVolume.slice(0, 3).map((item) => {
            const isPositive = item.changePercent >= 0;
            return (
              <div
                key={item.id}
                id={`volume-row-${item.symbol.toLowerCase()}`}
                onClick={() => onSelectMover(item)}
                className="grid grid-cols-[1fr_auto_auto] gap-4 px-2 py-2 hover:bg-[#262a35]/60 rounded cursor-pointer items-center transition-colors group"
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <span className="font-mono-data text-[#dfe2f2] font-semibold text-[13px] group-hover:text-white">
                    {item.symbol}
                  </span>
                  {item.name && (
                    <span className="text-xs text-[#B2B5BE] truncate hidden sm:block">
                      {item.name}
                    </span>
                  )}
                </div>

                <div className="font-mono-data text-[#dfe2f2] text-xs text-right font-medium">
                  {formatPrice(item.price, item.currency || '$')}
                </div>

                <div
                  className={`font-mono-data text-xs text-right w-16 font-semibold ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {formatPercent(item.changePercent)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Most Volatile Section */}
      <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-base text-[#dfe2f2] font-display">
            Most volatile
          </h3>
          <button
            id="btn-see-all-volatile"
            onClick={onSeeAllVolatile}
            className="text-[#2962ff] text-xs font-semibold hover:underline cursor-pointer transition-colors hover:text-[#5080ff]"
          >
            See all
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-2 py-1 text-[11px] font-bold text-[#B2B5BE] uppercase tracking-wider border-b border-[#2A2E39] mb-1 select-none font-mono">
            <div>Symbol</div>
            <div className="text-right">Price</div>
            <div className="text-right w-16">Chg%</div>
          </div>

          {/* Rows */}
          {mostVolatile.slice(0, 3).map((item) => {
            const isPositive = item.changePercent >= 0;
            return (
              <div
                key={item.id}
                id={`volatile-row-${item.symbol.toLowerCase()}`}
                onClick={() => onSelectMover(item)}
                className="grid grid-cols-[1fr_auto_auto] gap-4 px-2 py-2 hover:bg-[#262a35]/60 rounded cursor-pointer items-center transition-colors group"
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <span className="font-mono-data text-[#dfe2f2] font-semibold text-[13px] group-hover:text-white">
                    {item.symbol}
                  </span>
                  {item.name && (
                    <span className="text-xs text-[#B2B5BE] truncate hidden sm:block">
                      {item.name}
                    </span>
                  )}
                </div>

                <div className="font-mono-data text-[#dfe2f2] text-xs text-right font-medium">
                  {formatPrice(item.price, item.currency || '$')}
                </div>

                <div
                  className={`font-mono-data text-xs text-right w-16 font-semibold ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {formatPercent(item.changePercent)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
