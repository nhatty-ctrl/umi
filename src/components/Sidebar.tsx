import React from 'react';
import { ScreenType } from '../types';
import { UmiPetal, AvatarSvg } from './UmiGraphic';
import { useApp } from '../context/AppContext';

export function Sidebar() {
  const {
    currentScreen,
    overlay,
    navigate,
    openOverlay,
    userProfile,
    unreadNotificationsCount,
  } = useApp();

  const isCampaignsActive =
    !overlay && ['campaigns', 'campaign', 'create', 'manager'].includes(currentScreen);
  const isEarningsActive = !overlay && currentScreen === 'earnings';
  const isProfileActive = !overlay && currentScreen === 'profile';
  const isSettingsActive = !overlay && currentScreen === 'settings';

  return (
    <aside
      className="hidden md:flex flex-col w-[56px] xl:w-[216px] shrink-0 border-r border-[#181818] bg-[#000000] p-2 xl:p-3 text-[#B8B6AE] select-none h-screen sticky top-0 z-30 transition-all duration-200"
      aria-label="Main Navigation"
    >
      {/* Brand logo & wordmark */}
      <button
        onClick={() => navigate('campaigns')}
        className="flex items-center gap-3 px-2 xl:px-3 py-3 mb-2 text-left hover:opacity-90 transition-opacity justify-center xl:justify-start"
        aria-label="umi home"
      >
        <UmiPetal size={28} />
        <span className="hidden xl:inline font-serif text-[22px] tracking-tight font-medium text-[#F4F2EC]">
          umi
        </span>
      </button>

      {/* Primary Navigation Links */}
      <div className="flex flex-col gap-1">
        <button
          onClick={() => navigate('campaigns')}
          title="Campaigns"
          className={`flex items-center gap-3 px-2.5 xl:px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left justify-center xl:justify-start ${
            isCampaignsActive
              ? 'bg-[#181818] text-[#F4F2EC] shadow-sm'
              : 'hover:bg-[#111111] hover:text-[#F4F2EC]'
          }`}
        >
          <i className="ti ti-speakerphone text-[19px] shrink-0" />
          <span className="hidden xl:inline">Campaigns</span>
        </button>

        <button
          onClick={() => navigate('earnings')}
          title="Earnings"
          className={`flex items-center gap-3 px-2.5 xl:px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left justify-center xl:justify-start ${
            isEarningsActive
              ? 'bg-[#181818] text-[#F4F2EC] shadow-sm'
              : 'hover:bg-[#111111] hover:text-[#F4F2EC]'
          }`}
        >
          <i className="ti ti-coin text-[19px] shrink-0" />
          <span className="hidden xl:inline">Earnings</span>
        </button>

        <button
          onClick={() => openOverlay(overlay === 'search' ? null : 'search')}
          title="Search"
          className={`flex items-center gap-3 px-2.5 xl:px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left justify-center xl:justify-start ${
            overlay === 'search'
              ? 'bg-[#181818] text-[#F4F2EC] shadow-sm'
              : 'hover:bg-[#111111] hover:text-[#F4F2EC]'
          }`}
        >
          <i className="ti ti-search text-[19px] shrink-0" />
          <span className="hidden xl:inline">Search</span>
        </button>

        <button
          onClick={() => openOverlay(overlay === 'notif' ? null : 'notif')}
          title="Notifications"
          className={`flex items-center justify-between px-2.5 xl:px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left relative justify-center xl:justify-between ${
            overlay === 'notif'
              ? 'bg-[#181818] text-[#F4F2EC] shadow-sm'
              : 'hover:bg-[#111111] hover:text-[#F4F2EC]'
          }`}
        >
          <div className="flex items-center gap-3">
            <i className="ti ti-bell text-[19px] shrink-0" />
            <span className="hidden xl:inline">Notifications</span>
          </div>
          {unreadNotificationsCount > 0 && (
            <span
              className="w-2 h-2 rounded-full bg-[#C9B8FF] shrink-0 absolute top-2 right-2 xl:static"
              aria-label={`${unreadNotificationsCount} new notifications`}
            />
          )}
        </button>
      </div>

      {/* Spacer to push bottom items down */}
      <div className="flex-1" />

      {/* Bottom Profile, Settings, & More */}
      <div className="flex flex-col gap-1 pt-2 border-t border-[#181818]">
        <button
          onClick={() => navigate('profile')}
          title="Profile"
          className={`flex items-center gap-3 px-2.5 xl:px-3 py-2 rounded-xl text-[13.5px] font-medium transition-colors text-left justify-center xl:justify-start ${
            isProfileActive
              ? 'bg-[#181818] text-[#F4F2EC] shadow-sm'
              : 'hover:bg-[#111111] hover:text-[#F4F2EC]'
          }`}
        >
          <AvatarSvg
            color={userProfile.avatarColor}
            expression={userProfile.avatarExpression}
            size={24}
          />
          <span className="hidden xl:inline truncate">{userProfile.name.split(' ')[0]}</span>
        </button>

        <button
          onClick={() => navigate('settings')}
          title="Settings"
          className={`flex items-center gap-3 px-2.5 xl:px-3 py-2 rounded-xl text-[13.5px] font-medium transition-colors text-left justify-center xl:justify-start ${
            isSettingsActive
              ? 'bg-[#181818] text-[#F4F2EC] shadow-sm'
              : 'hover:bg-[#111111] hover:text-[#F4F2EC]'
          }`}
        >
          <i className="ti ti-settings text-[19px] shrink-0" />
          <span className="hidden xl:inline">Settings</span>
        </button>

        <button
          onClick={() => openOverlay(overlay === 'more' ? null : 'more')}
          title="More options"
          className={`flex items-center gap-3 px-2.5 xl:px-3 py-2 rounded-xl text-[13.5px] font-medium transition-colors text-left justify-center xl:justify-start ${
            overlay === 'more'
              ? 'bg-[#181818] text-[#F4F2EC] shadow-sm'
              : 'hover:bg-[#111111] hover:text-[#F4F2EC]'
          }`}
        >
          <i className="ti ti-menu-2 text-[19px] shrink-0" />
          <span className="hidden xl:inline">More</span>
        </button>
      </div>
    </aside>
  );
}
