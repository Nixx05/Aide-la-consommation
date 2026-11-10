/** Minuscules + suppression des accents et apostrophes typographiques, pour une recherche tolérante. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, ' ')
    .toLowerCase()
    .trim();
}

/** Formate une valeur nutritionnelle : "12,5 g" ou "—" si inconnue. */
export function formatNutrient(value: number | null, unit = 'g'): string {
  if (value === null) return '—';
  const rounded = Math.round(value * 10) / 10;
  return `${rounded.toString().replace('.', ',')} ${unit}`;
}
