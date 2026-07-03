'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { newGame, spin, spinDaily, calculateResult, type GameState, type GameMode } from '@/lib/game';
import { getDailySeed, getDailySpins, getDailyDateString, hasDailyBeenPlayed, saveDailyResult, getDailyResult } from '@/lib/daily';
import { generateShareText, shareResult, copyToClipboard } from '@/lib/share';
import { Player, COUNTRIES, PLAYERS } from '@/data/players';

export default function Home() {
  const [game, setGame] = useState<GameState | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dailyPlayed, setDailyPlayed] = useState(false);

  useEffect(() => {
    setDailyPlayed(hasDailyBeenPlayed());
  }, []);

  const start = (mode: GameMode) => setGame(newGame(mode));
  const pickedIds = game?.roster.filter((s) => s.player).map((s) => s.player!.id) || [];

  const doSpin = useCallback(() => {
    if (!game) return;
    setSpinning(true);
    setTimeout(() => {
      const pos = game.roster[game.round].position;
      let result;

      if (game.mode === 'daily') {
        const dailySpins = getDailySpins(getDailySeed());
        const ds = dailySpins[game.round];
        result = spinDaily(ds.countryCode, pos, pickedIds);
      } else {
        result = spin(pickedIds, pos);
      }

      if (result.players.length === 0) {
        result = spin(pickedIds, pos);
      }

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
      if (game.mode === 'daily') {
        saveDailyResult(result.overall, result.grade);
        setDailyPlayed(true);
      }
      setGame({ ...game, round: nextRound, roster: newRoster, currentSpin: null, isComplete: true, result });
    } else {
      setGame({ ...game, round: nextRound, roster: newRoster, currentSpin: null });
    }
  };

  const handleShare = () => {
    if (!game?.result) return;
    const roster = game.roster.map((s) => ({
      name: s.player?.name || '',
      position: s.position,
      overall: s.player?.overall || 0,
    }));
    const text = generateShareText(game.result, roster, game.mode === 'daily');
    shareResult(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  // ══════════ LANDING ══════════
  if (!game) {
    const prevResult = getDailyResult();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 safe-bottom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm w-full">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-court-accent to-rose-700 flex items-center justify-center shadow-lg shadow-court-accent/20">
            <span className="text-2xl">🏐</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
            Starting <span className="text-court-accent">6</span>
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Spin. Draft. Build the ultimate VNL lineup.
          </p>

          {/* Daily Challenge */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => start('daily')}
            disabled={dailyPlayed}
            className={`w-full py-4 rounded-2xl font-bold text-base mb-3 transition-all ${
              dailyPlayed
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-court-accent text-white glow-red'
            }`}
          >
            {dailyPlayed ? (
              <span>✅ Daily Complete — {prevResult?.overall} OVR ({prevResult?.grade})</span>
            ) : (
              <span>📅 Daily Challenge</span>
            )}
          </motion.button>

          {/* Classic */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => start('classic')}
            className="w-full py-4 rounded-2xl font-bold text-base bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            🎰 Classic Mode
          </motion.button>

          {/* Stats */}
          <div className="mt-8 flex justify-center gap-8 text-center">
            <div><p className="text-lg font-bold text-white">{PLAYERS.length}</p><p className="text-[10px] text-gray-600">Players</p></div>
            <div><p className="text-lg font-bold text-white">18</p><p className="text-[10px] text-gray-600">Nations</p></div>
            <div><p className="text-lg font-bold text-white">6</p><p className="text-[10px] text-gray-600">Rounds</p></div>
          </div>

          <p className="mt-8 text-[10px] text-gray-700">Real VNL 2026 data • {getDailyDateString()}</p>
        </motion.div>
      </div>
    );
  }

  // ══════════ RESULT ══════════
  if (game.isComplete && game.result) {
    const r = game.result;
    const gradeColor = r.overall >= 90 ? 'text-yellow-400' : r.overall >= 80 ? 'text-emerald-400' : 'text-white';

    return (
      <div className="min-h-screen px-4 py-8 max-w-md mx-auto flex flex-col items-center safe-bottom">
        {/* Mode badge */}
        {game.mode === 'daily' && (
          <div className="mb-4 px-3 py-1 rounded-full bg-court-accent/10 border border-court-accent/30 text-court-accent text-xs font-medium">
            📅 Daily Challenge — {getDailyDateString()}
          </div>
        )}

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-6 w-full">
          <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em] mb-1">Team Rating</p>
          <div className="flex items-center justify-center gap-3">
            <span className={`text-6xl font-black ${gradeColor}`}>{r.overall}</span>
            <div className="text-left">
              <p className="text-xl font-black text-gray-300">{r.grade}</p>
              <p className="text-[10px] text-gray-600">{r.strengthRating} STR</p>
            </div>
          </div>
        </motion.div>

        {/* Court */}
        <div className="relative w-full aspect-[4/3] max-h-[220px] mb-5 rounded-2xl overflow-hidden court-bg border border-white/10 shadow-xl">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/20" />
            <div className="absolute left-3 right-3 top-3 bottom-3 border border-white/10 rounded-xl" />
          </div>
          {courtSlots.map(({ idx, top, left }) => {
            const slot = game.roster[idx];
            return (
              <motion.div key={idx} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: idx * 0.08, type: 'spring' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 player-card rounded-xl p-1.5 w-[27%] max-w-[95px] text-center"
                style={{ top, left }}>
                <div className={`text-[7px] font-bold px-1 py-0.5 rounded mx-auto mb-0.5 w-fit bg-gradient-to-r ${posColor(slot.position)} text-white`}>{slot.position}</div>
                <p className="text-[9px] font-semibold text-white truncate">{slot.player?.name}</p>
                <p className="text-[10px] text-court-accent font-black">{slot.player?.overall}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="w-full gradient-border rounded-2xl p-4 mb-5">
          {[
            { label: 'ATK', value: r.totalAttack, color: 'bg-red-500' },
            { label: 'BLK', value: r.totalBlock, color: 'bg-violet-500' },
            { label: 'SRV', value: r.totalServe, color: 'bg-blue-500' },
            { label: 'DEF', value: r.totalDefense, color: 'bg-emerald-500' },
            { label: 'SET', value: r.totalSetting, color: 'bg-amber-500' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 mb-2 last:mb-0">
              <span className="text-[9px] text-gray-500 w-7 font-medium">{s.label}</span>
              <div className="stat-bar flex-1">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (s.value / 580) * 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }} className={`stat-bar-fill ${s.color}`} />
              </div>
              <span className="text-[10px] font-bold w-7 text-right text-gray-400">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="w-full space-y-2.5">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleShare}
            className="w-full py-3.5 bg-court-accent text-white font-bold rounded-xl glow-red text-sm">
            {copied ? '✅ Copied!' : '📤 Share Result'}
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setGame(null); setCopied(false); }}
            className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-medium rounded-xl text-sm">
            ← Back to Menu
          </motion.button>
        </div>
      </div>
    );
  }

  // ══════════ GAME ══════════
  const slot = game.roster[game.round];

  return (
    <div className="min-h-screen px-4 py-5 max-w-lg mx-auto safe-bottom">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-black tracking-tight">Starting <span className="text-court-accent">6</span></h1>
          {game.mode === 'daily' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-court-accent/20 text-court-accent font-medium">DAILY</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < game.round ? 'bg-court-accent' : i === game.round ? 'bg-court-accent animate-pulse' : 'bg-gray-800'}`} />
            ))}
          </div>
          {game.skipsLeft > 0 && <span className="text-[9px] px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">SKIP</span>}
        </div>
      </div>

      {/* Mini court */}
      <div className="relative w-full aspect-[5/3] max-h-[160px] mb-4 rounded-2xl overflow-hidden court-bg border border-white/10">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/15" />
          <div className="absolute left-2 right-2 top-2 bottom-2 border border-white/8 rounded-lg" />
        </div>
        {courtSlots.map(({ idx, top, left }) => {
          const s = game.roster[idx];
          const active = idx === game.round;
          return (
            <div key={idx} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg p-1 w-[22%] max-w-[80px] text-center transition-all ${
              active ? 'border-2 border-court-accent bg-court-accent/15 scale-110' : s.player ? 'player-card' : 'border border-dashed border-white/10'
            }`} style={{ top, left }}>
              <div className={`text-[7px] font-bold px-1 py-0.5 rounded mx-auto mb-0.5 w-fit bg-gradient-to-r ${posColor(s.position)} text-white`}>{s.position}</div>
              {s.player ? (
                <p className="text-[8px] font-medium text-white truncate">{s.player.name}</p>
              ) : active ? (
                <p className="text-[8px] text-court-accent">●</p>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Position label */}
      <div className="text-center mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${posBg(slot.position)}`}>
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${posColor(slot.position)}`} />
          <span className="text-xs font-semibold">{slot.label}</span>
        </div>
      </div>

      {/* Spin */}
      {!game.currentSpin && !spinning && (
        <div className="text-center py-8">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={doSpin}
            className="px-12 py-4 bg-court-accent text-white font-bold rounded-2xl glow-red">
            Spin
          </motion.button>
        </div>
      )}

      {spinning && (
        <div className="text-center py-10">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
            className="w-10 h-10 mx-auto border-[3px] border-court-accent border-t-transparent rounded-full" />
        </div>
      )}

      {/* Spin result */}
      {game.currentSpin && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{flag(game.currentSpin.country.code)}</span>
              <div>
                <p className="font-bold text-sm">{game.currentSpin.country.name}</p>
                <p className="text-[10px] text-gray-500">{game.currentSpin.players.length} available</p>
              </div>
            </div>
            {game.skipsLeft > 0 && game.mode === 'classic' && (
              <motion.button whileTap={{ scale: 0.95 }} onClick={skip}
                className="px-3 py-2 text-xs font-medium border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/10">
                Skip
              </motion.button>
            )}
          </div>

          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pb-20">
            {game.currentSpin.players.map((player, i) => (
              <motion.button
                key={player.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => pick(player)}
                className="w-full player-card rounded-xl p-3 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${posColor(player.position)} flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0`}>
                  {player.position}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{player.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-gray-500">{player.height}cm</span>
                    <span className="text-[9px] font-medium text-yellow-400">{player.grade}</span>
                  </div>
                </div>
                <div className="hidden sm:grid grid-cols-4 gap-1 text-center">
                  {[
                    { v: player.attack, c: 'text-red-400' },
                    { v: player.block, c: 'text-violet-400' },
                    { v: player.serve, c: 'text-blue-400' },
                    { v: player.defense, c: 'text-emerald-400' },
                  ].map((s, si) => (
                    <p key={si} className={`text-[9px] font-bold ${s.c}`}>{s.v}</p>
                  ))}
                </div>
                <p className="text-lg font-black text-court-accent flex-shrink-0 w-8 text-right">{player.overall}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
