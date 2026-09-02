import React, { useState, useMemo } from 'react';
import { X, Bookmark, BookmarkCheck, TrendingUp, TrendingDown, DollarSign, Activity, BarChart2, CheckCircle2 } from 'lucide-react';
import { MarketAsset, IndexItem } from '../types/market';
import { formatPercent, formatPrice, generateHistoricalPoints } from '../utils/formatters';

interface InteractiveChartModalProps {
  asset: MarketAsset | IndexItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (id: string, symbol: string) => void;
}

export const InteractiveChartModal: React.FC<InteractiveChartModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  if (!asset) return null;

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1M');
  const [chartMode, setChartMode] = useState<'line' | 'candlestick'>('line');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell' | null>(null);
  const [shares, setShares] = useState<number>(10);
  const [orderExecuted, setOrderExecuted] = useState<string | null>(null);

  const price = 'price' in asset ? asset.price : asset.value;
  const symbol = 'symbol' in asset ? asset.symbol : asset.badge;
  const name = asset.name;
  const currency = 'currency' in asset ? asset.currency : '$';
  const isPositive = asset.changePercent >= 0;

  // Generate chart data based on timeframe
  const dataPoints = useMemo(() => {
    const days = timeframe === '1D' ? 12 : timeframe === '5D' ? 24 : timeframe === '1M' ? 30 : timeframe === '6M' ? 60 : 120;
    return generateHistoricalPoints(price, days);
  }, [price, timeframe]);

  const activePoint = hoveredIndex !== null ? dataPoints[hoveredIndex] : dataPoints[dataPoints.length - 1];
  const minPrice = Math.min(...dataPoints.map((d) => d.price));
  const maxPrice = Math.max(...dataPoints.map((d) => d.price));
  const maxVolume = Math.max(...dataPoints.map((d) => d.volume));
  const priceRange = maxPrice - minPrice || 1;

  // Chart dimensions
  const svgWidth = 720;
  const svgHeight = 260;
  const paddingX = 20;
  const paddingY = 30;
  const volumeHeight = 50;

  // Generate path
  const pathD = useMemo(() => {
    return dataPoints
      .map((d, i) => {
        const x = paddingX + (i / (dataPoints.length - 1)) * (svgWidth - paddingX * 2);
        const y = paddingY + (1 - (d.price - minPrice) / priceRange) * (svgHeight - paddingY * 2 - volumeHeight);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [dataPoints, minPrice, priceRange, svgWidth, svgHeight]);

  const areaD = useMemo(() => {
    const lastX = svgWidth - paddingX;
    const firstX = paddingX;
    const bottomY = svgHeight - volumeHeight - 10;
    return `${pathD} L${lastX},${bottomY} L${firstX},${bottomY} Z`;
  }, [pathD, svgWidth, svgHeight]);

  const handleExecuteOrder = (type: 'BUY' | 'SELL') => {
    const total = (shares * price).toFixed(2);
    setOrderExecuted(`Successfully simulated ${type} order for ${shares} units of ${symbol} at ${formatPrice(price, currency)} (Total: $${total})`);
    setTimeout(() => {
      setOrderExecuted(null);
      setTradeAction(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#171b26] border border-[#2A2E39] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col text-[#dfe2f2]">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-[#2A2E39] flex justify-between items-start sticky top-0 bg-[#171b26] z-20">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{
                backgroundColor: 'badgeBg' in asset ? asset.badgeBg : isPositive ? '#089981' : '#F23645',
              }}
            >
              {'badge' in asset ? asset.badge : symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold font-display text-white">{name}</h2>
                <span className="text-xs font-mono-data bg-[#262a35] px-2 py-0.5 rounded text-[#B2B5BE] border border-[#2A2E39]">
                  {symbol}
                </span>
                <span className="text-xs text-[#8d90a2]">{'exchange' in asset ? asset.exchange : 'Index'}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 font-mono-data">
                <span className="text-2xl font-bold text-white">
                  {formatPrice(activePoint.price, currency)}
                </span>
                <span
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {formatPercent(asset.changePercent)}
                </span>
                <span className="text-xs text-[#8d90a2] hidden sm:inline">
                  {activePoint.time}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-modal-watchlist"
              onClick={() => onToggleWatchlist(asset.id, symbol)}
              className={`p-2 rounded-lg border transition-all ${
                isWatchlisted
                  ? 'bg-[#2962ff]/20 border-[#2962ff] text-[#2962ff]'
                  : 'bg-[#1E222D] border-[#2A2E39] text-[#c3c5d8] hover:text-white'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {isWatchlisted ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
            <button
              id="btn-close-modal"
              onClick={onClose}
              className="p-2 text-[#8d90a2] hover:text-white bg-[#1E222D] hover:bg-[#262a35] border border-[#2A2E39] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-6 space-y-6">
          {/* Chart Controls & Timeframe Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1E222D] p-2 rounded-xl border border-[#2A2E39]">
            {/* Timeframe */}
            <div className="flex items-center gap-1">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    timeframe === tf
                      ? 'bg-[#2962ff] text-white shadow-sm'
                      : 'text-[#c3c5d8] hover:text-white hover:bg-[#262a35]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Mode & Live Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[#171b26] p-1 rounded-lg border border-[#2A2E39]">
                <button
                  onClick={() => setChartMode('line')}
                  className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                    chartMode === 'line' ? 'bg-[#262a35] text-white' : 'text-[#8d90a2]'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartMode('candlestick')}
                  className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                    chartMode === 'candlestick' ? 'bg-[#262a35] text-white' : 'text-[#8d90a2]'
                  }`}
                >
                  Candles
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#089981] font-mono-data">
                <span className="w-2 h-2 rounded-full bg-[#089981] animate-ping" />
                <span>Real-Time</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Area */}
          <div className="bg-[#1b1f2b] border border-[#2A2E39] rounded-xl p-4 relative overflow-hidden">
            <svg
              className="w-full h-[280px]"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                <linearGradient id="chartGradientUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#089981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#089981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartGradientDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F23645" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#F23645" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75].map((pct, i) => {
                const y = paddingY + pct * (svgHeight - paddingY * 2 - volumeHeight);
                const gridPrice = maxPrice - pct * priceRange;
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#2A2E39"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={svgWidth - paddingX}
                      y={y - 4}
                      fill="#8d90a2"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="JetBrains Mono"
                    >
                      {formatPrice(gridPrice, currency)}
                    </text>
                  </g>
                );
              })}

              {/* Volume Bars */}
              {dataPoints.map((d, i) => {
                const barWidth = Math.max(2, (svgWidth - paddingX * 2) / dataPoints.length - 2);
                const x = paddingX + (i / (dataPoints.length - 1)) * (svgWidth - paddingX * 2) - barWidth / 2;
                const barH = (d.volume / maxVolume) * (volumeHeight - 10);
                const y = svgHeight - barH;
                const isBarUp = i > 0 ? d.price >= dataPoints[i - 1].price : true;

                return (
                  <rect
                    key={`vol-${i}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    fill={isBarUp ? 'rgba(8, 153, 129, 0.35)' : 'rgba(242, 54, 69, 0.35)'}
                    rx="1"
                  />
                );
              })}

              {/* Area & Line */}
              {chartMode === 'line' ? (
                <>
                  <path
                    d={areaD}
                    fill={`url(#${isPositive ? 'chartGradientUp' : 'chartGradientDown'})`}
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isPositive ? '#089981' : '#F23645'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                /* Candlestick Mode */
                dataPoints.map((d, i) => {
                  const prevP = i > 0 ? dataPoints[i - 1].price : d.price * 0.995;
                  const candleUp = d.price >= prevP;
                  const x = paddingX + (i / (dataPoints.length - 1)) * (svgWidth - paddingX * 2);
                  const openY = paddingY + (1 - (prevP - minPrice) / priceRange) * (svgHeight - paddingY * 2 - volumeHeight);
                  const closeY = paddingY + (1 - (d.price - minPrice) / priceRange) * (svgHeight - paddingY * 2 - volumeHeight);
                  const highY = Math.min(openY, closeY) - 5;
                  const lowY = Math.max(openY, closeY) + 5;
                  const candleColor = candleUp ? '#089981' : '#F23645';

                  return (
                    <g key={`candle-${i}`}>
                      <line x1={x} y1={highY} x2={x} y2={lowY} stroke={candleColor} strokeWidth="1" />
                      <rect
                        x={x - 3}
                        y={Math.min(openY, closeY)}
                        width="6"
                        height={Math.max(3, Math.abs(closeY - openY))}
                        fill={candleColor}
                        rx="1"
                      />
                    </g>
                  );
                })
              )}

              {/* Hover Crosshair */}
              {dataPoints.map((d, i) => {
                const x = paddingX + (i / (dataPoints.length - 1)) * (svgWidth - paddingX * 2);
                const y = paddingY + (1 - (d.price - minPrice) / priceRange) * (svgHeight - paddingY * 2 - volumeHeight);

                return (
                  <g
                    key={`hover-${i}`}
                    onMouseEnter={() => setHoveredIndex(i)}
                    className="cursor-crosshair"
                  >
                    <rect
                      x={x - (svgWidth / dataPoints.length) / 2}
                      y={0}
                      width={svgWidth / dataPoints.length}
                      height={svgHeight}
                      fill="transparent"
                    />
                    {hoveredIndex === i && (
                      <>
                        <line
                          x1={x}
                          y1={0}
                          x2={x}
                          y2={svgHeight}
                          stroke="#2962ff"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#2962ff"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover tooltip info */}
            {hoveredIndex !== null && (
              <div className="absolute top-4 left-4 bg-[#0f131e]/90 border border-[#2962ff] px-3 py-1.5 rounded-lg shadow-lg text-xs font-mono-data flex items-center gap-3">
                <span className="text-[#8d90a2]">{dataPoints[hoveredIndex].time}</span>
                <span className="text-white font-bold">{formatPrice(dataPoints[hoveredIndex].price, currency)}</span>
                <span className="text-[#B2B5BE]">Vol: {(dataPoints[hoveredIndex].volume / 1000000).toFixed(1)}M</span>
              </div>
            )}
          </div>

          {/* Key Financial Statistics & Range */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#1E222D] p-3.5 rounded-xl border border-[#2A2E39]">
              <div className="text-[11px] text-[#B2B5BE] uppercase font-mono tracking-wider">Day Range</div>
              <div className="text-sm font-semibold font-mono-data mt-1 text-white">
                {formatPrice('low24h' in asset ? asset.low24h : minPrice, currency)} - {formatPrice('high24h' in asset ? asset.high24h : maxPrice, currency)}
              </div>
              <div className="w-full bg-[#0f131e] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#2962ff] h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.max(10, ((price - minPrice) / priceRange) * 100))}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-[#1E222D] p-3.5 rounded-xl border border-[#2A2E39]">
              <div className="text-[11px] text-[#B2B5BE] uppercase font-mono tracking-wider">52W Range</div>
              <div className="text-sm font-semibold font-mono-data mt-1 text-white">
                {formatPrice('week52Low' in asset && asset.week52Low ? asset.week52Low : minPrice * 0.8, currency)} - {formatPrice('week52High' in asset && asset.week52High ? asset.week52High : maxPrice * 1.2, currency)}
              </div>
              <div className="text-[10px] text-[#8d90a2] mt-1">Yearly High/Low</div>
            </div>

            <div className="bg-[#1E222D] p-3.5 rounded-xl border border-[#2A2E39]">
              <div className="text-[11px] text-[#B2B5BE] uppercase font-mono tracking-wider">Market Cap / Vol</div>
              <div className="text-sm font-semibold font-mono-data mt-1 text-white">
                {'marketCap' in asset && asset.marketCap ? `$${asset.marketCap}` : 'volume' in asset ? asset.volume : 'High'}
              </div>
              <div className="text-[10px] text-[#8d90a2] mt-1">P/E: {'peRatio' in asset && asset.peRatio ? asset.peRatio : 'N/A'}</div>
            </div>

            <div className="bg-[#1E222D] p-3.5 rounded-xl border border-[#2A2E39]">
              <div className="text-[11px] text-[#B2B5BE] uppercase font-mono tracking-wider">Technical Signal</div>
              <div className="flex items-center gap-1.5 text-sm font-semibold font-mono-data mt-1 text-[#089981]">
                <Activity className="w-4 h-4" />
                <span>Strong Buy</span>
              </div>
              <div className="text-[10px] text-[#8d90a2] mt-1">RSI: 58.4 (Bullish)</div>
            </div>
          </div>

          {/* Paper Trading Simulation Bar */}
          <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#2962ff]/20 text-[#2962ff]">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Simulated Paper Trading</h4>
                  <p className="text-xs text-[#B2B5BE]">Test market strategies with real-time quotes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center bg-[#0f131e] border border-[#2A2E39] rounded-lg px-2 py-1">
                  <span className="text-xs text-[#8d90a2] mr-2">Qty:</span>
                  <input
                    type="number"
                    min="1"
                    value={shares}
                    onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 bg-transparent text-xs font-mono-data text-white focus:outline-none"
                  />
                </div>

                <button
                  id="btn-trade-buy"
                  onClick={() => handleExecuteOrder('BUY')}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#089981] hover:bg-[#067a67] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Buy {symbol}
                </button>

                <button
                  id="btn-trade-sell"
                  onClick={() => handleExecuteOrder('SELL')}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#F23645] hover:bg-[#d42231] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Sell {symbol}
                </button>
              </div>
            </div>

            {orderExecuted && (
              <div className="mt-3 p-3 bg-[#089981]/15 border border-[#089981]/40 rounded-lg flex items-center gap-2 text-xs text-[#089981] animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{orderExecuted}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
