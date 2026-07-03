export type Position = 'OH' | 'OPP' | 'MB' | 'S' | 'L';

export interface Player {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  position: Position;
  era: string;
  height: number;
  totalPoints: number;
  attackPoints: number;
  blockPoints: number;
  servePoints: number;
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
];

export const ERAS = ['2020s'];

import playersJson from './volleyball_clean_balanced.json';
export const PLAYERS: Player[] = playersJson as Player[];
