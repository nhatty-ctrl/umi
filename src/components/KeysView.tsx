import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function KeysView() {
  const { navigate, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'keys' | 'test'>('keys');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [secretKeys, setSecretKeys] = useState<Array<{ id: string; key: string; created: string }>>([
    { id: 'sec-1', key: 'umi_sk_live_9a7b4c2e81f', created: '3 hours ago' },
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateSecret = () => {
    const rand = Math.random().toString(36).substring(2, 10);
    const newKey = {
      id: `sec-${Date.now()}`,
      key: `umi_sk_live_${rand}`,
      created: 'Just now',
    };
    setSecretKeys(prev => [newKey, ...prev]);
    addNotification({
      title: 'Secret key generated',
      subtitle: newKey.key,
      body: 'New API secret created. Store it securely; server keys have full write access.',
      targetScreen: 'keys',
      type: 'system',
    });
  };

  const handleRunTest = () => {
    setIsRunningTest(true);
    setTestOutput('> connecting to sandbox endpoint...');
    setTimeout(() => {
      setTestOutput(
        '> sending test event...\n> key accepted: umi_pk_live_8f2k4a91\n> app ownership verified\n> event received in 212 ms\n> status: 200 OK'
      );
      setIsRunningTest(false);
    }, 600);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#181818]">
        <button
          onClick={() => navigate('campaigns')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#141414] border border-[#222222] text-[#F4F2EC] hover:bg-[#1a1a1a] transition-colors"
        >
          <i className="ti ti-arrow-left" />
          <span>Back to campaigns</span>
        </button>

        <button
          onClick={() => navigate('docs')}
          className="text-xs font-medium text-[#C9B8FF] hover:underline underline-offset-4 flex items-center gap-1"
        >
          <span>SDK Documentation</span>
          <i className="ti ti-arrow-right text-[11px]" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] [@media(min-width:1680px)]:grid-cols-[minmax(0,1fr)_360px] gap-10 items-start">
        <div className="min-w-0 space-y-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#F4F2EC]">
              API keys & SDK
            </h1>
            <p className="text-xs sm:text-sm text-[#9C9A92] mt-1.5">
              Connect your mobile application to track installs, verify attribution, and fund creator payouts.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#1c1c1c]">
            <button
              onClick={() => setActiveTab('keys')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                activeTab === 'keys'
                  ? 'border-[#F4F2EC] text-[#F4F2EC]'
                  : 'border-transparent text-[#9C9A92] hover:text-[#F4F2EC]'
              }`}
            >
              API Keys
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                activeTab === 'test'
                  ? 'border-[#F4F2EC] text-[#F4F2EC]'
                  : 'border-transparent text-[#9C9A92] hover:text-[#F4F2EC]'
              }`}
            >
              Connection Test
            </button>
          </div>

          {activeTab === 'keys' && (
            <div className="space-y-6 pt-1">
              {/* Publishable Key */}
              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                <div className="p-5">
                  <h3 className="font-semibold text-sm text-[#F4F2EC]">Publishable client key</h3>
                  <p className="text-xs text-[#9C9A92] mt-0.5">
                    Safe to embed inside iOS and Android production binaries. Used by `UmiAnalytics.initialize()`.
                  </p>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5 bg-[#070707] border-t border-[#1f1f1f] text-xs">
                  <span className="text-[#9C9A92] w-16">client</span>
                  <span className="font-mono text-xs text-[#F4F2EC] flex-1 truncate px-2">
                    umi_pk_live_8f2k4a91
                  </span>
                  <button
                    onClick={() => handleCopy('umi_pk_live_8f2k4a91', 'pub')}
                    className="text-[#9C9A92] hover:text-[#F4F2EC] p-1.5 rounded-lg hover:bg-[#141414] transition-colors"
                    aria-label="Copy publishable key"
                  >
                    <i className={`ti ${copiedKey === 'pub' ? 'ti-check text-[#C9B8FF]' : 'ti-copy'}`} />
                  </button>
                </div>
              </div>

              {/* Secret Keys */}
              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-[#F4F2EC]">Secret server keys</h3>
                    <p className="text-xs text-[#9C9A92] mt-0.5">
                      Backend only. Use for server-to-server validation and programmatic payouts.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateSecret}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#141414] border border-[#222222] text-[#F4F2EC] hover:bg-[#1a1a1a] transition-colors"
                  >
                    + New secret key
                  </button>
                </div>

                <div className="divide-y divide-[#181818]">
                  {secretKeys.map(k => (
                    <div key={k.id} className="flex items-center justify-between px-5 py-3.5 bg-[#070707] border-t border-[#1f1f1f] text-xs">
                      <span className="text-[#9C9A92] w-16">server</span>
                      <span className="font-mono text-xs text-[#F4F2EC] flex-1 truncate px-2">
                        {showSecret ? k.key : 'umi_sk_live_••••••••••••'}
                      </span>
                      <span className="text-xs text-[#9C9A92] mr-3 hidden sm:inline">{k.created}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowSecret(prev => !prev)}
                          className="text-[#9C9A92] hover:text-[#F4F2EC] p-1.5 rounded-lg hover:bg-[#141414] transition-colors"
                          aria-label="Toggle secret key visibility"
                        >
                          <i className={`ti ${showSecret ? 'ti-eye-off' : 'ti-eye'}`} />
                        </button>
                        <button
                          onClick={() => handleCopy(k.key, k.id)}
                          className="text-[#9C9A92] hover:text-[#F4F2EC] p-1.5 rounded-lg hover:bg-[#141414] transition-colors"
                          aria-label="Copy secret key"
                        >
                          <i className={`ti ${copiedKey === k.id ? 'ti-check text-[#C9B8FF]' : 'ti-copy'}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="space-y-4 pt-1">
              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-[#F4F2EC]">Sandbox connection probe</h3>
                    <p className="text-xs text-[#9C9A92] mt-0.5">
                      Sends a signed test event with `umi_pk_live_8f2k4a91` to verify ingestion pipelines.
                    </p>
                  </div>
                  <button
                    onClick={handleRunTest}
                    disabled={isRunningTest}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-[#F4F2EC] text-[#000000] hover:bg-white transition-colors"
                  >
                    {isRunningTest ? 'Testing...' : testOutput ? 'Run probe again' : 'Send test event'}
                  </button>
                </div>

                <div className="bg-[#070707] border border-[#1c1c1c] rounded-xl p-4 font-mono text-xs text-[#D8D7D2] whitespace-pre-wrap min-h-[110px]">
                  {testOutput || 'Ready. Click "Send test event" to verify endpoint handshake.'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right rail */}
        <aside className="space-y-6 lg:sticky lg:top-6">
          <div className="p-5 rounded-2xl border border-[#1f1f1f] bg-[#0c0c0c] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#9C9A92]">
              <span className="font-medium text-[#F4F2EC]">Environment status</span>
              <span className="text-[#4ade80] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-[#9C9A92] leading-relaxed">
              API requests are being served with low latency (&lt;45ms globally).
            </p>
            <div className="pt-2 border-t border-[#181818] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#9C9A92]">
                <span>Rate limit</span>
                <span className="text-[#F4F2EC]">1,000 req/min</span>
              </div>
              <div className="flex justify-between text-[#9C9A92]">
                <span>TLS version</span>
                <span className="text-[#F4F2EC]">TLS 1.3 only</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
