// Currency, percentage, and time formatters

export const formatPrice = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '₹--';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(val);
};

export const formatPercent = (val, showSign = true) => {
  if (val === null || val === undefined || isNaN(val)) return '0.0%';
  const num = Number(val);
  const sign = num > 0 && showSign ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
};

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'recently';
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${diffDay}d ago`;
};

export const formatDuration = (awayDuration) => {
  if (!awayDuration) return 'a brief while';
  const parts = [];
  if (awayDuration.days > 0) {
    parts.push(`${awayDuration.days} day${awayDuration.days > 1 ? 's' : ''}`);
  }
  if (awayDuration.hours > 0 || parts.length === 0) {
    parts.push(`${awayDuration.hours || 0} hour${awayDuration.hours !== 1 ? 's' : ''}`);
  }
  return parts.join(', ');
};
