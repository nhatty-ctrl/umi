import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCodeSvg, AvatarSvg } from './UmiGraphic';

export function CampaignDetailView() {
  const {
    selectedCampaign: campaign,
    joinedMap,
    approveCreatorRequest,
    openOverlay,
    navigate,
    userProfile,
  } = useApp();

  const joinStatus = joinedMap[campaign.id] || 0; // 0 = not joined, 1 = pending, 2 = approved

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'earnings'>('link');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const creatorShareLink = `https://umi.link/${campaign.id}/${userProfile.handle}`;
  const creatorCode = 'UMI-4F7K';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(creatorShareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(creatorCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

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

        <div className="flex items-center gap-2">
          {campaign.mine ? (
            <button
              onClick={() => navigate('manager')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-black hover:bg-white"
            >
              Manage Campaign
            </button>
          ) : (
            <span className="text-xs text-[#9C9A92]">
              Host: <strong className="text-[#F4F2EC]">{campaign.host}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Two-Column Grid: Main (fluid) + Right Rail (320px, 360px above 1680px) with 40px gap */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] [@media(min-width:1680px)]:grid-cols-[minmax(0,1fr)_360px] gap-10 items-start">
        {/* MAIN COLUMN (Fluid) */}
        <div className="space-y-8 min-w-0">
          {/* Hero Header */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div
              style={{ backgroundColor: campaign.bg, color: campaign.fg }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-5xl shrink-0 select-none shadow-xl border border-white/10"
            >
              <i className={`ti ${campaign.ic}`} />
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#F4F2EC]">
                  {campaign.name}
                </h1>
                <i className="ti ti-rosette-discount-check text-[#C9B8FF] text-xl" />
              </div>

              <div className="text-xs sm:text-sm text-[#9C9A92] flex items-center gap-3 flex-wrap">
                <span>By {campaign.b}</span>
                <span>·</span>
                <span>{campaign.cat}</span>
                <span>·</span>
                <span className="text-[#F4F2EC] font-semibold tabular-nums">
                  ${campaign.price} per verified install
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#C8C6BE] leading-relaxed max-w-2xl">
                {campaign.d} {campaign.d2}
              </p>
            </div>
          </div>

          {/* Campaign Details & Terms */}
          <div className="border border-[#1a1a1a] rounded-2xl p-6 bg-[#0A0A0A] space-y-4">
            <h3 className="text-base font-semibold text-[#F4F2EC]">Campaign Specifications</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#121212] border border-[#1f1f1f]">
                <div className="text-[#9C9A92]">Reward Rate</div>
                <div className="text-lg font-medium text-[#F4F2EC] mt-1 tabular-nums">
                  ${campaign.price}
                </div>
                <div className="text-[11px] text-[#9C9A92] mt-0.5">Per verified unique install</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121212] border border-[#1f1f1f]">
                <div className="text-[#9C9A92]">Attribution Window</div>
                <div className="text-lg font-medium text-[#F4F2EC] mt-1">28 Days</div>
                <div className="text-[11px] text-[#9C9A92] mt-0.5">Device fingerprint + deep link</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121212] border border-[#1f1f1f]">
                <div className="text-[#9C9A92]">Runway / Duration</div>
                <div className="text-lg font-medium text-[#F4F2EC] mt-1">{campaign.days} Days left</div>
                <div className="text-[11px] text-[#9C9A92] mt-0.5">Ends {campaign.end}</div>
              </div>
            </div>

            <div className="pt-2 text-xs text-[#9C9A92] leading-relaxed space-y-2 border-t border-[#181818]">
              <div className="font-medium text-[#F4F2EC]">Partner Guidelines:</div>
              <ul className="list-disc pl-4 space-y-1 text-[#C8C6BE]">
                <li>Creators must clearly label social posts as sponsored (#ad / #sponsored).</li>
                <li>Attribution is credited on initial app launch through creator deep link or custom promo code.</li>
                <li>Fraudulent, bot, or incent traffic is filtered automatically via umi verification SDK.</li>
              </ul>
            </div>
          </div>

          {/* Community & Creators Joined */}
          <div className="border border-[#1a1a1a] rounded-2xl p-6 bg-[#0A0A0A] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#F4F2EC]">
                Active Creators ({campaign.n})
              </h3>
              <button
                onClick={() => setIsFollowing(prev => !prev)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  isFollowing
                    ? 'bg-[#1e1e1e] text-[#F4F2EC]'
                    : 'bg-[#F4F2EC] text-black hover:bg-white'
                }`}
              >
                {isFollowing ? 'Following studio' : 'Follow studio'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                {['#7FB2FF', '#FF8A65', '#5EE0C0', '#FFC857', '#C9B8FF'].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] overflow-hidden"
                  >
                    <AvatarSvg color={c} size={32} />
                  </div>
                ))}
              </div>
              <span className="text-xs text-[#9C9A92]">
                Joined by {campaign.n} verified creators across TikTok, YouTube, and Instagram
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT RAIL (320px, 360px above 1680px, sticky top-6) */}
        <div className="space-y-6 lg:sticky lg:top-6 min-w-0">
          {/* Creator Partnership Card */}
          <div className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#181818]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9C9A92]">
                Creator Partnership
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  joinStatus === 2
                    ? 'bg-[#C9B8FF]/20 text-[#C9B8FF]'
                    : joinStatus === 1
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-[#1c1c1c] text-[#9C9A92]'
                }`}
              >
                {joinStatus === 2 ? 'Approved Partner' : joinStatus === 1 ? 'Pending Review' : 'Open'}
              </span>
            </div>

            {/* STATE 0: NOT JOINED */}
            {joinStatus === 0 && (
              <div className="space-y-4">
                <div className="text-xs text-[#C8C6BE] leading-relaxed">
                  Join <strong className="text-[#F4F2EC]">{campaign.name}</strong> to unlock your
                  custom tracking link, coupon code, and earn{' '}
                  <strong className="text-[#C9B8FF] tabular-nums">${campaign.price}</strong> per
                  install.
                </div>

                <button
                  type="button"
                  onClick={() => openOverlay('req')}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#F4F2EC] text-black hover:bg-white transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <i className="ti ti-plus" />
                  <span>Request to Join</span>
                </button>
              </div>
            )}

            {/* STATE 1: PENDING */}
            {joinStatus === 1 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                  <i className="ti ti-clock text-amber-400 text-base shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-200 block font-medium">Application Submitted</strong>
                    The founder usually reviews applications within 24 hours. You will receive an in-app
                    alert once approved.
                  </div>
                </div>

                {/* Simulation trigger for testing acceptance without refresh */}
                <div className="pt-2 border-t border-[#181818] text-center">
                  <button
                    type="button"
                    onClick={() => approveCreatorRequest(`req-demo-${campaign.id}`)}
                    className="text-xs text-[#C9B8FF] hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <i className="ti ti-check" />
                    <span>Demo: Founder approves application</span>
                  </button>
                </div>
              </div>
            )}

            {/* STATE 2: APPROVED PARTNER (Link, Code, QR, Performance) */}
            {joinStatus === 2 && (
              <div className="space-y-4">
                {/* Tabs Link / Earnings */}
                <div className="flex gap-2 p-1 bg-[#141414] rounded-xl border border-[#222222]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('link')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === 'link'
                        ? 'bg-[#222222] text-[#F4F2EC] font-semibold'
                        : 'text-[#9C9A92]'
                    }`}
                  >
                    Link &amp; Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('earnings')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === 'earnings'
                        ? 'bg-[#222222] text-[#F4F2EC] font-semibold'
                        : 'text-[#9C9A92]'
                    }`}
                  >
                    Performance
                  </button>
                </div>

                {activeTab === 'link' ? (
                  <div className="space-y-3.5">
                    {/* QR Code */}
                    <div className="p-4 rounded-xl bg-[#F4F2EC] flex flex-col items-center justify-center">
                      <QrCodeSvg size={104} />
                      <span className="text-[10px] font-semibold text-black mt-2 font-mono">
                        {creatorCode}
                      </span>
                    </div>

                    {/* Referral Link */}
                    <div>
                      <div className="flex justify-between text-[11px] text-[#9C9A92] mb-1">
                        <span>Your Tracking Link</span>
                        <span>Auto-attributes</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#141414] border border-[#222222] text-xs">
                        <span className="text-[#F4F2EC] truncate flex-1 font-mono text-[11px]">
                          {creatorShareLink}
                        </span>
                        <button
                          onClick={handleCopyLink}
                          className="px-2.5 py-1 rounded-lg bg-[#202020] text-[#C8C6BE] hover:text-white shrink-0 font-medium text-[11px]"
                        >
                          {copiedLink ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Creator Code */}
                    <div>
                      <div className="flex justify-between text-[11px] text-[#9C9A92] mb-1">
                        <span>Creator Promo Code</span>
                        <span>Onboarding match</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#141414] border border-[#222222] text-xs">
                        <span className="text-[#C9B8FF] font-semibold font-mono text-sm tracking-wide flex-1">
                          {creatorCode}
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="px-2.5 py-1 rounded-lg bg-[#202020] text-[#C8C6BE] hover:text-white shrink-0 font-medium text-[11px]"
                        >
                          {copiedCode ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#141414] border border-[#1f1f1f] space-y-1">
                      <div className="text-[#9C9A92]">Verified Installs</div>
                      <div className="text-xl font-medium text-[#F4F2EC] tabular-nums">142</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141414] border border-[#1f1f1f] space-y-1">
                      <div className="text-[#9C9A92]">Earned to Date</div>
                      <div className="text-xl font-medium text-[#C9B8FF] tabular-nums">$71.00</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('earnings')}
                      className="w-full py-2 rounded-xl text-xs font-semibold bg-[#1a1a1a] border border-[#262626] text-[#F4F2EC] hover:bg-[#222222] transition-colors"
                    >
                      View in Earnings &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
