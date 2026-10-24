import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateWithdrawalFee, validateWithdrawal } from '../utils/campaignLogic';

export function EarningsView() {
  const {
    availableBalance,
    onHoldBalance,
    verifyingBalance,
    paidOutTotal,
    payoutHistory,
    campaignStats,
    userProfile,
    withdraw,
    navigate,
  } = useApp();

  const [selectedRange, setSelectedRange] = useState<7 | 14 | 30>(30);
  const [withdrawAmountInput, setWithdrawAmountInput] = useState<string>(
    availableBalance >= 50 ? availableBalance.toFixed(2) : '50.00'
  );
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    userProfile.payoutMethods[0]?.id || ''
  );

  // Withdraw dialog states: 'idle' | 'confirm' | 'success'
  const [withdrawState, setWithdrawState] = useState<'idle' | 'confirm' | 'success'>('idle');
  const [validationError, setValidationError] = useState('');
  const [withdrawSuccessDetails, setWithdrawSuccessDetails] = useState<{
    amount: number;
    fee: number;
    net: number;
    methodName: string;
    arrival: string;
  } | null>(null);

  const selectedMethod =
    userProfile.payoutMethods.find(m => m.id === selectedMethodId) ||
    userProfile.payoutMethods[0];

  const parsedAmount = parseFloat(withdrawAmountInput) || 0;
  const currentFee = selectedMethod ? calculateWithdrawalFee(parsedAmount, selectedMethod.type) : 0;
  const netWithdrawal = Math.max(0, parsedAmount - currentFee);
  const arrivalDateText = selectedMethod?.type === 'card' ? 'Within minutes' : 'Friday, Oct 30';

  const handleQuickPercent = (factor: number) => {
    const val = Math.round(availableBalance * factor * 100) / 100;
    setWithdrawAmountInput(val.toFixed(2));
    setValidationError('');
  };

  const handleOpenConfirm = () => {
    if (!selectedMethod) {
      setValidationError('Please connect a payout method in Settings > Payment.');
      return;
    }
    const val = validateWithdrawal(parsedAmount, availableBalance, userProfile.minPayout);
    if (!val.valid) {
      setValidationError(val.error || 'Invalid amount');
      return;
    }
    setValidationError('');
    setWithdrawState('confirm');
  };

  const handleExecuteWithdrawal = () => {
    if (!selectedMethod) return;
    const res = withdraw(parsedAmount, selectedMethod.id);
    if (!res.success) {
      setValidationError(res.error || 'Withdrawal failed');
      setWithdrawState('idle');
      return;
    }

    setWithdrawSuccessDetails({
      amount: parsedAmount,
      fee: currentFee,
      net: netWithdrawal,
      methodName: `${selectedMethod.name} (•••• ${selectedMethod.last4})`,
      arrival: arrivalDateText,
    });
    setWithdrawState('success');
  };

  // Stacked Bar Chart computation for 7D/14D/30D
  const rangeDays = selectedRange;
  const barData = Array.from({ length: rangeDays }, (_, i) => {
    const tempo = Math.max(0.6, 1.4 + 0.9 * Math.sin(i * 0.5) + (i / rangeDays) * 0.7);
    const margin = Math.max(0.4, 1.1 + 0.6 * Math.cos(i * 0.6) + (i / rangeDays) * 0.5);
    const tavern = Math.max(0.2, 0.7 + 0.5 * Math.sin(i * 0.7 + 1));
    const total = tempo + margin + tavern;
    return { tempo, margin, tavern, total, dayIndex: i + 1 };
  });

  const maxDailyTotal = Math.max(...barData.map(d => d.total));
  const rangeDeltaText =
    selectedRange === 7
      ? '+8.2% vs previous 7 days'
      : selectedRange === 14
      ? '+14.6% vs previous 14 days'
      : '+21.4% vs previous 30 days';

  const totalEarnedInPeriod =
    selectedRange === 7 ? 48.6 : selectedRange === 14 ? 92.4 : 170.5;

  return (
    <div className="w-full">
      {/* Two-Column Grid: Main (fluid) + Right Rail (320px, 360px above 1680px) with 40px gap */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] [@media(min-width:1680px)]:grid-cols-[minmax(0,1fr)_360px] gap-10 items-start">
        {/* MAIN COLUMN (Fluid) */}
        <div className="space-y-8 min-w-0">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#181818]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F4F2EC]">
                Earnings
              </h1>
              <div className="text-xs text-[#9C9A92] mt-1">
                Verified installs & revenue share from connected apps
              </div>
            </div>

            {/* Range Toggle 7D / 14D / 30D */}
            <div className="flex items-center gap-1 bg-[#121212] p-1 rounded-xl border border-[#222222]">
              {[7, 14, 30].map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRange(r as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    selectedRange === r
                      ? 'bg-[#1F1F1F] text-[#F4F2EC] shadow-sm'
                      : 'text-[#9C9A92] hover:text-[#F4F2EC]'
                  }`}
                >
                  {r}D
                </button>
              ))}
            </div>
          </div>

          {/* Hero Balance Summary */}
          <div className="bg-[#0A0A0A] border border-[#1a1a1a] rounded-2xl p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#9C9A92] font-medium">
                  Total Earned ({selectedRange}D)
                </span>
                <div className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#F4F2EC] mt-1.5 tabular-nums">
                  ${totalEarnedInPeriod.toFixed(2)}
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#C9B8FF] bg-[#C9B8FF]/10 px-2.5 py-1 rounded-full self-start sm:self-auto font-medium">
                <i className="ti ti-trending-up" />
                <span>{rangeDeltaText}</span>
              </div>
            </div>

            {/* Stacked Bar Chart at full width */}
            <div className="mt-8">
              <div className="h-44 sm:h-52 flex items-end gap-1 sm:gap-2 pb-2">
                {barData.map((d, idx) => {
                  const tempoHeight = (d.tempo / maxDailyTotal) * 100;
                  const marginHeight = (d.margin / maxDailyTotal) * 100;
                  const tavernHeight = (d.tavern / maxDailyTotal) * 100;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col justify-end h-full group relative cursor-pointer"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#181818] border border-[#2a2a2a] text-[#F4F2EC] text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 tabular-nums">
                        Day {d.dayIndex}: ${d.total.toFixed(2)}
                      </div>
                      <div
                        style={{ height: `${tempoHeight}%` }}
                        className="w-full bg-[#F4F2EC] rounded-t-[2px] transition-all group-hover:brightness-110"
                      />
                      <div
                        style={{ height: `${marginHeight}%` }}
                        className="w-full bg-[#9C9A92] transition-all group-hover:brightness-110"
                      />
                      <div
                        style={{ height: `${tavernHeight}%` }}
                        className="w-full bg-[#454442] rounded-b-[2px] transition-all group-hover:brightness-110"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-6 text-xs text-[#9C9A92] pt-4 border-t border-[#181818] flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#F4F2EC]" />
                  <span>Tempo Run</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#9C9A92]" />
                  <span>Margin</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#454442]" />
                  <span>Tile Tavern</span>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE 1: "By campaign" (rows open campaign page) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-[#F4F2EC] tracking-tight">By campaign</h2>
              <span className="text-xs text-[#9C9A92]">Click row to view details</span>
            </div>

            <div className="border border-[#1a1a1a] rounded-2xl overflow-hidden bg-[#0A0A0A]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#181818] text-[#9C9A92] text-[11px] uppercase tracking-wider bg-[#0E0E0E]">
                      <th className="py-3 px-4 font-medium">Campaign</th>
                      <th className="py-3 px-4 font-medium text-right">Installs</th>
                      <th className="py-3 px-4 font-medium text-right">Earned</th>
                      <th className="py-3 px-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161616]">
                    {campaignStats.map(stat => (
                      <tr
                        key={stat.campaignId}
                        onClick={() => navigate('campaign', stat.campaignId)}
                        className="hover:bg-[#121212] transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-medium text-[#F4F2EC] group-hover:text-white flex items-center gap-2">
                          <span>{stat.campaignName}</span>
                          <i className="ti ti-arrow-up-right text-xs text-[#9C9A92] group-hover:text-[#C9B8FF] transition-colors" />
                        </td>
                        <td className="py-3.5 px-4 text-right text-[#C8C6BE] tabular-nums">
                          {stat.installs}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-[#F4F2EC] tabular-nums">
                          ${stat.earned.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                              stat.status === 'active'
                                ? 'bg-[#C9B8FF]/15 text-[#C9B8FF]'
                                : 'bg-[#222222] text-[#9C9A92]'
                            }`}
                          >
                            {stat.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* TABLE 2: "Payout history" */}
          <div className="space-y-3">
            <h2 className="text-lg font-medium text-[#F4F2EC] tracking-tight">Payout history</h2>
            <div className="border border-[#1a1a1a] rounded-2xl overflow-hidden bg-[#0A0A0A]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#181818] text-[#9C9A92] text-[11px] uppercase tracking-wider bg-[#0E0E0E]">
                      <th className="py-3 px-4 font-medium">Date</th>
                      <th className="py-3 px-4 font-medium">Description</th>
                      <th className="py-3 px-4 font-medium">Destination</th>
                      <th className="py-3 px-4 font-medium text-right">Amount</th>
                      <th className="py-3 px-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161616]">
                    {payoutHistory.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-[#121212] transition-colors">
                        <td className="py-3.5 px-4 text-[#9C9A92] whitespace-nowrap">{item.date}</td>
                        <td className="py-3.5 px-4 font-medium text-[#F4F2EC]">{item.description}</td>
                        <td className="py-3.5 px-4 text-[#C8C6BE] text-xs">{item.method}</td>
                        <td className="py-3.5 px-4 text-right font-medium text-[#F4F2EC] tabular-nums whitespace-nowrap">
                          ${item.amount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                              item.status === 'Paid'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : item.status === 'Processing'
                                ? 'bg-[#C9B8FF]/20 text-[#C9B8FF]'
                                : 'bg-red-500/15 text-red-400'
                            }`}
                          >
                            {item.status === 'Processing' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C9B8FF] animate-pulse" />
                            )}
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT RAIL (320px, 360px above 1680px, sticky top-6) */}
        <div className="space-y-6 lg:sticky lg:top-6 min-w-0">
          {/* Vertical Balances List */}
          <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-3.5">
            <div className="text-xs font-semibold text-[#9C9A92] uppercase tracking-wider pb-1 border-b border-[#181818]">
              Balances Breakdown
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs text-[#9C9A92]">Available to withdraw</div>
                <div className="text-xl font-medium text-[#F4F2EC] mt-0.5 tabular-nums">
                  ${availableBalance.toFixed(2)}
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-[#141414]">
              <div>
                <div className="text-xs text-[#9C9A92]">On hold (7-day clearing)</div>
                <div className="text-sm font-medium text-[#C8C6BE] mt-0.5 tabular-nums">
                  ${onHoldBalance.toFixed(2)}
                </div>
              </div>
              <i className="ti ti-clock text-[#9C9A92] text-xs" />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-[#141414]">
              <div>
                <div className="text-xs text-[#9C9A92]">Verifying (fraud filter)</div>
                <div className="text-sm font-medium text-[#C8C6BE] mt-0.5 tabular-nums">
                  ${verifyingBalance.toFixed(2)}
                </div>
              </div>
              <i className="ti ti-shield-check text-[#C9B8FF] text-xs" />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-[#141414]">
              <div>
                <div className="text-xs text-[#9C9A92]">Total paid out</div>
                <div className="text-sm font-medium text-[#9C9A92] mt-0.5 tabular-nums">
                  ${paidOutTotal.toFixed(2)}
                </div>
              </div>
              <i className="ti ti-check text-[#9C9A92] text-xs" />
            </div>

            <div className="text-[11px] text-[#9C9A92] pt-2 border-t border-[#181818] flex items-center justify-between">
              <span>Next automatic settlement:</span>
              <span className="text-[#F4F2EC] font-medium">Friday, Oct 30</span>
            </div>
          </div>

          {/* Withdraw Panel */}
          <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#F4F2EC]">Withdraw funds</h3>
              <span className="text-[11px] text-[#9C9A92]">Min. ${userProfile.minPayout}</span>
            </div>

            {/* Destination Selector from Settings */}
            <div>
              <label className="text-[11px] text-[#9C9A92] block mb-1.5">Destination</label>
              {userProfile.payoutMethods.length === 0 ? (
                <div className="p-3 rounded-xl border border-dashed border-[#333333] text-center">
                  <p className="text-xs text-[#9C9A92] mb-2">No payout method linked</p>
                  <button
                    onClick={() => navigate('settings', undefined, 'payment')}
                    className="text-xs text-[#C9B8FF] underline font-medium"
                  >
                    Connect in Settings &gt; Payment
                  </button>
                </div>
              ) : (
                <select
                  value={selectedMethodId}
                  onChange={e => setSelectedMethodId(e.target.value)}
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                >
                  {userProfile.payoutMethods.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} (•••• {m.last4}) {m.isDefault ? '· Default' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#9C9A92] mb-1.5">
                <span>Amount</span>
                <span className="tabular-nums">Max: ${availableBalance.toFixed(2)}</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9C9A92]">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={withdrawAmountInput}
                  onChange={e => {
                    setWithdrawAmountInput(e.target.value);
                    setValidationError('');
                  }}
                  placeholder="50.00"
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl pl-7 pr-3 py-2 text-sm font-medium text-[#F4F2EC] outline-none focus:border-[#C9B8FF] tabular-nums"
                />
              </div>

              {/* Quick Percent Buttons */}
              <div className="flex gap-1.5 mt-2">
                {[
                  { label: '25%', factor: 0.25 },
                  { label: '50%', factor: 0.5 },
                  { label: '75%', factor: 0.75 },
                  { label: 'Max', factor: 1.0 },
                ].map(b => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => handleQuickPercent(b.factor)}
                    className="flex-1 py-1 rounded-lg bg-[#141414] border border-[#222222] text-[10px] text-[#9C9A92] hover:text-[#F4F2EC] hover:bg-[#1a1a1a] transition-colors"
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary details */}
            <div className="space-y-1.5 pt-2 border-t border-[#161616] text-xs">
              <div className="flex justify-between text-[#9C9A92]">
                <span>Platform fee ({selectedMethod?.type === 'card' ? '1%' : '0%'})</span>
                <span className="tabular-nums">${currentFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-[#F4F2EC]">
                <span>Net payout</span>
                <span className="tabular-nums text-[#C9B8FF]">${netWithdrawal.toFixed(2)}</span>
              </div>
            </div>

            {/* Error Message */}
            {validationError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
                {validationError}
              </div>
            )}

            {/* Withdraw CTA */}
            {userProfile.payoutMethods.length === 0 ? (
              <button
                type="button"
                onClick={() => navigate('settings', undefined, 'payment')}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#181818] border border-[#2a2a2a] text-[#C9B8FF] hover:bg-[#202020] transition-colors"
              >
                Link payout method in Settings
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenConfirm}
                disabled={availableBalance < userProfile.minPayout || parsedAmount < userProfile.minPayout}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  availableBalance >= userProfile.minPayout && parsedAmount >= userProfile.minPayout
                    ? 'bg-[#F4F2EC] text-[#000000] hover:bg-white cursor-pointer'
                    : 'bg-[#181818] text-[#666666] border border-[#222222] cursor-not-allowed'
                }`}
              >
                Withdraw ${parsedAmount > 0 ? parsedAmount.toFixed(2) : '0.00'}
              </button>
            )}

            <div className="text-[11px] text-center text-[#9C9A92]">
              Need to change accounts?{' '}
              <button
                onClick={() => navigate('settings', undefined, 'payment')}
                className="text-[#C9B8FF] hover:underline"
              >
                Payment Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM DIALOG (position: fixed) */}
      {withdrawState === 'confirm' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setWithdrawState('idle')}
        >
          <div
            className="w-full max-w-md bg-[#0C0C0C] border border-[#222222] rounded-2xl p-6 shadow-2xl space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
              <h3 className="font-semibold text-base text-[#F4F2EC]">Confirm Withdrawal</h3>
              <button
                onClick={() => setWithdrawState('idle')}
                className="text-[#9C9A92] hover:text-[#F4F2EC] p-1"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1 text-[#9C9A92]">
                <span>Gross Amount:</span>
                <span className="font-medium text-[#F4F2EC] tabular-nums">${parsedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-[#9C9A92]">
                <span>Processing Fee:</span>
                <span className="font-medium text-[#F4F2EC] tabular-nums">${currentFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-[#9C9A92]">
                <span>Destination:</span>
                <span className="font-medium text-[#F4F2EC]">
                  {selectedMethod?.name} (•••• {selectedMethod?.last4})
                </span>
              </div>
              <div className="flex justify-between py-1 text-[#9C9A92]">
                <span>Estimated Arrival:</span>
                <span className="font-medium text-[#C9B8FF]">{arrivalDateText}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-[#181818] font-semibold text-base text-[#F4F2EC]">
                <span>Net Transfer:</span>
                <span className="text-[#C9B8FF] tabular-nums">${netWithdrawal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWithdrawState('idle')}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#161616]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteWithdrawal}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white shadow-md font-medium"
              >
                Authorize &amp; Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS DIALOG (position: fixed) */}
      {withdrawState === 'success' && withdrawSuccessDetails && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setWithdrawState('idle')}
        >
          <div
            className="w-full max-w-md bg-[#0C0C0C] border border-[#222222] rounded-2xl p-6 shadow-2xl text-center space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#C9B8FF]/15 border border-[#C9B8FF]/30 text-[#C9B8FF] flex items-center justify-center mx-auto text-xl">
              <i className="ti ti-check" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-medium text-[#F4F2EC]">Transfer Initiated</h3>
              <p className="text-xs text-[#9C9A92] mt-1">
                Your settlement is scheduled and processing.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#222222] rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between text-[#9C9A92]">
                <span>Net Amount:</span>
                <span className="text-[#F4F2EC] font-semibold tabular-nums">
                  ${withdrawSuccessDetails.net.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[#9C9A92]">
                <span>Sent to:</span>
                <span className="text-[#F4F2EC]">{withdrawSuccessDetails.methodName}</span>
              </div>
              <div className="flex justify-between text-[#9C9A92]">
                <span>Arrival:</span>
                <span className="text-[#C9B8FF] font-medium">{withdrawSuccessDetails.arrival}</span>
              </div>
              <div className="flex justify-between text-[#9C9A92]">
                <span>Status:</span>
                <span className="text-[#C9B8FF] font-medium">Processing</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWithdrawState('idle')}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
