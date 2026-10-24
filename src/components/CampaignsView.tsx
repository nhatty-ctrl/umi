import React, { useState } from 'react';
import { Campaign } from '../types';
import { CATEGORIES } from '../data/initialData';
import { filterCampaigns } from '../utils/campaignLogic';
import { CalendarCard } from './CalendarCard';
import { useApp } from '../context/AppContext';

export function CampaignsView() {
  const {
    campaigns,
    joinedMap,
    navigate,
    openOverlay,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'discover' | 'joined' | 'hosting'>('discover');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [sortOrder] = useState<number>(0);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const filteredCampaigns = filterCampaigns(campaigns, {
    tab: activeTab,
    category: selectedCat,
    sort: sortOrder,
    joinedMap,
  });

  const renderCampaignCard = (k: Campaign, isHost: boolean = false) => {
    const joinStatus = joinedMap[k.id] || 0;
    const parts = k.end.split(' ');
    const month = parts[1] || 'OCT';
    const day = parts[2] || '29';

    return (
      <div
        key={k.id}
        onClick={() => {
          if (isHost) {
            navigate('manager');
          } else {
            navigate('campaign', k.id);
          }
        }}
        className="group flex gap-4 sm:gap-5 items-start py-5 px-3 -mx-3 rounded-2xl cursor-pointer hover:bg-[#0c0c0c] transition-all border border-transparent hover:border-[#1a1a1a]"
      >
        {/* Date Badge */}
        <div
          style={{ backgroundColor: k.bg, color: k.fg }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 font-semibold leading-tight select-none shadow-sm transition-transform group-hover:scale-[1.02]"
        >
          <span className="text-[11px] uppercase tracking-wider opacity-85 font-medium">{month}</span>
          <span className="text-xl sm:text-2xl font-bold mt-0.5">{day}</span>
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[17px] font-semibold text-[#F4F2EC] tracking-tight group-hover:text-white transition-colors">
              {k.name}
            </span>
            <i className="ti ti-rosette-discount-check text-[#C9B8FF] text-[17px]" />
          </div>

          <div className="text-xs sm:text-sm text-[#8E8C84] mt-0.5">
            {isHost ? 'Live · ends ' : 'Ends '}
            {k.end} · {k.days} days left
          </div>

          <div className="text-xs sm:text-sm text-[#8E8C84] mt-1.5 flex items-center gap-1.5">
            <i className="ti ti-map-pin text-[13px] text-[#777]" />
            <span>
              {k.cat} · iOS and Android
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#D8D6CE] mt-2 line-clamp-2 leading-relaxed">
            {k.d} {k.d2}{' '}
            <span className="text-[#8E8C84] font-medium group-hover:underline">see more</span>
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span
              style={{ backgroundColor: k.bg, color: k.fg }}
              className="px-3 py-0.5 rounded-full text-xs font-semibold tabular-nums"
            >
              ${k.price} per verified install
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 mt-3.5">
            {isHost ? (
              <>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    navigate('manager');
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white transition-all shadow-sm"
                >
                  Manage
                </button>
                <span className="text-xs text-[#8E8C84] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9B8FF]" />
                  <span>Live · 3 new requests</span>
                </span>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    if (joinStatus === 0) {
                      navigate('campaign', k.id);
                      openOverlay('req');
                    } else {
                      navigate('campaign', k.id);
                    }
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    joinStatus === 2
                      ? 'bg-[#161616] border border-[#C9B8FF]/50 text-[#F4F2EC]'
                      : joinStatus === 1
                      ? 'bg-[#161616] border border-[#262626] text-[#8E8C84]'
                      : 'bg-[#F4F2EC] text-[#000000] hover:bg-white shadow-sm'
                  }`}
                >
                  {joinStatus === 2 ? (
                    <>
                      <i className="ti ti-circle-check text-[#C9B8FF]" />
                      <span>Joined</span>
                    </>
                  ) : joinStatus === 1 ? (
                    <>
                      <i className="ti ti-clock text-[#8E8C84]" />
                      <span>Pending</span>
                    </>
                  ) : (
                    <span>Join campaign</span>
                  )}
                </button>
                <span className="text-xs text-[#8E8C84] flex items-center gap-1 tabular-nums">
                  <i className="ti ti-users" />
                  <span>{k.n} creators</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'discover') {
      if (!filteredCampaigns.length) {
        return (
          <div className="bg-[#0A0A0A] rounded-2xl p-10 text-center mt-4 border border-[#161616]">
            <p className="text-[#8E8C84] text-sm">No campaigns found in &ldquo;{selectedCat}&rdquo;.</p>
            <button
              onClick={() => setSelectedCat('All')}
              className="mt-3 px-4 py-1.5 text-xs font-semibold bg-[#141414] border border-[#222222] rounded-full text-[#F4F2EC] hover:bg-[#1a1a1a]"
            >
              Reset filter
            </button>
          </div>
        );
      }

      if (selectedCat === 'All') {
        const featuredList = filteredCampaigns.slice(0, 2);
        const featured = featuredList[featuredIndex % featuredList.length] || filteredCampaigns[0];
        const endingSoon = filteredCampaigns.filter(k => k !== featured && k.days <= 10);
        const more = filteredCampaigns.filter(k => k !== featured && k.days > 10);

        return (
          <div className="space-y-6">
            {/* Featured Header with Navigation Chevrons */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#161616] mt-4 mb-1">
                <h2 className="text-xl font-semibold tracking-tight text-[#F4F2EC]">
                  Featured
                </h2>
                <div className="flex items-center gap-1 text-[#888888]">
                  <button
                    onClick={() => setFeaturedIndex(prev => Math.max(0, prev - 1))}
                    className="p-1 hover:text-[#F4F2EC] transition-colors"
                    aria-label="Previous featured"
                  >
                    <i className="ti ti-chevron-left text-sm" />
                  </button>
                  <button
                    onClick={() => setFeaturedIndex(prev => prev + 1)}
                    className="p-1 hover:text-[#F4F2EC] transition-colors"
                    aria-label="Next featured"
                  >
                    <i className="ti ti-chevron-right text-sm" />
                  </button>
                </div>
              </div>
              {renderCampaignCard(featured)}
            </div>

            {/* Ending Soon */}
            {endingSoon.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold tracking-tight pb-3 border-b border-[#161616] mt-6 mb-1 text-[#F4F2EC]">
                  Ending soon
                </h2>
                <div className="divide-y divide-[#121212]">
                  {endingSoon.map(k => renderCampaignCard(k))}
                </div>
              </div>
            )}

            {/* More Campaigns */}
            {more.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold tracking-tight pb-3 border-b border-[#161616] mt-6 mb-1 text-[#F4F2EC]">
                  More campaigns
                </h2>
                <div className="divide-y divide-[#121212]">
                  {more.map(k => renderCampaignCard(k))}
                </div>
              </div>
            )}
          </div>
        );
      }

      return (
        <div className="mt-4 divide-y divide-[#121212]">
          {filteredCampaigns.map(k => renderCampaignCard(k))}
        </div>
      );
    }

    if (activeTab === 'joined') {
      const joinedList = campaigns.filter(k => !k.mine && !!joinedMap[k.id]);
      if (!joinedList.length) {
        return (
          <div className="bg-[#0A0A0A] rounded-2xl p-10 text-center mt-6 border border-[#161616]">
            <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#222] flex items-center justify-center mx-auto mb-3 text-[#8E8C84] text-xl">
              <i className="ti ti-speakerphone" />
            </div>
            <h3 className="text-base font-semibold text-[#F4F2EC]">No joined campaigns yet</h3>
            <p className="text-xs text-[#8E8C84] mt-1 max-w-xs mx-auto">
              Request to join live campaigns to receive your custom referral link and earn per verified install.
            </p>
            <button
              onClick={() => setActiveTab('discover')}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-[#F4F2EC] text-[#000000] rounded-full hover:bg-white transition-colors"
            >
              Browse campaigns
            </button>
          </div>
        );
      }
      return (
        <div className="mt-4 divide-y divide-[#121212]">
          {joinedList.map(k => renderCampaignCard(k))}
        </div>
      );
    }

    // Hosting tab
    const hostedList = campaigns.filter(k => k.mine);
    if (!hostedList.length) {
      return (
        <div className="bg-[#0A0A0A] rounded-2xl p-10 text-center mt-6 border border-[#161616]">
          <h3 className="text-base font-semibold text-[#F4F2EC]">No hosted campaigns</h3>
          <p className="text-xs text-[#8E8C84] mt-1">Launch your own app campaign to acquire verified users.</p>
          <button
            onClick={() => navigate('create')}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-[#F4F2EC] text-[#000000] rounded-full hover:bg-white"
          >
            Create campaign
          </button>
        </div>
      );
    }

    return (
      <div className="mt-4 divide-y divide-[#121212]">
        {hostedList.map(k => renderCampaignCard(k, true))}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Two-Column Grid: Main (fluid) + Right Rail (320px, 360px above 1680px) with 40px gap */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] [@media(min-width:1680px)]:grid-cols-[minmax(0,1fr)_360px] gap-10 items-start">
        {/* Main Feed Column */}
        <div className="min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#F4F2EC]">
              Campaigns
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('create')}
                className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white transition-colors"
              >
                <i className="ti ti-plus" />
                <span>New campaign</span>
              </button>
            </div>
          </div>

          {/* Underline Tabs */}
          <div className="flex items-end gap-6 border-b border-[#161616] mt-4">
            <button
              onClick={() => setActiveTab('discover')}
              className={`pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                activeTab === 'discover'
                  ? 'border-[#F4F2EC] text-[#F4F2EC]'
                  : 'border-transparent text-[#8E8C84] hover:text-[#F4F2EC]'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('joined')}
              className={`pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                activeTab === 'joined'
                  ? 'border-[#F4F2EC] text-[#F4F2EC]'
                  : 'border-transparent text-[#8E8C84] hover:text-[#F4F2EC]'
              }`}
            >
              Joined
            </button>
            <button
              onClick={() => setActiveTab('hosting')}
              className={`pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                activeTab === 'hosting'
                  ? 'border-[#F4F2EC] text-[#F4F2EC]'
                  : 'border-transparent text-[#8E8C84] hover:text-[#F4F2EC]'
              }`}
            >
              Hosting
            </button>
          </div>

          {/* Feed Content */}
          {renderContent()}
        </div>

        {/* Right Rail (320px, 360px above 1680px, sticky top-6) */}
        <div className="hidden lg:block space-y-4 lg:sticky lg:top-6 min-w-0">
          {/* New Campaign Button */}
          <div className="relative">
            <button
              onClick={() => setIsNewMenuOpen(prev => !prev)}
              className="w-full h-10 rounded-xl text-xs font-semibold bg-[#141414] border border-[#222222] text-[#F4F2EC] hover:bg-[#1a1a1a] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>New campaign</span>
              <i className="ti ti-chevron-down text-[11px] text-[#888888]" />
            </button>

            {isNewMenuOpen && (
              <div className="absolute top-11 left-0 right-0 bg-[#141414] border border-[#222222] rounded-xl p-1.5 z-20 shadow-2xl">
                <button
                  onClick={() => {
                    setIsNewMenuOpen(false);
                    navigate('create');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs rounded-lg text-[#F4F2EC] hover:bg-[#202020] transition-colors text-left"
                >
                  <i className="ti ti-plus" />
                  <span>Create campaign</span>
                </button>
                <button
                  onClick={() => {
                    setIsNewMenuOpen(false);
                    navigate('create');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs rounded-lg text-[#F4F2EC] hover:bg-[#202020] transition-colors text-left"
                >
                  <i className="ti ti-link" />
                  <span>Import from store link</span>
                </button>
              </div>
            )}
          </div>

          {/* Calendar Card */}
          <CalendarCard />

          {/* Categories Section (Checklist styling from reference) */}
          <div className="pt-2">
            <div className="text-sm font-semibold text-[#F4F2EC] mb-2 px-1">Categories</div>
            <div className="flex flex-col gap-1">
              {['All categories', ...CATEGORIES].map(cat => {
                const val = cat === 'All categories' ? 'All' : cat;
                const isSelected = selectedCat === val;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(val)}
                    className="flex items-center gap-2.5 text-xs text-[#C8C6BE] hover:text-[#F4F2EC] py-1.5 px-2 rounded-lg text-left transition-colors hover:bg-[#0c0c0c]"
                  >
                    <span
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#C9B8FF] border-[#C9B8FF] text-[#000000] font-bold'
                          : 'border-[#333333] bg-transparent text-transparent'
                      }`}
                    >
                      <i className="ti ti-check" />
                    </span>
                    <span className={isSelected ? 'text-[#F4F2EC] font-medium' : ''}>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
