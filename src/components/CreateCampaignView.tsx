import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AvatarSvg } from './UmiGraphic';

export function CreateCampaignView() {
  const { navigate, createCampaign, userProfile } = useApp();

  const [step, setStep] = useState<number>(0); // 0: editor, 1: sdk, 2: deposit, 3: stripe, 4: live
  const [hasSentTestEvent, setHasSentTestEvent] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Editor form state
  const [campaignTitle, setCampaignTitle] = useState('Dune Notes');
  const [appStoreLink, setAppStoreLink] = useState('apps.apple.com/app/dune-notes');
  const [playStoreLink, setPlayStoreLink] = useState('');
  const [description, setDescription] = useState(
    'Show how you use Dune Notes in your daily routine. Film real usage from opening the app to saving a fast note.'
  );

  // Brief and terms editors
  const [briefAdded, setBriefAdded] = useState(true);
  const [assetsAdded, setAssetsAdded] = useState(true);
  const [termsAdded, setTermsAdded] = useState(true);

  // Settings
  const [isPublic, setIsPublic] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [showCreatorCount, setShowCreatorCount] = useState(true);
  const [dailyInstallCap, setDailyInstallCap] = useState(false);
  const [creatorQrCodes, setCreatorQrCodes] = useState(true);
  const [closeApplications, setCloseApplications] = useState(false);
  const [rewardPerInstall, setRewardPerInstall] = useState(0.5);
  const [budget, setBudget] = useState('500');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([
    'TikTok',
    'YouTube',
  ]);

  // Step 3 Stripe connection simulation
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setStep(4);
        createCampaign({
          id: 'dune',
          name: campaignTitle || 'Dune Notes',
          b: 'Dune',
          tag: 'quick notes',
          cat: 'Productivity',
          price: rewardPerInstall.toFixed(2),
          d: description,
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, campaignTitle, description, rewardPerInstall, createCampaign]);

  const handleCopyKey = () => {
    navigator.clipboard?.writeText('umi_pk_test_3c9d1b7a');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const toggleQuestion = (q: string) => {
    setSelectedQuestions(prev =>
      prev.includes(q) ? prev.filter(item => item !== q) : [...prev, q]
    );
  };

  const totalDepositWithFee = (parseFloat(budget) || 500) * 1.07;

  return (
    <div className="w-full space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between pb-2 border-b border-[#181818]">
        <button
          onClick={() => navigate('campaigns')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#141414] border border-[#222222] text-[#F4F2EC] hover:bg-[#1a1a1a] transition-colors"
        >
          <i className="ti ti-arrow-left" />
          <span>Back to campaigns</span>
        </button>

        <span className="text-xs text-[#9C9A92]">Founder Campaign Launch Wizard</span>
      </div>

      {/* Progress Segments */}
      <div className="flex gap-2 max-w-md mx-auto mb-6">
        {[
          { label: 'Details', idx: 0 },
          { label: 'SDK Probe', idx: 1 },
          { label: 'Deposit', idx: 2 },
          { label: 'Live', idx: 4 },
        ].map(s => (
          <div key={s.idx} className="flex-1 space-y-1 text-center">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                step >= s.idx ? 'bg-[#C9B8FF]' : 'bg-[#1e1e1e]'
              }`}
            />
            <span className="text-[10px] text-[#9C9A92] font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 0: FULL EDITOR */}
      {step === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] [@media(min-width:1680px)]:grid-cols-[minmax(0,1fr)_360px] gap-10 items-start">
          {/* Left Column: Form Details */}
          <div className="space-y-6 min-w-0">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#F4F2EC]">
              New Campaign
            </h1>

            {/* Visual Cover Uploader */}
            <div className="relative rounded-3xl overflow-hidden aspect-[21/9] bg-[#B5D4F4] text-[#042C53] flex items-center justify-center border border-white/10 shadow-xl">
              <div className="flex flex-col items-center">
                <i className="ti ti-bolt text-5xl md:text-6xl" />
                <span className="text-base font-semibold mt-1">{campaignTitle}</span>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#141414]/90 backdrop-blur-md border border-[#222222] rounded-xl px-3 py-1.5 shadow-lg">
                <span className="text-xs font-semibold text-[#F4F2EC]">Cover Ready</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#9C9A92]">Campaign Title</label>
              <input
                type="text"
                value={campaignTitle}
                onChange={e => setCampaignTitle(e.target.value)}
                placeholder="Campaign title"
                className="w-full bg-[#121212] border border-[#222222] rounded-2xl px-4 py-3 text-lg font-semibold tracking-tight text-[#F4F2EC] placeholder-[#4a4945] outline-none focus:border-[#C9B8FF]"
              />
            </div>

            {/* Founder Block */}
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#1a1a1a] flex items-center gap-3">
              <AvatarSvg
                color={userProfile.avatarColor}
                expression={userProfile.avatarExpression}
                size={36}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-[#F4F2EC]">{userProfile.name}</div>
                <div className="text-[11px] text-[#9C9A92]">@{userProfile.handle} · Host Founder</div>
              </div>
              <span className="text-[10px] bg-[#C9B8FF]/15 text-[#C9B8FF] px-2 py-0.5 rounded-full font-medium">
                Verified
              </span>
            </div>

            {/* App Store Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#9C9A92]">Apple App Store URL</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#121212] border border-[#222222] rounded-xl text-xs">
                  <i className="ti ti-brand-apple text-base text-[#9C9A92]" />
                  <input
                    type="text"
                    value={appStoreLink}
                    onChange={e => setAppStoreLink(e.target.value)}
                    className="bg-transparent border-0 outline-none text-[#F4F2EC] w-full"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#9C9A92]">Google Play Store URL</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#121212] border border-[#222222] rounded-xl text-xs">
                  <i className="ti ti-brand-google-play text-base text-[#9C9A92]" />
                  <input
                    type="text"
                    value={playStoreLink}
                    onChange={e => setPlayStoreLink(e.target.value)}
                    placeholder="play.google.com/store/apps/..."
                    className="bg-transparent border-0 outline-none text-[#F4F2EC] w-full placeholder-[#555]"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#9C9A92]">Campaign Pitch &amp; Creator Angle</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#121212] border border-[#222222] rounded-2xl p-3.5 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF] leading-relaxed resize-none"
              />
            </div>

            {/* Campaign Attachments */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl border border-[#1a1a1a] bg-[#0A0A0A] flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[#F4F2EC]">Creator talking points</div>
                  <div className="text-[11px] text-[#9C9A92]">Show one tap quick note taking.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setBriefAdded(prev => !prev)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    briefAdded
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#181818]'
                  }`}
                >
                  {briefAdded ? 'Attached' : 'Attach'}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#1a1a1a] bg-[#0A0A0A] flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[#F4F2EC]">Brand assets &amp; logo kit</div>
                  <div className="text-[11px] text-[#9C9A92]">SVG icons and high-res screenshots.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAssetsAdded(prev => !prev)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    assetsAdded
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#181818]'
                  }`}
                >
                  {assetsAdded ? 'Attached' : 'Attach'}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#1a1a1a] bg-[#0A0A0A] flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[#F4F2EC]">Creator partnership terms</div>
                  <div className="text-[11px] text-[#9C9A92]">Mandatory FTC sponsorship disclosure.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setTermsAdded(prev => !prev)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    termsAdded
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#181818]'
                  }`}
                >
                  {termsAdded ? 'Enforced' : 'Enforce'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Settings (Sticky at top 24px) */}
          <div className="border border-[#1a1a1a] rounded-3xl p-5 bg-[#0A0A0A] space-y-4 lg:sticky lg:top-6 min-w-0 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#181818]">
              <h3 className="font-semibold text-sm text-[#F4F2EC]">Campaign Rules</h3>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#C9B8FF] text-black hover:bg-[#d8caff] transition-colors"
              >
                Proceed &rarr;
              </button>
            </div>

            {/* Switches */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-[#C8C6BE]">Public discovery listing</span>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={e => setIsPublic(e.target.checked)}
                  className="accent-[#C9B8FF] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between py-1 border-t border-[#141414]">
                <span className="text-[#C8C6BE]">Require founder approval</span>
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={e => setRequireApproval(e.target.checked)}
                  className="accent-[#C9B8FF] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between py-1 border-t border-[#141414]">
                <span className="text-[#C8C6BE]">Show active creator count</span>
                <input
                  type="checkbox"
                  checked={showCreatorCount}
                  onChange={e => setShowCreatorCount(e.target.checked)}
                  className="accent-[#C9B8FF] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between py-1 border-t border-[#141414]">
                <span className="text-[#C8C6BE]">Daily install cap</span>
                <input
                  type="checkbox"
                  checked={dailyInstallCap}
                  onChange={e => setDailyInstallCap(e.target.checked)}
                  className="accent-[#C9B8FF] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between py-1 border-t border-[#141414]">
                <span className="text-[#C8C6BE]">Creator QR codes enabled</span>
                <input
                  type="checkbox"
                  checked={creatorQrCodes}
                  onChange={e => setCreatorQrCodes(e.target.checked)}
                  className="accent-[#C9B8FF] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between py-1 border-t border-[#141414]">
                <span className="text-[#C8C6BE]">Close applications</span>
                <input
                  type="checkbox"
                  checked={closeApplications}
                  onChange={e => setCloseApplications(e.target.checked)}
                  className="accent-[#C9B8FF] cursor-pointer"
                />
              </div>
            </div>

            {/* Reward Per Install */}
            <div className="pt-3 border-t border-[#181818] space-y-1.5">
              <div className="text-[11px] text-[#9C9A92]">Reward per verified install</div>
              <div className="flex items-center justify-between px-3 h-10 bg-[#141414] border border-[#222222] rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setRewardPerInstall(prev => Math.max(0.1, prev - 0.05))}
                  className="text-base text-[#9C9A92] hover:text-[#F4F2EC] px-1 font-bold"
                >
                  −
                </button>
                <span className="font-semibold text-sm text-[#F4F2EC] tabular-nums">
                  ${rewardPerInstall.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => setRewardPerInstall(prev => Math.min(5, prev + 0.05))}
                  className="text-base text-[#9C9A92] hover:text-[#F4F2EC] px-1 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Budget */}
            <div className="pt-2 border-t border-[#181818] space-y-1.5">
              <div className="text-[11px] text-[#9C9A92]">Initial Campaign Budget</div>
              <div className="flex items-center px-3 h-10 bg-[#141414] border border-[#222222] rounded-xl text-xs">
                <span className="text-[#9C9A92] mr-1">$</span>
                <input
                  type="text"
                  value={budget}
                  onChange={e => setBudget(e.target.value.replace(/[^0-9]/g, ''))}
                  className="bg-transparent border-0 outline-none w-full text-[#F4F2EC] font-semibold tabular-nums"
                />
              </div>
            </div>

            {/* Application Questions */}
            <div className="pt-2 border-t border-[#181818] space-y-2">
              <div className="text-[11px] text-[#9C9A92]">Application questions</div>
              <div className="flex flex-wrap gap-1.5">
                {['TikTok', 'YouTube', 'Instagram', 'Twitter / X', 'Custom'].map(q => {
                  const isSelected = selectedQuestions.includes(q);
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => toggleQuestion(q)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#F4F2EC] text-[#000000] font-semibold'
                          : 'bg-[#141414] border border-[#222222] text-[#9C9A92] hover:text-[#F4F2EC]'
                      }`}
                    >
                      <i className={`ti ${isSelected ? 'ti-check' : 'ti-plus'}`} />
                      <span>{q}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: CONNECT SDK */}
      {step === 1 && (
        <div className="max-w-xl mx-auto space-y-5 bg-[#0A0A0A] border border-[#1a1a1a] rounded-3xl p-7 shadow-2xl">
          <div>
            <h2 className="text-2xl font-serif font-medium text-[#F4F2EC]">Connect the SDK</h2>
            <p className="text-xs text-[#9C9A92] mt-1">
              Verify your integration in test mode before funding the budget.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs text-[#9C9A92]">Test API Key</div>
            <div className="flex items-center gap-2 bg-[#121212] border border-[#222222] rounded-xl px-3 py-2.5 font-mono text-xs text-[#F4F2EC]">
              <span className="flex-1 truncate">umi_pk_test_3c9d1b7a</span>
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-2.5 py-1 rounded-lg bg-[#1c1c1c] text-[#C8C6BE] hover:text-white"
              >
                {copiedKey ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-[#9C9A92]">Swift Package initialization</div>
            <div className="bg-[#121212] border border-[#222222] rounded-xl p-3 font-mono text-xs text-[#D8D7D2]">
              Umi.configure(apiKey: &ldquo;umi_pk_test_3c9d1b7a&rdquo;)
            </div>
          </div>

          {/* Test Event Probe */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#F4F2EC] flex items-center gap-1.5">
                <span>{hasSentTestEvent ? 'Test event verified' : 'Waiting for test event'}</span>
                {hasSentTestEvent && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
              </div>
              <div className="text-[11px] text-[#9C9A92] mt-0.5">
                {hasSentTestEvent
                  ? 'Attribution handshake verified successfully.'
                  : 'Trigger a simulated event or launch your debug app build.'}
              </div>
            </div>

            {hasSentTestEvent ? (
              <i className="ti ti-circle-check text-2xl text-[#C9B8FF]" />
            ) : (
              <button
                type="button"
                onClick={() => setHasSentTestEvent(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#C9B8FF] text-black hover:bg-[#d8caff] transition-colors"
              >
                Send Test Event
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#181818]">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#1a1a1a]"
            >
              Back
            </button>
            {/* Disabled until test event is verified */}
            <button
              type="button"
              disabled={!hasSentTestEvent}
              onClick={() => setStep(2)}
              className={`px-5 py-2 text-xs font-semibold rounded-full transition-colors ${
                hasSentTestEvent
                  ? 'bg-[#F4F2EC] text-black hover:bg-white cursor-pointer shadow-md'
                  : 'bg-[#181818] text-[#555] border border-[#222222] cursor-not-allowed'
              }`}
            >
              Continue to Deposit &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DEPOSIT BUDGET */}
      {step === 2 && (
        <div className="max-w-md mx-auto space-y-5 bg-[#0A0A0A] border border-[#1a1a1a] rounded-3xl p-7 shadow-2xl">
          <div>
            <h2 className="text-2xl font-serif font-medium text-[#F4F2EC]">Deposit your budget</h2>
            <p className="text-xs text-[#9C9A92] mt-1 leading-relaxed">
              Funds are held safely in escrow and disbursed only upon verified install confirmation.
              Unused deposit can be refunded anytime.
            </p>
          </div>

          <div className="bg-[#121212] border border-[#222222] rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-[#9C9A92]">
              <span>Creator Escrow (100% to creators)</span>
              <span className="text-[#F4F2EC] tabular-nums">${budget}.00</span>
            </div>
            <div className="flex justify-between text-[#9C9A92]">
              <span>Platform Fee (7%)</span>
              <span className="text-[#F4F2EC] tabular-nums">
                ${((parseFloat(budget) || 500) * 0.07).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#222222] font-semibold text-base text-[#F4F2EC]">
              <span>Total Charge</span>
              <span className="text-[#C9B8FF] tabular-nums">${totalDepositWithFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#181818]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#1a1a1a]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2 text-xs font-semibold rounded-full bg-[#F4F2EC] text-[#000000] hover:bg-white shadow-md flex items-center gap-1.5"
            >
              <i className="ti ti-brand-stripe text-base" />
              <span>Deposit with Stripe</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: STRIPE CONNECTING */}
      {step === 3 && (
        <div className="max-w-md mx-auto text-center py-16 px-6 bg-[#0A0A0A] border border-[#1a1a1a] rounded-3xl shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#C9B8FF] border-t-transparent animate-spin mx-auto" />
          <h3 className="font-serif text-2xl font-medium text-[#F4F2EC]">Connecting to Stripe...</h3>
          <p className="text-xs text-[#9C9A92]">
            Authorizing campaign escrow deposit of ${totalDepositWithFee.toFixed(2)}...
          </p>
        </div>
      )}

      {/* STEP 4: YOUR CAMPAIGN IS LIVE */}
      {step === 4 && (
        <div className="max-w-md mx-auto text-center py-12 px-6 bg-[#0A0A0A] border border-[#1a1a1a] rounded-3xl shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#C9B8FF]/15 border border-[#C9B8FF]/30 text-[#C9B8FF] flex items-center justify-center mx-auto text-3xl">
            <i className="ti ti-check" />
          </div>

          <div>
            <h3 className="font-serif text-3xl font-medium text-[#F4F2EC]">Your campaign is live</h3>
            <p className="text-xs text-[#9C9A92] mt-1.5">
              {campaignTitle} is published to discovery. Creators can now apply and share tracking links.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-[#222222] text-left text-xs space-y-2">
            <div className="flex justify-between text-[#9C9A92]">
              <span>Active Budget:</span>
              <span className="text-[#F4F2EC] font-semibold tabular-nums">${budget}.00</span>
            </div>
            <div className="flex justify-between text-[#9C9A92]">
              <span>Reward per Install:</span>
              <span className="text-[#C9B8FF] font-semibold tabular-nums">
                ${rewardPerInstall.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[#9C9A92]">
              <span>Status:</span>
              <span className="text-emerald-400 font-semibold">Active &amp; Discoverable</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('manager')}
            className="w-full py-3 rounded-2xl text-xs font-semibold bg-[#F4F2EC] text-black hover:bg-white transition-all shadow-md"
          >
            Go to Campaign Manager &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
