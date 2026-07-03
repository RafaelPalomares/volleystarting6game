'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PremiumSuccessPage() {
  useEffect(() => {
    localStorage.setItem('s6_premium', 'true');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-3xl font-black mb-3">You're Premium!</h1>
        <p className="text-gray-400 mb-8">
          No more ads. Unlimited skips. Full access to all features. Thank you for supporting Starting 6!
        </p>
        <Link href="/" className="inline-block px-8 py-3 bg-court-accent text-white font-bold rounded-xl glow-red">
          Start Playing
        </Link>
      </motion.div>
    </div>
  );
}
