import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { CampaignsView } from './components/CampaignsView';
import { CampaignDetailView } from './components/CampaignDetailView';
import { CampaignManagerView } from './components/CampaignManagerView';
import { EarningsView } from './components/EarningsView';
import { CreateCampaignView } from './components/CreateCampaignView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { KeysView } from './components/KeysView';
import { DocsView } from './components/DocsView';
import { OnboardingView } from './components/OnboardingView';
import { Overlays } from './components/Overlays';

function AppContent() {
  const { currentScreen, navigate } = useApp();

  // If in Docs or Onboarding, render standalone views
  if (currentScreen === 'onboarding') {
    return (
      <OnboardingView
        onFinishOnboarding={() => navigate('campaigns')}
        onNavigate={navigate}
      />
    );
  }

  if (currentScreen === 'docs') {
    return <DocsView />;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#F4F2EC] flex flex-col md:flex-row antialiased font-sans selection:bg-[#C9B8FF] selection:text-[#000000]">
      {/* Desktop Sidebar:
          Breakpoints:
          - under 768px: hidden (fixed bottom mobile nav used instead)
          - 768–1279px: 56px collapsed sidebar
          - 1280px+: 216px expanded sidebar
          Sticky at 100vh with More pinned to bottom edge
      */}
      <Sidebar />

      {/* Main Content Area:
          Rule:
          - Content area: padding 40px, max-width 1440px, aligned to sidebar edge. Center it only above 1680px.
          - Never leave more than 120px of unused width on either side at 1920px.
      */}
      <main className="flex-1 min-w-0 flex flex-col items-start [@media(min-width:1680px)]:items-center">
        <div className="w-full max-w-[1440px] [@media(min-width:1680px)]:max-w-[1520px] p-6 md:p-10 pb-24 md:pb-12 min-w-0">
          {currentScreen === 'campaigns' && <CampaignsView />}
          {currentScreen === 'campaign' && <CampaignDetailView />}
          {currentScreen === 'manager' && <CampaignManagerView />}
          {currentScreen === 'earnings' && <EarningsView />}
          {currentScreen === 'create' && <CreateCampaignView />}
          {currentScreen === 'profile' && <ProfileView />}
          {currentScreen === 'settings' && <SettingsView />}
          {currentScreen === 'keys' && <KeysView />}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <MobileNav />

      {/* All Overlays: Search, Notifications, Request Modal, More Menu (fixed to viewport) */}
      <Overlays />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
