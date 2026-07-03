'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PremiumPage() {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    // TODO: Replace with real Stripe checkout
    // For now, simulate a purchase flow
    // In production: redirect to Stripe Checkout session
    // const res = await fetch('/api/checkout', { method: 'POST' });
    // const { url } = await res.json();
    // window.location.href = url;

    // Demo: unlock premium locally
    setTimeout(() => {
      localStorage.setItem('s6_premium', 'true');
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm w-full text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
          <span className="text-2xl">⭐</span>
        </div>

        <h1 className="text-3xl font-black mb-2">Go Premium</h1>
        <p className="text-gray-500 text-sm mb-8">Remove ads and unlock exclusive features.</p>

        {/* Features */}
        <div className="text-left space-y-3 mb-8">
          {[
            { emoji: '🚫', text: 'No ads — ever' },
            { emoji: '🔄', text: 'Unlimited skips per game' },
            { emoji: '📊', text: 'Personal stats & history' },
            { emoji: '🏆', text: 'Leaderboard access' },
            { emoji: '🎯', text: 'Weekly challenges' },
            { emoji: '⚡', text: 'Early access to new features' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <span className="text-lg">{f.emoji}</span>
              <span className="text-sm font-medium">{f.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Price */}
        <div className="mb-6">
          <p className="text-4xl font-black text-white">€3.99</p>
          <p className="text-xs text-gray-500 mt-1">One-time payment • Lifetime access</p>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePurchase}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-2xl text-base disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Unlock Premium'}
        </motion.button>

        <Link href="/" className="block mt-4 text-xs text-gray-600 hover:text-gray-400">
          ← Back to game
        </Link>

        <p className="mt-6 text-[9px] text-gray-700">
          Secure payment via Stripe. Cancel anytime via support.
        </p>
      </motion.div>
    </div>
  );
}
