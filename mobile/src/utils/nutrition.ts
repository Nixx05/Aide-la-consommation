import type { Nutrients } from '../types/product';

export type Level = 'low' | 'moderate' | 'high';

/**
 * Seuils pour 100 g utilisés par les repères nutritionnels (type "traffic light" UK / FSA).
 * [faible si ≤ low, élevé si > high]
 */
const THRESHOLDS: Partial<Record<keyof Nutrients, { low: number; high: number }>> = {
  fat: { low: 3, high: 17.5 },
  saturatedFat: { low: 1.5, high: 5 },
  sugars: { low: 5, high: 22.5 },
  salt: { low: 0.3, high: 1.5 },
};

export function nutrientLevel(key: keyof Nutrients, value: number | null): Level | null {
  const t = THRESHOLDS[key];
  if (!t || value === null) return null;
  if (value <= t.low) return 'low';
  if (value > t.high) return 'high';
  return 'moderate';
}

export const LEVEL_LABEL: Record<Level, string> = {
  low: 'Faible',
  moderate: 'Modéré',
  high: 'Élevé',
};
