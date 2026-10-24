import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ScreenType,
  OverlayType,
  AvatarExpression,
  SettingsTab,
  Campaign,
  CreatorRequest,
  PayoutHistoryItem,
  Passkey,
  PayoutMethod,
  UserProfile,
  NotificationItem,
  CampaignEarningsStat,
} from '../types';
import {
  INITIAL_CAMPAIGNS,
  INITIAL_CREATOR_REQUESTS,
  INITIAL_PAYOUT_HISTORY,
} from '../data/initialData';
import { calculateWithdrawalFee, validateWithdrawal } from '../utils/campaignLogic';

const STORAGE_KEY = 'umi_state_v2';

export const AVATAR_COLORS: string[] = [
  '#C9B8FF', // Lavender (default)
  '#B5D4F4', // Sky
  '#C5E0D8', // Sage
  '#F8C8B8', // Peach
  '#F6E7B0', // Butter
  '#B7EDD8', // Mint
  '#F5B8D0', // Rose
  '#CBD5E1', // Slate
  '#F8B4A6', // Coral
  '#D8B4F8', // Lilac
];

export const FOUNDER_EXPRESSIONS: AvatarExpression[] = [
  'Builder',
  'Operator',
  'Visionary',
  'Maker',
  'Boss',
];

export const CREATOR_EXPRESSIONS: AvatarExpression[] = [
  'Streamer',
  'Vlogger',
  'Trendsetter',
  'Chill',
  'Hype',
];

export const ALL_EXPRESSIONS: AvatarExpression[] = [
  ...FOUNDER_EXPRESSIONS,
  ...CREATOR_EXPRESSIONS,
];

interface AppContextType {
  // Navigation
  currentScreen: ScreenType;
  selectedCampaignId: string;
  previousScreen: ScreenType;
  settingsTab: SettingsTab;
  navigate: (screen: ScreenType, campaignId?: string, tab?: SettingsTab) => void;

  // Overlays
  overlay: OverlayType;
  openOverlay: (ov: OverlayType) => void;
  closeOverlay: () => void;

  // Profile
  userProfile: UserProfile;
  updateUserProfile: (partial: Partial<UserProfile>) => void;
  setAvatar: (color: string, expression: AvatarExpression) => void;
  addPasskey: (name: string) => void;
  removePasskey: (id: string) => void;
  addPayoutMethod: (method: Omit<PayoutMethod, 'id' | 'isDefault'>) => void;
  removePayoutMethod: (id: string) => void;
  setDefaultPayoutMethod: (id: string) => void;

  // Campaigns & Joining
  campaigns: Campaign[];
  joinedMap: Record<string, number>; // 0 = none, 1 = pending, 2 = approved
  selectedCampaign: Campaign;
  requestJoinCampaign: (campaignId: string, form: { whyFit: string; channels: string }) => void;
  approveCreatorRequest: (reqId: string) => void;
  declineCreatorRequest: (reqId: string) => void;
  creatorRequests: CreatorRequest[];
  createCampaign: (data: Partial<Campaign>) => void;

  // Earnings & Financials
  availableBalance: number;
  onHoldBalance: number;
  verifyingBalance: number;
  paidOutTotal: number;
  payoutHistory: PayoutHistoryItem[];
  campaignStats: CampaignEarningsStat[];
  withdraw: (amount: number, methodId: string) => { success: boolean; error?: string };
  simulateInstall: (campaignId?: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'date' | 'unread'>) => void;

  // Reset demo
  resetDemoData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Amara Bekele',
  handle: 'amara',
  email: 'amara@example.com',
  bio: 'I review productivity, design, and photo apps for people who like thoughtful tools.',
  role: 'creator',
  avatarColor: '#C9B8FF',
  avatarExpression: 'Builder',
  channels: {
    tiktok: '@amara',
    youtube: 'youtube.com/@amara',
    instagram: '@amarabekele',
    twitter: '@amara_b',
  },
  twoFactor: true,
  passkeys: [
    { id: 'pk-1', name: 'MacBook Pro (Touch ID)', created: 'Oct 14, 2026', lastUsed: 'Yesterday' },
    { id: 'pk-2', name: 'iPhone 17 (Face ID)', created: 'Oct 19, 2026', lastUsed: 'Today' },
  ],
  payoutMethods: [
    { id: 'pm-1', type: 'bank', name: 'Chase Checking', last4: '4821', isDefault: true, routingNumber: '021000021' },
    { id: 'pm-2', type: 'card', name: 'Visa Debit', last4: '1094', isDefault: false },
  ],
  minPayout: 50,
  notifications: {
    campaign: true,
    recommendations: false,
    creatorRequests: true,
    payouts: true,
  },
};

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Cerebral Valley',
    subtitle: 'sent an announcement for Built with Claude: Life Sciences',
    body: 'Thank you for applying to Built with Claude: Life Sciences in partnership with Gladstone Institutes. We received an incredible number of applications for more than the 500 spots we had available.',
    date: 'Jul 7',
    unread: true,
    targetScreen: 'campaigns',
    type: 'system',
  },
  {
    id: 'notif-2',
    title: 'Tempo Run',
    subtitle: 'approved your partnership',
    body: 'Your link and creator code are live. Earn $0.40 per verified install.',
    date: 'Oct 17',
    unread: true,
    targetScreen: 'campaign',
    targetCampaignId: 'tempo',
    type: 'approval',
  },
  {
    id: 'notif-3',
    title: 'Friday settlement',
    subtitle: 'Friday settlement sent',
    body: '$128.50 was transferred to your Chase Checking account ending in 4821.',
    date: 'Oct 16',
    unread: false,
    targetScreen: 'earnings',
    type: 'payout',
  },
  {
    id: 'notif-4',
    title: 'Dune Notes',
    subtitle: 'new creator request',
    body: 'Dana L. (@danal) requested to join your campaign with 48k TikTok followers.',
    date: 'Oct 16',
    unread: true,
    targetScreen: 'manager',
    targetCampaignId: 'dune',
    type: 'request',
  },
  {
    id: 'notif-5',
    title: 'Cerebral Valley',
    subtitle: 'sent an announcement for Built with Opus 4.7: a Claude Code hackathon',
    body: 'Thank you for applying to the Built with Opus 4.7: a Claude Code hackathon. After reviewing all submissions we have finalized participant badges.',
    date: 'Apr 23',
    unread: false,
    targetScreen: 'campaigns',
    type: 'system',
  },
  {
    id: 'notif-6',
    title: 'Welcome!',
    subtitle: 'Welcome to Umi!',
    body: 'Explore high-converting mobile campaigns, link your social channels, and start earning per verified install.',
    date: 'Apr 18',
    unread: false,
    targetScreen: 'campaigns',
    type: 'system',
  },
];

const DEFAULT_STATS: CampaignEarningsStat[] = [
  { campaignId: 'tempo', campaignName: 'Tempo Run', installs: 142, earned: 56.8, status: 'active' },
  { campaignId: 'margin', campaignName: 'Margin', installs: 84, earned: 50.4, status: 'active' },
  { campaignId: 'tavern', campaignName: 'Tile Tavern', installs: 42, earned: 21.0, status: 'active' },
  { campaignId: 'lingo', campaignName: 'Lingo Daily', installs: 32, earned: 14.4, status: 'completed' },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Screen state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('campaigns');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('palazzo');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('campaigns');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('account');
  const [overlay, setOverlay] = useState<OverlayType>(null);

  // Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Campaigns & Requests
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [joinedMap, setJoinedMap] = useState<Record<string, number>>({
    tempo: 2, // approved
    lingo: 1, // pending
    palazzo: 0,
    margin: 2,
    tavern: 2,
    loop: 0,
  });
  const [creatorRequests, setCreatorRequests] = useState<CreatorRequest[]>(INITIAL_CREATOR_REQUESTS);

  // Earnings
  const [availableBalance, setAvailableBalance] = useState<number>(142.5);
  const [onHoldBalance, setOnHoldBalance] = useState<number>(84.0);
  const [verifyingBalance, setVerifyingBalance] = useState<number>(29.5);
  const [paidOutTotal, setPaidOutTotal] = useState<number>(410.0);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistoryItem[]>(INITIAL_PAYOUT_HISTORY);
  const [campaignStats, setCampaignStats] = useState<CampaignEarningsStat[]>(DEFAULT_STATS);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userProfile) setUserProfile(parsed.userProfile);
        if (parsed.campaigns) setCampaigns(parsed.campaigns);
        if (parsed.joinedMap) setJoinedMap(parsed.joinedMap);
        if (parsed.creatorRequests) setCreatorRequests(parsed.creatorRequests);
        if (typeof parsed.availableBalance === 'number') setAvailableBalance(parsed.availableBalance);
        if (typeof parsed.onHoldBalance === 'number') setOnHoldBalance(parsed.onHoldBalance);
        if (typeof parsed.verifyingBalance === 'number') setVerifyingBalance(parsed.verifyingBalance);
        if (typeof parsed.paidOutTotal === 'number') setPaidOutTotal(parsed.paidOutTotal);
        if (parsed.payoutHistory) setPayoutHistory(parsed.payoutHistory);
        if (parsed.campaignStats) setCampaignStats(parsed.campaignStats);
        if (parsed.notifications) setNotifications(parsed.notifications);
      }
    } catch {
      // ignore parse error
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        userProfile,
        campaigns,
        joinedMap,
        creatorRequests,
        availableBalance,
        onHoldBalance,
        verifyingBalance,
        paidOutTotal,
        payoutHistory,
        campaignStats,
        notifications,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // storage quota or private mode
    }
  }, [
    userProfile,
    campaigns,
    joinedMap,
    creatorRequests,
    availableBalance,
    onHoldBalance,
    verifyingBalance,
    paidOutTotal,
    payoutHistory,
    campaignStats,
    notifications,
  ]);

  // Sync with URL Hash for real routing and browser Back/Forward
  useEffect(() => {
    const handleHashChange = () => {
      const raw = window.location.hash.replace(/^#/, '');
      if (!raw) return;

      const parts = raw.split('/');
      const screen = parts[0] as ScreenType;
      const param = parts[1];

      const validScreens: ScreenType[] = [
        'campaigns',
        'campaign',
        'manager',
        'earnings',
        'create',
        'profile',
        'settings',
        'keys',
        'docs',
        'onboarding',
      ];

      if (validScreens.includes(screen)) {
        setCurrentScreen(screen);
        if (screen === 'campaign' && param) {
          setSelectedCampaignId(param);
        }
        if (screen === 'settings' && param) {
          setSettingsTab(param as SettingsTab);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when screen changes
  const navigate = useCallback((screen: ScreenType, campaignId?: string, tab?: SettingsTab) => {
    setOverlay(null);
    setCurrentScreen(prev => {
      if (prev !== screen) setPreviousScreen(prev);
      return screen;
    });

    if (campaignId) setSelectedCampaignId(campaignId);
    if (tab) setSettingsTab(tab);

    let newHash: string = screen;
    if (screen === 'campaign') {
      newHash = `campaign/${campaignId || selectedCampaignId}`;
    } else if (screen === 'settings' && tab) {
      newHash = `settings/${tab}`;
    }
    window.location.hash = newHash;
  }, [selectedCampaignId]);

  const openOverlay = useCallback((ov: OverlayType) => {
    setOverlay(ov);
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlay(null);
  }, []);

  // Add Notification helper
  const addNotification = useCallback((notif: Omit<NotificationItem, 'id' | 'date' | 'unread'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: 'Just now',
      unread: true,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  // Profile operations
  const updateUserProfile = useCallback((partial: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...partial }));
  }, []);

  const setAvatar = useCallback((color: string, expression: AvatarExpression) => {
    setUserProfile(prev => ({
      ...prev,
      avatarColor: color,
      avatarExpression: expression,
    }));
  }, []);

  const addPasskey = useCallback((name: string) => {
    const newPk: Passkey = {
      id: `pk-${Date.now()}`,
      name: name || 'Security Key',
      created: 'Just now',
      lastUsed: 'Never',
    };
    setUserProfile(prev => ({
      ...prev,
      passkeys: [newPk, ...prev.passkeys],
    }));
    addNotification({
      title: 'Security update',
      subtitle: 'Passkey registered',
      body: `"${newPk.name}" is now enabled for hardware-based authentication.`,
      targetScreen: 'settings',
      type: 'system',
    });
  }, [addNotification]);

  const removePasskey = useCallback((id: string) => {
    setUserProfile(prev => ({
      ...prev,
      passkeys: prev.passkeys.filter(p => p.id !== id),
    }));
  }, []);

  const addPayoutMethod = useCallback((method: Omit<PayoutMethod, 'id' | 'isDefault'>) => {
    const newMethod: PayoutMethod = {
      ...method,
      id: `pm-${Date.now()}`,
      isDefault: false,
    };
    setUserProfile(prev => ({
      ...prev,
      payoutMethods: [...prev.payoutMethods, newMethod],
    }));
    addNotification({
      title: 'Payment method added',
      subtitle: newMethod.name,
      body: `${newMethod.type === 'bank' ? 'Bank account' : 'Debit card'} ending in ${newMethod.last4} has been linked.`,
      targetScreen: 'settings',
      type: 'system',
    });
  }, [addNotification]);

  const removePayoutMethod = useCallback((id: string) => {
    setUserProfile(prev => ({
      ...prev,
      payoutMethods: prev.payoutMethods.filter(m => m.id !== id),
    }));
  }, []);

  const setDefaultPayoutMethod = useCallback((id: string) => {
    setUserProfile(prev => ({
      ...prev,
      payoutMethods: prev.payoutMethods.map(m => ({
        ...m,
        isDefault: m.id === id,
      })),
    }));
  }, []);

  // Creator flow: Request to join
  const requestJoinCampaign = useCallback((campaignId: string, form: { whyFit: string; channels: string }) => {
    setJoinedMap(prev => ({ ...prev, [campaignId]: 1 })); // 1 = pending

    const campaign = campaigns.find(c => c.id === campaignId) || campaigns[0];
    const newReq: CreatorRequest = {
      id: `req-${Date.now()}`,
      n: userProfile.name,
      h: `@${userProfile.handle}`,
      c: userProfile.avatarColor,
      ch: form.channels || 'TikTok & YouTube',
      past: 3,
      qual: '94%',
      note: form.whyFit,
      status: 0,
      campaignId,
      appliedDate: 'Today',
    };

    setCreatorRequests(prev => [newReq, ...prev]);

    addNotification({
      title: campaign.name,
      subtitle: 'application submitted',
      body: `Your request to join ${campaign.name} was sent. The founder will review your channels.`,
      targetScreen: 'campaign',
      targetCampaignId: campaignId,
      type: 'request',
    });
  }, [campaigns, userProfile, addNotification]);

  // Founder flow: Approve / Decline creator request
  const approveCreatorRequest = useCallback((reqId: string) => {
    let targetCampaignId = 'palazzo';
    let creatorName = 'Creator';

    setCreatorRequests(prev =>
      prev.map(r => {
        if (r.id === reqId) {
          targetCampaignId = r.campaignId || 'palazzo';
          creatorName = r.n;
          return { ...r, status: 1 };
        }
        return r;
      })
    );

    // If it's the current user or demo request, update joinedMap to 2 (Approved)
    setJoinedMap(prev => ({
      ...prev,
      [targetCampaignId]: 2,
    }));

    const campaign = campaigns.find(c => c.id === targetCampaignId) || campaigns[0];

    addNotification({
      title: campaign.name,
      subtitle: 'Creator approved',
      body: `Approved! ${creatorName} can now share referral links & creator code UMI-4F7K.`,
      targetScreen: 'campaign',
      targetCampaignId: targetCampaignId,
      type: 'approval',
    });
  }, [campaigns, addNotification]);

  const declineCreatorRequest = useCallback((reqId: string) => {
    setCreatorRequests(prev =>
      prev.map(r => (r.id === reqId ? { ...r, status: 2 } : r))
    );
  }, []);

  // Developer simulation: Simulate Install
  const simulateInstall = useCallback((campaignId: string = 'tempo') => {
    const campaign = campaigns.find(c => c.id === campaignId) || campaigns[0];
    const unitPrice = parseFloat(campaign.price) || 0.5;
    const addedInstalls = 5;
    const earnedAmount = addedInstalls * unitPrice;

    // Shift money: verifying balance increases, and existing verifying moves to available
    setVerifyingBalance(prev => Math.round((prev + earnedAmount) * 100) / 100);
    setAvailableBalance(prev => Math.round((prev + 5.0) * 100) / 100);

    // Update campaign stats
    setCampaignStats(prev => {
      const exists = prev.find(s => s.campaignId === campaign.id);
      if (exists) {
        return prev.map(s =>
          s.campaignId === campaign.id
            ? { ...s, installs: s.installs + addedInstalls, earned: s.earned + earnedAmount }
            : s
        );
      }
      return [
        ...prev,
        {
          campaignId: campaign.id,
          campaignName: campaign.name,
          installs: addedInstalls,
          earned: earnedAmount,
          status: 'active',
        },
      ];
    });

    addNotification({
      title: 'Verified install simulation',
      subtitle: `+${addedInstalls} installs on ${campaign.name}`,
      body: `+$${earnedAmount.toFixed(2)} added to Verifying. System confirmed fraud checks passed.`,
      targetScreen: 'earnings',
      type: 'install',
    });
  }, [campaigns, addNotification]);

  // Withdraw flow
  const withdraw = useCallback((amount: number, methodId: string): { success: boolean; error?: string } => {
    const method = userProfile.payoutMethods.find(m => m.id === methodId) || userProfile.payoutMethods[0];
    if (!method) {
      return { success: false, error: 'No payout method selected. Connect one in Settings > Payment.' };
    }

    const validation = validateWithdrawal(amount, availableBalance, userProfile.minPayout);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const fee = calculateWithdrawalFee(amount, method.type);
    const net = Math.round((amount - fee) * 100) / 100;
    const newAvailable = Math.round((availableBalance - amount) * 100) / 100;
    const newPaidOut = Math.round((paidOutTotal + net) * 100) / 100;

    setAvailableBalance(newAvailable);
    setPaidOutTotal(newPaidOut);

    const newHistoryItem: PayoutHistoryItem = {
      id: `payout-${Date.now()}`,
      date: 'Today',
      description: 'Withdrawal settlement',
      method: `${method.name} (•••• ${method.last4})`,
      amount: net,
      status: 'Processing',
    };

    setPayoutHistory(prev => [newHistoryItem, ...prev]);

    addNotification({
      title: 'Withdrawal initiated',
      subtitle: `$${net.toFixed(2)} processing`,
      body: `Sent to ${method.name} (•••• ${method.last4}). Estimated arrival: ${method.type === 'card' ? 'within minutes' : '1–2 business days'}.`,
      targetScreen: 'earnings',
      type: 'payout',
    });

    return { success: true };
  }, [availableBalance, paidOutTotal, userProfile, addNotification]);

  // Founder flow: Create campaign
  const createCampaign = useCallback((data: Partial<Campaign>) => {
    const id = data.id || `camp-${Date.now()}`;
    const newCamp: Campaign = {
      id,
      name: data.name || 'Untitled campaign',
      b: data.b || userProfile.name,
      tag: data.tag || 'new app',
      cat: data.cat || 'Productivity',
      host: userProfile.name,
      bg: data.bg || '#B5D4F4',
      fg: data.fg || '#042C53',
      ic: data.ic || 'ti-bolt',
      days: 30,
      n: 0,
      price: data.price || '0.50',
      end: 'Nov 24',
      d: data.d || 'Newly launched campaign.',
      d2: data.d2 || 'Promote to your audience.',
      mine: 1,
    };

    setCampaigns(prev => [newCamp, ...prev]);

    addNotification({
      title: 'Campaign live',
      subtitle: newCamp.name,
      body: `Your campaign is active with a funded budget. Creators can now apply.`,
      targetScreen: 'manager',
      targetCampaignId: id,
      type: 'system',
    });
  }, [userProfile, addNotification]);

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUserProfile(DEFAULT_PROFILE);
    setCampaigns(INITIAL_CAMPAIGNS);
    setJoinedMap({ tempo: 2, lingo: 1, palazzo: 0, margin: 2, tavern: 2, loop: 0 });
    setCreatorRequests(INITIAL_CREATOR_REQUESTS);
    setAvailableBalance(142.5);
    setOnHoldBalance(84.0);
    setVerifyingBalance(29.5);
    setPaidOutTotal(410.0);
    setPayoutHistory(INITIAL_PAYOUT_HISTORY);
    setCampaignStats(DEFAULT_STATS);
    setNotifications(DEFAULT_NOTIFICATIONS);
    navigate('campaigns');
  }, [navigate]);

  const selectedCampaign =
    campaigns.find(k => k.id === selectedCampaignId) || campaigns[0];

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        selectedCampaignId,
        previousScreen,
        settingsTab,
        navigate,
        overlay,
        openOverlay,
        closeOverlay,
        userProfile,
        updateUserProfile,
        setAvatar,
        addPasskey,
        removePasskey,
        addPayoutMethod,
        removePayoutMethod,
        setDefaultPayoutMethod,
        campaigns,
        joinedMap,
        selectedCampaign,
        requestJoinCampaign,
        approveCreatorRequest,
        declineCreatorRequest,
        creatorRequests,
        createCampaign,
        availableBalance,
        onHoldBalance,
        verifyingBalance,
        paidOutTotal,
        payoutHistory,
        campaignStats,
        withdraw,
        simulateInstall,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
