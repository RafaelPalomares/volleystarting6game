import { TeamResult } from './game';

export function generateShareText(result: TeamResult, roster: { name: string; position: string; overall: number }[], isDaily: boolean): string {
  const header = isDaily ? `🏐 Starting 6 — Daily Challenge` : `🏐 Starting 6`;
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const ratingEmoji = result.overall >= 90 ? '🔥' : result.overall >= 80 ? '⭐' : result.overall >= 70 ? '✅' : '🏐';

  const lines = [
    header,
    `${ratingEmoji} ${result.overall} OVR — ${result.grade}`,
    '',
    ...roster.map((p) => `${posEmoji(p.position)} ${p.name} (${p.overall})`),
    '',
    isDaily ? `📅 ${date}` : '',
    'https://starting6.vercel.app',
  ];

  return lines.filter(Boolean).join('\n');
}

function posEmoji(pos: string): string {
  switch (pos) {
    case 'OH': return '🔵';
    case 'OPP': return '🔴';
    case 'MB': return '🟣';
    case 'S': return '🟡';
    case 'LIB': return '🟢';
    default: return '⚪';
  }
}

export async function shareResult(text: string) {
  if (navigator.share) {
    try {
      await navigator.share({ text });
    } catch {
      copyToClipboard(text);
    }
  } else {
    copyToClipboard(text);
  }
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
