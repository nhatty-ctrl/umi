import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CampaignTile, AvatarSvg } from './UmiGraphic';

export function Overlays() {
  const {
    overlay,
    closeOverlay,
    campaigns,
    selectedCampaignId,
    navigate,
    requestJoinCampaign,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    userProfile,
    resetDemoData,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // Request form state
  const [tiktokLink, setTiktokLink] = useState(userProfile.channels.tiktok || '@amara');
  const [youtubeLink, setYoutubeLink] = useState(userProfile.channels.youtube || 'youtube.com/@amara');
  const [fitText, setFitText] = useState(
    'I review productivity and photo apps for people who like simple, beautiful tools. My audience engages heavily with workflow tutorials.'
  );
  const [sponsoredAgreement, setSponsoredAgreement] = useState(false);
  const [formError, setFormError] = useState('');

  if (!overlay) return null;

  const currentCampaign =
    campaigns.find(k => k.id === selectedCampaignId) || campaigns[0];

  const searchResults = campaigns.filter(k => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      k.name.toLowerCase().includes(q) ||
      k.b.toLowerCase().includes(q) ||
      k.cat.toLowerCase().includes(q)
    );
  });

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsoredAgreement) {
      setFormError('You must agree to label every post as sponsored.');
      return;
    }
    if (!fitText.trim()) {
      setFormError('Please explain why you are a good fit for this campaign.');
      return;
    }

    setFormError('');
    requestJoinCampaign(currentCampaign.id, {
      whyFit: fitText,
      channels: `${tiktokLink} · ${youtubeLink}`,
    });
    closeOverlay();
  };

  return (
    <>
      {/* 1. SEARCH PALETTE (position: fixed to viewport) */}
      {overlay === 'search' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-start pt-16 md:pt-24 p-4"
          onClick={closeOverlay}
        >
          <div
            className="w-full max-w-lg bg-[#0C0C0C] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1c1c1c]">
              <i className="ti ti-search text-[#9C9A92] text-lg" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search campaigns, studios, or categories..."
                className="bg-transparent border-0 outline-none text-sm text-[#F4F2EC] w-full placeholder-[#6f6d66]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#9C9A92] hover:text-[#F4F2EC]"
                >
                  <i className="ti ti-x" />
                </button>
              )}
            </div>

            <div className="p-3 max-h-80 overflow-y-auto">
              <div className="text-[11px] font-semibold text-[#6f6d66] uppercase tracking-wider px-2 py-1 mb-1">
                {searchQuery ? 'Results' : 'Trending campaigns'}
              </div>
              <div className="space-y-1">
                {searchResults.slice(0, 6).map(k => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => {
                      closeOverlay();
                      if (k.mine) {
                        navigate('manager');
                      } else {
                        navigate('campaign', k.id);
                      }
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#161616] transition-colors text-left group"
                  >
                    <CampaignTile bg={k.bg} fg={k.fg} icon={k.ic} size={36} rounded={10} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs sm:text-sm text-[#F4F2EC] group-hover:text-white truncate">
                        {k.name}
                      </div>
                      <div className="text-[11px] text-[#9C9A92] truncate">
                        {k.b} · {k.cat}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#C9B8FF] shrink-0 tabular-nums">
                      ${k.price}
                    </span>
                  </button>
                ))}

                {searchResults.length === 0 && (
                  <div className="text-xs text-[#9C9A92] p-4 text-center">
                    No campaigns or studios found matching &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. NOTIFICATIONS DRAWER (docked adjacent to sidebar matching Screenshot 1) */}
      {overlay === 'notif' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex"
          onClick={closeOverlay}
        >
          <div
            className="fixed top-0 bottom-0 left-0 md:left-14 xl:left-[216px] w-full sm:w-[380px] md:w-[400px] h-full bg-[#0A0A0A] border-r border-[#1c1c1c] flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 z-50"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#181818]">
              <div className="flex items-center gap-2.5">
                <h3 className="font-medium text-lg text-[#F4F2EC]">Notifications</h3>
                {notifications.some(n => n.unread) && (
                  <span className="w-2 h-2 rounded-full bg-[#C9B8FF]" />
                )}
              </div>
              <div className="flex items-center gap-3">
                {notifications.some(n => n.unread) && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-[#9C9A92] hover:text-[#C9B8FF] transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeOverlay}
                  className="text-[#9C9A92] hover:text-[#F4F2EC] p-1 transition-colors"
                  aria-label="Close notifications"
                >
                  <i className="ti ti-x text-base" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#161616]">
              {notifications.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    markNotificationAsRead(item.id);
                    closeOverlay();
                    navigate(item.targetScreen, item.targetCampaignId);
                  }}
                  className={`px-5 py-4 flex items-start gap-3.5 cursor-pointer transition-colors hover:bg-[#111111] group ${
                    item.unread ? 'bg-[#101010]/80' : ''
                  }`}
                >
                  {/* Brand/avatar circle matching screenshot */}
                  <div className="w-9 h-9 rounded-full bg-[#F4F2EC] text-[#000000] flex items-center justify-center shrink-0 font-bold text-xs select-none shadow-sm">
                    {item.type === 'payout' ? (
                      <i className="ti ti-coin text-base text-[#000000]" />
                    ) : (
                      item.title.charAt(0)
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-[13.5px] text-[#F4F2EC] group-hover:text-white truncate">
                        {item.title}
                      </span>
                      <span className="text-xs text-[#8E8C84] shrink-0 font-normal">
                        {item.date}
                      </span>
                    </div>
                    <div className="text-[13px] text-[#E0DED7] mt-0.5 leading-snug">
                      {item.subtitle}
                    </div>
                    {item.body && (
                      <div className="mt-2 pl-2.5 border-l border-[#282828] text-xs text-[#9C9A92] leading-relaxed line-clamp-3">
                        {item.body}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. REQUEST TO JOIN FORM (position: fixed to viewport) */}
      {overlay === 'req' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4"
          onClick={closeOverlay}
        >
          <div
            className="w-full max-w-md bg-[#0C0C0C] border border-[#262626] rounded-2xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
              <div>
                <h3 className="font-semibold text-base text-[#F4F2EC]">Request to join</h3>
                <div className="text-xs text-[#9C9A92]">{currentCampaign.name}</div>
              </div>
              <button
                type="button"
                onClick={closeOverlay}
                className="text-[#9C9A92] hover:text-[#F4F2EC] p-1 text-base"
                aria-label="Close request modal"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            <p className="text-xs text-[#9C9A92] leading-relaxed">
              Founders approve verified creators before generating your unique link and coupon code.
            </p>

            <form onSubmit={handleRequestSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] text-[#9C9A92] block mb-1">TikTok Handle / Link</label>
                <input
                  type="text"
                  required
                  value={tiktokLink}
                  onChange={e => setTiktokLink(e.target.value)}
                  placeholder="@yourhandle or link"
                  className="w-full h-10 px-3 bg-[#141414] border border-[#222222] rounded-xl text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9C9A92] block mb-1">YouTube Channel URL</label>
                <input
                  type="text"
                  required
                  value={youtubeLink}
                  onChange={e => setYoutubeLink(e.target.value)}
                  placeholder="youtube.com/@channel"
                  className="w-full h-10 px-3 bg-[#141414] border border-[#222222] rounded-xl text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9C9A92] block mb-1">Why are you a good fit?</label>
                <textarea
                  rows={3}
                  required
                  value={fitText}
                  onChange={e => setFitText(e.target.value)}
                  placeholder="Describe your audience niche and past campaign experience..."
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl p-2.5 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF] resize-none leading-relaxed"
                />
              </div>

              {/* Required Sponsorship Agreement Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="reqSponsoredTerms"
                  required
                  checked={sponsoredAgreement}
                  onChange={e => {
                    setSponsoredAgreement(e.target.checked);
                    if (e.target.checked) setFormError('');
                  }}
                  className="accent-[#C9B8FF] mt-0.5 cursor-pointer"
                />
                <label
                  htmlFor="reqSponsoredTerms"
                  className="text-xs text-[#C8C6BE] leading-relaxed cursor-pointer select-none"
                >
                  <strong className="text-[#F4F2EC]">I will label every post as sponsored</strong> and
                  abide by FTC creator disclosure requirements and umi partner terms.
                </label>
              </div>

              {formError && (
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#181818]">
                <button
                  type="button"
                  onClick={closeOverlay}
                  className="px-4 py-2 text-xs font-semibold rounded-full border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#1a1a1a]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-full bg-[#F4F2EC] text-black hover:bg-white shadow-md transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MORE DROPDOWN MENU (position: fixed to viewport) */}
      {overlay === 'more' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
          onClick={closeOverlay}
        >
          <div
            className="fixed bottom-16 md:bottom-6 left-4 md:left-[60px] xl:left-[224px] w-56 bg-[#141414] border border-[#262626] rounded-2xl p-2 shadow-2xl space-y-1 text-xs select-none animate-in fade-in zoom-in-95 duration-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-2 border-b border-[#222222] flex items-center gap-2">
              <AvatarSvg
                color={userProfile.avatarColor}
                expression={userProfile.avatarExpression}
                size={24}
              />
              <div className="min-w-0">
                <div className="font-medium text-[#F4F2EC] truncate">{userProfile.name}</div>
                <div className="text-[10px] text-[#9C9A92]">@{userProfile.handle}</div>
              </div>
            </div>

            <button
              onClick={() => {
                closeOverlay();
                navigate('docs');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F2EC] hover:bg-[#202020] transition-colors text-left"
            >
              <i className="ti ti-book text-base text-[#C9B8FF]" />
              <span>Documentation</span>
            </button>

            <button
              onClick={() => {
                closeOverlay();
                navigate('keys');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F2EC] hover:bg-[#202020] transition-colors text-left"
            >
              <i className="ti ti-key text-base text-[#C9B8FF]" />
              <span>SDK &amp; Keys</span>
            </button>

            <button
              onClick={() => {
                closeOverlay();
                navigate('manager');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F2EC] hover:bg-[#202020] transition-colors text-left"
            >
              <i className="ti ti-dashboard text-base text-[#C9B8FF]" />
              <span>Campaign Manager</span>
            </button>

            <button
              onClick={() => {
                closeOverlay();
                navigate('settings', undefined, 'developer');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F2EC] hover:bg-[#202020] transition-colors text-left"
            >
              <i className="ti ti-bolt text-base text-emerald-400" />
              <span>Simulate Install</span>
            </button>

            <div className="pt-1 border-t border-[#222222]">
              <button
                onClick={() => {
                  closeOverlay();
                  resetDemoData();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-[#202020] transition-colors text-left"
              >
                <i className="ti ti-refresh text-base" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
