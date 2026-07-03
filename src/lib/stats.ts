/**
 * Local stats tracker — saves game history for the user.
 * Premium feature: shows full history + best teams.
 */

export interface GameRecord {
  overall: number;
  grade: string;
  mode: 'classic' | 'daily';
  roster: { name: string; position: string; overall: number; country: string }[];
  timestamp: number;
}

const STORAGE_KEY = 's6_history';
const MAX_HISTORY = 50;

export function saveGameRecord(record: GameRecord) {
  if (typeof window === 'undefined') return;
  const history = getGameHistory();
  history.unshift(record);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getGameHistory(): GameRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getStats() {
  const history = getGameHistory();
  if (history.length === 0) return null;

  const overalls = history.map((g) => g.overall);
  return {
    gamesPlayed: history.length,
    bestRating: Math.max(...overalls),
    avgRating: Math.round(overalls.reduce((a, b) => a + b, 0) / overalls.length),
    bestGrade: history.reduce((best, g) => g.overall > best.overall ? g : best).grade,
    streak: calculateStreak(history),
  };
}

function calculateStreak(history: GameRecord[]): number {
  // Days in a row with at least one game
  const days = new Set(
    history.map((g) => new Date(g.timestamp).toISOString().split('T')[0]),
  );
  
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (days.has(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}
