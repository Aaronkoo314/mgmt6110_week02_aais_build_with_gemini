export function formatPrice(price: number, currency: string = '$'): string {
  if (currency === '%') {
    return `${price.toFixed(2)}%`;
  }
  if (currency === 'pts') {
    return `${price.toFixed(2)}`;
  }
  
  if (price >= 1000) {
    return `${currency}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (price < 10) {
    return `${currency}${price.toFixed(price < 2 ? 4 : 2)}`;
  }
  return `${currency}${price.toFixed(2)}`;
}

export function formatPercent(val: number): string {
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
}

export function generateSparklinePath(points: number[], width: number = 60, height: number = 20): string {
  if (!points || points.length === 0) return '';
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const padding = 2;
  const usableHeight = height - padding * 2;
  const stepX = width / (points.length - 1);

  return points
    .map((val, idx) => {
      const x = (idx * stepX).toFixed(1);
      // Flip Y because SVG 0 is top
      const normalized = (val - min) / range;
      const y = (height - padding - normalized * usableHeight).toFixed(1);
      return `${idx === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}

export function generateHistoricalPoints(basePrice: number, days: number = 30) {
  const points: { time: string; price: number; volume: number }[] = [];
  let current = basePrice * 0.92;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = days; i >= 0; i--) {
    const time = new Date(now - i * dayMs).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const delta = (Math.random() - 0.48) * (basePrice * 0.025);
    current = Math.max(basePrice * 0.5, current + delta);
    points.push({
      time,
      price: Number(current.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000 + 1000000),
    });
  }
  // Ensure last point is exactly close to current price
  points[points.length - 1].price = basePrice;
  return points;
}
