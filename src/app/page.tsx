'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TEAM_SLOTS,
  searchPlayers,
  calculateTeamRating,
  type TeamSlot,
  type TeamResult,
} from '@/lib/game';
import { Player, Position, POSITIONS, COUNTRIES } from '@/data/players';

export default function Home() {
  const [team, setTeam] = useState<TeamSlot[]>(TEAM_SLOTS.map((s) => ({ ...s })));
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [swapMode, setSwapMode] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState<Position | 'ALL'>('ALL');
  const [showResult, setShowResult] = useState(false);

  const pickedIds = team.filter((s) => s.player).map((s) => s.player!.id);
  const filledCount = team.filter((s) => s.player).length;
  const teamResult = useMemo(() => calculateTeamRating(team), [team]);

  const filteredPlayers = useMemo(() => {
    return searchPlayers(search, posFilter).filter((p) => !pickedIds.includes(p.id));
  }, [search, posFilter, pickedIds]);

  const selectPlayer = (player: Player) => {
    if (activeSlot === null) return;
    const newTeam = [...team];
    newTeam[activeSlot] = { ...newTeam[activeSlot], player };
    setTeam(newTeam);
    setActiveSlot(null);
    setSearch('');
  };

  const handleSlotClick = (index: number) => {
    if (swapMode !== null) {
      // Swap players
      const newTeam = [...team];
      const temp = newTeam[swapMode].player;
      newTeam[swapMode] = { ...newTeam[swapMode], player: newTeam[index].player };
      newTeam[index] = { ...newTeam[index], player: temp };
      setTeam(newTeam);
      setSwapMode(null);
    } else {
      setActiveSlot(index);
      setPosFilter(team[index].position);
    }
  };

  const clearSlot = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = { ...newTeam[index], player: null };
    setTeam(newTeam);
  };

  const resetTeam = () => {
    setTeam(TEAM_SLOTS.map((s) => ({ ...s })));
    setActiveSlot(null);
    setSwapMode(null);
    setShowResult(false);
  };

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

  const flag = (code: string) => COUNTRIES.find((c) => c.code === code)?.flag || '🌍';

  return (
    <div className="min-h-screen px-4 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Starting <span className="text-court-accent">6</span>
          </h1>
          <p className="text-xs text-gray-500">VNL 2026 • {filledCount}/6 picked</p>
        </div>
        <div className="flex items-center gap-3">
          {teamResult && (
            <div className="text-right">
              <p className="text-2xl font-black text-court-accent">{teamResult.overallRating}</p>
              <p className="text-[10px] text-gray-500">{teamResult.grade}</p>
            </div>
          )}
          <button onClick={resetTeam} className="px-3 py-1.5 text-xs border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Court Layout */}
      <div className="relative w-full aspect-[4/3] max-h-[320px] mb-6 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a5c2a] to-[#0d3d1a] border border-green-900/50">
        {/* Court lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/30" />
          <div className="absolute top-[30%] left-0 right-0 h-[1px] bg-white/15" />
          <div className="absolute top-[70%] left-0 right-0 h-[1px] bg-white/15" />
          <div className="absolute left-4 right-4 top-4 bottom-4 border border-white/20 rounded-lg" />
        </div>

        {/* Player positions on court */}
        {/* Front row: OH1, MB1, OPP */}
        {/* Back row: OH2, MB2, S */}
        {[
          { idx: 0, top: '18%', left: '15%' },  // OH1 front-left
          { idx: 3, top: '18%', left: '50%' },  // MB1 front-center
          { idx: 2, top: '18%', left: '85%' },  // OPP front-right
          { idx: 1, top: '68%', left: '15%' },  // OH2 back-left
          { idx: 4, top: '68%', left: '50%' },  // MB2 back-center
          { idx: 5, top: '68%', left: '85%' },  // S back-right
        ].map(({ idx, top, left }) => {
          const slot = team[idx];
          const isActive = activeSlot === idx;
          const isSwapTarget = swapMode !== null && swapMode !== idx;
          const isSwapSource = swapMode === idx;

          return (
            <motion.button
              key={idx}
              onClick={() => handleSlotClick(idx)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-[28%] max-w-[120px] rounded-xl p-2 transition-all text-center ${
                isActive
                  ? 'bg-court-accent/30 border-2 border-court-accent shadow-lg shadow-court-accent/30 scale-105'
                  : isSwapSource
                    ? 'bg-yellow-500/20 border-2 border-yellow-500'
                    : isSwapTarget
                      ? 'bg-white/10 border border-dashed border-white/40 hover:border-yellow-400'
                      : slot.player
                        ? 'bg-black/40 backdrop-blur-sm border border-white/20 hover:border-white/40'
                        : 'bg-black/20 border border-dashed border-white/20 hover:border-court-accent/50'
              }`}
              style={{ top, left }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded mx-auto mb-1 w-fit bg-gradient-to-r ${posColor(slot.position)} text-white`}>
                {slot.position}
              </div>
              {slot.player ? (
                <>
                  <p className="text-[11px] font-semibold text-white truncate">{slot.player.name}</p>
                  <p className="text-[10px] text-gray-300">{slot.player.overall}</p>
                </>
              ) : (
                <p className="text-[10px] text-gray-400">Empty</p>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Swap button */}
      {filledCount >= 2 && (
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setSwapMode(swapMode !== null ? null : (activeSlot ?? 0))}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              swapMode !== null
                ? 'bg-yellow-500 text-black font-bold'
                : 'border border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            {swapMode !== null ? '↕ Click a slot to swap — Cancel' : '↕ Swap Players'}
          </button>
        </div>
      )}

      {/* Player Selection Panel */}
      {activeSlot !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-border rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">
              Pick for: <span className="text-court-accent">{team[activeSlot].label}</span>
            </h3>
            <button onClick={() => { setActiveSlot(null); setSearch(''); }} className="text-xs text-gray-500 hover:text-white">
              ✕ Close
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search player or country..."
            className="w-full px-4 py-2.5 mb-3 rounded-xl bg-court-dark border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-court-accent"
          />

          {/* Position filter */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {[{ key: 'ALL' as const, label: 'All' }, ...POSITIONS].map((p) => (
              <button
                key={p.key}
                onClick={() => setPosFilter(p.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  posFilter === p.key
                    ? 'bg-court-accent text-white'
                    : 'bg-court-dark border border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Player list */}
          <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
            {filteredPlayers.slice(0, 50).map((player) => (
              <button
                key={player.id}
                onClick={() => selectPlayer(player)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-court-dark/50 border border-gray-800 hover:border-court-accent/50 hover:bg-court-accent/5 transition-all text-left"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${posColor(player.position)} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                  {player.position}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{flag(player.countryCode)} {player.name}</p>
                  <p className="text-[11px] text-gray-500">{player.country} · {player.height}cm · <span className="text-yellow-400">{player.grade}</span></p>
                </div>
                <p className="text-lg font-black text-court-accent flex-shrink-0">{player.overall}</p>
              </button>
            ))}
            {filteredPlayers.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-8">No players found</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Team Rating Card */}
      {teamResult && filledCount >= 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="gradient-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Team Rating</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-court-accent">{teamResult.overallRating}</span>
              <span className="text-sm text-gray-400">{teamResult.grade}</span>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Attack', value: teamResult.attackRating, color: 'bg-red-500' },
              { label: 'Block', value: teamResult.blockRating, color: 'bg-purple-500' },
              { label: 'Serve', value: teamResult.serveRating, color: 'bg-blue-500' },
              { label: 'Defense', value: teamResult.defenseRating, color: 'bg-green-500' },
              { label: 'Setting', value: teamResult.settingRating, color: 'bg-yellow-500' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-14">{s.label}</span>
                <div className="stat-bar flex-1">
                  <div className={`stat-bar-fill ${s.color}`} style={{ width: `${s.value}%` }} />
                </div>
                <span className="text-xs font-bold w-7 text-right">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
