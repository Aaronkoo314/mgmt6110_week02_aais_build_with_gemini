import React from 'react';
import { ChevronRight } from 'lucide-react';
import { IndexItem } from '../types/market';
import { formatPercent, generateSparklinePath } from '../utils/formatters';

interface IndicesBentoProps {
  indices: IndexItem[];
  onSelectIndex: (index: IndexItem) => void;
  onViewAllIndices?: () => void;
}

export const IndicesBento: React.FC<IndicesBentoProps> = ({
  indices,
  onSelectIndex,
  onViewAllIndices,
}) => {
  return (
    <section className="mb-14">
      {/* Section Header */}
      <h2
        id="indices-section-header"
        onClick={onViewAllIndices}
        className="text-2xl md:text-3xl font-bold text-[#dfe2f2] mb-6 flex items-center gap-1 group cursor-pointer w-fit font-display"
      >
        <span>Indices</span>
        <ChevronRight className="w-6 h-6 text-[#B2B5BE] group-hover:translate-x-1 group-hover:text-white transition-all" />
      </h2>

      {/* Grid of 3 Index Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((idxItem) => {
          const isPositive = idxItem.changePercent >= 0;
          const sparklinePath = generateSparklinePath(idxItem.sparkline, 60, 20);

          return (
            <div
              key={idxItem.id}
              id={`index-card-${idxItem.id}`}
              onClick={() => onSelectIndex(idxItem)}
              className="bento-card rounded-xl p-4 flex items-center gap-4 cursor-pointer relative group overflow-hidden select-none"
            >
              {/* Subtle hover gradient */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none ${
                  isPositive ? 'bg-[#089981]' : 'bg-[#F23645]'
                }`}
              />

              {/* Index Number Badge */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: idxItem.badgeBg,
                  boxShadow: `0 0 16px ${idxItem.badgeGlow}`,
                }}
              >
                {idxItem.badge}
              </div>

              {/* Text & Price Info */}
              <div className="flex-grow min-w-0">
                <div className="font-semibold text-base text-[#dfe2f2] group-hover:text-white transition-colors truncate">
                  {idxItem.name}
                </div>
                <div className="flex items-center gap-2 mt-1 font-mono-data text-xs md:text-sm">
                  <span className="text-[#dfe2f2] font-semibold">
                    {idxItem.value.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span
                    className={`font-medium ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {formatPercent(idxItem.changePercent)}
                  </span>
                </div>
              </div>

              {/* Sparkline SVG Chart */}
              <div className="w-16 h-8 shrink-0 flex items-center justify-end">
                <svg className="w-full h-full" viewBox="0 0 60 20" preserveAspectRatio="none">
                  <path
                    className={isPositive ? 'sparkline-up' : 'sparkline-down'}
                    d={sparklinePath}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
