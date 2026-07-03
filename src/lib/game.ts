import { PLAYERS, COUNTRIES, Player, Position } from '@/data/players';

export interface TeamSlot {
  position: Position;
  label: string;
  player: Player | null;
}

export interface TeamResult {
  overallRating: number;
  attackRating: number;
  blockRating: number;
  serveRating: number;
  defenseRating: number;
  settingRating: number;
  grade: string;
}

export const TEAM_SLOTS: TeamSlot[] = [
  { position: 'OH', label: 'Outside Hitter 1', player: null },
  { position: 'OH', label: 'Outside Hitter 2', player: null },
  { position: 'OPP', label: 'Opposite', player: null },
  { position: 'MB', label: 'Middle Blocker 1', player: null },
  { position: 'MB', label: 'Middle Blocker 2', player: null },
  { position: 'S', label: 'Setter', player: null },
];

export function getPlayersByPosition(position: Position | 'ALL'): Player[] {
  if (position === 'ALL') return PLAYERS;
  return PLAYERS.filter((p) => p.position === position);
}

export function searchPlayers(query: string, position?: Position | 'ALL'): Player[] {
  let filtered = position && position !== 'ALL'
    ? PLAYERS.filter((p) => p.position === position)
    : PLAYERS;

  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q),
    );
  }

  return filtered.sort((a, b) => b.overall - a.overall);
}

export function calculateTeamRating(team: TeamSlot[]): TeamResult | null {
  const players = team.map((s) => s.player).filter(Boolean) as Player[];
  if (players.length === 0) return null;

  const avg = (fn: (p: Player) => number) =>
    Math.round(players.reduce((a, p) => a + fn(p), 0) / players.length);

  const attackRating = avg((p) => p.attack);
  const blockRating = avg((p) => p.block);
  const serveRating = avg((p) => p.serve);
  const defenseRating = avg((p) => p.defense);
  const settingRating = avg((p) => p.setting);

  const setters = players.filter((p) => p.position === 'S');
  const synergyBonus = setters.length > 0 ? Math.round((setters[0].setting - 70) * 0.12) : 0;

  const overallRating = Math.min(
    99,
    Math.round(
      attackRating * 0.30 +
      blockRating * 0.20 +
      serveRating * 0.20 +
      defenseRating * 0.15 +
      settingRating * 0.15 +
      synergyBonus,
    ),
  );

  let grade: string;
  if (overallRating >= 88) grade = 'S+';
  else if (overallRating >= 83) grade = 'S';
  else if (overallRating >= 78) grade = 'S-';
  else if (overallRating >= 74) grade = 'A+';
  else if (overallRating >= 70) grade = 'A';
  else if (overallRating >= 66) grade = 'A-';
  else if (overallRating >= 62) grade = 'B+';
  else if (overallRating >= 58) grade = 'B';
  else if (overallRating >= 54) grade = 'B-';
  else if (overallRating >= 50) grade = 'C+';
  else if (overallRating >= 46) grade = 'C';
  else grade = 'C-';

  return { overallRating, attackRating, blockRating, serveRating, defenseRating, settingRating, grade };
}
