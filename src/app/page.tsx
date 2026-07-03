'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { newGame, spin, calculateResult, type GameState } from '@/lib/game';
import { Player, COUNTRIES, PLAYERS } from '@/data/players';

export default function Home() {
  const [game, setGame] = useState<GameState | null>(null);
  const [spinning, setSpinning] = useState(false);

  const start = () => setGame(newGame());
  const pickedIds = game?.roster.filter((s) => s.player).map((s) => s.player!.id) || [];

  const doSpin = useCallback(() => {
    if (!game) return;
    setSpinning(true);
    setTimeout(() => {
      const pos = game.roster[game.round].position;
      let result = spin(pickedIds, pos);
      if (result.players.length === 0) result = spin(pickedIds, pos);
      setGame((g) => g ? { ...g, currentSpin: result } : g);
      setSpinning(false);
    }, 900);
  }, [game, pickedIds]);

  const skip = () => {
    if (!game || game.skipsLeft <= 0) return;
    const pos = game.roster[game.round].position;
    setGame((g) => g ? { ...g, skipsLeft: g.skipsLeft - 1, currentSpin: null } : g);
    setSpinning(true);
    setTimeout(() => {
      const result = spin(pickedIds, pos);
      setGame((g) => g ? { ...g, currentSpin: result } : g);
      setSpinning(false);
    }, 900);
  };

  const pick = (player: Player) => {
    if (!game) return;
    const newRoster = [...game.roster];
    newRoster[game.round] = { ...newRoster[game.round], player };
    const nextRound = game.round + 1;
    const isComplete = nextRound >= 6;
    if (isComplete) {
      const result = calculateResult(newRoster);
      setGame({ ...game, round: nextRound, roster: newRoster, currentSpin: null, isComplete: true, result });
    } else {
      setGame({ ...game, round: nextRound, roster: newRoster, currentSpin: null });
    }
  };

  const flag = (code: string) => COUNTRIES.find((c) => c.code === code)?.flag || '🌍';
  const posColor = (pos: string) => {
    switch (pos) {
      case 'OH': return 'from-blue-500 to-blue-600';
      case 'OPP': return 'from-rose-500 to-rose-600';
      case 'MB': return 'from-violet-500 to-violet-600';
      case 'S': return 'from-amber-500 to-amber-600';
      case 'LIB': return 'from-emerald-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };
  const posBg = (pos: string) => {
    switch (pos) {
      case 'OH': return 'bg-blue-500/10 border-blue-500/30';
      case 'OPP': return 'bg-rose-500/10 border-rose-500/30';
      case 'MB': return 'bg-violet-500/10 border-violet-500/30';
      case 'S': return 'bg-amber-500/10 border-amber-500/30';
      case 'LIB': return 'bg-emerald-500/10 border-emerald-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  const courtSlots = [
    { idx: 0, top: '22%', left: '20%' },
    { idx: 3, top: '22%', left: '50%' },
    { idx: 2, top: '22%', left: '80%' },
    { idx: 4, top: '72%', left: '20%' },
    { idx: 1, top: '72%', left: '50%' },
    { idx: 5, top: '72%', left: '80%' },
  ];

  // ══════════════ LANDING ══════════════
  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-court-accent to-rose-700 flex items-center justify-center shadow-lg shadow-court-accent/20">
            <span className="text-3xl">🏐</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight leading-none">
            Starting <span className="text-court-accent">6</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed">
            Spin a country. Pick a player. Build the ultimate VNL lineup.
          </p>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={start}
            className="w-full max-w-[280px] py-4 bg-court-accent text-white font-bold rounded-2xl glow-red text-lg">
            Start Game
          </motion.button>
          <div className="mt-10 flex justify-center gap-10 text-center">
            <div><p className="text-xl font-bold text-white">{PLAYERS.length}</p><p className="text-[11px] text-gray-600 mt-0.5">Players</p></div>
            <div><p className="text-xl font-bold text-white">6</p><p className="text-[11px] text-gray-600 mt-0.5">Rounds</p></div>
            <div><p className="text-xl font-bold text-white">18</p><p className="text-[11px] text-gray-600 mt-0.5">Nations</p></div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══════════════ RESULT ══════════════
  if (game.isComplete && game.result) {
    const r = game.result;
    const gradeColor = r.overall >= 85 ? 'text-yellow-400' : r.overall >= 70 ? 'text-emerald-400' : 'text-white';

    return (
      <div className="min-h-screen px-4 py-8 max-w-md mx-auto flex flex-col items-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-8 w-full">
          <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em] mb-2">Your Team</p>
          <div className="flex items-center justify-center gap-4">
            <span className={`text-6xl md:text-7xl font-black ${gradeColor}`}>{r.overall}</span>
            <div className="text-left">
              <p className="text-2xl font-black text-gray-300">{r.grade}</p>
              <p className="text-[11px] text-gray-600">{r.strengthRating} STR</p>
            </div>
          </div>
        </motion.div>

        {/* Court */}
        <div className="relative w-full aspect-[4/3] max-h-[240px] mb-6 rounded-2xl overflow-hidden court-bg border border-white/10 shadow-2xl">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/20" />
            <div className="absolute left-4 right-4 top-4 bottom-4 border border-white/10 rounded-xl" />
            <div className="absolute top-[30%] left-4 right-4 h-[1px] bg-white/8" />
            <div className="absolute top-[70%] left-4 right-4 h-[1px] bg-white/8" />
          </div>
          {courtSlots.map(({ idx, top, left }) => {
            const slot = game.roster[idx];
            return (
              <motion.div key={idx} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: idx * 0.08, type: 'spring' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 player-card rounded-xl p-2 w-[27%] max-w-[100px] text-center"
                style={{ top, left }}>
                <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md mx-auto mb-1 w-fit bg-gradient-to-r ${posColor(slot.position)} text-white`}>{slot.position}</div>
                <p className="text-[10px] font-semibold text-white truncate">{slot.player?.name}</p>
                <p className="text-[11px] text-court-accent font-black mt-0.5">{slot.player?.overall}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats bars */}
        <div className="w-full gradient-border rounded-2xl p-5 mb-8">
          {[
            { label: 'ATK', value: r.totalAttack, color: 'bg-red-500' },
            { label: 'BLK', value: r.totalBlock, color: 'bg-violet-500' },
            { label: 'SRV', value: r.totalServe, color: 'bg-blue-500' },
            { label: 'DEF', value: r.totalDefense, color: 'bg-emerald-500' },
            { label: 'SET', value: r.totalSetting, color: 'bg-amber-500' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 mb-2.5 last:mb-0">
              <span className="text-[10px] text-gray-500 w-8 font-medium">{s.label}</span>
              <div className="stat-bar flex-1">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (s.value / 580) * 100)}%` }} transition={{ duration: 1, delay: 0.3 }}
                  className={`stat-bar-fill ${s.color}`} />
              </div>
              <span className="text-[11px] font-bold w-8 text-right text-gray-300">{s.value}</span>
            </div>
          ))}
        </div>

        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={start}
          className="w-full max-w-[280px] py-3.5 bg-court-accent text-white font-bold rounded-xl glow-red">
          Play Again
        </motion.button>
      </div>
    );
  }

  // ══════════════ GAME ══════════════
  const slot = game.roster[game.round];

  return (
    <div className="min-h-screen px-4 py-5 max-w-lg mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-black tracking-tight">Starting <span className="text-court-accent">6</span></h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < game.round ? 'bg-court-accent' : i === game.round ? 'bg-court-accent animate-pulse' : 'bg-gray-700'}`} />
            ))}
          </div>
          {game.skipsLeft > 0 && <span className="text-[10px] px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">1 SKIP</span>}
        </div>
      </div>

      {/* Court mini */}
      <div className="relative w-full aspect-[5/3] max-h-[180px] mb-5 rounded-2xl overflow-hidden court-bg border border-white/10">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-white/15" />
          <div className="absolute left-3 right-3 top-3 bottom-3 border border-white/8 rounded-lg" />
        </div>
        {courtSlots.map(({ idx, top, left }) => {
          const s = game.roster[idx];
          const active = idx === game.round;
          return (
            <div key={idx} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg p-1 w-[24%] max-w-[85px] text-center transition-all ${
              active ? 'border-2 border-court-accent bg-court-accent/10 scale-110' : s.player ? 'player-card' : 'border border-dashed border-white/10 bg-black/20'
            }`} style={{ top, left }}>
              <div className={`text-[7px] font-bold px-1 py-0.5 rounded mx-auto mb-0.5 w-fit bg-gradient-to-r ${posColor(s.position)} text-white`}>{s.position}</div>
              {s.player ? (
                <p className="text-[9px] font-semibold text-white truncate">{s.player.name}</p>
              ) : (
                <p className="text-[8px] text-gray-600">{active ? '●' : ''}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Position badge */}
      <div className="text-center mb-5">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${posBg(slot.position)}`}>
          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${posColor(slot.position)}`} />
          <span className="text-sm font-semibold">{slot.label}</span>
        </div>
      </div>

      {/* Spin */}
      {!game.currentSpin && !spinning && (
        <div className="text-center py-6">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={doSpin}
            className="px-12 py-4 bg-court-accent text-white font-bold rounded-2xl glow-red text-base">
            Spin
          </motion.button>
        </div>
      )}

      {spinning && (
        <div className="text-center py-10">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
            className="w-10 h-10 mx-auto border-3 border-court-accent border-t-transparent rounded-full" />
        </div>
      )}

      {/* Spin result */}
      {game.currentSpin && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          {/* Country header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{flag(game.currentSpin.country.code)}</span>
              <div>
                <p className="font-bold">{game.currentSpin.country.name}</p>
                <p className="text-[11px] text-gray-500">{game.currentSpin.players.length} {slot.position}s available</p>
              </div>
            </div>
            {game.skipsLeft > 0 && (
              <motion.button whileTap={{ scale: 0.95 }} onClick={skip}
                className="px-3.5 py-2 text-xs font-medium border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/10 transition-colors">
                Skip ↻
              </motion.button>
            )}
          </div>

          {/* Players */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pb-4">
            {game.currentSpin.players.map((player, i) => (
              <motion.button
                key={player.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => pick(player)}
                className="w-full player-card rounded-xl p-3.5 flex items-center gap-3 text-left"
              >
                {/* Position pill */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${posColor(player.position)} flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0`}>
                  {player.position}
                </div>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate text-white">{player.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-500">{player.height}cm</span>
                    <span className="text-[10px] text-gray-500">•</span>
                    <span className="text-[10px] font-medium text-yellow-400">{player.grade}</span>
                  </div>
                </div>

                {/* Stats mini */}
                <div className="hidden sm:grid grid-cols-4 gap-1.5 text-center">
                  {[
                    { v: player.attack, c: 'text-red-400' },
                    { v: player.block, c: 'text-violet-400' },
                    { v: player.serve, c: 'text-blue-400' },
                    { v: player.defense, c: 'text-emerald-400' },
                  ].map((s, si) => (
                    <div key={si} className="w-7">
                      <p className={`text-[10px] font-bold ${s.c}`}>{s.v}</p>
                    </div>
                  ))}
                </div>

                {/* Overall */}
                <div className="flex-shrink-0 w-12 text-right">
                  <p className="text-xl font-black text-court-accent">{player.overall}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
