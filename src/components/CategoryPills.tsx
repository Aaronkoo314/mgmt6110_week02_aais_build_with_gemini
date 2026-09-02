import React from 'react';
import { CategoryType } from '../types/market';

interface CategoryPillsProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

const CATEGORIES: CategoryType[] = [
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Bonds',
  'ETFs',
  'Economy',
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="bg-[#1b1f2b] rounded-full flex items-center gap-1.5 p-1 overflow-x-auto no-scrollbar max-w-full border border-[#2A2E39] shadow-inner">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`category-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 ease-in-out cursor-pointer ${
                isActive
                  ? 'bg-[#dfe2f2] text-[#0f131e] font-bold shadow-sm'
                  : 'text-[#c3c5d8] hover:text-[#dfe2f2] hover:bg-[#313441]/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
