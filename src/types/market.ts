export interface SparklinePoint {
  time: string;
  value: number;
}

export interface OHLCPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: 'US stocks' | 'World stocks' | 'Crypto' | 'Futures' | 'Forex' | 'Bonds' | 'ETFs' | 'Economy';
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  sparkline: number[];
  high24h: number;
  low24h: number;
  openPrice: number;
  prevClose: number;
  volume: string;
  volumeRaw: number;
  marketCap?: string;
  peRatio?: number;
  week52High?: number;
  week52Low?: number;
  exchange: string;
  history?: {
    '1D': number[];
    '5D': number[];
    '1M': number[];
    '1Y': number[];
    'ALL': number[];
  };
}

export interface IndexItem {
  id: string;
  badge: string;
  badgeBg: string;
  badgeGlow: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  category: string;
  high: number;
  low: number;
}

export interface TableMoverItem {
  id: string;
  symbol: string;
  name?: string;
  price: number;
  changePercent: number;
  volume?: string;
  category: string;
  currency?: string;
}

export type CategoryType =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Bonds'
  | 'ETFs'
  | 'Economy';
