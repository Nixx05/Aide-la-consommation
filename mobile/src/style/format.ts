// Petites fonctions pour afficher les valeurs nutritionnelles.

// 12.5 -> "12,5 g"   |   null -> "—"
export function formatValue(value: number | null, unit = 'g'): string {
  if (value === null) return '—';
  const rounded = Math.round(value * 10) / 10;
  return `${rounded}`.replace('.', ',') + ' ' + unit;
}

// Seuils pour 100 g (repères "feu tricolore") : faible si <= low, élevé si > high
const LIMITS: { [nutrient: string]: { low: number; high: number } } = {
  fat: { low: 3, high: 17.5 },
  saturatedFat: { low: 1.5, high: 5 },
  sugars: { low: 5, high: 22.5 },
  salt: { low: 0.3, high: 1.5 },
};

// Renvoie "Faible", "Modéré", "Élevé" ou null si on ne sait pas
export function nutrientLevel(nutrient: string, value: number | null): string | null {
  const limit = LIMITS[nutrient];
  if (!limit || value === null) return null;
  if (value <= limit.low) return 'Faible';
  if (value > limit.high) return 'Élevé';
  return 'Modéré';
}

export const levelColors: { [level: string]: string } = {
  Faible: '#1F8A4C',
  Modéré: '#E08A00',
  Élevé: '#C6372D',
};
