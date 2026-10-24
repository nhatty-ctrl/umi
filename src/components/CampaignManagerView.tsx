import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_DUNE_CREATORS, INITIAL_INVOICES } from '../data/initialData';
import { calculateRunway } from '../utils/campaignLogic';
import {
  ManagerCreator,
  ActivityInvoice,
  CampaignAnnouncement,
  CampaignBonusTier,
  ApiKeyItem,
} from '../types';

export function CampaignManagerView() {
  const {
    navigate,
    creatorRequests,
    approveCreatorRequest,
    declineCreatorRequest,
    addNotification,
  } = useApp();

  // 6 Tabs: Creators, Updates, Payments, Analytics, Developers, Settings
  const [activeTab, setActiveTab] = useState<'cr' | 'up' | 'pm' | 'an' | 'dv' | 'se'>('cr');

  // Campaign Financial State
  const [deposit, setDeposit] = useState<number>(500);
  const [spent, setSpent] = useState<number>(315.5);
  const [dailyRate] = useState<number>(20.7);

  // Creators list state
  const [creators, setCreators] = useState<ManagerCreator[]>(INITIAL_DUNE_CREATORS);
  const [sortField, setSortField] = useState<'i' | 'q' | 'n'>('i');
  const [creatorLimit, setCreatorLimit] = useState<number>(5);
  const [expandedCreatorId, setExpandedCreatorId] = useState<number | null>(null);

  // Requests state filter
  const [requestFilter, setRequestFilter] = useState<number>(0); // 0=pending, 1=approved, 2=declined

  // Billing & Activity state
  const [invoices, setInvoices] = useState<ActivityInvoice[]>(INITIAL_INVOICES);

  // Announcements State (Updates tab)
  const [announcements, setAnnouncements] = useState<CampaignAnnouncement[]>([
    {
      id: 'ann-1',
      author: 'Founder · Dune Notes',
      date: 'Today, 2:40 PM',
      text: 'v2.4.0 is live on the App Store! Highlights include instant lock-screen widgets and 40% faster note sync. Perfect for tutorial videos.',
      reach: 8,
    },
    {
      id: 'ann-2',
      author: 'Founder · Dune Notes',
      date: 'Oct 14, 10:15 AM',
      text: 'Milestone unlocked: we just passed 500 verified installs! Check out the new performance bonus tiers in Payments.',
      reach: 6,
    },
  ]);
  const [composeText, setComposeText] = useState('');
  const [composeError, setComposeError] = useState('');
  const [announcementToast, setAnnouncementToast] = useState(false);

  // Payments State
  const [stripeStatus, setStripeStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [bonusTiers, setBonusTiers] = useState<CampaignBonusTier[]>([
    { id: 'bt-1', installs: 100, bonusAmount: 25, active: true },
    { id: 'bt-2', installs: 250, bonusAmount: 75, active: true },
    { id: 'bt-3', installs: 500, bonusAmount: 180, active: true },
  ]);
  const [newTierInstalls, setNewTierInstalls] = useState('1000');
  const [newTierBonus, setNewTierBonus] = useState('400');
  const [isAddingTier, setIsAddingTier] = useState(false);

  // Analytics State
  const [analyticsRange, setAnalyticsRange] = useState<'7D' | '30D' | '90D'>('7D');
  const [analyticsMetric, setAnalyticsMetric] = useState<'installs' | 'spend' | 'rate'>('installs');
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);
  const [liveClicks, setLiveClicks] = useState<number>(28);
  const [liveBars, setLiveBars] = useState<number[]>([14, 18, 12, 22, 19, 25, 16, 28, 24, 31, 27, 30]);

  // Developers State
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: 'key-1',
      name: 'Production Server Webhook',
      keyPrefix: 'umi_live_8f7a92b...3c1e',
      created: 'Oct 6, 2026',
      lastUsed: '2 minutes ago',
    },
    {
      id: 'key-2',
      name: 'Mobile SDK Client Key',
      keyPrefix: 'umi_live_5d1e44f...89a2',
      created: 'Oct 6, 2026',
      lastUsed: 'Just now',
    },
  ]);
  const [isNewKeyModalOpen, setIsNewKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKeyItem | null>(null);
  const [testEventToast, setTestEventToast] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Settings State
  const [isPublic, setIsPublic] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [closeApplications, setCloseApplications] = useState(false);
  const [rewardPerInstall, setRewardPerInstall] = useState(0.5);
  const [creatorQrCodes, setCreatorQrCodes] = useState(true);
  const [dailyCapEnabled, setDailyCapEnabled] = useState(false);
  const [dailyCapValue, setDailyCapValue] = useState('200');
  const [isPaused, setIsPaused] = useState(false);
  const [isEndDateModalOpen, setIsEndDateModalOpen] = useState(false);
  const [endDateValue, setEndDateValue] = useState('2026-11-17');

  // End Campaign 2-Step Modal
  const [isEndCampaignOpen, setIsEndCampaignOpen] = useState(false);
  const [confirmCampaignName, setConfirmCampaignName] = useState('');
  const [isCampaignEnded, setIsCampaignEnded] = useState(false);

  // Modals & Share State
  const [isAddDepositOpen, setIsAddDepositOpen] = useState(false);
  const [depositCustomAmount, setDepositCustomAmount] = useState('250');
  const [messagingCreator, setMessagingCreator] = useState<ManagerCreator | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Live simulation ticker for traffic counter in Analytics
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClicks(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(18, Math.min(50, prev + delta));
      });
      setLiveBars(prev => {
        const newBar = Math.floor(Math.random() * 20) + 12;
        return [...prev.slice(1), newBar];
      });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const runway = calculateRunway(deposit, spent, dailyRate);

  const handleAddDeposit = (amount: number) => {
    if (isNaN(amount) || amount <= 0) return;
    setDeposit(prev => prev + amount);
    setInvoices(prev => [
      {
        date: 'Today',
        description: 'Deposit added',
        status: 'Paid',
        amount: amount,
      },
      ...prev,
    ]);
    addNotification({
      title: 'Dune Notes budget',
      subtitle: `+$${amount.toFixed(2)} deposit added`,
      body: `Stripe charged your corporate account. Budget runway extended by ~${Math.round(amount / dailyRate)} days.`,
      targetScreen: 'manager',
      type: 'system',
    });
    setIsAddDepositOpen(false);
  };

  const handleShareLink = () => {
    navigator.clipboard?.writeText('https://umi.link/dune/amara');
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messagingCreator || !messageText.trim()) return;
    addNotification({
      title: `Message sent to ${messagingCreator.name}`,
      subtitle: 'Delivered via umi direct',
      body: `"${messageText.trim().slice(0, 70)}..."`,
      targetScreen: 'manager',
      type: 'system',
    });
    setMessageText('');
    setMessagingCreator(null);
  };

  // Broadcast Announcement
  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeText.trim()) {
      setComposeError('Please enter an announcement message.');
      return;
    }
    setComposeError('');
    const newAnn: CampaignAnnouncement = {
      id: `ann-${Date.now()}`,
      author: 'Founder · Dune Notes',
      date: 'Just now',
      text: composeText.trim(),
      reach: creators.length,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setComposeText('');
    setAnnouncementToast(true);
    setTimeout(() => setAnnouncementToast(false), 2500);

    addNotification({
      title: 'Dune Notes announcement',
      subtitle: 'Broadcast sent',
      body: `Announcement delivered to ${creators.length} approved creators.`,
      targetScreen: 'manager',
      type: 'system',
    });
  };

  // Add Bonus Tier
  const handleAddBonusTier = (e: React.FormEvent) => {
    e.preventDefault();
    const inst = parseInt(newTierInstalls, 10);
    const bon = parseFloat(newTierBonus);
    if (isNaN(inst) || isNaN(bon) || inst <= 0 || bon <= 0) return;

    setBonusTiers(prev => [
      ...prev,
      {
        id: `bt-${Date.now()}`,
        installs: inst,
        bonusAmount: bon,
        active: true,
      },
    ]);
    setIsAddingTier(false);
    setNewTierInstalls('');
    setNewTierBonus('');
  };

  // Send Test Event in Developers Tab
  const handleSendTestEvent = () => {
    setSpent(prev => prev + rewardPerInstall);
    setTestEventToast(true);
    setTimeout(() => setTestEventToast(false), 3000);

    addNotification({
      title: 'SDK Test Event',
      subtitle: 'Verified install registered',
      body: 'Device verified via App Store receipt. Token logged as valid.',
      targetScreen: 'manager',
      type: 'install',
    });
  };

  // Generate API Key
  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const randomHex = Math.random().toString(36).substring(2, 8);
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      keyPrefix: `umi_live_${randomHex}...${Math.random().toString(36).substring(2, 6)}`,
      created: 'Today',
      lastUsed: 'Never',
    };
    setApiKeys(prev => [newKey, ...prev]);
    setNewKeyName('');
    setIsNewKeyModalOpen(false);
  };

  // Revoke Key
  const handleRevokeKey = () => {
    if (!keyToRevoke) return;
    setApiKeys(prev => prev.filter(k => k.id !== keyToRevoke.id));
    setKeyToRevoke(null);
  };

  // End Campaign Action
  const handleConfirmEndCampaign = () => {
    if (confirmCampaignName.trim().toLowerCase() !== 'dune notes') return;
    setIsCampaignEnded(true);
    setIsEndCampaignOpen(false);
    addNotification({
      title: 'Dune Notes ended',
      subtitle: 'Campaign archived',
      body: `Campaign was closed. Remaining escrow of $${runway.remaining.toFixed(2)} refunded to your Stripe account.`,
      targetScreen: 'campaigns',
      type: 'system',
    });
    setTimeout(() => {
      navigate('campaigns');
    }, 1200);
  };

  // Sorting creators
  const sortedCreators = [...creators].sort((a, b) => {
    if (sortField === 'i') return b.installs - a.installs;
    if (sortField === 'q') return b.quality - a.quality;
    return b.id - a.id;
  });
  const visibleCreators = sortedCreators.slice(0, creatorLimit);

  // Dune Requests & Pending count
  const duneRequests = creatorRequests;
  const pendingRequestsCount = duneRequests.filter(r => r.status === 0).length;

  // Chart data setup for Analytics tab
  const chartDatasets = useMemo(() => {
    const data7 = {
      installs: [32, 45, 38, 52, 48, 64, 48],
      spend: [16, 22.5, 19, 26, 24, 32, 24],
      rate: [82, 84, 80, 86, 85, 88, 83],
      labels: ['Oct 17', 'Oct 18', 'Oct 19', 'Oct 20', 'Oct 21', 'Oct 22', 'Today'],
    };
    const data30 = {
      installs: [
        18, 22, 25, 30, 28, 35, 40, 38, 42, 45, 40, 48, 50, 46, 52, 55, 49, 58, 62, 59, 64, 60,
        65, 70, 68, 72, 75, 71, 78, 48,
      ],
      spend: [
        9, 11, 12.5, 15, 14, 17.5, 20, 19, 21, 22.5, 20, 24, 25, 23, 26, 27.5, 24.5, 29, 31, 29.5,
        32, 30, 32.5, 35, 34, 36, 37.5, 35.5, 39, 24,
      ],
      rate: [
        78, 80, 79, 81, 80, 82, 83, 82, 84, 85, 83, 84, 85, 84, 86, 85, 86, 87, 86, 88, 87, 86,
        88, 89, 87, 88, 89, 88, 90, 83,
      ],
      labels: Array.from({ length: 30 }, (_, i) => `Oct ${i + 1}`),
    };
    const data90 = {
      installs: [
        12, 16, 15, 20, 24, 28, 32, 35, 40, 45, 48, 52, 58, 60, 65, 72, 70, 75, 80, 85, 82, 88,
        92, 95, 90, 98, 102, 105, 110, 48,
      ],
      spend: [
        6, 8, 7.5, 10, 12, 14, 16, 17.5, 20, 22.5, 24, 26, 29, 30, 32.5, 36, 35, 37.5, 40, 42.5,
        41, 44, 46, 47.5, 45, 49, 51, 52.5, 55, 24,
      ],
      rate: [
        75, 76, 75, 78, 80, 79, 81, 82, 83, 84, 83, 85, 84, 86, 85, 87, 86, 88, 87, 89, 88, 89,
        90, 89, 90, 91, 90, 91, 92, 83,
      ],
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i * 3 + 1}`),
    };
    return { '7D': data7, '30D': data30, '90D': data90 };
  }, []);

  const currentDataset = chartDatasets[analyticsRange];
  const currentValues = currentDataset[analyticsMetric];
  const maxVal = Math.max(...currentValues) || 1;

  const activeValue =
    scrubIndex !== null && scrubIndex < currentValues.length
      ? currentValues[scrubIndex]
      : currentValues[currentValues.length - 1];

  const activeDate =
    scrubIndex !== null && scrubIndex < currentDataset.labels.length
      ? currentDataset.labels[scrubIndex]
      : currentDataset.labels[currentDataset.labels.length - 1];

  return (
    <div className="w-full space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-[#181818]">
        <button
          onClick={() => navigate('campaigns')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#141414] border border-[#222222] text-[#F4F2EC] hover:bg-[#1a1a1a] transition-colors"
        >
          <i className="ti ti-arrow-left" />
          <span>Back to campaigns</span>
        </button>

        <div className="flex items-center gap-4 text-xs text-[#F4F2EC]">
          <button
            onClick={() => navigate('campaign', 'dune')}
            className="hover:underline underline-offset-4 text-[#F4F2EC] flex items-center gap-1.5"
          >
            <i className="ti ti-external-link text-[13px]" />
            <span>Public preview</span>
          </button>
          <button
            onClick={handleShareLink}
            className="hover:underline underline-offset-4 text-[#F4F2EC] flex items-center gap-1.5"
          >
            <i className="ti ti-link text-[13px]" />
            <span>{shareToast ? 'Link copied!' : 'Share campaign'}</span>
          </button>
        </div>
      </div>

      {/* Two-Column Grid: Fluid Main + Sticky Right Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] [@media(min-width:1680px)]:grid-cols-[minmax(0,1fr)_360px] gap-10 items-start">
        {/* MAIN COLUMN */}
        <div className="min-w-0 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#F4F2EC]">
                  Dune Notes
                </h1>
                {isCampaignEnded ? (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#2a1212] text-[#f09595] border border-[#791e1e]">
                    Ended
                  </span>
                ) : isPaused ? (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#3c0e0e] text-[#f09595] border border-[#791e1e]">
                    Paused
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0f281e] text-[#4ade80] border border-[#1b4332] inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                    Live campaign
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm text-[#9C9A92] mt-1.5">
                Ends Nov 17 · 28 days left · $0.50 per verified install
              </div>
            </div>
          </div>

          {/* 6 Flat Tabs: Creators, Updates, Payments, Analytics, Developers, Settings */}
          <div className="flex gap-6 border-b border-[#1c1c1c] overflow-x-auto no-scrollbar">
            {[
              {
                key: 'cr',
                label: `Creators${pendingRequestsCount > 0 ? ` (${pendingRequestsCount})` : ''}`,
              },
              { key: 'up', label: 'Updates' },
              { key: 'pm', label: 'Payments' },
              { key: 'an', label: 'Analytics' },
              { key: 'dv', label: 'Developers' },
              { key: 'se', label: 'Settings' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
                  activeTab === tab.key
                    ? 'border-[#F4F2EC] text-[#F4F2EC]'
                    : 'border-transparent text-[#9C9A92] hover:text-[#F4F2EC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: CREATORS */}
          {activeTab === 'cr' && (
            <div className="space-y-6 pt-1">
              {/* Creator Requests Section (Pending, Approved, Declined) */}
              <div className="p-5 rounded-2xl border border-[#1f1f1f] bg-[#0c0c0c] space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#F4F2EC]">Creator Applications</h3>
                    {pendingRequestsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#C9B8FF]/15 text-[#C9B8FF]">
                        {pendingRequestsCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#9C9A92]">
                    <button
                      onClick={() => setRequestFilter(0)}
                      className={`transition-colors ${
                        requestFilter === 0
                          ? 'text-[#F4F2EC] underline underline-offset-4 font-medium'
                          : 'hover:text-[#F4F2EC]'
                      }`}
                    >
                      Pending ({duneRequests.filter(r => r.status === 0).length})
                    </button>
                    <button
                      onClick={() => setRequestFilter(1)}
                      className={`transition-colors ${
                        requestFilter === 1
                          ? 'text-[#F4F2EC] underline underline-offset-4 font-medium'
                          : 'hover:text-[#F4F2EC]'
                      }`}
                    >
                      Approved ({duneRequests.filter(r => r.status === 1).length})
                    </button>
                    <button
                      onClick={() => setRequestFilter(2)}
                      className={`transition-colors ${
                        requestFilter === 2
                          ? 'text-[#F4F2EC] underline underline-offset-4 font-medium'
                          : 'hover:text-[#F4F2EC]'
                      }`}
                    >
                      Declined ({duneRequests.filter(r => r.status === 2).length})
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {duneRequests
                    .filter(r => r.status === requestFilter)
                    .map(r => (
                      <div
                        key={r.id}
                        className="p-4 rounded-xl border border-[#1a1a1a] bg-[#080808] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-[#F4F2EC] flex items-center gap-2">
                            <span>{r.n}</span>
                            <span className="text-xs text-[#9C9A92] font-normal">{r.h}</span>
                          </div>
                          <div className="text-xs text-[#9C9A92] mt-1">
                            {r.ch} · {r.past} past campaigns · {r.qual} install quality
                          </div>
                          {r.note && (
                            <p className="text-xs text-[#D6D4CC] mt-2 italic bg-[#101010] p-2.5 rounded-lg border border-[#1a1a1a]">
                              &ldquo;{r.note}&rdquo;
                            </p>
                          )}
                        </div>

                        {requestFilter === 0 ? (
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                            <button
                              onClick={() => approveCreatorRequest(r.id)}
                              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => declineCreatorRequest(r.id)}
                              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#9C9A92] hover:text-[#F4F2EC] hover:bg-[#1a1a1a] transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 self-end sm:self-start ${
                              requestFilter === 1
                                ? 'text-[#C9B8FF] bg-[#C9B8FF]/10 border border-[#C9B8FF]/20'
                                : 'text-[#9C9A92] bg-[#1a1a1a]'
                            }`}
                          >
                            {requestFilter === 1 ? 'Approved' : 'Declined'}
                          </span>
                        )}
                      </div>
                    ))}

                  {duneRequests.filter(r => r.status === requestFilter).length === 0 && (
                    <div className="text-xs text-[#9C9A92] py-6 text-center bg-[#080808] border border-[#181818] rounded-xl">
                      {requestFilter === 0
                        ? 'All caught up. New creator applications will appear here.'
                        : 'No records in this tab.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Tracked Creators List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#9C9A92] flex-wrap gap-2">
                  <span>
                    {creators.length} active creators · 631 verified installs ·{' '}
                    <span className="tabular-nums font-medium text-[#F4F2EC]">$315.50</span> earned
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSortField('i')}
                      className={`transition-colors ${
                        sortField === 'i'
                          ? 'text-[#F4F2EC] underline underline-offset-4'
                          : 'hover:text-[#F4F2EC]'
                      }`}
                    >
                      Installs
                    </button>
                    <button
                      onClick={() => setSortField('q')}
                      className={`transition-colors ${
                        sortField === 'q'
                          ? 'text-[#F4F2EC] underline underline-offset-4'
                          : 'hover:text-[#F4F2EC]'
                      }`}
                    >
                      Quality
                    </button>
                    <button
                      onClick={() => setSortField('n')}
                      className={`transition-colors ${
                        sortField === 'n'
                          ? 'text-[#F4F2EC] underline underline-offset-4'
                          : 'hover:text-[#F4F2EC]'
                      }`}
                    >
                      Newest
                    </button>
                  </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[minmax(0,1fr)_80px_60px] md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)_84px_60px] gap-4 py-2 text-xs text-[#9C9A92] border-b border-[#1c1c1c]">
                  <span>Creator</span>
                  <span className="hidden md:block">Verified installs</span>
                  <span className="text-right">Earned</span>
                  <span className="text-right">Quality</span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-[#181818]">
                  {visibleCreators.map(c => {
                    const isOpen = expandedCreatorId === c.id;
                    const initials = c.name
                      .split(' ')
                      .map(w => w[0])
                      .join('');

                    return (
                      <div key={c.id}>
                        <div
                          onClick={() => setExpandedCreatorId(isOpen ? null : c.id)}
                          className="grid grid-cols-[minmax(0,1fr)_80px_60px] md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)_84px_60px] gap-4 py-3.5 items-center cursor-pointer hover:bg-[#0a0a0a] -mx-2 px-2 rounded-lg transition-colors text-xs sm:text-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-8 h-8 rounded-full border border-[#2a2a2a] bg-[#141414] text-xs flex items-center justify-center shrink-0 text-[#9C9A92] font-medium">
                              {initials}
                            </span>
                            <div className="min-w-0">
                              <div className="font-medium text-[#F4F2EC] truncate">{c.name}</div>
                              <div className="text-[11px] text-[#9C9A92] truncate">
                                {c.platform} · {c.handle}
                              </div>
                            </div>
                          </div>

                          <div className="hidden md:block">
                            <div className="text-xs tabular-nums text-[#F4F2EC] mb-1">
                              {c.installs}
                            </div>
                            <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                              <div
                                style={{ width: `${(c.installs / 214) * 100}%` }}
                                className="h-full bg-[#F4F2EC]"
                              />
                            </div>
                          </div>

                          <div className="text-right tabular-nums text-[#F4F2EC]">
                            ${(c.installs * rewardPerInstall).toFixed(2)}
                          </div>

                          <div className="text-right tabular-nums text-[#F4F2EC]">
                            {c.quality ? `${c.quality}%` : <span className="text-[#9C9A92]">New</span>}
                          </div>
                        </div>

                        {/* Expanded Accordion Details */}
                        {isOpen && (
                          <div className="flex flex-wrap items-center gap-6 py-3 px-4 mb-2 bg-[#0c0c0c] border border-[#1a1a1a] rounded-xl text-xs text-[#9C9A92]">
                            <span>Joined {c.joined}</span>
                            <span>{c.ratePerDay} installs/day</span>
                            <span>Best day {c.bestDay}</span>
                            <div className="ml-auto flex items-center gap-4">
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setMessagingCreator(c);
                                }}
                                className="text-[#F4F2EC] hover:underline"
                              >
                                Message
                              </button>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setCreators(prev => prev.filter(x => x.id !== c.id));
                                }}
                                className="text-[#f09595] hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Show all / Show fewer toggle */}
                <div className="pt-4 border-t border-[#1c1c1c]">
                  <button
                    onClick={() => setCreatorLimit(prev => (prev < 8 ? 8 : 5))}
                    className="text-xs font-semibold underline underline-offset-4 text-[#F4F2EC]"
                  >
                    {creatorLimit < 8 ? 'Show all 8' : 'Show fewer'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPDATES */}
          {activeTab === 'up' && (
            <div className="space-y-6 pt-1">
              {/* Compose Box */}
              <div className="p-6 rounded-2xl border border-[#1f1f1f] bg-[#0c0c0c] space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-[#F4F2EC]">Broadcast to creators</h3>
                  <p className="text-xs text-[#9C9A92] mt-0.5">
                    Send updates, product news, or suggested talking points to all {creators.length} active creators.
                  </p>
                </div>

                <form onSubmit={handlePostAnnouncement} className="space-y-3">
                  <div className="relative">
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={composeText}
                      onChange={e => setComposeText(e.target.value)}
                      placeholder="e.g. New update live! Share your honest feedback on our latest features in your next video..."
                      className="w-full bg-[#141414] border border-[#222222] rounded-xl p-3.5 text-xs text-[#F4F2EC] placeholder-[#666666] outline-none focus:border-[#C9B8FF] transition-colors resize-none leading-relaxed"
                    />
                    <div className="absolute right-3 bottom-3 text-[10px] text-[#777777] tabular-nums">
                      {composeText.length} / 500
                    </div>
                  </div>

                  {composeError && (
                    <div className="text-xs text-[#f09595] flex items-center gap-1.5">
                      <i className="ti ti-alert-circle" />
                      <span>{composeError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#9C9A92] flex items-center gap-1.5">
                      <i className="ti ti-bell text-[13px] text-[#C9B8FF]" />
                      <span>Delivered via in-app push and notification badge</span>
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <i className="ti ti-send" />
                      <span>Post announcement</span>
                    </button>
                  </div>
                </form>

                {announcementToast && (
                  <div className="p-2.5 rounded-lg bg-[#0f281e] border border-[#1b4332] text-xs text-[#4ade80] flex items-center gap-2 animate-in fade-in">
                    <i className="ti ti-circle-check" />
                    <span>Announcement broadcasted to {creators.length} creators!</span>
                  </div>
                )}
              </div>

              {/* Feed of Announcements */}
              <div className="space-y-3">
                <div className="text-xs font-medium text-[#9C9A92] uppercase tracking-wider px-1">
                  Sent Announcements
                </div>

                <div className="space-y-3">
                  {announcements.map(ann => (
                    <div
                      key={ann.id}
                      className="p-5 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-2.5 transition-colors hover:border-[#262626]"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#F4F2EC]">{ann.author}</span>
                          <span className="text-[#777777]">·</span>
                          <span className="text-[#8E8C84]">{ann.date}</span>
                        </div>
                        <span className="text-[11px] text-[#C9B8FF] bg-[#C9B8FF]/10 px-2 py-0.5 rounded-full border border-[#C9B8FF]/20">
                          {ann.reach} recipients
                        </span>
                      </div>
                      <p className="text-xs text-[#D8D6CE] leading-relaxed whitespace-pre-wrap">
                        {ann.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENTS */}
          {activeTab === 'pm' && (
            <div className="space-y-6 pt-1">
              {/* Deposit & Runway */}
              <div className="p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]">
                <div className="text-xs text-[#9C9A92]">Remaining escrow deposit</div>
                <div className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#F4F2EC] mt-1.5 tabular-nums">
                  ${runway.remaining.toFixed(2)}
                </div>
                <div className="text-xs text-[#9C9A92] mt-1 tabular-nums">
                  of ${deposit.toFixed(2)} deposit · ${spent.toFixed(2)} paid to creators
                </div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mt-4 max-w-md">
                  <div
                    style={{ width: `${runway.percentSpent}%` }}
                    className="h-full bg-[#F4F2EC] transition-all duration-300"
                  />
                </div>
                <div className="text-xs text-[#9C9A92] mt-2">
                  At about ${dailyRate.toFixed(2)} a day, this lasts until Oct 29, 19 days before the campaign ends.
                </div>

                {/* Quick Add To Deposit */}
                <div className="flex items-center gap-2 mt-5 flex-wrap">
                  <span className="text-xs text-[#9C9A92] mr-1">Add to deposit:</span>
                  {[100, 250, 500].map(amt => (
                    <button
                      key={amt}
                      onClick={() => handleAddDeposit(amt)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-full border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#1a1a1a] transition-colors tabular-nums"
                    >
                      +${amt}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsAddDepositOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full bg-[#F4F2EC] text-[#000000] hover:bg-white transition-colors"
                  >
                    Custom amount
                  </button>
                </div>
              </div>

              {/* Stripe Connect Card with State Machine */}
              <div className="p-5 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-3">
                <div className="text-xs font-medium text-[#F4F2EC]">Billing account & payouts</div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-[#1f1f1f] bg-[#0c0c0c] flex-wrap gap-3">
                  <div>
                    <div className="font-medium text-sm text-[#F4F2EC] flex items-center gap-2">
                      <span>Stripe Connect</span>
                      {stripeStatus === 'connected' ? (
                        <span className="text-[11px] font-medium text-[#4ade80] flex items-center gap-1">
                          <i className="ti ti-circle-check text-xs" />
                          <span>Connected</span>
                        </span>
                      ) : stripeStatus === 'connecting' ? (
                        <span className="text-[11px] font-medium text-[#C9B8FF] flex items-center gap-1">
                          <i className="ti ti-loader animate-spin text-xs" />
                          <span>Connecting...</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-[#f09595]">Disconnected</span>
                      )}
                    </div>
                    <div className="text-xs text-[#9C9A92] mt-0.5">
                      {stripeStatus === 'connected'
                        ? 'Auto-deposit enabled via corporate banking account.'
                        : 'Connect your corporate account to enable seamless deposits.'}
                    </div>
                  </div>

                  {stripeStatus === 'connected' ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsStripeModalOpen(true)}
                        className="text-xs font-semibold text-[#C9B8FF] hover:underline underline-offset-4"
                      >
                        Manage portal
                      </button>
                      <button
                        onClick={() => setStripeStatus('disconnected')}
                        className="text-xs text-[#9C9A92] hover:text-[#f09595]"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : stripeStatus === 'connecting' ? (
                    <span className="text-xs text-[#9C9A92]">Handshake in progress...</span>
                  ) : (
                    <button
                      onClick={() => {
                        setStripeStatus('connecting');
                        setTimeout(() => setStripeStatus('connected'), 1400);
                      }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white transition-colors"
                    >
                      Connect Stripe
                    </button>
                  )}
                </div>
              </div>

              {/* Performance Bonus Tiers */}
              <div className="p-5 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[#F4F2EC]">Performance Bonuses</div>
                    <p className="text-xs text-[#9C9A92] mt-0.5">
                      Milestone bonuses paid automatically to creators upon hitting verified install targets.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingTier(prev => !prev)}
                    className="text-xs font-semibold text-[#C9B8FF] hover:underline underline-offset-4"
                  >
                    {isAddingTier ? 'Cancel' : '+ Add tier'}
                  </button>
                </div>

                {isAddingTier && (
                  <form
                    onSubmit={handleAddBonusTier}
                    className="p-4 rounded-xl border border-[#262626] bg-[#121212] space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[#9C9A92] block mb-1">Target verified installs</label>
                        <input
                          type="number"
                          min="10"
                          value={newTierInstalls}
                          onChange={e => setNewTierInstalls(e.target.value)}
                          placeholder="e.g. 1000"
                          className="w-full bg-[#181818] border border-[#2a2a2a] rounded-lg p-2 text-xs text-[#F4F2EC] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[#9C9A92] block mb-1">Bonus amount (USD)</label>
                        <input
                          type="number"
                          min="5"
                          value={newTierBonus}
                          onChange={e => setNewTierBonus(e.target.value)}
                          placeholder="e.g. 400"
                          className="w-full bg-[#181818] border border-[#2a2a2a] rounded-lg p-2 text-xs text-[#F4F2EC] outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingTier(false)}
                        className="px-3 py-1.5 text-xs text-[#9C9A92] hover:text-[#F4F2EC]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white"
                      >
                        Save tier
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {bonusTiers.map((tier, idx) => (
                    <div
                      key={tier.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-[#1c1c1c] bg-[#0c0c0c] text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#181818] text-[#C9B8FF] text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-[#F4F2EC] font-medium">
                            Reach {tier.installs} verified installs
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#4ade80] font-semibold tabular-nums">
                          +${tier.bonusAmount.toFixed(2)} bonus
                        </span>
                        <button
                          onClick={() => setBonusTiers(prev => prev.filter(t => t.id !== tier.id))}
                          className="text-[#777777] hover:text-[#f09595]"
                          title="Remove tier"
                        >
                          <i className="ti ti-trash text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity / Invoices */}
              <div className="p-5 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]">
                <div className="text-xs font-medium text-[#F4F2EC] mb-3">Billing history</div>
                <div className="divide-y divide-[#181818] text-xs">
                  {invoices.map((inv, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2.5">
                      <span className="w-20 text-[#9C9A92]">{inv.date}</span>
                      <span className="flex-1 text-[#F4F2EC] px-2">{inv.description}</span>
                      <span className="w-20 text-[#9C9A92]">{inv.status}</span>
                      <span className="w-24 text-right tabular-nums text-[#F4F2EC]">
                        {inv.description === 'Deposit added' ? '+' : ''}${inv.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'an' && (
            <div className="space-y-6 pt-1">
              {/* 4 KPI Hero Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-[#1a1a1a] bg-[#080808]">
                  <div className="text-xs text-[#9C9A92] flex items-center gap-1.5">
                    <i className="ti ti-shield-check" />
                    <span>Verify rate</span>
                  </div>
                  <div className="text-2xl font-medium tracking-tight mt-1 text-[#F4F2EC] tabular-nums">
                    83%
                  </div>
                  <div className="text-[11px] text-[#4ade80] mt-1">+4% vs last week</div>
                </div>

                <div className="p-4 rounded-xl border border-[#1a1a1a] bg-[#080808]">
                  <div className="text-xs text-[#9C9A92] flex items-center gap-1.5">
                    <i className="ti ti-coin" />
                    <span>Cost per install</span>
                  </div>
                  <div className="text-2xl font-medium tracking-tight mt-1 text-[#F4F2EC] tabular-nums">
                    $0.50
                  </div>
                  <div className="text-[11px] text-[#9C9A92] mt-1">Fixed verified CPI</div>
                </div>

                <div className="p-4 rounded-xl border border-[#1a1a1a] bg-[#080808]">
                  <div className="text-xs text-[#9C9A92] flex items-center gap-1.5">
                    <i className="ti ti-ban" />
                    <span>Blocked fraud</span>
                  </div>
                  <div className="text-2xl font-medium tracking-tight mt-1 text-[#F4F2EC] tabular-nums">
                    41
                  </div>
                  <div className="text-[11px] text-[#9C9A92] mt-1">VPN & device farms</div>
                </div>

                <div className="p-4 rounded-xl border border-[#1a1a1a] bg-[#080808]">
                  <div className="text-xs text-[#9C9A92] flex items-center gap-1.5">
                    <i className="ti ti-wallet" />
                    <span>Budget left</span>
                  </div>
                  <div className="text-2xl font-medium tracking-tight mt-1 text-[#F4F2EC] tabular-nums">
                    ${runway.remaining.toFixed(0)}
                  </div>
                  <div className="text-[11px] text-[#C9B8FF] mt-1">~19 days runway</div>
                </div>
              </div>

              {/* Scrubbable Bar Chart */}
              <div className="p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-[#9C9A92]">
                      {analyticsMetric === 'installs'
                        ? 'Verified Installs'
                        : analyticsMetric === 'spend'
                        ? 'Campaign Spend'
                        : 'Verification Rate'}
                    </div>
                    <div className="font-serif text-3xl font-medium text-[#F4F2EC] mt-0.5 tabular-nums">
                      {analyticsMetric === 'spend'
                        ? `$${activeValue.toFixed(2)}`
                        : analyticsMetric === 'rate'
                        ? `${activeValue}%`
                        : activeValue}
                    </div>
                    <div className="text-xs text-[#C9B8FF] mt-0.5">{activeDate}</div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Metric Select */}
                    <div className="flex bg-[#141414] border border-[#222222] rounded-lg p-0.5 text-xs">
                      {(['installs', 'spend', 'rate'] as const).map(m => (
                        <button
                          key={m}
                          onClick={() => setAnalyticsMetric(m)}
                          className={`px-2.5 py-1 rounded capitalize transition-colors ${
                            analyticsMetric === m
                              ? 'bg-[#222222] text-[#F4F2EC] font-medium'
                              : 'text-[#8E8C84] hover:text-[#F4F2EC]'
                          }`}
                        >
                          {m === 'rate' ? 'Verify rate' : m}
                        </button>
                      ))}
                    </div>

                    {/* Range Select */}
                    <div className="flex bg-[#141414] border border-[#222222] rounded-lg p-0.5 text-xs">
                      {(['7D', '30D', '90D'] as const).map(r => (
                        <button
                          key={r}
                          onClick={() => {
                            setAnalyticsRange(r);
                            setScrubIndex(null);
                          }}
                          className={`px-2.5 py-1 rounded transition-colors ${
                            analyticsRange === r
                              ? 'bg-[#222222] text-[#F4F2EC] font-medium'
                              : 'text-[#8E8C84] hover:text-[#F4F2EC]'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SVG Scrubbable Bar Graph */}
                <div
                  className="w-full h-44 select-none relative pt-4"
                  onMouseLeave={() => setScrubIndex(null)}
                >
                  <div className="flex items-end justify-between h-36 gap-1 w-full border-b border-[#1c1c1c] pb-1">
                    {currentValues.map((val, idx) => {
                      const heightPercent = Math.max(6, Math.round((val / maxVal) * 100));
                      const isHovered = scrubIndex === idx;

                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setScrubIndex(idx)}
                          className="flex-1 h-full flex items-end group cursor-pointer relative"
                        >
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t transition-all duration-150 ${
                              isHovered
                                ? 'bg-[#C9B8FF] shadow-[0_0_12px_rgba(201,184,255,0.4)]'
                                : 'bg-[#242424] hover:bg-[#383838]'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-[#777777] pt-2">
                    <span>{currentDataset.labels[0]}</span>
                    <span>{currentDataset.labels[Math.floor(currentDataset.labels.length / 2)]}</span>
                    <span>{currentDataset.labels[currentDataset.labels.length - 1]}</span>
                  </div>
                </div>
              </div>

              {/* Live Traffic Simulation */}
              <div className="p-5 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                    <span className="font-semibold text-[#F4F2EC]">Real-time traffic feed</span>
                  </div>
                  <span className="text-[#8E8C84] tabular-nums">
                    <span className="text-[#4ade80] font-medium">{liveClicks} clicks</span> in the last 5 mins
                  </span>
                </div>

                {/* Mini rolling bars */}
                <div className="flex items-end gap-1 h-12 w-full pt-2">
                  {liveBars.map((b, i) => (
                    <div
                      key={i}
                      style={{ height: `${(b / 35) * 100}%` }}
                      className="flex-1 bg-[#1e1e1e] rounded-xs transition-all duration-500 hover:bg-[#C9B8FF]"
                    />
                  ))}
                </div>
              </div>

              {/* Conversion Funnel */}
              <div className="p-5 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-3">
                <div className="text-xs font-semibold text-[#F4F2EC]">4-Stage Conversion Funnel</div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-[#9C9A92]">1. Clicks</span>
                    <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="w-full h-full bg-[#F4F2EC]" />
                    </div>
                    <span className="w-16 text-right tabular-nums text-[#F4F2EC]">4,820</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-[#9C9A92]">2. Installs</span>
                    <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="w-[18.9%] h-full bg-[#F4F2EC]" />
                    </div>
                    <span className="w-16 text-right tabular-nums text-[#F4F2EC]">912 (18.9%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-[#9C9A92]">3. Verified</span>
                    <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="w-[13.1%] h-full bg-[#C9B8FF]" />
                    </div>
                    <span className="w-16 text-right tabular-nums text-[#C9B8FF] font-medium">
                      631 (69.2%)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-[#9C9A92]">4. Paid</span>
                    <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="w-[13.1%] h-full bg-[#4ade80]" />
                    </div>
                    <span className="w-16 text-right tabular-nums text-[#4ade80] font-medium">
                      $315.50
                    </span>
                  </div>
                </div>
              </div>

              {/* Needs Attention List */}
              <div className="p-5 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-3">
                <div className="text-xs font-semibold text-[#F4F2EC]">Needs Attention</div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl border border-[#2a2210] bg-[#1a1508] flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#facc15] shrink-0 mt-1" />
                    <div>
                      <span className="font-medium text-[#F4F2EC]">Leo M. (@leom)</span>
                      <p className="text-[#A3997A] text-[11px] mt-0.5">
                        Install velocity decreased by 22% over the last 48 hours. Consider suggesting fresh copy.
                      </p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-[#2a1212] bg-[#170a0a] flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#f87171] shrink-0 mt-1" />
                    <div>
                      <span className="font-medium text-[#F4F2EC]">Sade O. (@sadeo)</span>
                      <p className="text-[#B97A7A] text-[11px] mt-0.5">
                        0% verification pass rate across 52 clicks (duplicate device IDs flagged).
                      </p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-[#0f281e] bg-[#081812] flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#4ade80] shrink-0 mt-1" />
                    <div>
                      <span className="font-medium text-[#F4F2EC]">Dana L. (@danal)</span>
                      <p className="text-[#7AB998] text-[11px] mt-0.5">
                        Hit the 200 verified installs milestone. Unlocked Performance Bonus Tier 1.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DEVELOPERS */}
          {activeTab === 'dv' && (
            <div className="space-y-6 pt-1">
              {/* SDK Heartbeat & Test Event */}
              <div className="p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-[#F4F2EC]">SDK Connectivity</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0f281e] text-[#4ade80] border border-[#1b4332] inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                        Connected · ping 2m ago
                      </span>
                    </div>
                    <p className="text-xs text-[#9C9A92] mt-1">
                      iOS SDK v2.4.1 (Active) · Android SDK v2.4.0 (Active)
                    </p>
                  </div>

                  <button
                    onClick={handleSendTestEvent}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <i className="ti ti-bolt text-[13px]" />
                    <span>Send test event</span>
                  </button>
                </div>

                {testEventToast && (
                  <div className="p-3 rounded-xl bg-[#0f281e] border border-[#1b4332] text-xs text-[#4ade80] flex items-center gap-2 animate-in fade-in">
                    <i className="ti ti-circle-check text-sm" />
                    <span>
                      Test event received: <code>install_verified</code> (Device: iPhone 17, token: <code>test_9f2a</code>) +$0.50 logged.
                    </span>
                  </div>
                )}
              </div>

              {/* API Keys Manager */}
              <div className="p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-[#F4F2EC]">Server API Keys</h3>
                    <p className="text-xs text-[#9C9A92] mt-0.5">
                      Used for backend event validation and server-to-server install reporting.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNewKeyModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white transition-colors"
                  >
                    + Create key
                  </button>
                </div>

                <div className="divide-y divide-[#181818] border border-[#1c1c1c] rounded-xl overflow-hidden bg-[#080808]">
                  {apiKeys.map(k => (
                    <div key={k.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-medium text-[#F4F2EC]">{k.name}</div>
                        <div className="text-[#8E8C84] mt-0.5 flex items-center gap-2 font-mono">
                          <span>{k.keyPrefix}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(k.keyPrefix);
                              setCopiedKeyId(k.id);
                              setTimeout(() => setCopiedKeyId(null), 1500);
                            }}
                            className="text-[#C9B8FF] hover:underline"
                          >
                            {copiedKeyId === k.id ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <div className="text-[11px] text-[#666666] mt-1">
                          Created {k.created} · Last used {k.lastUsed}
                        </div>
                      </div>

                      <button
                        onClick={() => setKeyToRevoke(k)}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-[#f09595] hover:bg-[#3c0e0e]/50 border border-[#791e1e]/40 transition-colors self-start sm:self-auto"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Snippet */}
              <div className="p-5 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F4F2EC]">Client SDK Integration</span>
                  <button
                    onClick={() => navigate('docs')}
                    className="text-[#C9B8FF] hover:underline text-xs"
                  >
                    Full Documentation →
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#080808] border border-[#1c1c1c] text-xs font-mono text-[#D8D6CE] overflow-x-auto leading-relaxed">
                  {`// Swift (iOS)
import UmiSDK

func applicationDidBecomeActive() {
    UmiSDK.recordInstall(
        campaign: "dune",
        attributionToken: UmiSDK.readPasteboardToken()
    )
}`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'se' && (
            <div className="space-y-6 pt-1">
              {/* Access Controls */}
              <div className="p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-4">
                <div className="text-xs text-[#9C9A92] uppercase tracking-wider font-semibold">
                  Access Controls
                </div>
                <div className="divide-y divide-[#181818]">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium text-[#F4F2EC]">Public campaign</div>
                      <div className="text-xs text-[#9C9A92]">Anyone can find it in Discover.</div>
                    </div>
                    <button
                      onClick={() => setIsPublic(prev => !prev)}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        isPublic ? 'bg-[#F4F2EC]' : 'bg-[#1e1e1e] border border-[#2a2a2a]'
                      }`}
                      role="switch"
                      aria-checked={isPublic}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                          isPublic ? 'translate-x-4 bg-[#000000]' : 'bg-[#9C9A92]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium text-[#F4F2EC]">Require creator approval</div>
                      <div className="text-xs text-[#9C9A92]">
                        You review each creator before their link and code activate.
                      </div>
                    </div>
                    <button
                      onClick={() => setRequireApproval(prev => !prev)}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        requireApproval ? 'bg-[#F4F2EC]' : 'bg-[#1e1e1e] border border-[#2a2a2a]'
                      }`}
                      role="switch"
                      aria-checked={requireApproval}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                          requireApproval ? 'translate-x-4 bg-[#000000]' : 'bg-[#9C9A92]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium text-[#F4F2EC]">Close new applications</div>
                      <div className="text-xs text-[#9C9A92]">
                        Stop taking new requests. Current approved creators keep earning.
                      </div>
                    </div>
                    <button
                      onClick={() => setCloseApplications(prev => !prev)}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        closeApplications ? 'bg-[#F4F2EC]' : 'bg-[#1e1e1e] border border-[#2a2a2a]'
                      }`}
                      role="switch"
                      aria-checked={closeApplications}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                          closeApplications ? 'translate-x-4 bg-[#000000]' : 'bg-[#9C9A92]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Rewards */}
              <div className="p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-4">
                <div className="text-xs text-[#9C9A92] uppercase tracking-wider font-semibold">Rewards</div>
                <div className="divide-y divide-[#181818]">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium text-[#F4F2EC]">Reward per verified install</div>
                      <div className="text-xs text-[#9C9A92]">
                        Applies to subsequent installs. Existing ones remain logged.
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setRewardPerInstall(prev => Math.max(0.1, Math.round((prev - 0.05) * 100) / 100))
                        }
                        className="w-7 h-7 rounded-lg border border-[#2a2a2a] text-[#F4F2EC] flex items-center justify-center hover:bg-[#1a1a1a]"
                        aria-label="Decrease reward"
                      >
                        −
                      </button>
                      <span className="tabular-nums text-sm font-semibold w-14 text-center text-[#F4F2EC]">
                        ${rewardPerInstall.toFixed(2)}
                      </span>
                      <button
                        onClick={() =>
                          setRewardPerInstall(prev => Math.min(5.0, Math.round((prev + 0.05) * 100) / 100))
                        }
                        className="w-7 h-7 rounded-lg border border-[#2a2a2a] text-[#F4F2EC] flex items-center justify-center hover:bg-[#1a1a1a]"
                        aria-label="Increase reward"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium text-[#F4F2EC]">Creator QR codes</div>
                      <div className="text-xs text-[#9C9A92]">Allow creators to export high-res scannable codes.</div>
                    </div>
                    <button
                      onClick={() => setCreatorQrCodes(prev => !prev)}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        creatorQrCodes ? 'bg-[#F4F2EC]' : 'bg-[#1e1e1e] border border-[#2a2a2a]'
                      }`}
                      role="switch"
                      aria-checked={creatorQrCodes}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                          creatorQrCodes ? 'translate-x-4 bg-[#000000]' : 'bg-[#9C9A92]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Limits & Schedules */}
              <div className="p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] space-y-4">
                <div className="text-xs text-[#9C9A92] uppercase tracking-wider font-semibold">
                  Limits & Schedules
                </div>
                <div className="divide-y divide-[#181818]">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium text-[#F4F2EC]">Daily install cap</div>
                      <div className="text-xs text-[#9C9A92]">
                        Pause earning for the day once this threshold is reached.
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {dailyCapEnabled && (
                        <input
                          type="number"
                          value={dailyCapValue}
                          onChange={e => setDailyCapValue(e.target.value)}
                          className="w-20 px-2 py-1 text-xs tabular-nums bg-transparent border border-[#2a2a2a] rounded-lg text-[#F4F2EC] text-right outline-none"
                        />
                      )}
                      <button
                        onClick={() => setDailyCapEnabled(prev => !prev)}
                        className={`w-10 h-6 rounded-full relative transition-colors ${
                          dailyCapEnabled ? 'bg-[#F4F2EC]' : 'bg-[#1e1e1e] border border-[#2a2a2a]'
                        }`}
                        role="switch"
                        aria-checked={dailyCapEnabled}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                            dailyCapEnabled ? 'translate-x-4 bg-[#000000]' : 'bg-[#9C9A92]'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium text-[#F4F2EC]">Campaign end date</div>
                      <div className="text-xs text-[#9C9A92]">Current: {endDateValue} (11:59 PM UTC)</div>
                    </div>
                    <button
                      onClick={() => setIsEndDateModalOpen(true)}
                      className="text-xs font-semibold text-[#C9B8FF] hover:underline underline-offset-4"
                    >
                      Change date
                    </button>
                  </div>
                </div>
              </div>

              {/* Pause Campaign */}
              <div className="p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#F4F2EC]">Pause campaign</div>
                  <div className="text-xs text-[#9C9A92]">
                    New installs stop earning. Creators retain all past earnings.
                  </div>
                </div>
                <button
                  onClick={() => setIsPaused(prev => !prev)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                    isPaused
                      ? 'border-[#C9B8FF] text-[#C9B8FF] hover:bg-[#C9B8FF]/10'
                      : 'border-[#791e1e] text-[#f09595] hover:bg-[#3c0e0e]'
                  }`}
                >
                  {isPaused ? 'Resume campaign' : 'Pause campaign'}
                </button>
              </div>

              {/* 2-Step End Campaign Confirmation */}
              <div className="p-6 rounded-2xl border border-[#3c0e0e]/60 bg-[#160808] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-[#f09595]">End campaign permanently</div>
                  <div className="text-xs text-[#b88585] mt-0.5">
                    Closes tracking immediately and refunds remaining balance (${runway.remaining.toFixed(2)}) back to Stripe.
                  </div>
                </div>
                <button
                  onClick={() => setIsEndCampaignOpen(true)}
                  className="px-4 py-2 text-xs font-semibold rounded-full bg-[#3c0e0e] border border-[#791e1e] text-[#f09595] hover:bg-[#511212] transition-colors shrink-0"
                >
                  End campaign
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT RAIL (320px, 360px above 1680px, sticky top 24px) */}
        <aside className="space-y-6 lg:sticky lg:top-6">
          {/* Quick Runway Summary Card */}
          <div className="p-5 rounded-2xl border border-[#1f1f1f] bg-[#0c0c0c] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9C9A92] uppercase tracking-wider">
                Runway & Funds
              </span>
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
            </div>

            <div>
              <div className="text-xs text-[#9C9A92]">Available budget</div>
              <div className="font-serif text-3xl font-medium tracking-tight text-[#F4F2EC] mt-0.5 tabular-nums">
                ${runway.remaining.toFixed(2)}
              </div>
              <div className="text-[11px] text-[#9C9A92] mt-1">
                Estimated ~{Math.max(1, Math.round(runway.remaining / dailyRate))} days at current rate
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#9C9A92]">
                <span>Spent</span>
                <span className="tabular-nums font-medium text-[#F4F2EC]">${spent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#9C9A92]">
                <span>Original deposit</span>
                <span className="tabular-nums font-medium text-[#F4F2EC]">${deposit.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsAddDepositOpen(true)}
              className="w-full py-2.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white transition-colors"
            >
              Add deposit
            </button>
          </div>

          {/* Quick Creator Applications Box */}
          <div className="p-5 rounded-2xl border border-[#1f1f1f] bg-[#0c0c0c] space-y-3">
            <div className="text-xs font-medium text-[#9C9A92] uppercase tracking-wider">
              Pending approvals
            </div>
            {pendingRequestsCount > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-[#F4F2EC]">
                  <span className="font-semibold">{pendingRequestsCount} creator{pendingRequestsCount > 1 ? 's' : ''}</span> waiting for review
                </div>
                <button
                  onClick={() => setActiveTab('cr')}
                  className="w-full py-2 rounded-full text-xs font-semibold border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#1a1a1a] transition-colors"
                >
                  Review applications
                </button>
              </div>
            ) : (
              <div className="text-xs text-[#9C9A92]">
                All incoming creator requests have been reviewed.
              </div>
            )}
          </div>

          {/* SDK Heartbeat card */}
          <div className="p-5 rounded-2xl border border-[#1f1f1f] bg-[#0c0c0c] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#9C9A92]">
              <span className="font-medium text-[#F4F2EC]">SDK integration</span>
              <span className="text-[#4ade80] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                Connected
              </span>
            </div>
            <p className="text-[11px] text-[#9C9A92] leading-relaxed">
              <code>UmiAnalytics.logInstall()</code> is receiving events from App Store & Play Store.
            </p>
            <button
              onClick={() => setActiveTab('dv')}
              className="text-xs font-medium text-[#C9B8FF] hover:underline underline-offset-4 inline-flex items-center gap-1"
            >
              <span>Manage keys & events</span>
              <i className="ti ti-arrow-right text-[11px]" />
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL 1: Add Deposit */}
      {isAddDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0c0c0c] border border-[#222222] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-medium text-[#F4F2EC]">Add campaign funds</h3>
              <button
                onClick={() => setIsAddDepositOpen(false)}
                className="text-[#9C9A92] hover:text-[#F4F2EC] text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#9C9A92]">
              Deposits are held in escrow and paid out automatically as verified installs are logged. Unused balance is refundable at any time.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[100, 250, 500].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositCustomAmount(amt.toString())}
                  className={`py-2 rounded-xl text-xs font-medium border transition-colors tabular-nums ${
                    depositCustomAmount === amt.toString()
                      ? 'border-[#C9B8FF] bg-[#C9B8FF]/10 text-[#F4F2EC]'
                      : 'border-[#222222] text-[#9C9A92] hover:bg-[#141414]'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs text-[#9C9A92] block mb-1.5">Custom deposit amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#9C9A92]">$</span>
                <input
                  type="number"
                  min="50"
                  step="10"
                  value={depositCustomAmount}
                  onChange={e => setDepositCustomAmount(e.target.value)}
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl py-2.5 pl-8 pr-4 text-sm text-[#F4F2EC] tabular-nums outline-none focus:border-[#C9B8FF]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddDepositOpen(false)}
                className="flex-1 py-2.5 rounded-full text-xs font-medium text-[#9C9A92] hover:bg-[#141414]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddDeposit(parseFloat(depositCustomAmount) || 100)}
                className="flex-1 py-2.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white"
              >
                Charge via Stripe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Message Creator */}
      {messagingCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0c0c0c] border border-[#222222] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[#F4F2EC]">
                Message {messagingCreator.name}
              </h3>
              <button
                onClick={() => setMessagingCreator(null)}
                className="text-[#9C9A92] hover:text-[#F4F2EC] text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#9C9A92]">
              Sends an instant notification and email to {messagingCreator.name} ({messagingCreator.handle}).
            </p>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <textarea
                autoFocus
                rows={4}
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Share advice, feedback, or custom terms..."
                className="w-full bg-[#141414] border border-[#222222] rounded-xl p-3 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF] resize-none"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMessagingCreator(null)}
                  className="flex-1 py-2 rounded-full text-xs font-medium text-[#9C9A92] hover:bg-[#141414]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white"
                >
                  Send message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Stripe Connect Portal */}
      {isStripeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0c0c0c] border border-[#222222] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[#F4F2EC]">Stripe Billing Portal</h3>
              <button
                onClick={() => setIsStripeModalOpen(false)}
                className="text-[#9C9A92] hover:text-[#F4F2EC] text-lg"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-[#9C9A92] space-y-2">
              <p>Stripe Customer ID: <code>cus_P92kLm39q</code></p>
              <p>Primary Payment: Chase Checking ending in 4821</p>
              <p>Auto-recharge trigger: when deposit drops below $50</p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setIsStripeModalOpen(false)}
                className="w-full py-2.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Change Campaign End Date */}
      {isEndDateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0c0c0c] border border-[#222222] rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#F4F2EC]">Change campaign end date</h3>
            <p className="text-xs text-[#9C9A92]">
              Creators will see this updated deadline on the campaign page.
            </p>
            <input
              type="date"
              value={endDateValue}
              onChange={e => setEndDateValue(e.target.value)}
              className="w-full bg-[#141414] border border-[#222222] rounded-xl p-2.5 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
            />
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsEndDateModalOpen(false)}
                className="flex-1 py-2 text-xs text-[#9C9A92] hover:bg-[#141414] rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsEndDateModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white rounded-full"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Create API Key */}
      {isNewKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0c0c0c] border border-[#222222] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[#F4F2EC]">Create server API key</h3>
              <button
                onClick={() => setIsNewKeyModalOpen(false)}
                className="text-[#9C9A92] hover:text-[#F4F2EC] text-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#9C9A92]">
              Name your key according to its environment or purpose (e.g. Staging Server, Production Webhook).
            </p>
            <form onSubmit={handleCreateApiKey} className="space-y-4">
              <div>
                <label className="text-xs text-[#9C9A92] block mb-1">Key Name</label>
                <input
                  type="text"
                  autoFocus
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production Analytics"
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl p-2.5 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewKeyModalOpen(false)}
                  className="flex-1 py-2 text-xs text-[#9C9A92] hover:bg-[#141414] rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newKeyName.trim()}
                  className="flex-1 py-2 text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white rounded-full disabled:opacity-50"
                >
                  Generate key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: Revoke API Key 2-Step Confirmation */}
      {keyToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0c0c0c] border border-[#791e1e]/60 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#f09595]">
              <i className="ti ti-alert-triangle text-xl" />
              <h3 className="font-serif text-lg font-medium">Revoke API Key?</h3>
            </div>
            <p className="text-xs text-[#9C9A92] leading-relaxed">
              Are you sure you want to revoke <strong>{keyToRevoke.name}</strong>? Any server using this key will immediately receive <code>401 Unauthorized</code> errors.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setKeyToRevoke(null)}
                className="flex-1 py-2 text-xs text-[#9C9A92] hover:bg-[#141414] rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeKey}
                className="flex-1 py-2 text-xs font-semibold bg-[#3c0e0e] border border-[#791e1e] text-[#f09595] hover:bg-[#511212] rounded-full"
              >
                Revoke immediately
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: End Campaign 2-Step Confirmation */}
      {isEndCampaignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0c0c0c] border border-[#791e1e]/60 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#f09595]">
              <i className="ti ti-alert-triangle text-xl" />
              <h3 className="font-serif text-lg font-medium">End Campaign Permanently</h3>
            </div>
            <p className="text-xs text-[#9C9A92] leading-relaxed">
              This action cannot be undone. Creator referral links will expire, and your remaining escrow balance of <strong>${runway.remaining.toFixed(2)}</strong> will be returned to your Stripe payout method.
            </p>
            <div>
              <label className="text-xs text-[#9C9A92] block mb-1">
                Type <strong>Dune Notes</strong> to confirm:
              </label>
              <input
                type="text"
                value={confirmCampaignName}
                onChange={e => setConfirmCampaignName(e.target.value)}
                placeholder="Dune Notes"
                className="w-full bg-[#141414] border border-[#222222] rounded-xl p-2.5 text-xs text-[#F4F2EC] outline-none focus:border-[#f09595]"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsEndCampaignOpen(false);
                  setConfirmCampaignName('');
                }}
                className="flex-1 py-2 text-xs text-[#9C9A92] hover:bg-[#141414] rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEndCampaign}
                disabled={confirmCampaignName.trim().toLowerCase() !== 'dune notes'}
                className="flex-1 py-2 text-xs font-semibold bg-[#3c0e0e] border border-[#791e1e] text-[#f09595] hover:bg-[#511212] rounded-full disabled:opacity-40 transition-colors"
              >
                End campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
