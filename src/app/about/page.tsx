'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-xs text-gray-500 hover:text-white mb-8 block">← Back</Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black mb-2">About Starting 6</h1>
        <p className="text-gray-500 text-sm mb-10">Built by a volleyball player, for volleyball players.</p>

        {/* Creator section */}
        <div className="gradient-border rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-court-accent to-rose-700 flex items-center justify-center text-xl">
              🏐
            </div>
            <div>
              <h2 className="font-black text-lg text-white">Rafael Palomares</h2>
              <p className="text-xs text-gray-500">Founder & Creator</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
            <p>
              Setter and floor general at <span className="text-white font-medium">Volleyball Münchenbuchsee U20</span>. 
              Number 5. The kind of setter who sees the play two touches before it happens — calm under pressure, 
              surgical with his sets, and always finds the open hitter when it matters most.
            </p>
            <p>
              Rafael built Starting 6 out of obsession with the game — a way to combine his love for volleyball 
              with his passion for tech. Every stat, every player, every detail in this app comes from someone 
              who actually lives and breathes this sport on the court, not just behind a screen.
            </p>
            <p>
              When he's not running the offense for Münchenbuchsee or coding this app, he's probably studying 
              Giannelli sets on YouTube or arguing about who the real GOAT setter is.
            </p>
          </div>

          {/* Player card style */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500">Player Profile</p>
                <p className="font-bold text-white">R. Palomares</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-court-accent">99</p>
                <p className="text-[9px] text-gray-500">OVR</p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { label: 'IQ', value: 99, color: 'text-yellow-400' },
                { label: 'SET', value: 99, color: 'text-amber-400' },
                { label: 'SRV', value: 95, color: 'text-blue-400' },
                { label: 'DEF', value: 92, color: 'text-emerald-400' },
                { label: 'LDR', value: 99, color: 'text-purple-400' },
              ].map((s) => (
                <div key={s.label}>
                  <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[8px] text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The game */}
        <div className="space-y-4 text-sm text-gray-400 leading-relaxed mb-10">
          <h2 className="text-white font-bold text-base">The Game</h2>
          <p>
            Starting 6 is inspired by the viral 82-0 basketball game. Same concept — slot machine draft, 
            random countries, build the best team — but built for volleyball. Real VNL 2026 data. 
            Real players. Real positions.
          </p>
          <p>
            The goal: make volleyball culture as addictive online as it is in the gym. 
            Share your lineups, compete in daily challenges, and prove you know the game better than anyone.
          </p>
        </div>

        {/* Links */}
        <div className="border-t border-white/5 pt-6 space-y-2">
          <h3 className="text-xs text-gray-600 uppercase tracking-wider mb-3">Legal</h3>
          <Link href="/privacy" className="block text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="block text-sm text-gray-500 hover:text-white transition-colors">Terms of Use</Link>
          <Link href="/imprint" className="block text-sm text-gray-500 hover:text-white transition-colors">Imprint</Link>
        </div>

        <p className="mt-8 text-[10px] text-gray-700">© 2026 Rafael Palomares. All rights reserved.</p>
      </motion.div>
    </div>
  );
}
