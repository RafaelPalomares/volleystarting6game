import { PLAYERS, COUNTRIES, Player, Position } from '@/data/players';

export interface SpinResult {
  country: typeof COUNTRIES[number];
  players: Player[];
}

export interface RosterSlot {
  position: Position;
  label: string;
  player: Player | null;
}

export interface GameState {
  round: number;
  roster: RosterSlot[];
  currentSpin: SpinResult | null;
  skipsLeft: number;    // skip country (re-spin)
  isComplete: boolean;
  result: TeamResult | null;
}

export interface TeamResult {
  strengthRating: number;
  totalAttack: number;
  totalBlock: number;
  totalServe: number;
  totalDefense: number;
  totalSetting: number;
  overall: number;
  grade: string;
}

const ROSTER_TEMPLATE: RosterSlot[] = [
  { position: 'OH', label: 'Outside Hitter', player: null },
  { position: 'OH', label: 'Outside Hitter', player: null },
  { position: 'OPP', label: 'Opposite', player: null },
  { position: 'MB', label: 'Middle Blocker', player: null },
  { position: 'MB', label: 'Middle Blocker', player: null },
  { position: 'S', label: 'Setter', player: null },
];

export function newGame(): GameState {
  return {
    round: 0,
    roster: ROSTER_TEMPLATE.map((s) => ({ ...s })),
    currentSpin: null,
    skipsLeft: 1,
    isComplete: false,
    result: null,
  };
}

export function spin(pickedIds: number[], position: Position): SpinResult {
  // Pick random country that has available players FOR THIS POSITION
  const available = COUNTRIES.filter((c) =>
    PLAYERS.some((p) => p.countryCode === c.code && !pickedIds.includes(p.id) && p.position === position),
  );

  if (available.length === 0) {
    // Fallback: show all remaining players of this position
    return {
      country: { name: 'Free Agents', code: 'INT', flag: '🌍' },
      players: PLAYERS.filter((p) => !pickedIds.includes(p.id) && p.position === position).slice(0, 15),
    };
  }

  const country = available[Math.floor(Math.random() * available.length)];
  const players = PLAYERS
    .filter((p) => p.countryCode === country.code && !pickedIds.includes(p.id) && p.position === position)
    .sort((a, b) => b.overall - a.overall);

  return { country, players };
}

export function calculateResult(roster: RosterSlot[]): TeamResult {
  const players = roster.map((s) => s.player).filter(Boolean) as Player[];

  const totalAttack = players.reduce((a, p) => a + p.attack, 0);
  const totalBlock = players.reduce((a, p) => a + p.block, 0);
  const totalServe = players.reduce((a, p) => a + p.serve, 0);
  const totalDefense = players.reduce((a, p) => a + p.defense, 0);
  const totalSetting = players.reduce((a, p) => a + p.setting, 0);

  const strengthRating = totalAttack + totalBlock + totalServe + totalDefense + totalSetting;

  // Overall: average of all player overalls
  const overall = Math.round(players.reduce((a, p) => a + p.overall, 0) / players.length);

  let grade: string;
  if (overall >= 85) grade = 'S+';
  else if (overall >= 80) grade = 'S';
  else if (overall >= 75) grade = 'S-';
  else if (overall >= 70) grade = 'A+';
  else if (overall >= 67) grade = 'A';
  else if (overall >= 63) grade = 'A-';
  else if (overall >= 60) grade = 'B+';
  else if (overall >= 57) grade = 'B';
  else if (overall >= 54) grade = 'B-';
  else if (overall >= 50) grade = 'C+';
  else grade = 'C';

  return { strengthRating, totalAttack, totalBlock, totalServe, totalDefense, totalSetting, overall, grade };
}
