import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UmiPetal } from './UmiGraphic';

interface DocArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  sections: {
    title: string;
    description: string;
    filename?: string;
    code?: string;
  }[];
  tip?: string;
}

const DOCS_DATA: Record<string, DocArticle> = {
  Quickstart: {
    id: 'Quickstart',
    title: 'iOS Quickstart',
    category: 'Getting started',
    description: 'Verify your first install and attribute creator codes in about ten minutes.',
    sections: [
      {
        title: 'Add the Swift Package',
        description: 'Add the umi-ios SDK dependency to your Xcode project or Package.swift manifest.',
        filename: 'Package.swift',
        code: '.package(url: "https://github.com/umi/umi-ios", from: "1.0.0")',
      },
      {
        title: 'Configure at launch',
        description: 'Initialize Umi inside your SwiftUI App or UIApplicationDelegate with your publishable key.',
        filename: 'App.swift',
        code: `import Umi\n\n@main struct MyApp: App {\n  init() {\n    Umi.configure(apiKey: "umi_pk_live_49f82bc19a7e3d")\n  }\n}`,
      },
      {
        title: 'Confirm the creator code',
        description: 'When the user launches via deep link or enters a creator code during onboarding, confirm the referral source.',
        filename: 'Onboarding.swift',
        code: `Umi.confirmSource(code: creatorCode) { result in\n  switch result {\n  case .success(let attribution):\n    print("Attributed to creator \\(attribution.creatorHandle)")\n  case .failure(let error):\n    print("Attribution check failed: \\(error)")\n  }\n}`,
      },
    ],
    tip: 'Use your publishable key inside client binaries. Never ship a secret key in client builds.',
  },
  Introduction: {
    id: 'Introduction',
    title: 'Introduction to umi',
    category: 'Getting started',
    description: 'umi is a performance-based partnership protocol connecting verified mobile apps with creators.',
    sections: [
      {
        title: 'How attribution works',
        description: 'umi uses cryptographic deep links, universal clipboard matching, and device fingerprint verification to confirm real app installs with zero ad-fraud.',
      },
      {
        title: 'Reward settlements',
        description: 'Founders fund a campaign deposit via Stripe. When an install is verified, funds transition from Verifying to Available on creators’ weekly settlements.',
      },
    ],
  },
  Install: {
    id: 'Install',
    title: 'SDK Installation Guide',
    category: 'iOS SDK',
    description: 'Complete setup for Swift Package Manager, CocoaPods, and manual frameworks.',
    sections: [
      {
        title: 'Swift Package Manager (Recommended)',
        description: 'In Xcode, select File > Add Packages and enter the repository URL.',
        code: 'https://github.com/umi/umi-ios.git',
      },
    ],
  },
  Configure: {
    id: 'Configure',
    title: 'SDK Configuration',
    category: 'iOS SDK',
    description: 'Fine-tune tracking options, test modes, and sandbox environments.',
    sections: [
      {
        title: 'Debug mode',
        description: 'Enable verbose logging in debug builds to verify event payloads.',
        code: 'Umi.setDebugMode(enabled: true)',
      },
    ],
  },
  'Creator codes': {
    id: 'Creator codes',
    title: 'Creator Codes & Deep Links',
    category: 'Guides',
    description: 'How custom coupon codes like UMI-4F7K are matched against active campaigns.',
    sections: [
      {
        title: 'Custom code lookup',
        description: 'Codes are 8-character identifiers linked to an approved creator registration.',
      },
    ],
  },
  'Payouts and settlement': {
    id: 'Payouts and settlement',
    title: 'Payouts & Settlement Schedule',
    category: 'Guides',
    description: 'Understand the clearing cycle from Verifying to Available and Friday direct deposits.',
    sections: [
      {
        title: '7-Day clearing window',
        description: 'To protect against immediate app uninstalls, earnings remain on hold for 7 days before becoming available for withdrawal.',
      },
    ],
  },
  'REST API': {
    id: 'REST API',
    title: 'REST API Reference',
    category: 'Reference',
    description: 'Server-side endpoints for querying campaign metrics and creator performance.',
    sections: [
      {
        title: 'GET /v1/campaigns/:id/creators',
        description: 'Retrieve all approved creators and their verified install totals.',
        code: 'curl https://api.umi.is/v1/campaigns/palazzo/creators \\\n  -H "Authorization: Bearer umi_sk_live_..."',
      },
    ],
  },
};

export function DocsView() {
  const { previousScreen, navigate } = useApp();
  const [activeArticleId, setActiveArticleId] = useState<string>('Quickstart');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  const categories = [
    { name: 'Getting started', items: ['Introduction', 'Quickstart'] },
    { name: 'iOS SDK', items: ['Install', 'Configure'] },
    { name: 'Guides', items: ['Creator codes', 'Payouts and settlement'] },
    { name: 'Reference', items: ['REST API'] },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const articleKeys = Object.keys(DOCS_DATA);
  const currentIndex = articleKeys.indexOf(activeArticleId);
  const prevArticleKey = currentIndex > 0 ? articleKeys[currentIndex - 1] : null;
  const nextArticleKey = currentIndex < articleKeys.length - 1 ? articleKeys[currentIndex + 1] : null;

  const currentDoc = DOCS_DATA[activeArticleId] || DOCS_DATA['Quickstart'];

  // Filter categories by search
  const filteredCategories = categories
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-[#000000] text-[#F4F2EC]">
      {/* Top Docs Header */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-[#1c1c1c] sticky top-0 bg-[#000000]/95 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('campaigns')}
            className="flex items-center gap-2 hover:opacity-85 transition-opacity"
          >
            <UmiPetal size={26} />
            <span className="font-serif text-lg font-medium text-[#F4F2EC]">umi</span>
          </button>
          <span className="text-xs text-[#9C9A92] font-mono px-2 py-0.5 rounded bg-[#181818] border border-[#222222]">
            documentation
          </span>
        </div>

        {/* "Back to app" returns to the screen user came from! */}
        <button
          onClick={() => navigate(previousScreen || 'campaigns')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#141414] border border-[#222222] text-[#F4F2EC] hover:bg-[#1f1f1f] transition-colors"
        >
          <i className="ti ti-arrow-left text-xs" />
          <span>Back to app ({previousScreen || 'campaigns'})</span>
        </button>
      </header>

      {/* Docs Layout Container: max-width 1440px */}
      <div className="w-full max-w-[1440px] mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)_240px] gap-10 items-start">
          {/* Left Nav (260px, sticky) */}
          <nav className="md:sticky md:top-20 space-y-5 text-xs select-none bg-[#0A0A0A] border border-[#1a1a1a] rounded-2xl p-4">
            {/* Search Input */}
            <div className="relative">
              <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-[#9C9A92]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter docs..."
                className="w-full bg-[#141414] border border-[#222222] rounded-xl pl-8 pr-3 py-2 text-xs text-[#F4F2EC] outline-none focus:border-[#C9B8FF]"
              />
            </div>

            {filteredCategories.map(cat => (
              <div key={cat.name} className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9C9A92] px-2 py-0.5">
                  {cat.name}
                </div>
                {cat.items.map(item => (
                  <button
                    key={item}
                    onClick={() => setActiveArticleId(item)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors ${
                      activeArticleId === item
                        ? 'bg-[#181818] text-[#F4F2EC] font-semibold border border-[#262626]'
                        : 'text-[#9C9A92] hover:text-[#F4F2EC] hover:bg-[#121212]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Main Content Fluid (max 880px, code blocks full width) */}
          <main className="min-w-0 max-w-[880px] space-y-8">
            <div className="space-y-2">
              <div className="text-xs text-[#C9B8FF] font-medium flex items-center gap-1.5">
                <span>{currentDoc.category}</span>
                <i className="ti ti-chevron-right text-[10px]" />
                <span className="text-[#F4F2EC]">{currentDoc.title}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#F4F2EC]">
                {currentDoc.title}
              </h1>
              <p className="text-sm text-[#9C9A92] leading-relaxed">{currentDoc.description}</p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {currentDoc.sections.map((sec, idx) => (
                <div
                  key={idx}
                  id={`sec-${idx}`}
                  className="border border-[#1a1a1a] rounded-2xl p-5 bg-[#0A0A0A] space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#181818] border border-[#2a2a2a] text-xs font-semibold flex items-center justify-center text-[#F4F2EC] tabular-nums">
                      {idx + 1}
                    </span>
                    <h2 className="text-base font-medium text-[#F4F2EC]">{sec.title}</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-[#C8C6BE] leading-relaxed">
                    {sec.description}
                  </p>

                  {/* Code Block Full Width */}
                  {sec.code && (
                    <div className="border border-[#222222] rounded-xl overflow-hidden bg-[#070707] mt-3">
                      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0E0E0E] border-b border-[#222222] text-[11px] text-[#9C9A92]">
                        <span className="font-mono">{sec.filename || 'Code Snippet'}</span>
                        <button
                          onClick={() => handleCopy(sec.code!, `sec-${idx}`)}
                          className="hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                        >
                          <i
                            className={`ti ${
                              copiedCodeKey === `sec-${idx}` ? 'ti-check text-[#C9B8FF]' : 'ti-copy'
                            }`}
                          />
                          <span>{copiedCodeKey === `sec-${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-4 font-mono text-xs text-[#D8D7D2] overflow-x-auto leading-relaxed">
                        <code>{sec.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Callout Tip if available */}
            {currentDoc.tip && (
              <div className="flex items-start gap-3 bg-[#0A0A0A] border border-[#C9B8FF]/20 rounded-2xl p-4 text-xs">
                <i className="ti ti-info-circle text-[#C9B8FF] text-lg shrink-0 mt-0.5" />
                <p className="text-[#C8C6BE] leading-relaxed">{currentDoc.tip}</p>
              </div>
            )}

            {/* Prev / Next Navigation */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#181818]">
              {prevArticleKey ? (
                <button
                  onClick={() => setActiveArticleId(prevArticleKey)}
                  className="p-4 rounded-2xl border border-[#1f1f1f] bg-[#0A0A0A] text-left hover:border-[#2a2a2a] transition-colors"
                >
                  <div className="text-[10px] text-[#9C9A92]">Previous</div>
                  <div className="text-xs font-semibold text-[#F4F2EC] mt-0.5">
                    {DOCS_DATA[prevArticleKey]?.title}
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextArticleKey ? (
                <button
                  onClick={() => setActiveArticleId(nextArticleKey)}
                  className="p-4 rounded-2xl border border-[#1f1f1f] bg-[#0A0A0A] text-right hover:border-[#2a2a2a] transition-colors"
                >
                  <div className="text-[10px] text-[#9C9A92]">Next</div>
                  <div className="text-xs font-semibold text-[#F4F2EC] mt-0.5">
                    {DOCS_DATA[nextArticleKey]?.title}
                  </div>
                </button>
              ) : (
                <div />
              )}
            </div>
          </main>

          {/* Right "On this page" TOC (240px, sticky) */}
          <aside className="hidden lg:block text-xs select-none sticky top-20 bg-[#0A0A0A] border border-[#1a1a1a] rounded-2xl p-4 space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9C9A92]">
              On this page
            </div>
            <div className="space-y-2 text-[#9C9A92]">
              {currentDoc.sections.map((sec, idx) => (
                <a
                  key={idx}
                  href={`#sec-${idx}`}
                  className="block hover:text-white transition-colors truncate"
                >
                  {idx + 1}. {sec.title}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
