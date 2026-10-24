import React, { useState } from 'react';
import { ScreenType } from '../types';
import { AvatarSvg } from './UmiGraphic';

interface OnboardingViewProps {
  onFinishOnboarding: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export function OnboardingView({ onFinishOnboarding, onNavigate }: OnboardingViewProps) {
  const [step, setStep] = useState<number>(0);
  const [role, setRole] = useState<'creator' | 'founder'>('creator');
  const [handle, setHandle] = useState('amara');
  const [appLink, setAppLink] = useState('apps.apple.com/app/dune-notes');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#000000]">
      <div className="w-full max-w-md bg-[#0E0E0E] border border-[#222222] rounded-3xl p-6 sm:p-7 shadow-2xl">
        {/* Progress Segments */}
        <div className="flex gap-1.5 mb-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-colors ${
                i <= step ? 'bg-[#F4F2EC]' : 'bg-[#1e1e1e]'
              }`}
            />
          ))}
        </div>

        {/* STEP 0: CHOOSE ROLE */}
        {step === 0 && (
          <div>
            <h2 className="font-serif text-3xl tracking-tight text-[#F4F2EC]">Welcome to umi</h2>
            <p className="text-xs text-[#9C9A92] mt-1 mb-5">How will you use the platform?</p>

            <div className="space-y-3">
              <div
                onClick={() => setRole('creator')}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  role === 'creator'
                    ? 'border-[#F4F2EC] bg-[#141414]'
                    : 'border-[#222222] bg-[#0c0c0c] hover:border-[#333333]'
                }`}
              >
                <AvatarSvg color="#A8D0B0" size={42} />
                <div>
                  <div className="font-semibold text-sm text-[#F4F2EC]">Creator / Partner</div>
                  <div className="text-xs text-[#9C9A92] mt-0.5">
                    Promote apps and earn per verified install.
                  </div>
                </div>
              </div>

              <div
                onClick={() => setRole('founder')}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  role === 'founder'
                    ? 'border-[#F4F2EC] bg-[#141414]'
                    : 'border-[#222222] bg-[#0c0c0c] hover:border-[#333333]'
                }`}
              >
                <AvatarSvg color="#E8B4A0" size={42} />
                <div>
                  <div className="font-semibold text-sm text-[#F4F2EC]">App founder / Studio</div>
                  <div className="text-xs text-[#9C9A92] mt-0.5">
                    Launch campaigns and pay only for verified installs.
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-6 py-3 rounded-full text-sm font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 1: SETUP DETAILS */}
        {step === 1 && (
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-tight text-[#F4F2EC]">
              {role === 'creator' ? 'Set up your profile' : 'Add your app'}
            </h2>
            <p className="text-xs text-[#9C9A92] mt-1 mb-4">
              {role === 'creator'
                ? 'Founders see these when you request to join.'
                : 'We pull the name, icon and details from your store listing.'}
            </p>

            {role === 'creator' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] text-[#9C9A92] block mb-1">Username</label>
                  <div className="flex items-center h-11 px-3 bg-[#141414] border border-[#222222] rounded-xl text-xs">
                    <span className="text-[#9C9A92]">umi.link/</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={e => setHandle(e.target.value)}
                      className="bg-transparent border-0 outline-none flex-1 text-[#F4F2EC] font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[11px] text-[#9C9A92] block mb-1">Social channels</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 h-10 px-3 bg-[#141414] border border-[#222222] rounded-xl text-xs">
                      <i className="ti ti-brand-tiktok text-[#9C9A92]" />
                      <span className="text-[#F4F2EC]">@amara</span>
                    </div>
                    <div className="flex items-center gap-2 h-10 px-3 bg-[#141414] border border-[#222222] rounded-xl text-xs">
                      <i className="ti ti-brand-youtube text-[#9C9A92]" />
                      <span className="text-[#9C9A92]">YouTube</span>
                    </div>
                    <div className="flex items-center gap-2 h-10 px-3 bg-[#141414] border border-[#222222] rounded-xl text-xs">
                      <i className="ti ti-brand-instagram text-[#9C9A92]" />
                      <span className="text-[#9C9A92]">@instagram</span>
                    </div>
                    <div className="flex items-center gap-2 h-10 px-3 bg-[#141414] border border-[#222222] rounded-xl text-xs">
                      <i className="ti ti-brand-x text-[#9C9A92]" />
                      <span className="text-[#9C9A92]">@x</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-[11px] text-[#9C9A92] block mb-1">App Store URL</label>
                <div className="flex items-center h-11 px-3 bg-[#141414] border border-[#222222] rounded-xl text-xs">
                  <input
                    type="text"
                    value={appLink}
                    onChange={e => setAppLink(e.target.value)}
                    className="bg-transparent border-0 outline-none w-full text-[#F4F2EC]"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setStep(0)}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#1a1a1a]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2 text-xs font-semibold rounded-full bg-[#F4F2EC] text-[#000000] hover:bg-white"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: HOW PAYOUTS WORK */}
        {step === 2 && (
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-tight text-[#F4F2EC]">
              How payouts work
            </h2>
            <p className="text-xs text-[#9C9A92] mt-1 mb-4">
              Two systems keep payouts fair for both creators and founders.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#141414] border border-[#202020]">
                <i className="ti ti-shield-check text-xl text-[#C9B8FF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-[#F4F2EC]">Install verification</div>
                  <p className="text-[11px] text-[#9C9A92] mt-0.5 leading-relaxed">
                    Installs are confirmed with a creator code and the app SDK, never guessed or fabricated.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#141414] border border-[#202020]">
                <i className="ti ti-calendar-event text-xl text-[#C9B8FF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-[#F4F2EC]">
                    Friday settlement and receipts
                  </div>
                  <p className="text-[11px] text-[#9C9A92] mt-0.5 leading-relaxed">
                    Earnings clear a hold safety window, then pay out every Friday directly to your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-[#2a2a2a] text-[#F4F2EC] hover:bg-[#1a1a1a]"
              >
                Back
              </button>
              <button
                onClick={() => {
                  onFinishOnboarding();
                  onNavigate('campaigns');
                }}
                className="px-5 py-2 text-xs font-semibold rounded-full bg-[#F4F2EC] text-[#000000] hover:bg-white shadow-md"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
