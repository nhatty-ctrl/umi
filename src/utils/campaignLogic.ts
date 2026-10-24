/**
 * Pure business logic for umi calculations, filtering, and validation
 */

export interface Campaign {
  id: string;
  name: string;
  b: string;
  tag: string;
  cat: string;
  host: string;
  bg: string;
  fg: string;
  ic: string;
  days: number;
  n: number;
  price: string;
  end: string;
  d: string;
  d2: string;
  mine?: number;
}

export function calculateRunway(deposit: number, spent: number, ratePerDay: number) {
  const remaining = Math.max(0, deposit - spent);
  const daysLeft = ratePerDay > 0 ? Math.floor(remaining / ratePerDay) : 0;
  return {
    remaining,
    daysLeft,
    percentSpent: deposit > 0 ? Math.min(100, (spent / deposit) * 100) : 0,
  };
}

export function calculateWithdrawalFee(amount: number, method: 'bank' | 'card'): number {
  if (method === 'card') {
    return Math.round(amount * 0.01 * 100) / 100;
  }
  return 0;
}

export function validateWithdrawal(
  amount: number,
  availableBalance: number,
  minimumPayout: number = 50
): { valid: boolean; error?: string } {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Enter a valid withdrawal amount' };
  }
  if (amount > availableBalance + 0.001) {
    return { valid: false, error: 'That’s more than your available balance' };
  }
  if (amount < minimumPayout) {
    return { valid: false, error: `Minimum withdrawal is $${minimumPayout.toFixed(2)}` };
  }
  return { valid: true };
}

export function filterCampaigns(
  campaigns: Campaign[],
  options: {
    tab: 'discover' | 'joined' | 'hosting';
    category: string;
    sort: number; // 0: newest/default, 1: highest reward
    joinedMap: Record<string, number>;
  }
): Campaign[] {
  const { tab, category, sort, joinedMap } = options;

  let filtered = campaigns.filter(k => {
    if (tab === 'hosting') return !!k.mine;
    if (k.mine) return false;
    if (tab === 'joined') return !!joinedMap[k.id];
    return true;
  });

  if (tab === 'discover' && category !== 'All') {
    filtered = filtered.filter(k => k.cat === category);
  }

  if (tab === 'discover' && sort === 1) {
    filtered = [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  return filtered;
}
