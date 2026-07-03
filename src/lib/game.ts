import { PLAYERS, COUNTRIES, Player, Position } from '@/data/players';

export interface SpinResult {
  country: typeof COUNTRIES[number];
  availablePlayers: Player[];
}

export interface TeamSlot {
  position: Position;
  label: string;
  player: Player | null;
}

export interface GameState {
  round: number;
  maxRounds: number;
  team: TeamSlot[];
  currentSpin: SpinResult | null;
  reSpinsLeft: number;
  isComplete: boolean;
  result: TeamResult | null;
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

export function createInitialGameState(): GameState {
  const team: TeamSlot[] = [
    { position: 'OH', label: 'Outside Hitter 1', player: null },
    { position: 'OH', label: 'Outside Hitter 2', player: null },
    { position: 'OPP', label: 'Opposite', player: null },
    { position: 'MB', label: 'Middle Blocker 1', player: null },
    { position: 'MB', label: 'Middle Blocker 2', player: null },
    { position: 'S', label: 'Setter', player: null },
  ];

  return {
    round: 0,
    maxRounds: 6,
    team,
    currentSpin: null,
    reSpinsLeft: 2,
    isComplete: false,
    result: null,
  };
}

export function spin(alreadyPicked: number[]): SpinResult {
  const countriesWithPlayers = COUNTRIES.filter((c) =>
    PLAYERS.some((p) => p.countryCode === c.code && !alreadyPicked.includes(p.id)),
  );

  const country = countriesWithPlayers[Math.floor(Math.random() * countriesWithPlayers.length)];

  const availablePlayers = PLAYERS.filter(
    (p) => p.countryCode === country.code && !alreadyPicked.includes(p.id),
  );

  return { country, availablePlayers };
}

export function calculateTeamRating(team: TeamSlot[]): TeamResult {
  const players = team.map((s) => s.player).filter(Boolean) as Player[];

  if (players.length < 6) {
    return { overallRating: 0, attackRating: 0, blockRating: 0, serveRating: 0, defenseRating: 0, settingRating: 0, grade: 'F' };
  }

  const attackRating = Math.round(players.reduce((a, p) => a + p.attack, 0) / players.length);
  const blockRating = Math.round(players.reduce((a, p) => a + p.block, 0) / players.length);
  const serveRating = Math.round(players.reduce((a, p) => a + p.serve, 0) / players.length);
  const defenseRating = Math.round(players.reduce((a, p) => a + p.defense, 0) / players.length);
  const settingRating = Math.round(players.reduce((a, p) => a + p.setting, 0) / players.length);

  // Setter synergy
  const setters = players.filter((p) => p.position === 'S');
  const synergyBonus = setters.length > 0 ? Math.round((setters[0].setting - 70) * 0.15) : 0;

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
  if (overallRating >= 90) grade = 'S+';
  else if (overallRating >= 85) grade = 'S';
  else if (overallRating >= 80) grade = 'A+';
  else if (overallRating >= 75) grade = 'A';
  else if (overallRating >= 70) grade = 'B+';
  else if (overallRating >= 65) grade = 'B';
  else if (overallRating >= 60) grade = 'C+';
  else if (overallRating >= 55) grade = 'C';
  else if (overallRating >= 50) grade = 'C-';
  else grade = 'D';

  return { overallRating, attackRating, blockRating, serveRating, defenseRating, settingRating, grade };
}
