import React, { useState } from 'react';
import { useApp, AVATAR_COLORS, FOUNDER_EXPRESSIONS, CREATOR_EXPRESSIONS } from '../context/AppContext';
import { AvatarSvg } from './UmiGraphic';
import { AvatarExpression } from '../types';

export function ProfileView() {
  const {
    userProfile,
    updateUserProfile,
    setAvatar,
    campaigns,
    joinedMap,
    navigate,
  } = useApp();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editHandle, setEditHandle] = useState(userProfile.handle);
  const [editBio, setEditBio] = useState(userProfile.bio);
  const [editTiktok, setEditTiktok] = useState(userProfile.channels.tiktok);
  const [editYoutube, setEditYoutube] = useState(userProfile.channels.youtube);

  const joinedCampaigns = campaigns.filter(c => !c.mine && !!joinedMap[c.id]);
  const hostingCampaigns = campaigns.filter(c => !!c.mine);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      handle: editHandle,
      bio: editBio,
      channels: {
        ...userProfile.channels,
        tiktok: editTiktok,
        youtube: editYoutube,
      },
    });
    setIsEditProfileOpen(false);
  };

  return (
    <div className="w-full space-y-8">
      {/* Page Title & Lock Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#181818]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F4F2EC]">
            Your Profile
          </h1>
          <div className="text-xs text-[#9C9A92] mt-1 flex items-center gap-1.5">
            <i className="ti ti-lock text-[#C9B8FF]" />
            <span>Private profile · Only visible to you</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#141414] border border-[#222222] text-[#F4F2EC] hover:bg-[#1f1f1f] transition-colors"
          >
            Edit profile
          </button>
          <button
            onClick={() => navigate('settings')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F4F2EC] text-black hover:bg-white transition-colors"
          >
            Settings
          </button>
        </div>
      </div>

      {/* Two-Column Desktop Layout: Left Column (420px) + Right Column (Fluid) */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)] gap-10 items-start">
        {/* LEFT COLUMN (420px): Cover tinted by avatar color, 112px avatar, name, handle, links, lock note, counts */}
        <div className="border border-[#1a1a1a] rounded-3xl overflow-hidden bg-[#0A0A0A] shadow-xl">
          {/* Cover tinted by avatar color */}
          <div
            style={{
              background: `linear-gradient(135deg, ${userProfile.avatarColor}33 0%, #141414 100%)`,
              borderColor: `${userProfile.avatarColor}22`,
            }}
            className="h-36 relative border-b transition-colors duration-300 flex items-end p-4"
          >
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-md text-[#C8C6BE] border border-white/10 flex items-center gap-1">
              <i className="ti ti-lock text-[10px]" />
              <span>Owner View</span>
            </div>
          </div>

          <div className="p-6 pt-0">
            {/* 112px Avatar protruding into the cover */}
            <div className="-mt-14 mb-4 inline-block p-1.5 rounded-full bg-[#0A0A0A] shadow-2xl">
              <AvatarSvg
                color={userProfile.avatarColor}
                expression={userProfile.avatarExpression}
                size={112}
              />
            </div>

            {/* Name, Handle & Bio */}
            <div>
              <h2 className="font-serif text-2xl font-medium text-[#F4F2EC] tracking-tight">
                {userProfile.name}
              </h2>
              <div className="text-xs text-[#9C9A92] mt-0.5">@{userProfile.handle}</div>
              <p className="text-xs text-[#C8C6BE] mt-3 leading-relaxed">{userProfile.bio}</p>
            </div>

            {/* Social Links */}
            <div className="mt-4 pt-4 border-t border-[#161616] space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-[#9C9A92] font-semibold">
                Connected Channels
              </div>
              <div className="flex flex-col gap-1.5 text-xs">
                {userProfile.channels.tiktok && (
                  <div className="flex items-center gap-2 text-[#C8C6BE]">
                    <i className="ti ti-brand-tiktok text-[#C9B8FF]" />
                    <span>{userProfile.channels.tiktok}</span>
                  </div>
                )}
                {userProfile.channels.youtube && (
                  <div className="flex items-center gap-2 text-[#C8C6BE]">
                    <i className="ti ti-brand-youtube text-red-400" />
                    <span>{userProfile.channels.youtube}</span>
                  </div>
                )}
                {userProfile.channels.instagram && (
                  <div className="flex items-center gap-2 text-[#C8C6BE]">
                    <i className="ti ti-brand-instagram text-[#C9B8FF]" />
                    <span>{userProfile.channels.instagram}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Counts: Joined & Hosting */}
            <div className="mt-4 pt-4 border-t border-[#161616] grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#121212] border border-[#1c1c1c]">
                <div className="text-lg font-medium text-[#F4F2EC] tabular-nums">
                  {joinedCampaigns.length}
                </div>
                <div className="text-[11px] text-[#9C9A92]">Campaigns Joined</div>
              </div>
              <div className="p-3 rounded-xl bg-[#121212] border border-[#1c1c1c]">
                <div className="text-lg font-medium text-[#F4F2EC] tabular-nums">
                  {hostingCampaigns.length}
                </div>
                <div className="text-[11px] text-[#9C9A92]">Campaigns Hosted</div>
              </div>
            </div>

            {/* Lock Note */}
            <div className="mt-4 p-3 rounded-xl bg-[#121212] border border-[#1c1c1c] text-[11px] text-[#9C9A92] leading-relaxed flex items-start gap-2">
              <i className="ti ti-shield-check text-[#C9B8FF] text-sm shrink-0 mt-0.5" />
              <span>
                Other creators and users cannot view your profile. Only your public creator card is
                visible to founders when you apply.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Fluid): "What founders see" card, Avatar editor, Joined and Hosting lists */}
        <div className="space-y-8 min-w-0">
          {/* Card: "What founders see" */}
          <div className="border border-[#1a1a1a] rounded-3xl p-6 bg-[#0A0A0A] space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-[#F4F2EC]">What founders see</h3>
              <p className="text-xs text-[#9C9A92] mt-0.5">
                When you request to join a campaign, the founder sees this exact verification card:
              </p>
            </div>

            <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <AvatarSvg
                  color={userProfile.avatarColor}
                  expression={userProfile.avatarExpression}
                  size={52}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-[#F4F2EC]">{userProfile.name}</span>
                    <span className="text-xs text-[#9C9A92]">@{userProfile.handle}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9B8FF]/15 text-[#C9B8FF] font-medium">
                      Verified Partner
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 my-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1e1e1e] text-[11px] text-[#C8C6BE]">
                      {userProfile.channels.tiktok} · {userProfile.channels.youtube}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1e1e1e] text-[11px] text-[#C8C6BE]">
                      3 past campaigns
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1e1e1e] text-[11px] text-emerald-400 font-medium">
                      94% verified install rate
                    </span>
                  </div>

                  <p className="text-xs text-[#C8C6BE] leading-relaxed italic">
                    &ldquo;{userProfile.bio}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Avatar Editor with 10 Colors and 10 Expressions (5 founder, 5 creator) */}
          <div className="border border-[#1a1a1a] rounded-3xl p-6 bg-[#0A0A0A] space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[#F4F2EC]">Avatar Customizer</h3>
              <p className="text-xs text-[#9C9A92] mt-0.5">
                Changes apply instantly across your cover, header, sidebar, More menu, and founder
                card. Saved to local storage.
              </p>
            </div>

            {/* 10 Colors */}
            <div className="space-y-2.5">
              <div className="text-xs text-[#9C9A92] font-medium">10 Pastel Palette Colors</div>
              <div className="flex items-center gap-3 flex-wrap">
                {AVATAR_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatar(c, userProfile.avatarExpression)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 relative ${
                      userProfile.avatarColor === c
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0A0A0A] scale-105'
                        : 'border border-black/20'
                    }`}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* 10 Expressions (5 Founder, 5 Creator) */}
            <div className="space-y-4 pt-4 border-t border-[#181818]">
              {/* Founder Expressions */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-[#C9B8FF] flex items-center gap-1.5">
                  <i className="ti ti-briefcase text-xs" />
                  <span>5 Founder Archetypes</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {FOUNDER_EXPRESSIONS.map(expr => (
                    <button
                      key={expr}
                      type="button"
                      onClick={() => setAvatar(userProfile.avatarColor, expr)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                        userProfile.avatarExpression === expr
                          ? 'bg-[#181818] border-[#C9B8FF] text-[#F4F2EC] shadow-sm'
                          : 'bg-[#121212] border-[#222222] text-[#9C9A92] hover:text-[#F4F2EC] hover:bg-[#161616]'
                      }`}
                    >
                      <AvatarSvg
                        color={userProfile.avatarColor}
                        expression={expr}
                        size={40}
                      />
                      <span className="text-[11px] font-medium">{expr}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Creator Expressions */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-medium text-[#C9B8FF] flex items-center gap-1.5">
                  <i className="ti ti-sparkles text-xs" />
                  <span>5 Creator Archetypes</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {CREATOR_EXPRESSIONS.map(expr => (
                    <button
                      key={expr}
                      type="button"
                      onClick={() => setAvatar(userProfile.avatarColor, expr)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                        userProfile.avatarExpression === expr
                          ? 'bg-[#181818] border-[#C9B8FF] text-[#F4F2EC] shadow-sm'
                          : 'bg-[#121212] border-[#222222] text-[#9C9A92] hover:text-[#F4F2EC] hover:bg-[#161616]'
                      }`}
                    >
                      <AvatarSvg
                        color={userProfile.avatarColor}
                        expression={expr}
                        size={40}
                      />
                      <span className="text-[11px] font-medium">{expr}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lists of Joined and Hosting campaigns with status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Joined Campaigns List */}
            <div className="border border-[#1a1a1a] rounded-3xl p-5 bg-[#0A0A0A] space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#181818]">
                <h3 className="text-sm font-semibold text-[#F4F2EC]">Joined Campaigns</h3>
                <span className="text-xs text-[#9C9A92] tabular-nums">
                  {joinedCampaigns.length} apps
                </span>
              </div>

              <div className="space-y-2">
                {joinedCampaigns.map(c => {
                  const status = joinedMap[c.id];
                  return (
                    <div
                      key={c.id}
                      onClick={() => navigate('campaign', c.id)}
                      className="p-3 rounded-2xl bg-[#121212] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          style={{ backgroundColor: c.bg, color: c.fg }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs"
                        >
                          <i className={`ti ${c.ic}`} />
                        </span>
                        <div className="min-w-0 truncate">
                          <div className="font-medium text-[#F4F2EC] truncate">{c.name}</div>
                          <div className="text-[11px] text-[#9C9A92]">{c.b}</div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                          status === 2
                            ? 'bg-[#C9B8FF]/20 text-[#C9B8FF]'
                            : 'bg-[#222222] text-[#9C9A92]'
                        }`}
                      >
                        {status === 2 ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hosting Campaigns List */}
            <div className="border border-[#1a1a1a] rounded-3xl p-5 bg-[#0A0A0A] space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#181818]">
                <h3 className="text-sm font-semibold text-[#F4F2EC]">Hosting Campaigns</h3>
                <button
                  onClick={() => navigate('create')}
                  className="text-xs text-[#C9B8FF] hover:underline flex items-center gap-1 font-semibold"
                >
                  <i className="ti ti-plus" />
                  <span>New</span>
                </button>
              </div>

              <div className="space-y-2">
                {hostingCampaigns.map(c => (
                  <div
                    key={c.id}
                    onClick={() => navigate('manager')}
                    className="p-3 rounded-2xl bg-[#121212] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        style={{ backgroundColor: c.bg, color: c.fg }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs"
                      >
                        <i className={`ti ${c.ic}`} />
                      </span>
                      <div className="min-w-0 truncate">
                        <div className="font-medium text-[#F4F2EC] truncate">{c.name}</div>
                        <div className="text-[11px] text-[#9C9A92]">{c.days} days runway</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 shrink-0">
                      Live
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsEditProfileOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0C0C0C] border border-[#222222] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1a1a1a]">
              <h3 className="font-semibold text-base text-[#F4F2EC]">Edit Profile</h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-[#9C9A92] hover:text-[#F4F2EC] p-1"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] text-[#9C9A92] block mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9C9A92] block mb-1">Handle</label>
                <input
                  type="text"
                  required
                  value={editHandle}
                  onChange={e => setEditHandle(e.target.value)}
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9C9A92] block mb-1">Bio / Pitch</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl p-2.5 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#9C9A92] block mb-1">TikTok Handle</label>
                  <input
                    type="text"
                    value={editTiktok}
                    onChange={e => setEditTiktok(e.target.value)}
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#9C9A92] block mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={editYoutube}
                    onChange={e => setEditYoutube(e.target.value)}
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#161616]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#F4F2EC] text-black font-semibold hover:bg-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
