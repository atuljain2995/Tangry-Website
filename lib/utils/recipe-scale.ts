const VULGAR_FRACTIONS: Record<string, number> = {
  '¼': 0.25,
  '½': 0.5,
  '¾': 0.75,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '⅛': 0.125,
  '⅜': 0.375,
  '⅝': 0.625,
  '⅞': 0.875,
};

const FRACTION_CHARS = Object.keys(VULGAR_FRACTIONS).join('');

// Matches "2", "2.5", "½", "1½", "1 1/2", "3/4" at a word boundary.
const QUANTITY = new RegExp(
  `(\\d+\\s*\\d*\\/\\d+|\\d+\\s*[${FRACTION_CHARS}]|[${FRACTION_CHARS}]|\\d+(?:\\.\\d+)?)`,
  'g',
);

function parseQuantity(raw: string): number | null {
  const token = raw.trim();

  // "1 1/2" or "3/4"
  const slash = token.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/);
  if (slash) {
    const [, whole, num, den] = slash;
    return (whole ? Number(whole) : 0) + Number(num) / Number(den);
  }

  // "1½" or bare "½"
  const vulgar = token.match(new RegExp(`^(\\d*)\\s*([${FRACTION_CHARS}])$`));
  if (vulgar) {
    const [, whole, frac] = vulgar;
    return (whole ? Number(whole) : 0) + VULGAR_FRACTIONS[frac];
  }

  const plain = Number(token);
  return Number.isFinite(plain) ? plain : null;
}

/** Renders back to the nearest common kitchen fraction so quantities stay readable. */
function formatQuantity(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0';

  const whole = Math.floor(value);
  const remainder = value - whole;

  const candidates: [number, string][] = [
    [0, ''],
    [0.125, '⅛'],
    [0.25, '¼'],
    [1 / 3, '⅓'],
    [0.375, '⅜'],
    [0.5, '½'],
    [0.625, '⅝'],
    [2 / 3, '⅔'],
    [0.75, '¾'],
    [0.875, '⅞'],
    [1, ''],
  ];

  let best = candidates[0];
  for (const candidate of candidates) {
    if (Math.abs(candidate[0] - remainder) < Math.abs(best[0] - remainder)) best = candidate;
  }

  // Rounded up to the next whole number.
  if (best[0] === 1) return String(whole + 1);

  if (!best[1]) {
    return whole > 0 ? String(whole) : Number(value.toFixed(2)).toString();
  }
  return whole > 0 ? `${whole}${best[1]}` : best[1];
}

/**
 * Scales every numeric quantity in an ingredient line, leaving the rest of the
 * text untouched. Ranges like "1½ to 2 tsp" scale both ends.
 */
export function scaleIngredient(line: string, multiplier: number): string {
  if (multiplier === 1) return line;

  return line.replace(QUANTITY, (match) => {
    const parsed = parseQuantity(match);
    if (parsed === null) return match;
    return formatQuantity(parsed * multiplier);
  });
}
