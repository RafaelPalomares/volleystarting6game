/**
 * VNL 2026 Player Database Builder
 * 
 * Data extracted from volleyballworld.com VNL 2026 statistics (publicly available).
 * This builds a comprehensive player database from official FIVB tournament data.
 * 
 * Source: https://en.volleyballworld.com/volleyball/competitions/volleyball-nations-league/statistics/
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

interface VNLPlayer {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  position: string;
  era: string;
  height: number;
  // Raw VNL 2026 stats
  totalPoints: number;
  attackPoints: number;
  blockPoints: number;
  servePoints: number;
  // Calculated game ratings (0-99)
  attack: number;
  block: number;
  serve: number;
  defense: number;
  setting: number;
  overall: number;
}

// Country code mapping
const COUNTRY_MAP: Record<string, { name: string; code: string }> = {
  'BUL': { name: 'Bulgaria', code: 'BG' },
  'BEL': { name: 'Belgium', code: 'BE' },
  'JPN': { name: 'Japan', code: 'JP' },
  'SLO': { name: 'Slovenia', code: 'SI' },
  'TUR': { name: 'Türkiye', code: 'TR' },
  'FRA': { name: 'France', code: 'FR' },
  'ARG': { name: 'Argentina', code: 'AR' },
  'USA': { name: 'USA', code: 'US' },
  'UKR': { name: 'Ukraine', code: 'UA' },
  'BRA': { name: 'Brazil', code: 'BR' },
  'IRI': { name: 'Iran', code: 'IR' },
  'CHN': { name: 'China', code: 'CN' },
  'GER': { name: 'Germany', code: 'DE' },
  'ITA': { name: 'Italy', code: 'IT' },
  'CAN': { name: 'Canada', code: 'CA' },
  'SRB': { name: 'Serbia', code: 'RS' },
  'POL': { name: 'Poland', code: 'PL' },
  'CUB': { name: 'Cuba', code: 'CU' },
};

// Raw VNL 2026 scorer data extracted from volleyballworld.com
// Format: [name, country, totalPoints, attackPoints, blockPoints, servePoints]
const VNL_SCORERS: [string, string, number, number, number, number][] = [
  ['A. Nikolov', 'BUL', 194, 174, 8, 12],
  ['Reggers', 'BEL', 193, 179, 4, 10],
  ['Ran', 'JPN', 159, 134, 12, 13],
  ['Mujanović', 'SLO', 139, 123, 9, 7],
  ['A. Lagumdzija', 'TUR', 134, 104, 17, 13],
  ['M. Henno', 'FRA', 131, 114, 9, 8],
  ['Vicentin', 'ARG', 125, 110, 10, 5],
  ['Boyer', 'FRA', 124, 106, 15, 3],
  ['Hanes', 'USA', 116, 93, 14, 9],
  ['Tupchii', 'UKR', 115, 95, 12, 8],
  ['T. Štern', 'SLO', 113, 96, 8, 9],
  ['Darlan', 'BRA', 112, 95, 8, 9],
  ['Haji', 'IRI', 110, 93, 12, 5],
  ['Ishikawa', 'JPN', 109, 100, 3, 6],
  ['Bottolo', 'ITA', 109, 93, 8, 8],
  ['Možič', 'SLO', 107, 82, 19, 6],
  ['Wang B.', 'CHN', 104, 92, 6, 6],
  ['Wen Z. H.', 'CHN', 98, 92, 3, 3],
  ['Yanchuk', 'UKR', 98, 71, 11, 16],
  ['Haghparast', 'IRI', 97, 87, 2, 8],
  ['Röhrs', 'GER', 96, 88, 4, 4],
  ['Anderson', 'USA', 95, 81, 9, 5],
  ['Perin', 'BEL', 94, 76, 6, 12],
  ['Marinović', 'SRB', 93, 75, 11, 7],
  ['Clevenot', 'FRA', 93, 82, 9, 2],
  ['Asparuhov', 'BUL', 91, 72, 8, 11],
  ['Howe', 'CAN', 91, 52, 33, 6],
  ['Wassenaar Ketrzynski', 'CAN', 88, 78, 7, 3],
  ['Miyaura', 'JPN', 85, 81, 3, 1],
  ['Poriya', 'IRI', 85, 73, 3, 9],
  ['Böhme', 'GER', 83, 68, 5, 10],
  ['Bedirhan', 'TUR', 82, 58, 23, 1],
  ['Brand', 'GER', 80, 69, 5, 6],
  ['Porro L.', 'ITA', 79, 66, 5, 8],
  ['Bovolenta', 'ITA', 77, 65, 6, 6],
  ['Gomez', 'ARG', 76, 66, 5, 5],
  ['Bołądź', 'POL', 76, 66, 4, 6],
  ['Mašulović V.', 'SRB', 72, 60, 6, 6],
  ['Rychlicki', 'ITA', 72, 59, 7, 6],
  ['Judson', 'BRA', 72, 54, 14, 4],
  ['Semeniuk', 'UKR', 71, 44, 22, 5],
  ['Yüksel', 'TUR', 71, 62, 6, 3],
  ['Adriano', 'BRA', 71, 62, 1, 8],
  ['Śliwka', 'POL', 70, 62, 6, 2],
  ['John', 'GER', 70, 65, 2, 3],
  ['Lemański', 'POL', 69, 43, 20, 6],
  ['Kulpinac', 'SRB', 69, 58, 6, 5],
  ['Sho', 'CAN', 69, 58, 5, 6],
  ['Bayram', 'TUR', 68, 57, 8, 3],
];

const VNL_SCORERS_2: [string, string, number, number, number, number][] = [
  ['Hartke', 'USA', 67, 54, 9, 4],
  ['Armoa Morel', 'ARG', 67, 61, 3, 3],
  ['Morteza', 'IRI', 67, 58, 4, 5],
  ['Plotnytskyi', 'UKR', 67, 57, 2, 8],
  ['Nishida', 'JPN', 66, 56, 4, 6],
  ['Grozdanov', 'BUL', 66, 44, 20, 2],
  ['Peng S.K.', 'CHN', 64, 45, 10, 9],
  ['Loeppky', 'CAN', 64, 55, 5, 4],
  ['Nedeljković', 'SRB', 62, 42, 15, 5],
  ['Sanguinetti', 'ITA', 61, 43, 10, 8],
  ['Tümer', 'TUR', 60, 47, 8, 5],
  ['Atanasov', 'BUL', 60, 48, 6, 6],
  ['Lucarelli', 'BRA', 60, 43, 12, 5],
  ['Fafchamps', 'BEL', 59, 43, 13, 3],
  ['Yant', 'CUB', 59, 52, 5, 2],
  ['Kovalov', 'UKR', 58, 47, 7, 4],
  ['Krick', 'GER', 56, 45, 11, 0],
  ['Masso', 'CUB', 54, 46, 5, 3],
  ['Jakubiszak', 'POL', 53, 44, 8, 1],
  ['Torwie', 'GER', 52, 30, 13, 9],
  ['Lopez', 'CUB', 52, 47, 3, 2],
  ['Gonzalez', 'CUB', 51, 42, 8, 1],
  ['Kozamernik', 'SLO', 51, 29, 20, 2],
  ['D\'heer', 'BEL', 51, 36, 14, 1],
  ['Rotty', 'BEL', 50, 42, 8, 0],
  ['Young', 'CAN', 50, 41, 5, 4],
  ['Gierżot', 'POL', 49, 39, 7, 3],
  ['I. Petkov', 'BUL', 49, 34, 8, 7],
  ['Zerba', 'ARG', 49, 35, 13, 1],
  ['Yu Y.T.', 'CHN', 48, 40, 5, 3],
  ['Pajenk', 'SLO', 48, 38, 7, 3],
  ['Jendryk', 'USA', 48, 34, 11, 3],
  ['Szalpuk', 'POL', 47, 37, 5, 5],
  ['Shchurov', 'UKR', 45, 31, 14, 0],
  ['Perić', 'SRB', 45, 38, 5, 2],
  ['Gueye', 'FRA', 45, 30, 8, 7],
  ['Flavio', 'BRA', 45, 29, 15, 1],
  ['Leon', 'POL', 45, 37, 4, 4],
  ['Nasevich', 'POL', 44, 40, 2, 2],
  ['McHenry', 'USA', 44, 31, 13, 0],
  ['Mohammad', 'IRI', 43, 33, 8, 2],
  ['Reichert', 'GER', 43, 34, 5, 4],
  ['Gomułka', 'POL', 42, 34, 2, 6],
  ['Li Y.Z.', 'CHN', 42, 32, 7, 3],
  ['Larry', 'JPN', 42, 29, 11, 2],
  ['Champlin', 'USA', 42, 36, 4, 2],
  ['Maar', 'CAN', 41, 39, 1, 1],
  ['Plaskie', 'BEL', 40, 34, 0, 6],
  ['Demyanenko', 'CAN', 40, 27, 11, 2],
  ['Simón', 'CUB', 40, 29, 10, 1],
];

const VNL_SCORERS_3: [string, string, number, number, number, number][] = [
  ['Onodera', 'JPN', 39, 27, 10, 2],
  ['Stefanović', 'SRB', 39, 28, 8, 3],
  ['Iyegbekedo', 'FRA', 39, 25, 13, 1],
  ['S. Nikolov', 'BUL', 37, 17, 9, 11],
  ['Martinez Franchi', 'ARG', 37, 31, 4, 2],
  ['Sani', 'ITA', 36, 27, 6, 3],
  ['Bryan', 'BRA', 36, 27, 4, 5],
  ['Cardenas', 'CUB', 35, 29, 4, 2],
  ['Gürbüz', 'TUR', 34, 25, 3, 6],
  ['Ewert', 'USA', 34, 30, 4, 0],
  ['Bardarov', 'BUL', 34, 25, 5, 4],
  ['Šen', 'SLO', 33, 26, 4, 3],
  ['Huetz', 'FRA', 33, 22, 9, 2],
  ['Loser Bruno', 'ARG', 33, 23, 9, 1],
  ['Eisa', 'IRI', 32, 24, 6, 2],
  ['Nivaldo', 'CUB', 31, 29, 2, 0],
  ['Jiang C.', 'CHN', 31, 21, 10, 0],
  ['M. Lagumdzija', 'TUR', 31, 24, 7, 0],
  ['Zhang Z.J.', 'CHN', 31, 21, 10, 0],
  ['Nowak J.', 'POL', 31, 18, 7, 6],
  ['Diaz', 'ARG', 30, 21, 3, 6],
  ['Ramos', 'ARG', 30, 22, 6, 2],
  ['Hofer', 'CAN', 30, 24, 4, 2],
  ['Concepcion', 'CUB', 30, 21, 5, 4],
  ['Brizard', 'FRA', 23, 10, 7, 6],
  ['De Cecco', 'ARG', 11, 4, 4, 3],
  ['Christenson', 'USA', 11, 4, 5, 2],
  ['Cachopa', 'BRA', 7, 3, 3, 1],
  ['Planinšič', 'SLO', 14, 0, 8, 6],
  ['Defalco', 'USA', 27, 23, 2, 2],
];

const ALL_SCORERS = [...VNL_SCORERS, ...VNL_SCORERS_2, ...VNL_SCORERS_3];

// Known positions from VNL rosters
const KNOWN_POSITIONS: Record<string, string> = {
  'A. Nikolov': 'OH', 'Reggers': 'OH', 'Ran': 'OH', 'Mujanović': 'OPP',
  'A. Lagumdzija': 'OPP', 'M. Henno': 'OH', 'Vicentin': 'OH', 'Boyer': 'MB',
  'Hanes': 'OPP', 'Tupchii': 'OPP', 'T. Štern': 'OPP', 'Darlan': 'OPP',
  'Haji': 'OH', 'Ishikawa': 'OH', 'Bottolo': 'OH', 'Možič': 'OH',
  'Wang B.': 'OH', 'Wen Z. H.': 'OH', 'Yanchuk': 'OPP', 'Haghparast': 'OH',
  'Röhrs': 'OH', 'Anderson': 'OPP', 'Perin': 'OPP', 'Marinović': 'OH',
  'Clevenot': 'OH', 'Asparuhov': 'OH', 'Howe': 'MB', 'Wassenaar Ketrzynski': 'OH',
  'Miyaura': 'OH', 'Poriya': 'OPP', 'Böhme': 'OPP', 'Bedirhan': 'MB',
  'Brand': 'OH', 'Porro L.': 'OH', 'Bovolenta': 'OPP', 'Gomez': 'OH',
  'Bołądź': 'OPP', 'Mašulović V.': 'OH', 'Rychlicki': 'OPP', 'Judson': 'MB',
  'Semeniuk': 'MB', 'Yüksel': 'OH', 'Adriano': 'OPP', 'Śliwka': 'OH',
  'John': 'OH', 'Lemański': 'MB', 'Kulpinac': 'OH', 'Sho': 'OPP',
  'Bayram': 'OH', 'Hartke': 'OPP', 'Nishida': 'OPP', 'Grozdanov': 'MB',
  'Loeppky': 'OH', 'Kozamernik': 'MB', 'Leon': 'OH', 'Maar': 'OH',
  'Lucarelli': 'OH', 'Yant': 'OH', 'Masso': 'OH', 'Defalco': 'OH',
  'Brizard': 'S', 'De Cecco': 'S', 'Christenson': 'S', 'Cachopa': 'S',
  'Planinšič': 'S', 'S. Nikolov': 'S', 'Plotnytskyi': 'OPP',
  'Flavio': 'MB', 'McHenry': 'MB', 'D\'heer': 'MB', 'Fafchamps': 'MB',
};

/**
 * Convert raw VNL stats to game ratings (0-99 scale).
 * Uses the tournament's top performers as reference points.
 */
function calculateRatings(
  attackPts: number,
  blockPts: number,
  servePts: number,
  totalPts: number,
  position: string,
): { attack: number; block: number; serve: number; defense: number; setting: number; overall: number } {
  // Max values in dataset for normalization
  const maxAttack = 179; // Reggers
  const maxBlock = 33;   // Howe
  const maxServe = 16;   // Yanchuk
  const maxTotal = 194;  // A. Nikolov

  // Normalize to 0-99 with floor at ~40 (these are all national team players)
  const attackRaw = Math.min(99, Math.round(40 + (attackPts / maxAttack) * 59));
  const blockRaw = Math.min(99, Math.round(40 + (blockPts / maxBlock) * 59));
  const serveRaw = Math.min(99, Math.round(40 + (servePts / maxServe) * 59));

  // Defense is estimated inversely from position (liberos/OH tend to dig more)
  let defense: number;
  if (position === 'L') defense = 90 + Math.round(Math.random() * 8);
  else if (position === 'OH') defense = 65 + Math.round(Math.random() * 15);
  else if (position === 'S') defense = 70 + Math.round(Math.random() * 10);
  else if (position === 'OPP') defense = 50 + Math.round(Math.random() * 15);
  else defense = 45 + Math.round(Math.random() * 15); // MB

  // Setting - high for setters, low for others
  let setting: number;
  if (position === 'S') setting = 85 + Math.round(Math.random() * 12);
  else setting = 30 + Math.round(Math.random() * 20);

  // Adjust attack for setters and MBs
  let attack = attackRaw;
  if (position === 'S') attack = Math.min(attack, 55);
  if (position === 'MB') attack = Math.min(attack + 5, 85);

  const block = blockRaw;
  const serve = serveRaw;

  // Overall: weighted average
  let overall: number;
  if (position === 'S') {
    overall = Math.round(setting * 0.40 + serve * 0.20 + defense * 0.20 + attack * 0.10 + block * 0.10);
  } else if (position === 'MB') {
    overall = Math.round(block * 0.30 + attack * 0.30 + serve * 0.15 + defense * 0.15 + setting * 0.10);
  } else {
    overall = Math.round(attack * 0.35 + serve * 0.20 + defense * 0.20 + block * 0.15 + setting * 0.10);
  }

  // Boost based on total points (impact bonus)
  const impactBonus = Math.round((totalPts / maxTotal) * 8);
  overall = Math.min(99, overall + impactBonus);

  return { attack, block, serve, defense, setting, overall };
}

// Build the database
function buildDatabase(): VNLPlayer[] {
  const players: VNLPlayer[] = [];
  let id = 1;

  for (const [name, countryCode, total, atk, blk, srv] of ALL_SCORERS) {
    const countryInfo = COUNTRY_MAP[countryCode];
    if (!countryInfo) continue;

    const position = KNOWN_POSITIONS[name] || guessPosition(atk, blk, srv, total);
    const ratings = calculateRatings(atk, blk, srv, total, position);

    players.push({
      id: id++,
      name,
      country: countryInfo.name,
      countryCode: countryInfo.code,
      position,
      era: '2020s',
      height: estimateHeight(position),
      totalPoints: total,
      attackPoints: atk,
      blockPoints: blk,
      servePoints: srv,
      ...ratings,
    });
  }

  return players;
}

function guessPosition(atk: number, blk: number, srv: number, total: number): string {
  if (blk > atk * 0.3) return 'MB';
  if (total < 15 && srv > atk) return 'S';
  if (atk > total * 0.8 && blk < 5) return 'OH';
  return 'OH';
}

function estimateHeight(position: string): number {
  switch (position) {
    case 'MB': return 200 + Math.round(Math.random() * 10);
    case 'OPP': return 195 + Math.round(Math.random() * 10);
    case 'OH': return 190 + Math.round(Math.random() * 10);
    case 'S': return 185 + Math.round(Math.random() * 10);
    case 'L': return 178 + Math.round(Math.random() * 8);
    default: return 190;
  }
}

// Execute
const db = buildDatabase();
console.log(`✅ Built database with ${db.length} players from VNL 2026`);
console.log(`   Countries: ${[...new Set(db.map(p => p.country))].length}`);
console.log(`   Positions: OH=${db.filter(p=>p.position==='OH').length}, OPP=${db.filter(p=>p.position==='OPP').length}, MB=${db.filter(p=>p.position==='MB').length}, S=${db.filter(p=>p.position==='S').length}`);

// Write to JSON
const outputPath = join(__dirname, '..', 'src', 'data', 'vnl-players.json');
writeFileSync(outputPath, JSON.stringify(db, null, 2));
console.log(`📁 Written to ${outputPath}`);

// Also generate TypeScript export
const tsOutput = `// Auto-generated from VNL 2026 data (volleyballworld.com)
// ${db.length} players from ${[...new Set(db.map(p => p.country))].length} countries
import type { Player } from './players';

export const VNL_PLAYERS: Player[] = ${JSON.stringify(db.map(p => ({
  id: p.id + 200, // offset to avoid conflict with legacy data
  name: p.name,
  country: p.country,
  countryCode: p.countryCode,
  position: p.position,
  era: p.era,
  height: p.height,
  attack: p.attack,
  block: p.block,
  serve: p.serve,
  defense: p.defense,
  setting: p.setting,
  overall: p.overall,
})), null, 2)};
`;

const tsPath = join(__dirname, '..', 'src', 'data', 'vnl-2026.ts');
writeFileSync(tsPath, tsOutput);
console.log(`📁 TypeScript export written to ${tsPath}`);
