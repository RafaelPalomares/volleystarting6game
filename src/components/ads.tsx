'use client';

import { useEffect, useRef } from 'react';

// Google AdSense component
// Replace ca-pub-XXXXXXX with your real AdSense publisher ID
const AD_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'; // TODO: Replace with your AdSense ID

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}

export function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isPremium = usePremiumStatus();

  useEffect(() => {
    if (isPremium) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [isPremium]);

  if (isPremium) return null;

  return (
    <div className={`w-full flex justify-center my-4 ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '50px' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Interstitial ad between rounds (shows every 3 rounds)
export function InterstitialAd({ round, onClose }: { round: number; onClose: () => void }) {
  const isPremium = usePremiumStatus();

  // Only show after round 3
  if (isPremium || round !== 3) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-[#0d0f17] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
        <p className="text-xs text-gray-500 mb-3">AD</p>
        <div className="w-full h-[250px] bg-gray-900 rounded-xl flex items-center justify-center mb-4">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '250px' }}
            data-ad-client={AD_CLIENT}
            data-ad-slot="INTERSTITIAL_SLOT"
            data-ad-format="rectangle"
          />
        </div>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-white transition-colors">
          Continue →
        </button>
        <div className="mt-3 pt-3 border-t border-white/5">
          <a href="/premium" className="text-xs text-court-accent hover:underline">
            Remove ads for €3.99 →
          </a>
        </div>
      </div>
    </div>
  );
}

// Premium status check
export function usePremiumStatus(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('s6_premium') === 'true';
}

export function setPremiumStatus(status: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('s6_premium', String(status));
}
