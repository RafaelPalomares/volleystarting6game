'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getStats, getGameHistory, type GameRecord } from '@/lib/stats';
import { usePremiumStatus } from '@/components/ads';

export default function StatsPage() {
  const [stats, setStats] = useState<ReturnType<typeof getStats>>(null);
  const [history, setHistory] = useState<GameRecord[]>([]);
  const isPremium = usePremiumStatus();

  useEffect(() => {
    setStats(getStats());
    setHistory(getGameHistory());
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Your Stats</h1>
        <Link href="/" className="text-xs text-gray-500 hover:text-white">← Back</Link>
      </div>

      {stats ? (
        <>
          {/* Overview cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Games', value: stats.gamesPlayed, emoji: '🎮' },
              { label: 'Best', value: stats.bestRating, emoji: '🏆' },
              { label: 'Average', value: stats.avgRating, emoji: '📊' },
              { label: 'Streak', value: `${stats.streak}d`, emoji: '🔥' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="gradient-border rounded-xl p-4 text-center"
              >
                <p className="text-lg mb-1">{s.emoji}</p>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* History */}
          <h2 className="text-sm font-bold text-gray-400 mb-3">Recent Games</h2>
          <div className="space-y-2">
            {(isPremium ? history : history.slice(0, 5)).map((game, i) => (
              <div key={i} className="gradient-border rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400">
                    {game.mode === 'daily' ? '📅' : '🎰'} {game.mode}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{game.overall} OVR</p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(game.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-court-accent">{game.grade}</span>
              </div>
            ))}

            {!isPremium && history.length > 5 && (
              <Link href="/premium" className="block text-center py-3 text-xs text-court-accent hover:underline">
                ⭐ Unlock full history with Premium
              </Link>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-3xl mb-3">🏐</p>
          <p className="text-gray-500 text-sm">Play a game to see your stats!</p>
          <Link href="/" className="inline-block mt-4 px-6 py-2 bg-court-accent text-white text-sm font-bold rounded-lg">
            Play Now
          </Link>
        </div>
      )}
    </div>
  );
}
