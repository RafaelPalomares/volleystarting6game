export type Position = 'OH' | 'OPP' | 'MB' | 'S' | 'LIB';

export interface Player {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  position: Position;
  height: number;
  attack: number;
  block: number;
  serve: number;
  defense: number;
  setting: number;
  overall: number;
  grade: string;
}

export const POSITIONS: { key: Position; label: string }[] = [
  { key: 'OH', label: 'Outside Hitter' },
  { key: 'OPP', label: 'Opposite' },
  { key: 'MB', label: 'Middle Blocker' },
  { key: 'S', label: 'Setter' },
  { key: 'LIB', label: 'Libero' },
];

export const COUNTRIES = [
  { name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
  { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Slovenia', code: 'SI', flag: '🇸🇮' },
  { name: 'Türkiye', code: 'TR', flag: '🇹🇷' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
  { name: 'USA', code: 'US', flag: '🇺🇸' },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  { name: 'Iran', code: 'IR', flag: '🇮🇷' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Serbia', code: 'RS', flag: '🇷🇸' },
  { name: 'Poland', code: 'PL', flag: '🇵🇱' },
  { name: 'Cuba', code: 'CU', flag: '🇨🇺' },
  { name: 'International', code: 'INT', flag: '🌍' },
];

// Normalize both formats from the big roster JSON
import rawPlayers from './volleyball_big_roster.json';

function normalize(raw: any): Player {
  if (raw.countryCode) {
    // Format 1: full VNL data
    return {
      id: raw.id,
      name: raw.name,
      country: raw.country || 'International',
      countryCode: raw.countryCode || 'INT',
      position: raw.position as Position,
      height: raw.height || 190,
      attack: raw.attack,
      block: raw.block,
      serve: raw.serve,
      defense: raw.defense,
      setting: raw.setting,
      overall: raw.overall,
      grade: raw.grade,
    };
  }
  // Format 2: generated players with stats object
  const stats = raw.stats || {};
  return {
    id: raw.id,
    name: raw.name,
    country: 'International',
    countryCode: 'INT',
    position: raw.position as Position,
    height: 190,
    attack: stats.attack || raw.attack || 50,
    block: stats.block || raw.block || 50,
    serve: stats.serve || raw.serve || 50,
    defense: stats.defense || raw.defense || 50,
    setting: stats.setting || raw.setting || 50,
    overall: raw.overall || 50,
    grade: raw.grade || 'C',
  };
}

export const PLAYERS: Player[] = (rawPlayers as any[]).map(normalize);
