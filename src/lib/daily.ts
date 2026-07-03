import { PLAYERS, COUNTRIES, Player, Position } from '@/data/players';

/**
 * Daily Challenge: seeded random so all players get the same spins each day.
 * Seed = YYYYMMDD as number.
 */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function getDailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function getDailySpins(seed: number): { countryCode: string; position: Position }[] {
  const rand = seededRandom(seed);
  const positions: Position[] = ['OH', 'OH', 'OPP', 'MB', 'MB', 'S'];
  const spins: { countryCode: string; position: Position }[] = [];

  for (const pos of positions) {
    // Get countries that have this position
    const available = COUNTRIES.filter((c) =>
      PLAYERS.some((p) => p.countryCode === c.code && p.position === pos),
    );
    const idx = Math.floor(rand() * available.length);
    spins.push({ countryCode: available[idx]?.code || 'BR', position: pos });
  }

  return spins;
}

export function getDailyDateString(): string {
  const d = new Date();
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function hasDailyBeenPlayed(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('s6_daily_seed');
  return saved === String(getDailySeed());
}

export function saveDailyResult(overall: number, grade: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('s6_daily_seed', String(getDailySeed()));
  localStorage.setItem('s6_daily_result', JSON.stringify({ overall, grade }));
}

export function getDailyResult(): { overall: number; grade: string } | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('s6_daily_result');
  const seed = localStorage.getItem('s6_daily_seed');
  if (seed !== String(getDailySeed())) return null;
  return data ? JSON.parse(data) : null;
}
