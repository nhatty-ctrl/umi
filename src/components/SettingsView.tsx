import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SettingsTab } from '../types';

export function SettingsView() {
  const {
    settingsTab,
    navigate,
    userProfile,
    updateUserProfile,
    addPasskey,
    removePasskey,
    addPayoutMethod,
    removePayoutMethod,
    setDefaultPayoutMethod,
    simulateInstall,
  } = useApp();

  // Inline editing states for Account
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempHandle, setTempHandle] = useState(userProfile.handle);
  const [tempEmail, setTempEmail] = useState(userProfile.email);
  const [tempBio, setTempBio] = useState(userProfile.bio);

  // Passkey dialog state
  const [isPasskeyModalOpen, setIsPasskeyModalOpen] = useState(false);
  const [passkeyDeviceName, setPasskeyDeviceName] = useState('MacBook Pro (Touch ID)');

  // Payment method modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'bank' | 'card'>('bank');
  const [bankName, setBankName] = useState('Chase Checking');
  const [bankRouting, setBankRouting] = useState('021000021');
  const [bankAccountNum, setBankAccountNum] = useState('987654321');
  const [cardHolder, setCardHolder] = useState('Amara Bekele');
  const [cardNumber, setCardNumber] = useState('4242424242421094');

  // Developer simulation states
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([
    '[system] SDK sandbox initialized. Test webhook endpoints ready.',
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const tabs: { key: SettingsTab; label: string; icon: string }[] = [
    { key: 'account', label: 'Account', icon: 'ti-user' },
    { key: 'preferences', label: 'Preferences', icon: 'ti-adjustments' },
    { key: 'payment', label: 'Payment', icon: 'ti-credit-card' },
    { key: 'security', label: 'Security', icon: 'ti-shield-lock' },
    { key: 'developer', label: 'Developer', icon: 'ti-code' },
  ];

  const handleSaveField = (field: string) => {
    if (field === 'name') updateUserProfile({ name: tempName });
    if (field === 'handle') updateUserProfile({ handle: tempHandle });
    if (field === 'email') updateUserProfile({ email: tempEmail });
    if (field === 'bio') updateUserProfile({ bio: tempBio });
    setEditingField(null);
  };

  const handleCancelField = (field: string) => {
    if (field === 'name') setTempName(userProfile.name);
    if (field === 'handle') setTempHandle(userProfile.handle);
    if (field === 'email') setTempEmail(userProfile.email);
    if (field === 'bio') setTempBio(userProfile.bio);
    setEditingField(null);
  };

  const handleCreatePasskey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyDeviceName.trim()) return;
    addPasskey(passkeyDeviceName.trim());
    setIsPasskeyModalOpen(false);
    setPasskeyDeviceName('');
  };

  const handleAddPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentType === 'bank') {
      const last4 = bankAccountNum.slice(-4) || '9876';
      addPayoutMethod({
        type: 'bank',
        name: bankName || 'Bank Checking',
        last4,
        routingNumber: bankRouting,
      });
    } else {
      const last4 = cardNumber.slice(-4) || '4242';
      addPayoutMethod({
        type: 'card',
        name: `${cardHolder || 'Visa'} Debit`,
        last4,
      });
    }
    setIsPaymentModalOpen(false);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    simulateInstall('tempo');
    const timestamp = new Date().toLocaleTimeString();
    setSimulatedLogs(prev => [
      `[${timestamp}] POST /v1/events/install HTTP/1.1 200 OK (Campaign: Tempo Run, attribution: amara, payout: +$2.50)`,
      ...prev,
    ]);
    setTimeout(() => setIsSimulating(false), 600);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumb: Profile / Settings */}
      <div className="flex items-center gap-2 text-xs text-[#9C9A92] pb-1 border-b border-[#181818]">
        <button
          onClick={() => navigate('profile')}
          className="hover:text-[#F4F2EC] transition-colors flex items-center gap-1 font-medium"
        >
          <i className="ti ti-user text-xs" />
          <span>Profile</span>
        </button>
        <span className="text-[#555555]">/</span>
        <span className="text-[#F4F2EC] font-medium">Settings</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F4F2EC]">
            Settings
          </h1>
          <div className="text-xs text-[#9C9A92] mt-1">
            Manage your account credentials, notifications, payouts, and developer sandbox
          </div>
        </div>
      </div>

      {/* Main Settings Layout: Left Sub-nav (220px, sticky) + Right Two-Column Grid filling width */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-8 items-start">
        {/* Left Sub-nav */}
        <nav
          className="md:sticky md:top-6 bg-[#0A0A0A] border border-[#1a1a1a] rounded-2xl p-2 space-y-1 select-none"
          aria-label="Settings categories"
        >
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => navigate('settings', undefined, tab.key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left ${
                settingsTab === tab.key
                  ? 'bg-[#181818] text-[#F4F2EC] shadow-sm'
                  : 'text-[#9C9A92] hover:bg-[#121212] hover:text-[#F4F2EC]'
              }`}
            >
              <i className={`ti ${tab.icon} text-base shrink-0`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Two-Column Grid filling full desktop width */}
        <div className="min-w-0">
          {/* TAB: ACCOUNT */}
          {settingsTab === 'account' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Profile Information Box */}
              <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#9C9A92] pb-1 border-b border-[#181818]">
                  Personal Profile
                </div>

                {/* Display Name */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs text-[#9C9A92]">Full Name</div>
                  {editingField === 'name' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={e => setTempName(e.target.value)}
                        className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-lg px-2.5 py-1 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                      />
                      <button
                        onClick={() => handleSaveField('name')}
                        className="px-2.5 py-1 rounded-lg text-xs bg-[#F4F2EC] text-black font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancelField('name')}
                        className="px-2.5 py-1 rounded-lg text-xs bg-[#1a1a1a] text-[#9C9A92]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-[#F4F2EC]">{userProfile.name}</span>
                      <button
                        onClick={() => {
                          setTempName(userProfile.name);
                          setEditingField('name');
                        }}
                        className="text-xs text-[#C9B8FF] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-1.5 pt-3 border-t border-[#141414]">
                  <div className="text-xs text-[#9C9A92]">Username / Handle</div>
                  {editingField === 'handle' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempHandle}
                        onChange={e => setTempHandle(e.target.value)}
                        className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-lg px-2.5 py-1 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                      />
                      <button
                        onClick={() => handleSaveField('handle')}
                        className="px-2.5 py-1 rounded-lg text-xs bg-[#F4F2EC] text-black font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancelField('handle')}
                        className="px-2.5 py-1 rounded-lg text-xs bg-[#1a1a1a] text-[#9C9A92]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-[#F4F2EC]">@{userProfile.handle}</span>
                      <button
                        onClick={() => {
                          setTempHandle(userProfile.handle);
                          setEditingField('handle');
                        }}
                        className="text-xs text-[#C9B8FF] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5 pt-3 border-t border-[#141414]">
                  <div className="text-xs text-[#9C9A92]">Primary Email</div>
                  {editingField === 'email' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={tempEmail}
                        onChange={e => setTempEmail(e.target.value)}
                        className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-lg px-2.5 py-1 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                      />
                      <button
                        onClick={() => handleSaveField('email')}
                        className="px-2.5 py-1 rounded-lg text-xs bg-[#F4F2EC] text-black font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancelField('email')}
                        className="px-2.5 py-1 rounded-lg text-xs bg-[#1a1a1a] text-[#9C9A92]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-[#F4F2EC]">{userProfile.email}</span>
                      <button
                        onClick={() => {
                          setTempEmail(userProfile.email);
                          setEditingField('email');
                        }}
                        className="text-xs text-[#C9B8FF] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Creator Bio & Social Channels */}
              <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#9C9A92] pb-1 border-b border-[#181818]">
                  Bio &amp; Creator Channels
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-xs text-[#9C9A92]">Creator Pitch / Bio</div>
                  {editingField === 'bio' ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={tempBio}
                        onChange={e => setTempBio(e.target.value)}
                        className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF] resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveField('bio')}
                          className="px-3 py-1 rounded-lg text-xs bg-[#F4F2EC] text-black font-semibold"
                        >
                          Save Bio
                        </button>
                        <button
                          onClick={() => handleCancelField('bio')}
                          className="px-3 py-1 rounded-lg text-xs bg-[#1a1a1a] text-[#9C9A92]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs text-[#C8C6BE] leading-relaxed">{userProfile.bio}</p>
                      <button
                        onClick={() => {
                          setTempBio(userProfile.bio);
                          setEditingField('bio');
                        }}
                        className="text-xs text-[#C9B8FF] hover:underline shrink-0"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#141414] space-y-2 text-xs">
                  <div className="text-[#9C9A92]">Connected Platforms</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#121212] border border-[#1f1f1f] flex items-center gap-2">
                      <i className="ti ti-brand-tiktok text-[#C9B8FF]" />
                      <span className="truncate text-[#F4F2EC]">{userProfile.channels.tiktok}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#121212] border border-[#1f1f1f] flex items-center gap-2">
                      <i className="ti ti-brand-youtube text-red-400" />
                      <span className="truncate text-[#F4F2EC]">{userProfile.channels.youtube}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PREFERENCES */}
          {settingsTab === 'preferences' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Notification Toggles */}
              <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#9C9A92] pb-1 border-b border-[#181818]">
                  Notification Channels
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-sm text-[#F4F2EC]">Campaign updates</div>
                    <div className="text-xs text-[#9C9A92]">Alert when application status changes.</div>
                  </div>
                  <button
                    onClick={() =>
                      updateUserProfile({
                        notifications: {
                          ...userProfile.notifications,
                          campaign: !userProfile.notifications.campaign,
                        },
                      })
                    }
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      userProfile.notifications.campaign ? 'bg-[#C9B8FF]' : 'bg-[#222222]'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                        userProfile.notifications.campaign
                          ? 'translate-x-4 bg-black'
                          : 'bg-[#9C9A92]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-[#141414]">
                  <div>
                    <div className="font-medium text-sm text-[#F4F2EC]">Payout settlements</div>
                    <div className="text-xs text-[#9C9A92]">Notify when Friday payouts clear.</div>
                  </div>
                  <button
                    onClick={() =>
                      updateUserProfile({
                        notifications: {
                          ...userProfile.notifications,
                          payouts: !userProfile.notifications.payouts,
                        },
                      })
                    }
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      userProfile.notifications.payouts ? 'bg-[#C9B8FF]' : 'bg-[#222222]'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                        userProfile.notifications.payouts
                          ? 'translate-x-4 bg-black'
                          : 'bg-[#9C9A92]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-[#141414]">
                  <div>
                    <div className="font-medium text-sm text-[#F4F2EC]">Creator requests</div>
                    <div className="text-xs text-[#9C9A92]">For your hosted app campaigns.</div>
                  </div>
                  <button
                    onClick={() =>
                      updateUserProfile({
                        notifications: {
                          ...userProfile.notifications,
                          creatorRequests: !userProfile.notifications.creatorRequests,
                        },
                      })
                    }
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      userProfile.notifications.creatorRequests ? 'bg-[#C9B8FF]' : 'bg-[#222222]'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                        userProfile.notifications.creatorRequests
                          ? 'translate-x-4 bg-black'
                          : 'bg-[#9C9A92]'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Display & Currency */}
              <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#9C9A92] pb-1 border-b border-[#181818]">
                  Regional &amp; Currency
                </div>

                <div className="space-y-1.5 py-1">
                  <div className="text-xs text-[#9C9A92]">Display Currency</div>
                  <div className="p-3 rounded-xl bg-[#121212] border border-[#1f1f1f] flex items-center justify-between text-xs text-[#F4F2EC]">
                    <span>USD ($) — United States Dollar</span>
                    <span className="text-[#C9B8FF] font-semibold">Active</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-[#141414]">
                  <div className="text-xs text-[#9C9A92]">Attribution Timezone</div>
                  <div className="p-3 rounded-xl bg-[#121212] border border-[#1f1f1f] text-xs text-[#F4F2EC]">
                    UTC (Coordinated Universal Time)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAYMENT */}
          {settingsTab === 'payment' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Linked Payout Methods */}
              <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-[#181818]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9C9A92]">
                    Linked Payout Methods
                  </span>
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C9B8FF] hover:underline font-semibold"
                  >
                    <i className="ti ti-plus" />
                    <span>Add Method</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {userProfile.payoutMethods.map(m => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl bg-[#121212] border border-[#1f1f1f] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center shrink-0">
                          <i
                            className={`ti ${
                              m.type === 'bank' ? 'ti-building-bank' : 'ti-credit-card'
                            } text-[#C9B8FF] text-base`}
                          />
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-[#F4F2EC] flex items-center gap-2">
                            <span>{m.name}</span>
                            {m.isDefault && (
                              <span className="text-[10px] bg-[#C9B8FF]/15 text-[#C9B8FF] px-2 py-0.5 rounded-full font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#9C9A92]">
                            •••• {m.last4} {m.routingNumber ? `· Routing ${m.routingNumber}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!m.isDefault && (
                          <button
                            onClick={() => setDefaultPayoutMethod(m.id)}
                            className="px-2 py-1 rounded-lg text-[11px] bg-[#1a1a1a] hover:bg-[#222222] text-[#C8C6BE]"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => removePayoutMethod(m.id)}
                          className="p-1 text-[#9C9A92] hover:text-red-400"
                          title="Remove payout method"
                        >
                          <i className="ti ti-trash text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {userProfile.payoutMethods.length === 0 && (
                    <div className="text-center py-6 text-xs text-[#9C9A92]">
                      No payout methods linked. Add a bank account or debit card to withdraw funds.
                    </div>
                  )}
                </div>
              </div>

              {/* Settlement & Threshold Settings */}
              <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#9C9A92] pb-1 border-b border-[#181818]">
                  Payout Rules
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-[#9C9A92]">Minimum Withdrawal Threshold</div>
                  <div className="flex gap-2">
                    {[50, 100, 250].map(val => (
                      <button
                        key={val}
                        onClick={() => updateUserProfile({ minPayout: val })}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors tabular-nums ${
                          userProfile.minPayout === val
                            ? 'bg-[#F4F2EC] text-black border-white'
                            : 'bg-[#121212] text-[#9C9A92] border-[#222222] hover:text-[#F4F2EC]'
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#9C9A92] leading-relaxed pt-1">
                    Withdrawal requests are validated against this minimum threshold.
                  </p>
                </div>

                <div className="pt-3 border-t border-[#141414] space-y-1.5 text-xs">
                  <div className="text-[#9C9A92]">Weekly Settlement Schedule</div>
                  <div className="p-3 rounded-xl bg-[#121212] border border-[#1f1f1f] text-xs leading-relaxed text-[#C8C6BE]">
                    Balances above ${userProfile.minPayout} automatically clear every{' '}
                    <strong className="text-[#F4F2EC]">Friday at 18:00 UTC</strong> with zero
                    transfer fee to your default account.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SECURITY */}
          {settingsTab === 'security' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Hardware Passkeys */}
              <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-[#181818]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9C9A92]">
                    Hardware Passkeys
                  </span>
                  <button
                    onClick={() => setIsPasskeyModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C9B8FF] hover:underline font-semibold"
                  >
                    <i className="ti ti-plus" />
                    <span>Add Passkey</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {userProfile.passkeys.map(pk => (
                    <div
                      key={pk.id}
                      className="p-3 rounded-xl bg-[#121212] border border-[#1f1f1f] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <i className="ti ti-fingerprint text-[#C9B8FF] text-lg" />
                        <div>
                          <div className="font-medium text-[#F4F2EC]">{pk.name}</div>
                          <div className="text-[11px] text-[#9C9A92]">
                            Added {pk.created} · Last used: {pk.lastUsed || 'Never'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removePasskey(pk.id)}
                        className="p-1 text-[#9C9A92] hover:text-red-400"
                        title="Delete passkey"
                      >
                        <i className="ti ti-trash" />
                      </button>
                    </div>
                  ))}

                  {userProfile.passkeys.length === 0 && (
                    <div className="text-center py-6 text-xs text-[#9C9A92]">
                      No passkeys registered. Add Touch ID or Face ID for fast login.
                    </div>
                  )}
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#9C9A92] pb-1 border-b border-[#181818]">
                  Two-Factor Authentication
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-sm text-[#F4F2EC]">Authenticator app</div>
                    <div className="text-xs text-[#9C9A92]">
                      Require verification code during sign in and withdrawal.
                    </div>
                  </div>
                  <button
                    onClick={() => updateUserProfile({ twoFactor: !userProfile.twoFactor })}
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      userProfile.twoFactor ? 'bg-[#C9B8FF]' : 'bg-[#222222]'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                        userProfile.twoFactor ? 'translate-x-4 bg-black' : 'bg-[#9C9A92]'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#121212] border border-[#1f1f1f] text-xs text-[#9C9A92] leading-relaxed">
                  2FA protects against unauthorized withdrawals and ensures your creator earnings
                  cannot be transferred without verification.
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEVELOPER (with Simulate Install action) */}
          {settingsTab === 'developer' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* SDK Keys & Test Runner */}
              <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#9C9A92] pb-1 border-b border-[#181818]">
                  API &amp; SDK Keys
                </div>

                {/* Publishable Key */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#9C9A92]">
                    <span>Publishable Key</span>
                    <span className="text-[#C9B8FF]">Safe for mobile binaries</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#121212] border border-[#1f1f1f] text-xs">
                    <span className="font-mono text-[#F4F2EC] flex-1 truncate">
                      umi_pk_live_49f82bc19a7e3d
                    </span>
                    <button
                      onClick={() => handleCopy('umi_pk_live_49f82bc19a7e3d', 'pk')}
                      className="px-2.5 py-1 rounded-lg bg-[#1c1c1c] text-[#C8C6BE] hover:text-white"
                    >
                      {copiedKey === 'pk' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Secret Key */}
                <div className="space-y-1.5 pt-2 border-t border-[#141414]">
                  <div className="flex justify-between text-xs text-[#9C9A92]">
                    <span>Secret Key</span>
                    <span className="text-amber-400">Server-side only</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#121212] border border-[#1f1f1f] text-xs">
                    <span className="font-mono text-[#F4F2EC] flex-1 truncate">
                      {secretRevealed
                        ? 'umi_sk_live_83ad019bf2e99d4ca1'
                        : 'umi_sk_live_••••••••••••••••••••'}
                    </span>
                    <button
                      onClick={() => setSecretRevealed(prev => !prev)}
                      className="px-2 py-1 rounded-lg bg-[#1c1c1c] text-[#C8C6BE] hover:text-white"
                    >
                      {secretRevealed ? 'Hide' : 'Reveal'}
                    </button>
                    <button
                      onClick={() => handleCopy('umi_sk_live_83ad019bf2e99d4ca1', 'sk')}
                      className="px-2.5 py-1 rounded-lg bg-[#1c1c1c] text-[#C8C6BE] hover:text-white"
                    >
                      {copiedKey === 'sk' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Install Simulation Console */}
              <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-[#181818]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9C9A92]">
                    Verified Install Simulation
                  </span>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Sandbox Active
                  </span>
                </div>

                <p className="text-xs text-[#9C9A92] leading-relaxed">
                  Trigger synthetic verified installs for your joined campaigns. This increments the
                  install count, credits your Verifying balance, updates the stacked chart, and
                  creates an in-app notification.
                </p>

                <button
                  type="button"
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#C9B8FF] text-black hover:bg-[#d8caff] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <i className={`ti ti-bolt ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Simulating Install...' : 'Simulate Verified Install (+5)'}</span>
                </button>

                {/* Event Log Output */}
                <div className="p-3 rounded-xl bg-[#070707] border border-[#181818] space-y-1 font-mono text-[11px] text-[#A1A1AA] max-h-36 overflow-y-auto">
                  {simulatedLogs.map((log, idx) => (
                    <div key={idx} className="leading-snug break-all">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PASSKEY MODAL (position: fixed) */}
      {isPasskeyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsPasskeyModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-[#0C0C0C] border border-[#222222] rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1a1a1a]">
              <h3 className="font-semibold text-sm text-[#F4F2EC]">Register Hardware Passkey</h3>
              <button
                onClick={() => setIsPasskeyModalOpen(false)}
                className="text-[#9C9A92] hover:text-[#F4F2EC] p-1"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            <form onSubmit={handleCreatePasskey} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] text-[#9C9A92] block mb-1">Device Name</label>
                <input
                  type="text"
                  required
                  value={passkeyDeviceName}
                  onChange={e => setPasskeyDeviceName(e.target.value)}
                  placeholder="e.g. MacBook Air Touch ID"
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#141414] text-[11px] text-[#9C9A92] leading-relaxed">
                Your device will prompt you for biometric confirmation (Fingerprint or Face).
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasskeyModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#161616]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#F4F2EC] text-black font-semibold hover:bg-white"
                >
                  Save Passkey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT METHOD MODAL (position: fixed) */}
      {isPaymentModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsPaymentModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0C0C0C] border border-[#222222] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1a1a1a]">
              <h3 className="font-semibold text-base text-[#F4F2EC]">Add Payout Method</h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-[#9C9A92] hover:text-[#F4F2EC] p-1"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            {/* Type selector */}
            <div className="flex gap-2 p-1 bg-[#141414] rounded-xl border border-[#222222]">
              <button
                type="button"
                onClick={() => setPaymentType('bank')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  paymentType === 'bank'
                    ? 'bg-[#222222] text-[#F4F2EC] font-semibold'
                    : 'text-[#9C9A92]'
                }`}
              >
                Bank Account (0% fee)
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('card')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  paymentType === 'card'
                    ? 'bg-[#222222] text-[#F4F2EC] font-semibold'
                    : 'text-[#9C9A92]'
                }`}
              >
                Debit Card (1% fee)
              </button>
            </div>

            <form onSubmit={handleAddPayout} className="space-y-3 text-xs">
              {paymentType === 'bank' ? (
                <>
                  <div>
                    <label className="text-[11px] text-[#9C9A92] block mb-1">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      placeholder="Chase Checking"
                      className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#9C9A92] block mb-1">Routing Number</label>
                      <input
                        type="text"
                        required
                        value={bankRouting}
                        onChange={e => setBankRouting(e.target.value)}
                        placeholder="021000021"
                        className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9C9A92] block mb-1">Account Number</label>
                      <input
                        type="text"
                        required
                        value={bankAccountNum}
                        onChange={e => setBankAccountNum(e.target.value)}
                        placeholder="987654321"
                        className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[11px] text-[#9C9A92] block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      placeholder="Amara Bekele"
                      className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#9C9A92] block mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 1094"
                      className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#161616]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#F4F2EC] text-black font-semibold hover:bg-white"
                >
                  Link Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
