'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createInitialGameState,
  spin,
  calculateTeamRating,
  type GameState,
} from '@/lib/game';
import { Player, COUNTRIES, PLAYERS } from '@/data/players';

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const startGame = () => {
    setGameState(createInitialGameState());
    setSelectedPlayer(null);
  };

  const getPickedIds = (): number[] => {
    if (!gameState) return [];
    return gameState.team.filter((s) => s.player).map((s) => s.player!.id);
  };

  const doSpin = useCallback(() => {
    setIsSpinning(true);
    setSelectedPlayer(null);
    setTimeout(() => {
      const result = spin(getPickedIds());
      setGameState((prev) => prev ? { ...prev, currentSpin: result } : prev);
      setIsSpinning(false);
    }, 1000);
  }, [gameState]);

  const doRespin = () => {
    if (!gameState || gameState.reSpinsLeft <= 0) return;
    setGameState((prev) => prev ? { ...prev, reSpinsLeft: prev.reSpinsLeft - 1 } : prev);
    doSpin();
  };

  const selectPlayer = (player: Player) => setSelectedPlayer(player);

  const confirmSelection = () => {
    if (!gameState || !selectedPlayer) return;
    const nextRound = gameState.round + 1;
    const newTeam = [...gameState.team];
    newTeam[gameState.round] = { ...newTeam[gameState.round], player: selectedPlayer };

    const isComplete = nextRound >= gameState.maxRounds;
    if (isComplete) {
      const result = calculateTeamRating(newTeam);
      setGameState({ ...gameState, round: nextRound, team: newTeam, currentSpin: null, isComplete: true, result });
    } else {
      setGameState({ ...gameState, round: nextRound, team: newTeam, currentSpin: null });
    }
    setSelectedPlayer(null);
  };

  const posColor = (pos: string) => {
    switch (pos) {
      case 'OH': return 'from-blue-500 to-blue-700';
      case 'OPP': return 'from-red-500 to-red-700';
      case 'MB': return 'from-purple-500 to-purple-700';
      case 'S': return 'from-yellow-500 to-yellow-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const flag = (code: string) => COUNTRIES.find((c) => c.code === code)?.flag || '🏳️';

  // === LANDING ===
  if (!gameState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-5xl mb-4">🏐</p>
          <h1 className="text-5xl md:text-7xl font-black mb-3 tracking-tight">
            <span className="text-white">Starting</span>{' '}
            <span className="text-court-accent">6</span>
          </h1>
          <p className="text-gray-400 mb-12 max-w-sm mx-auto">
            Spin a country. Draft a player. Build the highest-rated VNL lineup.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-10 py-4 bg-court-accent text-white text-lg font-bold rounded-2xl glow-red"
          >
            PLAY
          </motion.button>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-xs mx-auto text-center">
            <div>
              <p className="text-2xl font-bold text-court-accent">6</p>
              <p className="text-xs text-gray-500">Picks</p>
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
  if (gameState.isComplete && gameState.result) {
    const { result } = gameState;
    const ratingColor = result.overallRating >= 85 ? 'text-yellow-400' : result.overallRating >= 70 ? 'text-green-400' : 'text-white';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Team Rating</p>
          <h2 className={`text-7xl md:text-9xl font-black ${ratingColor}`}>
            {result.overallRating}
          </h2>
          <p className="text-2xl font-bold mt-2 text-gray-300">Grade: {result.grade}</p>
        </motion.div>

        {/* Stat breakdown */}
        <div className="w-full max-w-md mb-8">
          <div className="gradient-border rounded-2xl p-5 space-y-3">
            {[
              { label: 'Attack', value: result.attackRating, color: 'bg-red-500' },
              { label: 'Block', value: result.blockRating, color: 'bg-purple-500' },
              { label: 'Serve', value: result.serveRating, color: 'bg-blue-500' },
              { label: 'Defense', value: result.defenseRating, color: 'bg-green-500' },
              { label: 'Setting', value: result.settingRating, color: 'bg-yellow-500' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-16">{s.label}</span>
                <div className="stat-bar flex-1">
                  <div className={`stat-bar-fill ${s.color}`} style={{ width: `${s.value}%` }} />
                </div>
                <span className="text-sm font-bold w-8 text-right">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roster */}
        <div className="w-full max-w-md space-y-2 mb-8">
          {gameState.team.map((slot, i) => (
            <motion.div
              key={i}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="gradient-border rounded-xl p-3 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${posColor(slot.position)} flex items-center justify-center text-white text-xs font-bold`}>
                {slot.position}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{slot.player?.name}</p>
                <p className="text-xs text-gray-500">{flag(slot.player?.countryCode || '')} {slot.player?.country}</p>
              </div>
              <p className="text-sm font-bold text-court-accent">{slot.player?.overall}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="px-8 py-3 bg-court-accent text-white font-bold rounded-xl glow-red"
        >
          PLAY AGAIN
        </motion.button>
      </div>
    );
  }

  // === GAME ===
  const currentSlot = gameState.team[gameState.round];

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-black">
          Starting <span className="text-court-accent">6</span>
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Pick <span className="text-white font-bold">{gameState.round + 1}</span>/6</span>
          <span>🔄 <span className="text-yellow-400 font-bold">{gameState.reSpinsLeft}</span></span>
        </div>
      </div>

      {/* Roster slots */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        {gameState.team.map((slot, i) => (
          <div
            key={i}
            className={`rounded-xl p-2 text-center transition-all ${
              i === gameState.round
                ? 'border-2 border-court-accent bg-court-accent/10'
                : slot.player
                  ? 'border border-gray-700 bg-court-mid'
                  : 'border border-gray-800 bg-court-dark/50'
            }`}
          >
            <div className={`text-[10px] font-bold mb-1 px-1 py-0.5 rounded bg-gradient-to-r ${posColor(slot.position)} text-white`}>
              {slot.position}
            </div>
            {slot.player ? (
              <p className="text-[10px] font-medium truncate">{slot.player.name.split(' ').pop()}</p>
            ) : (
              <p className="text-[10px] text-gray-600">—</p>
            )}
          </div>
        ))}
      </div>

      {/* Current pick */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-400">Drafting:</p>
        <p className="text-lg font-bold">{currentSlot.label}</p>
      </div>

      {/* Spin */}
      {!gameState.currentSpin && (
        <div className="text-center py-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={doSpin}
            disabled={isSpinning}
            className="px-10 py-4 bg-court-accent text-white text-lg font-bold rounded-2xl glow-red disabled:opacity-50"
          >
            {isSpinning ? '🎰 SPINNING...' : '🎰 SPIN'}
          </motion.button>
        </div>
      )}

      {/* Results */}
      {gameState.currentSpin && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-court-mid border border-gray-700">
              <span className="text-3xl">{flag(gameState.currentSpin.country.code)}</span>
              <p className="font-bold text-lg">{gameState.currentSpin.country.name}</p>
            </div>
            {gameState.reSpinsLeft > 0 && (
              <button
                onClick={doRespin}
                className="ml-3 px-4 py-2 text-sm border border-yellow-500/50 text-yellow-400 rounded-xl hover:bg-yellow-500/10 transition-colors"
              >
                🔄 ({gameState.reSpinsLeft})
              </button>
            )}
          </div>

          <div className="space-y-2">
            {gameState.currentSpin.availablePlayers.map((player, i) => (
              <motion.button
                key={player.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => selectPlayer(player)}
                className={`w-full gradient-border rounded-xl p-4 flex items-center gap-4 text-left transition-all ${
                  selectedPlayer?.id === player.id
                    ? 'border-court-accent bg-court-accent/10 glow-red'
                    : 'hover:border-gray-500'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${posColor(player.position)} flex items-center justify-center text-white font-bold text-sm`}>
                  {player.position}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{player.name}</p>
                  <p className="text-sm text-gray-400">{player.height}cm · <span className="text-yellow-400">{player.grade}</span></p>
                </div>
                <p className="text-xl font-black text-court-accent">{player.overall}</p>
              </motion.button>
            ))}
          </div>

          {selectedPlayer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 gradient-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{selectedPlayer.name}</h3>
                  <p className="text-sm text-gray-400">
                    {flag(selectedPlayer.countryCode)} {selectedPlayer.country} · {selectedPlayer.position} · {selectedPlayer.height}cm
                  </p>
                </div>
                <div className="text-3xl font-black text-court-accent">{selectedPlayer.overall}</div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Attack', value: selectedPlayer.attack, color: 'bg-red-500' },
                  { label: 'Block', value: selectedPlayer.block, color: 'bg-purple-500' },
                  { label: 'Serve', value: selectedPlayer.serve, color: 'bg-blue-500' },
                  { label: 'Defense', value: selectedPlayer.defense, color: 'bg-green-500' },
                  { label: 'Setting', value: selectedPlayer.setting, color: 'bg-yellow-500' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-16">{stat.label}</span>
                    <div className="stat-bar flex-1">
                      <div className={`stat-bar-fill ${stat.color}`} style={{ width: `${stat.value}%` }} />
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{stat.value}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmSelection}
                className="w-full mt-6 py-3 bg-court-accent text-white font-bold rounded-xl glow-red"
              >
                DRAFT {selectedPlayer.name.toUpperCase()}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
