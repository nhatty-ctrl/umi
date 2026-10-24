import React from 'react';
import { useApp } from '../context/AppContext';

export function MobileNav() {
  const { currentScreen, overlay, navigate, openOverlay, unreadNotificationsCount } = useApp();

  const isCampaignsActive =
    !overlay && ['campaigns', 'campaign', 'create', 'manager'].includes(currentScreen);
  const isEarningsActive = !overlay && currentScreen === 'earnings';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center bg-[#000000] border-t border-[#181818] px-2 py-2 text-[#B8B6AE] select-none"
      aria-label="Mobile Navigation"
    >
      <button
        onClick={() => navigate('campaigns')}
        className={`flex flex-col items-center gap-0.5 text-[10.5px] py-1 px-3 ${
          isCampaignsActive ? 'text-[#F4F2EC]' : 'hover:text-[#F4F2EC]'
        }`}
      >
        <i className="ti ti-speakerphone text-[20px]" />
        <span>Campaigns</span>
      </button>

      <button
        onClick={() => navigate('earnings')}
        className={`flex flex-col items-center gap-0.5 text-[10.5px] py-1 px-3 ${
          isEarningsActive ? 'text-[#F4F2EC]' : 'hover:text-[#F4F2EC]'
        }`}
      >
        <i className="ti ti-coin text-[20px]" />
        <span>Earnings</span>
      </button>

      <button
        onClick={() => openOverlay(overlay === 'search' ? null : 'search')}
        className={`flex flex-col items-center gap-0.5 text-[10.5px] py-1 px-3 ${
          overlay === 'search' ? 'text-[#F4F2EC]' : 'hover:text-[#F4F2EC]'
        }`}
      >
        <i className="ti ti-search text-[20px]" />
        <span>Search</span>
      </button>

      <button
        onClick={() => openOverlay(overlay === 'notif' ? null : 'notif')}
        className={`relative flex flex-col items-center gap-0.5 text-[10.5px] py-1 px-3 ${
          overlay === 'notif' ? 'text-[#F4F2EC]' : 'hover:text-[#F4F2EC]'
        }`}
      >
        <i className="ti ti-bell text-[20px]" />
        <span>Alerts</span>
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#C9B8FF]" />
        )}
      </button>

      <button
        onClick={() => openOverlay(overlay === 'more' ? null : 'more')}
        className={`flex flex-col items-center gap-0.5 text-[10.5px] py-1 px-3 ${
          overlay === 'more' ? 'text-[#F4F2EC]' : 'hover:text-[#F4F2EC]'
        }`}
      >
        <i className="ti ti-menu-2 text-[20px]" />
        <span>More</span>
      </button>
    </nav>
  );
}
