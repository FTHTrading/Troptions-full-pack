'use client';
import { useState } from 'react';
import { useI18n } from '@/i18n/useI18n';

export type AssistantMode = 'merchant' | 'fan' | 'sponsor' | 'guest' | 'launch-guide';

interface AIAssistantProps {
  mode?: AssistantMode;
  className?: string;
}

// Guide responses — no live AI required; plain text campaign help
const GUIDE_RESPONSES: Record<AssistantMode, string[]> = {
  merchant: [
    "Let's set up your merchant campaign. Choose a campaign type first — QR Campaign, Loyalty Reward, NFT Coupon, VIP Pass, or Merchant Namespace.",
    "Your namespace is your campaign identity. Use your business name, lowercase, hyphenated. Example: my-restaurant or kevan-coffee.",
    "For a QR Campaign, set a destination URL — your menu, offer page, or claim flow. Customers scan and land on your offer.",
    "NFT Coupons work as collectible digital coupons. Set a discount or reward, attach an image, and mint on Solana devnet to test.",
    "VIP Passes grant access or recognition. Add a description of what the pass unlocks — event access, loyalty tier, or exclusive offer.",
  ],
  fan: [
    "Create a fan tribute in 3 steps: name the tribute, write a message for your city or team, then generate a QR to share.",
    "Fan tributes are commemorative and community — not gambling, not investment. They can include a collectible attachment.",
    "You can tie a local merchant offer to your fan tribute — a food spot, shop, or sponsor near the venue.",
    "Add an image URL or use a placeholder. Your tribute goes live immediately.",
    "Optional: attach a VIP Pass or NFT Coupon to give fans something to claim when they scan your tribute QR.",
  ],
  sponsor: [
    "Sponsor activations live inside fan tributes and QR campaigns. Start by choosing your activation type: branded QR offer, VIP sponsor pass, or fan tribute sponsor slot.",
    "Your sponsor offer will appear when fans scan tributes near your activation zone.",
    "Add your brand name, offer description, and redemption URL. Fans scan → claim → your brand appears.",
    "Track engagement through scan analytics once your campaign goes live.",
  ],
  guest: [
    "Welcome! I can help you find merchants, offers, fan tributes, and nearby activations.",
    "Scan a QR code at any participating merchant or venue to claim an offer.",
    "Look for fan tribute QR codes around the stadium area to claim collectibles.",
    "Need help navigating? WhichWay AI on fifa.unykorn.org can guide you to venues, restaurants, and transport.",
  ],
  'launch-guide': [
    "This is the Solana Campaign Launcher. You can create Merchant Namespaces, QR Campaigns, Loyalty Rewards, NFT Coupons, VIP Passes, Fan Tributes, Sponsor Offers, Local Giveaways, and Event Promos.",
    "All campaigns are on Solana devnet by default. Mainnet requires NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true.",
    "Campaign assets are not investments, securities, or gambling products — they are promotional utilities for loyalty, access, and fan engagement.",
    "Connect a Phantom, Solflare, or Backpack wallet to mint. No private keys or seed phrases are ever handled by this app.",
    "DONK AI builds the campaign. TROPTIONS powers the operating layer. UNYKORN gives your campaign a namespace.",
  ],
};

const MODE_LABELS: Record<AssistantMode, string> = {
  merchant: 'Merchant Launch Assistant',
  fan: 'Fan Tribute Assistant',
  sponsor: 'Sponsor Activation Assistant',
  guest: 'Guest Concierge',
  'launch-guide': 'Launch Guide',
};

export default function AIAssistant({ mode = 'launch-guide', className = '' }: AIAssistantProps) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; text: string }[]>([
    { role: 'assistant', text: GUIDE_RESPONSES[mode][0] },
  ]);
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState(false);
  const guides = GUIDE_RESPONSES[mode];
  const [guideIndex, setGuideIndex] = useState(1);

  function send() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    // Pull next guide response (cycles through preset tips)
    const nextGuide = guides[guideIndex % guides.length];
    setGuideIndex((i) => i + 1);
    setMessages((m) => [
      ...m,
      { role: 'user', text: userMsg },
      { role: 'assistant', text: nextGuide },
    ]);
  }

  return (
    <div className={`border border-white/10 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/4 hover:bg-white/6 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400/70">AI</span>
          <span className="text-sm font-medium text-white">{MODE_LABELS[mode]}</span>
          {/* Truth label: always stub for now */}
          <span className="text-[9px] font-mono text-yellow-500/60 border border-yellow-500/20 rounded px-1">
            {t.truth.aiRuntimeStubbed}
          </span>
        </div>
        <span className="text-white/30 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="p-4">
          {/* Stub notice */}
          <div className="text-[10px] text-yellow-500/60 mb-3 font-mono">
            {t.ai.stubNotice} — Connect AI_GATEWAY_URL in env to enable live provider.
          </div>

          {/* Messages */}
          <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-xs p-2 rounded ${
                  m.role === 'assistant'
                    ? 'bg-white/4 text-white/70'
                    : 'bg-cyan-900/20 text-cyan-200 text-right'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={t.ai.askPlaceholder}
              className="flex-1 bg-white/4 border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-white/25"
            />
            <button
              onClick={send}
              className="border border-white/15 text-white/60 text-xs px-3 py-2 rounded hover:border-white/30 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
