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
      const currentPos = game.roster[game.round].position;
      const result = spin(pickedIds, currentPos);

      // Auto-skip if no players found for this position (re-spin automatically)
      if (result.players.length === 0) {
        const retry = spin(pickedIds, currentPos);
        setGame((g) => g ? { ...g, currentSpin: retry } : g);
      } else {
        setGame((g) => g ? { ...g, currentSpin: result } : g);
      }
      setSpinning(false);
    }, 800);
  }, [game, pickedIds]);

  const skip = () => {
    if (!game || game.skipsLeft <= 0) return;
    setGame({ ...game, skipsLeft: game.skipsLeft - 1, currentSpin: null });
    setTimeout(() => {
      const currentPos = game.roster[game.round].position;
      const result = spin(pickedIds, currentPos);
      setGame((g) => g ? { ...g, currentSpin: result } : g);
    }, 800);
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
      case 'OH': return 'from-blue-500 to-blue-700';
      case 'OPP': return 'from-red-500 to-red-700';
      case 'MB': return 'from-purple-500 to-purple-700';
      case 'S': return 'from-yellow-500 to-yellow-700';
      case 'LIB': return 'from-green-500 to-green-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  // Court positions: front row + back row
  const courtPositions = [
    { idx: 0, top: '20%', left: '20%' },   // OH1 front-left
    { idx: 3, top: '20%', left: '50%' },   // MB1 front-center
    { idx: 2, top: '20%', left: '80%' },   // OPP front-right
    { idx: 4, top: '70%', left: '20%' },   // MB2 back-left
    { idx: 1, top: '70%', left: '50%' },   // OH2 back-center
    { idx: 5, top: '70%', left: '80%' },   // S back-right
  ];

  // === LANDING ===
  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-5xl mb-4">🏐</p>
          <h1 className="text-5xl md:text-7xl font-black mb-3 tracking-tight">
            Starting <span className="text-court-accent">6</span>
          </h1>
          <p className="text-gray-400 mb-10 max-w-sm mx-auto">
            Spin the slot machine. Draft from the country you land on. Build the highest-rated VNL lineup.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={start}
            className="px-10 py-4 bg-court-accent text-white text-lg font-bold rounded-2xl glow-red"
          >
            PLAY
          </motion.button>

          <div className="mt-10 grid grid-cols-3 gap-8 max-w-xs mx-auto text-center">
            <div>
              <p className="text-2xl font-bold text-court-accent">6</p>
              <p className="text-xs text-gray-500">Rounds</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">{PLAYERS.length}</p>
              <p className="text-xs text-gray-500">Players</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">18</p>
              <p className="text-xs text-gray-500">Nations</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // === RESULT ===
  if (game.isComplete && game.result) {
    const r = game.result;
    const rColor = r.overall >= 80 ? 'text-yellow-400' : r.overall >= 65 ? 'text-green-400' : 'text-white';

    return (
      <div className="min-h-screen px-4 py-8 max-w-lg mx-auto flex flex-col items-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Team Overall</p>
          <h2 className={`text-7xl font-black ${rColor}`}>{r.overall}</h2>
          <p className="text-xl font-bold text-gray-300 mt-1">{r.grade}</p>
          <p className="text-sm text-gray-500 mt-1">Strength: {r.strengthRating}</p>
        </motion.div>

        {/* Court with results */}
        <div className="relative w-full aspect-[4/3] max-h-[260px] mb-6 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a5c2a] to-[#0d3d1a] border border-green-900/50">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/30" />
            <div className="absolute top-[30%] left-0 right-0 h-[1px] bg-white/15" />
            <div className="absolute top-[70%] left-0 right-0 h-[1px] bg-white/15" />
            <div className="absolute left-3 right-3 top-3 bottom-3 border border-white/20 rounded-lg" />
          </div>
          {courtPositions.map(({ idx, top, left }) => {
            const slot = game.roster[idx];
            return (
              <motion.div
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-white/20 rounded-xl p-2 w-[28%] max-w-[110px] text-center"
                style={{ top, left }}
              >
                <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded mx-auto mb-1 w-fit bg-gradient-to-r ${posColor(slot.position)} text-white`}>
                  {slot.position}
                </div>
                <p className="text-[11px] font-semibold text-white truncate">{slot.player?.name}</p>
                <p className="text-[10px] text-court-accent font-bold">{slot.player?.overall}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="w-full gradient-border rounded-2xl p-5 mb-6">
          {[
            { label: 'Attack', value: r.totalAttack, max: 600, color: 'bg-red-500' },
            { label: 'Block', value: r.totalBlock, max: 600, color: 'bg-purple-500' },
            { label: 'Serve', value: r.totalServe, max: 600, color: 'bg-blue-500' },
            { label: 'Defense', value: r.totalDefense, max: 600, color: 'bg-green-500' },
            { label: 'Setting', value: r.totalSetting, max: 600, color: 'bg-yellow-500' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 mb-2">
              <span className="text-xs text-gray-400 w-14">{s.label}</span>
              <div className="stat-bar flex-1">
                <div className={`stat-bar-fill ${s.color}`} style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%` }} />
              </div>
              <span className="text-xs font-bold w-8 text-right">{s.value}</span>
            </div>
          ))}
        </div>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={start} className="px-8 py-3 bg-court-accent text-white font-bold rounded-xl glow-red">
          PLAY AGAIN
        </motion.button>
      </div>
    );
  }

  // === GAME (Slot Machine) ===
  const currentSlot = game.roster[game.round];

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-black">Starting <span className="text-court-accent">6</span></h1>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>Round <span className="text-white font-bold">{game.round + 1}</span>/6</span>
          <span>Skip: <span className="text-yellow-400 font-bold">{game.skipsLeft}</span></span>
        </div>
      </div>

      {/* Court with current roster */}
      <div className="relative w-full aspect-[4/3] max-h-[220px] mb-5 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a5c2a] to-[#0d3d1a] border border-green-900/50">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/25" />
          <div className="absolute left-3 right-3 top-3 bottom-3 border border-white/15 rounded-lg" />
        </div>
        {courtPositions.map(({ idx, top, left }) => {
          const slot = game.roster[idx];
          const isCurrent = idx === game.round;
          return (
            <div
              key={idx}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl p-1.5 w-[26%] max-w-[100px] text-center transition-all ${
                isCurrent
                  ? 'bg-court-accent/20 border-2 border-court-accent animate-pulse-glow'
                  : slot.player
                    ? 'bg-black/40 backdrop-blur-sm border border-white/20'
                    : 'bg-black/20 border border-dashed border-white/15'
              }`}
              style={{ top, left }}
            >
              <div className={`text-[8px] font-bold px-1 py-0.5 rounded mx-auto mb-0.5 w-fit bg-gradient-to-r ${posColor(slot.position)} text-white`}>
                {slot.position}
              </div>
              {slot.player ? (
                <>
                  <p className="text-[10px] font-semibold text-white truncate">{slot.player.name}</p>
                  <p className="text-[9px] text-court-accent font-bold">{slot.player.overall}</p>
                </>
              ) : (
                <p className="text-[9px] text-gray-500">{isCurrent ? '⟵ picking' : '—'}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Current position info */}
      <div className="text-center mb-4">
        <p className="text-xs text-gray-500">Now picking:</p>
        <p className="text-lg font-bold">{currentSlot.label} <span className={`text-xs px-2 py-0.5 rounded bg-gradient-to-r ${posColor(currentSlot.position)} text-white ml-2`}>{currentSlot.position}</span></p>
      </div>

      {/* Spin button */}
      {!game.currentSpin && !spinning && (
        <div className="text-center py-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={doSpin}
            className="px-10 py-4 bg-court-accent text-white text-lg font-bold rounded-2xl glow-red"
          >
            🎰 SPIN
          </motion.button>
        </div>
      )}

      {spinning && (
        <div className="text-center py-8">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-12 h-12 mx-auto border-4 border-court-accent border-t-transparent rounded-full" />
          <p className="text-sm text-gray-400 mt-3">Spinning...</p>
        </div>
      )}

      {/* Spin result — country + player list */}
      {game.currentSpin && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Country slot result */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-court-mid border border-gray-700">
              <span className="text-4xl">{flag(game.currentSpin.country.code)}</span>
              <div>
                <p className="font-bold text-lg">{game.currentSpin.country.name}</p>
                <p className="text-xs text-gray-400">{game.currentSpin.players.length} players available</p>
              </div>
            </div>
            {game.skipsLeft > 0 && (
              <button
                onClick={skip}
                className="px-4 py-3 text-sm border border-yellow-500/40 text-yellow-400 rounded-xl hover:bg-yellow-500/10 transition-colors"
              >
                SKIP
              </button>
            )}
          </div>

          {/* Player cards */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {game.currentSpin.players.map((player, i) => (
              <motion.button
                key={player.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => pick(player)}
                className="w-full gradient-border rounded-xl p-4 flex items-center gap-4 text-left hover:border-court-accent/60 hover:bg-court-accent/5 transition-all"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${posColor(player.position)} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                  {player.position}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{player.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span>{player.height}cm</span>
                    <span className="text-yellow-400 font-medium">{player.grade}</span>
                  </div>
                </div>
                {/* Mini stats */}
                <div className="hidden sm:flex gap-2 text-[10px] text-gray-500">
                  <div className="text-center"><p className="font-bold text-red-400">{player.attack}</p><p>ATK</p></div>
                  <div className="text-center"><p className="font-bold text-purple-400">{player.block}</p><p>BLK</p></div>
                  <div className="text-center"><p className="font-bold text-blue-400">{player.serve}</p><p>SRV</p></div>
                  <div className="text-center"><p className="font-bold text-green-400">{player.defense}</p><p>DEF</p></div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black text-court-accent">{player.overall}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
