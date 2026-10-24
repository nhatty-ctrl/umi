export type ScreenType =
  | 'campaigns'
  | 'campaign'
  | 'manager'
  | 'earnings'
  | 'create'
  | 'profile'
  | 'settings'
  | 'keys'
  | 'docs'
  | 'onboarding';

export type OverlayType = 'search' | 'notif' | 'more' | 'req' | 'withdraw' | null;

export type AvatarExpression =
  | 'Builder'
  | 'Operator'
  | 'Visionary'
  | 'Maker'
  | 'Boss'
  | 'Streamer'
  | 'Vlogger'
  | 'Trendsetter'
  | 'Chill'
  | 'Hype';

export type SettingsTab = 'account' | 'preferences' | 'payment' | 'security' | 'developer';

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

export interface CreatorRequest {
  id: string;
  n: string;
  h: string;
  c: string;
  ch: string;
  past: number;
  qual: string;
  note: string;
  status: number; // 0 = pending, 1 = approved, 2 = declined
  campaignId?: string;
  appliedDate?: string;
}

export interface ManagerCreator {
  name: string;
  handle: string;
  platform: string;
  installs: number;
  quality: number;
  joined: string;
  ratePerDay: number;
  bestDay: number;
  id: number;
}

export interface PayoutHistoryItem {
  id?: string;
  date: string;
  description: string;
  method: string;
  amount: number;
  status: 'Paid' | 'Processing' | 'Failed';
}

export interface ActivityInvoice {
  date: string;
  description: string;
  status: string;
  amount: number;
}

export interface Passkey {
  id: string;
  name: string;
  created: string;
  lastUsed?: string;
}

export interface PayoutMethod {
  id: string;
  type: 'bank' | 'card';
  name: string;
  last4: string;
  isDefault: boolean;
  routingNumber?: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  email: string;
  bio: string;
  role: 'creator' | 'founder';
  avatarColor: string;
  avatarExpression: AvatarExpression;
  channels: {
    tiktok: string;
    youtube: string;
    instagram: string;
    twitter: string;
  };
  twoFactor: boolean;
  passkeys: Passkey[];
  payoutMethods: PayoutMethod[];
  minPayout: number;
  notifications: {
    campaign: boolean;
    recommendations: boolean;
    creatorRequests: boolean;
    payouts: boolean;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  date: string;
  unread: boolean;
  targetScreen: ScreenType;
  targetCampaignId?: string;
  type: 'approval' | 'payout' | 'install' | 'request' | 'system';
}

export interface CampaignEarningsStat {
  campaignId: string;
  campaignName: string;
  installs: number;
  earned: number;
  status: 'active' | 'completed';
}

export interface CampaignAnnouncement {
  id: string;
  author: string;
  date: string;
  text: string;
  reach: number;
}

export interface CampaignBonusTier {
  id: string;
  installs: number;
  bonusAmount: number;
  active: boolean;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  created: string;
  lastUsed: string;
}

